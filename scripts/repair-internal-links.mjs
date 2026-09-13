import fs from 'node:fs';
const files=fs.readdirSync('src/content/travel').filter(f=>f.endsWith('.md'));
let changed=0;
for(const root of ['src/content/travel','docs/editorial-recovery/rewrites'])for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.md'))) {
  const name=`${root}/${file}`;
  const before=fs.readFileSync(name,'utf8');
  const after=before.replaceAll('/travel/korea/korea-season-travel-calendar/','/travel/seoul/korea-season-travel-calendar/')
    .replaceAll('/travel/sokcho/sokcho-seoraksan-market/','/travel/gangwon/sokcho-seoraksan-market/');
  if(after!==before){fs.writeFileSync(name,after);changed++;}
}
console.log(`Fixed internal references in ${changed} files.`);
