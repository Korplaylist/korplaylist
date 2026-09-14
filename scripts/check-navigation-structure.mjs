import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { parse } from 'parse5';

const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const hasClass = (node, value) => attr(node, 'class')?.split(' ').includes(value);
const base = 'https://korplaylist.com';
const pages = new Map();
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (entry.name === 'index.html') {
      const url = `/${path.relative('dist', path.dirname(file)).split(path.sep).filter(Boolean).join('/')}/`.replace('//', '/');
      pages.set(url, walk(parse(fs.readFileSync(file, 'utf8'))));
    }
  }
}
scan('dist');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
let articles = 0;
let archives = 0;
let translatedLinks = 0;
for (const [url, nodes] of pages) {
  if (nodes.some(node => hasClass(node, 'article-content'))) {
    articles++;
    const alternates = new Map(nodes.filter(node => node.nodeName === 'link' && attr(node, 'hreflang')).map(node => [attr(node, 'hreflang'), attr(node, 'href')]));
    const locale = attr(nodes.find(node => node.nodeName === 'html'), 'lang');
    for (const node of nodes.filter(node => hasClass(node, 'language-link'))) {
      const lang = attr(node, 'lang');
      const expected = lang === locale ? base + url : alternates.get(lang) ?? `${base}${lang === 'ko' ? '/' : `/${lang}/`}travel/`;
      assert.equal(new URL(attr(node, 'href'), base).href, expected, `${url}: language ${lang}`);
      if (alternates.has(lang) && lang !== locale) translatedLinks++;
    }
    for (const node of nodes.filter(node => node.nodeName === 'script' && attr(node, 'type') === 'application/ld+json')) {
      const schema = JSON.parse(node.childNodes.map(child => child.value ?? '').join(''));
      const article = schema['@graph']?.find(item => item['@type'] === 'Article');
      if (article) assert.equal(article.author.url, `${base}${locale === 'ko' ? '' : `/${locale}`}/about/`);
    }
  }
  if (/^\/(en|ja)\/(regions|categories)\//.test(url)) {
    archives++;
    assert.ok(sitemap.includes(`${base}${url}</loc>`), `${url}: not in sitemap`);
    const [, locale, kind, group] = url.split('/');
    if (group) {
      const cards = nodes.filter(node => attr(node, 'data-guide') !== undefined);
      assert.ok(cards.length, `${url}: empty archive`);
      for (const card of cards) assert.equal(attr(card, kind === 'regions' ? 'data-region' : 'data-theme'), group, `${url}: wrong grouping`);
      for (const card of cards) {
        const link = walk(card).find(node => hasClass(node, 'post-image-link'));
        assert.ok(attr(link, 'href').startsWith(`/${locale}/travel/`), `${url}: wrong language`);
      }
    }
  }
}
assert.equal(articles, 295);
for (const prefix of ['', '/en', '/ja']) {
  const nodes = pages.get(`${prefix}/travel/`);
  assert.ok(nodes.some(node => node.nodeName === 'guide-browser'));
  const cards = nodes.filter(node => attr(node, 'data-guide') !== undefined);
  assert.ok(cards.length > 12);
  assert.ok(cards.every(node => attr(node, 'hidden') === undefined), 'No-JS must retain every guide');
}
const changedContent = execFileSync('git', ['diff', '--name-only', '13dd0ba', '--', 'src/content/travel', 'public/images', 'src/data/myrealtrip-stays.json'], { encoding: 'utf8' }).trim();
assert.equal(changedContent, '', 'Article source and photographs must remain unchanged');
console.log(JSON.stringify({ articles, archives, translatedLinks, unchangedArticleSourceAndPhotos: true, errors: [] }, null, 2));

if (process.argv.includes('--production')) {
  let checked = 0;
  for (const [url, expected] of pages) {
    if (!/^\/(en|ja)\/(regions|categories)\//.test(url) && !['/travel/', '/en/travel/', '/ja/travel/'].includes(url)) continue;
    const response = await fetch(base + url, { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `${url}: public status`);
    const actual = walk(parse(await response.text()));
    const links = nodes => nodes.filter(node => node.nodeName === 'a').map(node => attr(node, 'href'));
    assert.deepEqual(links(actual), links(expected), `${url}: public navigation differs`);
    assert.equal(actual.filter(node => attr(node, 'data-guide') !== undefined).length, expected.filter(node => attr(node, 'data-guide') !== undefined).length, `${url}: public card count`);
    const scripts = nodes => nodes.filter(node => node.nodeName === 'script' && attr(node, 'src')?.startsWith('/_astro/')).map(node => attr(node, 'src'));
    assert.deepEqual(scripts(actual), scripts(expected), `${url}: public client code differs`);
    checked++;
  }
  console.log(JSON.stringify({ publicNavigationPages: checked, errors: [] }, null, 2));
}
