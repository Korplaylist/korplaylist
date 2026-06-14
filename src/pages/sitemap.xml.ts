import { getPublishedTravelPosts, getPostUrl } from "../lib/travel";
import { siteConfig } from "../site.config";

const staticPaths = [
  "/",
  "/travel/",
  "/regions/",
  "/categories/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/"
];

export async function GET() {
  const posts = await getPublishedTravelPosts();
  const urls = [...staticPaths, ...posts.map((post) => getPostUrl(post))];
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
