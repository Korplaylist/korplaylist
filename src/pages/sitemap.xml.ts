import { getCategoryUrl, getPublishedTravelPosts, getPostUrl, getRegionUrl } from "../lib/travel";
import { categories, regions, siteConfig } from "../site.config";

const staticPaths = [
  "/",
  "/en/",
  "/en/contact/",
  "/en/privacy/",
  "/en/terms/",
  "/ja/",
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
  const categoryUrls = categories.map((category) => getCategoryUrl(category));
  const regionUrls = regions.map((region) => getRegionUrl(region));
  const urls = [...staticPaths, ...categoryUrls, ...regionUrls, ...posts.map((post) => getPostUrl(post))];
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
