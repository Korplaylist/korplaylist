import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseFragment} from 'parse5';

const baseline = 'a9097e4';
const root = 'src/content/travel';
const names = execFileSync('git', ['ls-tree', '-r', '--name-only', baseline, root], {encoding: 'utf8'}).trim().split('\n');
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const normal = text => text.replace(/\r\n/g, '\n');
// These two malformed URLs resolve to the same preserved JPG; no photo replacement is allowed.
const repairedImageSuffixes = new Map([
  ['src/content/travel/yeosu-island-day.md', '\uC0B0\uCC45\uB85C\uC640 \uD56D\uAD6C \uC57C\uACBD'],
  ['src/content/travel/yeosu-island-day-en.md', 'night sea promenade and harbor lights']
]);
const markupRepairs = JSON.parse(fs.readFileSync('docs/editorial-audit-20260914/allowed-markup-repairs.json', 'utf8'));
function repairBaselineImageUrl(file, text) {
  // Restore only the recorded broken closing tags before comparing protected structures.
  for (const [target, before, after] of markupRepairs) {
    if (file === target) text = text.replace(before, after);
  }
  const suffix = repairedImageSuffixes.get(file);
  if (!suffix) return text;
  const image = '/images/generated/unique/yeosu-night-sea-generated-yeosu-island-day-trip-1.jpg';
  return text.replace(`src="${image} ${suffix}"`, `src="${image}"`);
}
const protectedMarkup = text => {
  text = text.replaceAll('/travel/korea/korea-season-travel-calendar/', '/travel/seoul/korea-season-travel-calendar/');
  const nodes = walk(parseFragment(text, {sourceCodeLocationInfo: true}));
  return nodes.filter(node => ['figure', 'table'].includes(node.nodeName) ||
    node.attrs?.some(attr => attr.name === 'class' && attr.value.split(' ').some(c => ['planning-table', 'map-route', 'decision-grid', 'article-summary'].includes(c))))
    .map(node => node.sourceCodeLocation)
    .filter(Boolean)
    .map(location => text.slice(location.startOffset, location.endOffset));
};
const errors = [];
const changed = [];
for (const file of names) {
  if (!fs.existsSync(file)) { errors.push(`${file}: article removed`); continue; }
  const before = normal(execFileSync('git', ['show', `${baseline}:${file}`], {encoding: 'utf8', maxBuffer: 5_000_000}));
  const after = normal(fs.readFileSync(file, 'utf8'));
  const header = text => text.match(/^---\n[\s\S]*?\n---\n/)?.[0];
  if (!header(before) || !header(after)) { errors.push(`${file}: invalid frontmatter`); continue; }
  if (header(before).replace(/^updatedAt:.*$/m, '') !== header(after).replace(/^updatedAt:.*$/m, '')) errors.push(`${file}: protected metadata changed`);
  const beforeBody = repairBaselineImageUrl(file, before.slice(header(before).length));
  const afterBody = after.slice(header(after).length);
  if (JSON.stringify(protectedMarkup(beforeBody)) !== JSON.stringify(protectedMarkup(afterBody))) errors.push(`${file}: photo/table/route markup changed`);
  const images = text => text.match(/<(?:img|source)\b[^>]*>|!\[[^\]]*\]\([^)]*\)/g) ?? [];
  if (JSON.stringify(images(beforeBody)) !== JSON.stringify(images(afterBody))) errors.push(`${file}: image references changed`);
  if (afterBody.length < beforeBody.length * 0.9) errors.push(`${file}: more than 10% of body removed`);
  if (before !== after) changed.push(file);
}
const newFiles = fs.readdirSync(root).filter(name => name.endsWith('.md') && !names.includes(`${root}/${name}`));
if (newFiles.length) errors.push(`Unexpected new articles: ${newFiles.join(', ')}`);
console.log(JSON.stringify({baseline, articles: names.length, changedArticles: changed, errors}, null, 2));
if (errors.length) process.exitCode = 1;
