import fs from 'node:fs';
// Reviewed replacement bodies live separately so the existing URLs and dates survive.
const root = 'docs/editorial-recovery/rewrites';
let count = 0;
for (const file of fs.readdirSync(root).filter(name => name.endsWith('.md'))) {
  const target = `src/content/travel/${file}`;
  const original = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
  const header = original.match(/^---\n[\s\S]*?\n---\n/);
  if (!header) throw new Error(`Missing frontmatter: ${target}`);
  const replacement = fs.readFileSync(`${root}/${file}`, 'utf8');
  const [title, description, ...body] = replacement.split('\n');
  let next = header[0].replace(/^title:.*$/m, `title: ${JSON.stringify(title)}`)
    .replace(/^description:.*$/m, `description: ${JSON.stringify(description)}`)
    .replace(/^updatedAt:.*$/m, 'updatedAt: "2026-09-13"');
  if(file.startsWith('daegu-modern-street')&&!/^imageVerified:/m.test(next))next=next.replace(/\n---\n$/, '\nimageVerified: false\n---\n');
  fs.writeFileSync(target, next + '\n' + body.join('\n').trim() + '\n');
  count++;
}
console.log(`Applied ${count} reviewed article replacements; original publication dates and URLs retained.`);
