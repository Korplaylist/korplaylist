import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse, parseFragment} from 'parse5';

const out = 'docs/editorial-audit-20260914';
const baselineFile = `${out}/repeated-paragraphs-baseline.json`;
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const plain = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(plain).join(' ');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function files(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}
const repeated = new Map();
let articleCount = 0;
for (const file of files('dist').filter(file => path.basename(file) === 'index.html')) {
  const body = walk(parse(fs.readFileSync(file, 'utf8'))).find(node => attr(node, 'class')?.split(' ').includes('article-content'));
  if (!body) continue;
  articleCount++;
  const url = '/' + path.relative('dist', path.dirname(file)).split(path.sep).join('/') + '/';
  for (const node of walk(body).filter(node => node.nodeName === 'p')) {
    const text = plain(node).replace(/\s+/g, ' ').trim();
    if (text.length < 70) continue;
    if (!repeated.has(text)) repeated.set(text, new Set());
    repeated.get(text).add(url);
  }
}
if (articleCount !== 295) throw new Error(`Expected 295 built articles, got ${articleCount}`);
fs.mkdirSync(out, {recursive: true});
const save = (name, value) => fs.writeFileSync(`${out}/${name}.json`, JSON.stringify(value, null, 2) + '\n');
if (process.argv.includes('--capture-baseline')) {
  if (fs.existsSync(baselineFile)) throw new Error('Baseline already exists; refusing to overwrite it.');
  const rows = [...repeated].filter(([, urls]) => urls.size >= 3).sort((a, b) => b[1].size - a[1].size);
  if (rows.length !== 88) throw new Error('Capture requires the 7b82407 build with 88 repeated paragraph types.');
  save('repeated-paragraphs-baseline', rows.map(([text, urls], index) => ({id: index + 1, fingerprint: hash(text), text, urls: [...urls]})));
}
const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
const decisions = JSON.parse(fs.readFileSync(`${out}/review-decisions.json`, 'utf8'));
if (baseline.length !== 88 || baseline.some(row => !decisions[row.id])) throw new Error('Every baseline paragraph needs a review decision.');
save('repeated-paragraphs-review', baseline.map(row => ({...row, decision: decisions[row.id], remainingUrls: [...(repeated.get(row.text) ?? [])]})));

const originalCandidates = files('public/images').filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.split(path.sep).includes('optimized') && !file.split(path.sep).includes('unique'));
const images = new Map();
const field = (text, key) => text.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1]?.trim();
function record(image, file, kind, credit, alt) {
  if (!image) return;
  if (!images.has(image)) images.set(image, []);
  images.get(image).push({file, kind, credit: credit ?? '', alt: alt ?? ''});
}
for (const file of files('src/content/travel').filter(file => file.endsWith('.md'))) {
  const text = fs.readFileSync(file, 'utf8');
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  record(field(front, 'heroImage'), file, 'hero', field(front, 'imageCredit'), field(front, 'imageAlt'));
  const nodes = walk(parseFragment(text));
  for (const node of nodes.filter(node => node.nodeName === 'img')) {
    let parent = node.parentNode;
    while (parent && parent.nodeName !== 'figure') parent = parent.parentNode;
    const caption = parent && walk(parent).find(n => n.nodeName === 'figcaption');
    record(attr(node, 'src'), file, 'body', caption ? plain(caption).trim() : '', attr(node, 'alt'));
  }
  for (const match of text.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)) record(match[2], file, 'markdown', '', match[1]);
}
const photos = [...images].map(([image, usages]) => {
  const local = image.startsWith('/') ? path.join('public', image.slice(1).split(/[?#]/)[0]) : null;
  const exists = Boolean(local && fs.existsSync(local));
  const stem = path.parse(image).name;
  // Prefixes identify candidates from the legacy variant-naming code, not verified provenance.
  const candidates = image.includes('/generated/unique/') ? originalCandidates.filter(file => stem.startsWith(path.parse(file).name + '-')).map(file => file.split(path.sep).join('/')) : [];
  return {image, exists, sha256: exists ? hash(fs.readFileSync(local)) : null, usages, originalCandidates: candidates,
    provenanceStatus: 'Original source URL, permission and depicted location are not established by the filename or credit alone.',
    action: 'Preserved. Do not delete, replace or relabel based on this automated inventory.'};
});
save('photo-records', photos);
console.log(JSON.stringify({articleCount, reviewedParagraphTypes: baseline.length, currentlyRepeatedTypes: [...repeated.values()].filter(urls => urls.size >= 3).length,
  uniqueArticleImages: photos.length, imageReferences: photos.reduce((sum, p) => sum + p.usages.length, 0),
  missingLocalImages: photos.filter(p => p.image.startsWith('/') && !p.exists).length,
  candidateOriginalsFound: photos.filter(p => p.originalCandidates.length).length}, null, 2));
