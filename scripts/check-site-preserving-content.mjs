import fs from 'node:fs';
import path from 'node:path';
import {parse, parseFragment} from 'parse5';

const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const plain = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(plain).join(' ');
const key = url => decodeURIComponent(url).normalize('NFC').replace(/\/$/, '') || '/';
const pages = new Map();
const errors = [];
for (const file of fs.readdirSync('src/content/travel').filter(name => name.endsWith('.md'))) {
  const source = fs.readFileSync(path.join('src/content/travel', file), 'utf8');
  const nodes = walk(parseFragment(source, {sourceCodeLocationInfo: true}));
  if (nodes.some(node => node.nodeName === 'section' && node.sourceCodeLocation && !node.sourceCodeLocation.endTag)) errors.push(`${file}: unclosed HTML section`);
  if (/<\/st\/div>|<\/strong\/div>|mo\/div>/.test(source)) errors.push(`${file}: malformed budget row`);
}
function scan(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (entry.name === 'index.html' || entry.name === '404.html') {
      const url = entry.name === '404.html' ? '/404.html' : `/${path.relative('dist', path.dirname(file)).split(path.sep).filter(Boolean).join('/')}/`.replace('//', '/');
      const nodes = walk(parse(fs.readFileSync(file, 'utf8')));
      pages.set(key(url), {url, nodes, ids: new Set(nodes.map(node => attr(node, 'id')).filter(Boolean))});
    }
  }
}
scan('dist');
const redirects = new Map(fs.readFileSync('public/_redirects', 'utf8').split(/\r?\n/)
  .filter(line => line.startsWith('/')).map(line => line.trim().split(/\s+/))
  .filter(parts => parts.length === 3).map(([from, to]) => [key(from), to]));
const repetitions = new Map();
let articles = 0;
let internalLinks = 0;
let articleImages = 0;
for (const page of pages.values()) {
  const canonical = attr(page.nodes.find(node => node.nodeName === 'link' && attr(node, 'rel') === 'canonical') ?? {}, 'href');
  if (canonical !== `https://korplaylist.com${page.url}`) errors.push(`${page.url}: canonical mismatch`);
  const body = page.nodes.find(node => attr(node, 'class')?.split(' ').includes('article-content'));
  if (body) {
    articles++;
    const bodyNodes = walk(body);
    articleImages += bodyNodes.filter(node => node.nodeName === 'img').length;
    if (/애드센스|AdSense|アドセンス/i.test(plain(body))) errors.push(`${page.url}: public editing-purpose text`);
    for (const node of bodyNodes.filter(node => node.nodeName === 'p')) {
      const text = plain(node).replace(/\s+/g, ' ').trim();
      if (text.length < 70) continue;
      const urls = repetitions.get(text) ?? new Set();
      urls.add(page.url);
      repetitions.set(text, urls);
    }
  }
  for (const node of page.nodes.filter(node => node.nodeName === 'a')) {
    const href = attr(node, 'href');
    if (!href) continue;
    const url = new URL(href, `https://korplaylist.com${page.url}`);
    if (url.searchParams.get('checkIn') === '2026-07-10') errors.push(`${page.url}: stale booking date`);
    if (url.origin !== 'https://korplaylist.com') continue;
    internalLinks++;
    let target = pages.get(key(url.pathname));
    if (!target && redirects.has(key(url.pathname))) target = pages.get(key(new URL(redirects.get(key(url.pathname)), url).pathname));
    if (!target) {
      if (!fs.existsSync(path.join('dist', decodeURIComponent(url.pathname)))) errors.push(`${page.url}: missing ${url.pathname}`);
    } else if (url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1)))) errors.push(`${page.url}: missing anchor ${href}`);
  }
}
if (articles !== 295) errors.push(`Expected 295 preserved articles, got ${articles}`);
const notFound = pages.get('/404.html');
if (!notFound?.nodes.some(node => attr(node, 'name') === 'robots' && attr(node, 'content')?.includes('noindex'))) errors.push('404 is missing or indexable');
for (const sitemap of ['dist/sitemap-0.xml', 'dist/sitemap.xml']) {
  if (fs.readFileSync(sitemap, 'utf8').includes('/404.html')) errors.push(`${sitemap}: lists 404`);
}
console.log(JSON.stringify({pages: pages.size, articles, articleImages, internalLinks, repeatedParagraphTypes: [...repetitions.values()].filter(urls => urls.size >= 3).length, errors}, null, 2));
if (errors.length) process.exitCode = 1;
