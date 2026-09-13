import fs from 'node:fs';
// Reviewed replacement bodies live separately so the existing URLs and dates survive.
const root = 'docs/editorial-recovery/rewrites';
const reviewDate = process.argv.find(arg => arg.startsWith('--date='))?.slice(7);
if (reviewDate && (!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate) || new Date(reviewDate).toISOString().slice(0, 10) !== reviewDate)) {
  throw new Error('Expected a valid --date=YYYY-MM-DD');
}
let count = 0;
for (const file of fs.readdirSync(root).filter(name => name.endsWith('.md'))) {
  const target = `src/content/travel/${file}`;
  const original = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
  const header = original.match(/^---\n[\s\S]*?\n---\n/);
  if (!header) throw new Error(`Missing frontmatter: ${target}`);
  const replacement = fs.readFileSync(`${root}/${file}`, 'utf8').replace(/\r\n/g, '\n');
  const [title, description, ...body] = replacement.split('\n');
  let next = header[0].replace(/^title:.*$/m, `title: ${JSON.stringify(title)}`)
    .replace(/^description:.*$/m, `description: ${JSON.stringify(description)}`);
  if(file.startsWith('daegu-modern-street')&&!/^imageVerified:/m.test(next))next=next.replace(/\n---\n$/, '\nimageVerified: false\n---\n');
  const content = '\n' + body.join('\n').trim() + '\n';
  if (next + content === original) continue;
  if (!reviewDate) throw new Error(`Changed article ${file} requires --date=YYYY-MM-DD`);
  next = next.replace(/^updatedAt:.*$/m, `updatedAt: "${reviewDate}"`);
  fs.writeFileSync(target, next + content);
  count++;
}
console.log(`Applied ${count} reviewed article replacements; original publication dates and URLs retained.`);
