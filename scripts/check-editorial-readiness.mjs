import fs from 'node:fs';

// Passing a word/image quota cannot establish original value or AdSense approval.
const reportPath='docs/editorial-recovery/built-site-report.json';
if(!fs.existsSync(reportPath))throw Error('Build and run check:site before the editorial readiness report.');
const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
const replacements=new Set();
for(const file of fs.readdirSync('docs/editorial-recovery/rewrites').filter(f=>f.endsWith('.md'))) {
  const source=fs.readFileSync(`src/content/travel/${file}`,'utf8').replace(/\r\n/g,'\n');
  const expected=fs.readFileSync(`docs/editorial-recovery/rewrites/${file}`,'utf8').replace(/\r\n/g,'\n').split('\n').slice(2).join('\n').trim();
  const actual=source.replace(/^---\n[\s\S]*?\n---\n/,'').trim();
  if(actual===expected)replacements.add(file);
}
const pending=report.articles.filter(p=>{
  const parts=new URL(p.url,'https://korplaylist.com').pathname.split('/').filter(Boolean);
  const locale=['en','ja'].includes(parts[0])?`-${parts[0]}`:'';
  const file=`${parts.at(-1)}${locale}.md`;
  return !replacements.has(file)||!p.externalSources||p.repeatedParagraphs>=10;
});
console.log(`Technical errors: ${report.technicalErrors.length}. Articles still requiring individual editorial verification: ${pending.length}/${report.articles.length}.`);
console.log('Automated checks do not certify factual accuracy, originality, image rights, or AdSense approval. Do not hide failures with adsenseReady:false.');
fs.writeFileSync('docs/editorial-recovery/editorial-pending.json',JSON.stringify(pending,null,2));
if(pending.length||report.technicalErrors.length)process.exitCode=1;
