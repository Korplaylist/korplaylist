import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';

const origin='https://korplaylist.com';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const plain=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(plain).join(' ');
const article=html=>{
  const nodes=walk(parse(html));
  const body=nodes.find(n=>attr(n,'class')?.split(' ').includes('article-content'));
  if(!body)return null;
  const canonical=attr(nodes.find(n=>n.nodeName==='link'&&attr(n,'rel')==='canonical')??{},'href');
  return {hash:createHash('sha256').update(plain(body).replace(/\s+/g,' ').trim()).digest('hex'),canonical};
};
const report=JSON.parse(fs.readFileSync('docs/editorial-recovery/built-site-report.json','utf8'));
const results=[];
// A small worker pool avoids sending a full-site burst to the public origin.
const queue=[...report.articles];
async function worker(){
  while(queue.length){
    const {url}=queue.shift();
    try{
      const local=article(fs.readFileSync(path.join('dist',url,'index.html'),'utf8'));
      const response=await fetch(origin+url,{signal:AbortSignal.timeout(25000)});
      const actual=article(await response.text());
      results.push({url,status:response.status,bodyMatches:!!actual&&actual.hash===local.hash,canonicalMatches:actual?.canonical===origin+url});
    }catch(error){results.push({url,error:error.message});}
  }
}
await Promise.all(Array.from({length:4},worker));
const probes=[];
for(const url of ['/en/about/','/ja/about/','/en/contact/','/ja/contact/','/en/categories/transport/','/ja/regions/jeju/','/adsense-recovery-nonexistent-20260913/','/en/adsense-recovery-nonexistent-20260913/','/ja/adsense-recovery-nonexistent-20260913/']){
  try{
    const response=await fetch(origin+url,{signal:AbortSignal.timeout(25000)});
    const html=await response.text();
    const expectedStatus=url.includes('nonexistent')?404:200;
    const nodes=walk(parse(html));
    const noindex=nodes.some(n=>n.nodeName==='meta'&&attr(n,'name')==='robots'&&attr(n,'content')?.includes('noindex'));
    const localFile=expectedStatus===404?'dist/404.html':path.join('dist',url,'index.html');
    const localMain=walk(parse(fs.readFileSync(localFile,'utf8'))).find(n=>n.nodeName==='main');
    const liveMain=nodes.find(n=>n.nodeName==='main');
    const contentMatches=!!localMain&&!!liveMain&&plain(localMain).replace(/\s+/g,' ').trim()===plain(liveMain).replace(/\s+/g,' ').trim();
    probes.push({url,status:response.status,expectedStatus,contentMatches,ok:response.status===expectedStatus&&contentMatches&&(expectedStatus!==404||noindex)});
  }catch(error){probes.push({url,error:error.message,ok:false});}
}
for(const [from,to] of [['여행코스','itineraries'],['관광지','destinations'],['교통','transport'],['계절-여행','seasonal-trips'],['맛집-시장','food'],['전시-문화','destinations']]){
  const url=`/categories/${encodeURIComponent(from)}/`;
  try{
    const response=await fetch(origin+url,{redirect:'manual',signal:AbortSignal.timeout(25000)});
    const location=response.headers.get('location');
    const destination=location?new URL(location,origin).pathname:null;
    probes.push({url,status:response.status,location,ok:response.status===301&&destination===`/categories/${to}/`});
  }catch(error){probes.push({url,error:error.message,ok:false});}
}
results.sort((a,b)=>a.url.localeCompare(b.url));
const failed=results.filter(p=>p.status!==200||!p.bodyMatches||!p.canonicalMatches);
fs.writeFileSync('docs/editorial-recovery/production-report.json',JSON.stringify({checkedAt:new Date().toISOString(),articles:results,probes},null,2));
console.log(JSON.stringify({articles:results.length,matched:results.length-failed.length,failed:failed.length,probes},null,2));
if(failed.length)console.log(JSON.stringify(failed.slice(0,10),null,2));
if(failed.length||probes.some(p=>!p.ok))process.exitCode=1;
