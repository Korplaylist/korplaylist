import { getCategoryUrl, getPostRegion, getPublishedTravelPosts, getPostUrl, getRegionUrl, normalizeCategory } from "../lib/travel";
import { categories, regions, siteConfig } from "../site.config";
import { browseGroups, browseUrl } from "../lib/browse";

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
  const categoriesWithPosts = categories.filter((category) => posts.some((post) => normalizeCategory(post.data.category) === category));
  const categoryUrls = categoriesWithPosts.map((category) => getCategoryUrl(category));
  const regionsWithPosts = regions.filter((region) => posts.some((post) => getPostRegion(post) === region));
  const regionUrls = regionsWithPosts.map((region) => getRegionUrl(region));
  const browseUrls = ['en', 'ja'].flatMap(locale => ['regions', 'categories'].flatMap(kind => [
    browseUrl(locale, kind),
    ...browseGroups(posts.filter(post => post.data.locale === locale), locale, kind).map(group => browseUrl(locale, kind, group.key))
  ]));
  const urls = [...staticPaths, ...categoryUrls, ...regionUrls, ...browseUrls, ...posts.map((post) => getPostUrl(post))];
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
