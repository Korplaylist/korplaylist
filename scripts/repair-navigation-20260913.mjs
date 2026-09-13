import fs from 'node:fs';
for (const locale of ['en','ja']) {
  const file=`src/pages/${locale}/index.astro`;
  let text=fs.readFileSync(file,'utf8');
  text=text.replace('localizedCategories, localizedRegions, regionSlugMap','localizedCategories, localizedRegions, regionSlugMap, categories, categorySlugMap');
  text=text.replace(`return { label, href: post ? getPostUrl(post) : "/${locale}/#regions" };`, `return { label, href: post ? \`/${locale}/regions/\${regionSlugMap[koRegion]}/\` : null };`);
  text=text.replace(`return { label, href: post ? getPostUrl(post) : "/${locale}/#themes", description: categoryDescriptions[label] };`, `return { label, href: post ? \`/${locale}/categories/\${categorySlugMap[categories[index]]}/\` : null, description: categoryDescriptions[label] };`);
  text=text.replace('regionItems.map(', 'regionItems.filter(item => item.href).map(').replace('categoryItems.map(', 'categoryItems.filter(item => item.href).map(');
  text=text.replace('Practical Korea travel articles written around routes, costs, transport, stays, and search intent.', 'Plan station transfers, reservations, walking routes and travel costs.');
  text=text.replace('ルート、費用、交通、宿泊、検索意図に合わせて韓国旅行を準備しやすく整理します。', '駅からの移動、予約、徒歩ルート、旅行費用を確認できます。');
  fs.writeFileSync(file,text);
}
for(const file of ['src/components/PopularCarousel.astro','src/components/AuthorBio.astro']) {
  let text=fs.readFileSync(file,'utf8');
  text=text.replaceAll('/#about','/about/').replaceAll('/#contact','/contact/');
  if(file.includes('PopularCarousel')) text=text.replaceAll('인기 여행 가이드','선별 여행 가이드').replaceAll('Popular Korea Travel Guides','Selected Korea Travel Guides').replaceAll('人気の韓国旅行ガイド','おすすめの韓国旅行ガイド');
  fs.writeFileSync(file,text);
}
const redirects='public/_redirects';
let text=fs.readFileSync(redirects,'utf8');
for(const [from,to] of Object.entries({'여행코스':'itineraries','관광지':'destinations','교통':'transport','계절-여행':'seasonal-trips','맛집-시장':'food','전시-문화':'destinations'})) {
  for(const variant of new Set([from,encodeURIComponent(from),encodeURIComponent(from.normalize('NFD'))])) {
    const line=`/categories/${variant}/ /categories/${to}/ 301`;
    if(!text.includes(line))text+='\n'+line;
  }
}
fs.writeFileSync(redirects,text.trimEnd()+'\n');
