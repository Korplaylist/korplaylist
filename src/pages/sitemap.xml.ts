import { getCategoryUrl, getPostRegion, getPublishedTravelPosts, getPostUrl, getRegionUrl } from "../lib/travel";
import { categories, regions, siteConfig, localizedCategories, categorySlugMap, regionSlugMap } from "../site.config";

const staticPaths = [
  "/",
  "/en/",
  "/en/about/",
  "/en/travel/",
  "/en/contact/",
  "/en/privacy/",
  "/en/terms/",
  "/ja/",
  "/ja/about/",
  "/ja/travel/",
  "/ja/contact/",
  "/ja/privacy/",
  "/ja/terms/",
  "/travel/",
  "/regions/",
  "/categories/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/"
];

export async function GET() {
  const posts = [
    ...(await getPublishedTravelPosts("ko")),
    ...(await getPublishedTravelPosts("en")),
    ...(await getPublishedTravelPosts("ja"))
  ];
  const categoriesWithPosts = categories.filter((category) => posts.some((post) => post.data.category === category));
  const categoryUrls = categoriesWithPosts.map((category) => getCategoryUrl(category));
  const regionsWithPosts = regions.filter((region) => posts.some((post) => getPostRegion(post) === region));
  const regionUrls = regionsWithPosts.map((region) => getRegionUrl(region));
  const localizedUrls = [];
  for (const locale of ["en", "ja"]) {
    const local = posts.filter(post => post.data.locale === locale);
    for (const region of regions) if (local.some(post => post.data.regionSlug === regionSlugMap[region])) localizedUrls.push(`/${locale}/regions/${regionSlugMap[region]}/`);
    for (const [i, category] of categories.entries()) if (local.some(post => post.data.category === localizedCategories[locale][i])) localizedUrls.push(`/${locale}/categories/${categorySlugMap[category]}/`);
  }
  const urls = [...new Set([...staticPaths, ...categoryUrls, ...regionUrls, ...localizedUrls, ...posts.map((post) => getPostUrl(post))])];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${new URL(url, siteConfig.domain).toString()}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
