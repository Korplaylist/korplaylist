import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {parseFragment} from 'parse5';
const require=createRequire(import.meta.url);
const ar=createRequire(require.resolve('astro/package.json'));
const mr=createRequire(ar.resolve('@astrojs/markdown-remark'));
const {unified}=await import(pathToFileURL(mr.resolve('unified')));
const {default:remarkParse}=await import(pathToFileURL(mr.resolve('remark-parse')));
const processor=unified().use(remarkParse);
const baseline=JSON.parse(fs.readFileSync('docs/editorial-recovery/baseline-repeated-passages.json','utf8'));
const normalize=s=>s.replace(/\s+/g,' ').trim();
const repeated=new Set(baseline.map(p=>normalize(p.text)));
const plain=n=>n.type==='text'||n.type==='inlineCode'?n.value:(n.children||[]).map(plain).join('');
const htmlText=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(htmlText).join(' ');
const walk=n=>[n,...(n.childNodes||[]).flatMap(walk)];
const changes=[];
const reviewedFiles=new Set(fs.readdirSync('docs/editorial-recovery/rewrites').filter(f=>f.endsWith('.md')));
for(const file of fs.readdirSync('src/content/travel').filter(f=>f.endsWith('.md'))) {
  const path='src/content/travel/'+file;
  // This one-time migration always starts at the audited pre-recovery commit.
  const original=execFileSync('git',['show',`731913e:${path}`],{encoding:'utf8'}).replace(/\r\n/g,'\n');
  const split=original.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)([\s\S]*)$/);
  if(!split)throw Error(file+' missing frontmatter');
  let [,head,body]=split;
  if(/^draft:\s*true/m.test(head))continue;
  const ranges=[];
  let repeatedRemoved=0,imagesRemoved=0;
  for(const node of processor.parse(body).children) {
    if(reviewedFiles.has(file)&&node.type==='paragraph'&&repeated.has(normalize(plain(node)))) {
      ranges.push([node.position.start.offset,node.position.end.offset]);repeatedRemoved++;
    }
    if(node.type==='html') {
      const fragment=parseFragment(node.value,{sourceCodeLocationInfo:true});
      for(const el of walk(fragment)) {
        const loc=el.sourceCodeLocation;
        if(!loc)continue;
        if(reviewedFiles.has(file)&&el.nodeName==='p'&&repeated.has(normalize(htmlText(el)))) {ranges.push([node.position.start.offset+loc.startOffset,node.position.start.offset+loc.endOffset]);repeatedRemoved++;}
        if(el.nodeName==='figure'&&/\/generated\//.test(node.value.slice(loc.startOffset,loc.endOffset))) {ranges.push([node.position.start.offset+loc.startOffset,node.position.start.offset+loc.endOffset]);imagesRemoved++;}
      }
    }
  }
  const merged=[];
  for(const range of ranges.sort((a,b)=>a[0]-b[0])) {
    const last=merged.at(-1);if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);else merged.push(range);
  }
  for(const [start,end] of merged.reverse())body=body.slice(0,start)+body.slice(end);
  // Remove authoring notes, not legitimate travel guidance around them.
  body=body.replace(/^## 애드센스 관점의 정보 보강\s*\r?\n[^\n]*(?:\r?\n)?/gm,'');
  body=body.replace(/[^.!?\n]*(?:애드센스|AdSense)[^.!?\n]*[.!?]?/gi,'');
  body=body.replaceAll('/en/#about','/en/about/').replaceAll('/ja/#about','/ja/about/').replaceAll('/en/#contact','/en/contact/').replaceAll('/ja/#contact','/ja/contact/');
  // Delete empty markdown sections left by removal of boilerplate.
  body=body.replace(/^### [^\n]*\n\s*(?=#{2,3} |$)/gm,'')
    .replace(/^## [^\n]*\n\s*(?=## |$)/gm,'').replace(/\n{3,}/g,'\n\n');
  const title=head.match(/^title:\s*"(.*)"/m)?.[1]||'';
  if(!/festival|축제|祭り|フェスティバル|biennale|비엔날레/i.test(title)) {
    const clean=title.replace(/\s*2026년?\s*/g,' ').replace(/\s+([:：])/g,'$1').replace(/\s{2,}/g,' ').trim();
    head=head.replace(/^title:.*$/m,`title: ${JSON.stringify(clean)}`);
  }
  if(/heroImage:.*\/generated\//.test(head)&&!/^imageVerified:/m.test(head))head=head.replace(/\r?\n---\r?\n$/, '\nimageVerified: false\n---\n');
  body=body.replace(/^[ \t]+$/gm,'').replace(/\n{3,}/g,'\n\n').trimEnd()+'\n';
  let next=head+body;
  if(next!==original) {
    if(repeatedRemoved>0||/애드센스|AdSense/i.test(split[2]))next=next.replace(/^updatedAt:.*$/m,'updatedAt: "2026-09-13"');
    fs.writeFileSync(path,next);
    changes.push({file,repeatedRemoved,imagesRemoved,heroUnverified:/imageVerified: false/.test(head)});
  }
}
fs.mkdirSync('docs/editorial-recovery',{recursive:true});
fs.writeFileSync('docs/editorial-recovery/cleanup.json',JSON.stringify(changes,null,2));
console.log(JSON.stringify({changed:changes.length,removedRepeated:changes.reduce((s,r)=>s+r.repeatedRemoved,0),removedUnverifiedImages:changes.reduce((s,r)=>s+r.imagesRemoved,0)},null,2));
await import('./apply-editorial-rewrites.mjs');
await import('./repair-internal-links.mjs');
