import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';

const files = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const walk = n => [n, ...(n.childNodes ?? []).flatMap(walk)];
const attr = (n,k) => n.attrs?.find(a=>a.name===k)?.value;
const text = n => n.nodeName==='#text' ? n.value : (n.childNodes ?? []).map(text).join(' ');
const normalize = value => value.replace(/\s+/g,' ').trim();
const errors=[];
const pages=new Map();
const paragraphs=new Map();
const editorial=[];
for(const file of files('dist').filter(f=>f.endsWith('.html'))) {
  const relative=path.relative('dist',file).replaceAll('\\','/');
  const url='/'+relative.replace(/index\.html$/,'');
  const source=fs.readFileSync(file,'utf8');
  const nodes=walk(parse(source));
  const body=nodes.find(n=>attr(n,'class')?.split(' ').includes('article-content'));
  const ids=new Set(nodes.map(n=>attr(n,'id')).filter(Boolean));
  const links=nodes.filter(n=>n.nodeName==='a').map(n=>attr(n,'href')).filter(Boolean);
  pages.set(url,{file,nodes,ids,links});
  if(!body)continue;
  const content=normalize(text(body));
  if(/애드센스|AdSense/i.test(content))errors.push({url,problem:'Authoring-purpose text in travel article'});
  if(/checkIn=2026-07-10/.test(source))errors.push({url,problem:'Expired affiliate check-in date'});
  for(const n of walk(body).filter(n=>n.nodeName==='p')) {
    const value=normalize(text(n));
    if(value.length<=70)continue;
    const uses=paragraphs.get(value)??new Set();uses.add(url);paragraphs.set(value,uses);
  }
  const externalSources=walk(body).filter(n=>n.nodeName==='a'&&/^https?:/.test(attr(n,'href')??'')&&!/google\.com\/maps|map\.naver|map\.kakao|booking|agoda/.test(attr(n,'href'))).length;
  const canonical=nodes.find(n=>n.nodeName==='link'&&attr(n,'rel')==='canonical');
  if(attr(canonical??{},'href')!==`https://korplaylist.com${url}`)errors.push({url,problem:'Canonical mismatch',canonical:attr(canonical??{},'href')});
  editorial.push({url,bodyCharacters:content.length,externalSources});
}
const redirects=new Map();
for(const line of fs.readFileSync('public/_redirects','utf8').split(/\r?\n/)) {
  const parts=line.trim().split(/\s+/);
  if(parts.length===3&&/^30[1278]$/.test(parts[2]))redirects.set(parts[0],parts[1]);
}
for(const [url,page] of pages)for(const href of page.links) {
  if(/^(mailto:|tel:|javascript:)/.test(href))continue;
  let target;try {target=new URL(href,`https://korplaylist.com${url}`);}catch {errors.push({url,problem:'Invalid link',href});continue;}
  if(target.origin!=='https://korplaylist.com')continue;
  let key=decodeURI(target.pathname);
  const visited=new Set();
  while(redirects.has(key)&&!visited.has(key)) {visited.add(key);key=redirects.get(key);}
  const destination=pages.get(key)??pages.get(key.endsWith('/')?key:key+'/');
  if(!destination) {
    if(!fs.existsSync(path.join('dist',key)))errors.push({url,problem:'Missing internal target',href});
  } else if(target.hash&&!destination.ids.has(decodeURIComponent(target.hash.slice(1))))errors.push({url,problem:'Missing anchor',href});
}
const repeated=[...paragraphs].filter(([,urls])=>urls.size>=3).map(([text,urls])=>({text,urls:[...urls],count:urls.size}));
for(const row of editorial)row.repeatedParagraphs=repeated.filter(p=>p.urls.includes(row.url)).length;
const notFound=pages.get('/404.html');
if(!notFound||!notFound.nodes.some(n=>n.nodeName==='meta'&&attr(n,'name')==='robots'&&attr(n,'content')?.includes('noindex')))errors.push({url:'/404.html',problem:'Missing noindex 404 document'});
fs.mkdirSync('docs/editorial-recovery',{recursive:true});
fs.writeFileSync('docs/editorial-recovery/built-site-report.json',JSON.stringify({technicalErrors:errors,articles:editorial,repeatedPassages:repeated},null,2));
console.log(JSON.stringify({pages:pages.size,articles:editorial.length,technicalErrors:errors.length,repeatedLongPassages:repeated.length,articlesWithoutExternalSources:editorial.filter(p=>!p.externalSources).length},null,2));
if(errors.length){console.table(errors.slice(0,25));process.exitCode=1;}
