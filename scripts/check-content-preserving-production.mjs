import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';

const origin = 'https://korplaylist.com';
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const hasClass = (node, name) => attr(node, 'class')?.split(' ').includes(name);
function plain(node) {
  const email = attr(node, 'data-cfemail');
  if (email && /^(?:[a-f0-9]{2}){2,}$/i.test(email)) {
    const bytes = Buffer.from(email, 'hex');
    return Buffer.from([...bytes.subarray(1)].map(byte => byte ^ bytes[0])).toString('utf8');
  }
  return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(plain).join(' ');
}
const normalized = node => plain(node).replace(/\s+/g, ' ').trim();
const hash = text => createHash('sha256').update(text).digest('hex');
function snapshot(html) {
  const nodes = walk(parse(html));
  const body = nodes.find(node => hasClass(node, 'article-content'));
  if (!body) return null;
  const hero = nodes.find(node => hasClass(node, 'article-hero-figure'));
  const stays = nodes.find(node => hasClass(node, 'stay-panel'));
  const imageNodes = [...walk(body), ...(hero ? walk(hero) : []), ...(stays ? walk(stays) : [])];
  return {
    body: hash(normalized(body)),
    title: normalized(nodes.find(node => node.nodeName === 'h1')),
    canonical: attr(nodes.find(node => node.nodeName === 'link' && attr(node, 'rel') === 'canonical') ?? {}, 'href'),
    images: imageNodes.filter(node => node.nodeName === 'img').map(node => ({src: attr(node, 'src'), alt: attr(node, 'alt')})),
    stays: stays ? hash(normalized(stays) + walk(stays).filter(node => node.nodeName === 'a').map(node => attr(node, 'href')).join('|')) : null
  };
}
const queue = [];
function scan(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (entry.name === 'index.html') {
      const expected = snapshot(fs.readFileSync(file, 'utf8'));
      if (expected) queue.push({url: `/${path.relative('dist', path.dirname(file)).split(path.sep).join('/')}/`, expected});
    }
  }
}
scan('dist');
const articleCount = queue.length;
const errors = [];
async function worker() {
  while (queue.length) {
    const {url, expected} = queue.shift();
    try {
      const response = await fetch(origin + url, {signal: AbortSignal.timeout(25000)});
      if (response.status !== 200 || JSON.stringify(snapshot(await response.text())) !== JSON.stringify(expected)) errors.push(`${url}: live article/photo/stay mismatch`);
    } catch (error) { errors.push(`${url}: ${error.message}`); }
  }
}
await Promise.all(Array.from({length: 4}, worker));
let probes = 0;
for (const url of ['/en/about/', '/ja/about/', '/en/contact/', '/ja/contact/', '/privacy/', '/en/privacy/', '/ja/privacy/', '/missing-preservation-20260914/', '/en/missing-preservation-20260914/', '/ja/missing-preservation-20260914/']) {
  probes++;
  try {
    const response = await fetch(origin + url, {signal: AbortSignal.timeout(25000)});
    const missing = url.includes('missing-preservation');
    const expectedFile = missing ? 'dist/404.html' : path.join('dist', url, 'index.html');
    const liveNodes = walk(parse(await response.text()));
    const expectedMain = walk(parse(fs.readFileSync(expectedFile, 'utf8'))).find(node => node.nodeName === 'main');
    const actualMain = liveNodes.find(node => node.nodeName === 'main');
    const noindex = liveNodes.some(node => attr(node, 'name') === 'robots' && attr(node, 'content')?.includes('noindex'));
    if (response.status !== (missing ? 404 : 200) || !actualMain || normalized(actualMain) !== normalized(expectedMain) || (missing && !noindex)) errors.push(`${url}: page/status mismatch`);
    if (!missing && !response.headers.get('cache-control')?.includes('no-cache')) errors.push(`${url}: document cache header missing`);
  } catch (error) { errors.push(`${url}: ${error.message}`); }
}
for (const [alias, target] of [['여행코스', 'itineraries'], ['관광지', 'destinations'], ['교통', 'transport'], ['계절-여행', 'seasonal-trips'], ['맛집-시장', 'food'], ['전시-문화', 'destinations']]) {
  for (const form of ['NFC', 'NFD']) {
    probes++;
    const url = `/categories/${encodeURIComponent(alias.normalize(form))}/`;
    try {
      const response = await fetch(origin + url, {redirect: 'manual', signal: AbortSignal.timeout(25000)});
      const location = response.headers.get('location');
      if (response.status !== 301 || !location || new URL(location, origin).pathname !== `/categories/${target}/`) errors.push(`${url}: alias redirect mismatch`);
    } catch (error) { errors.push(`${url}: ${error.message}`); }
  }
}
console.log(JSON.stringify({articleCount, probes, checkedAt: new Date().toISOString(), errors}, null, 2));
if (articleCount !== 295 || errors.length) process.exitCode = 1;
