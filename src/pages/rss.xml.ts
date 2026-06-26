import { getCollection } from "astro:content";
import { siteConfig } from "../site.config";
import { getPostUrl, isIndexableTravelData } from "../lib/travel";

export async function GET() {
  const posts = await getCollection("travel", ({ data }) => isIndexableTravelData(data));
  const items = posts
    .sort((a, b) => b.data.updatedAt.valueOf() - a.data.updatedAt.valueOf())
    .map((post) => {
      const url = new URL(getPostUrl(post), siteConfig.domain).toString();
      const publishedAt = post.data.publishedAt.toUTCString();

      return [
        "    <item>",
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.data.description)}</description>`,
        `      <pubDate>${publishedAt}</pubDate>`,
        `      <category>${escapeXml(post.data.category)}</category>`,
        `      <source url="${siteConfig.domain}/rss.xml">${escapeXml(siteConfig.siteName)}</source>`,
        `      <atom:updated>${post.data.updatedAt.toISOString()}</atom:updated>`,
        "    </item>"
      ].join("\n");
    })
    .join("\n");

  const latestUpdatedAt = posts.length
    ? new Date(Math.max(...posts.map((post) => post.data.updatedAt.valueOf()))).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.siteName)}</title>
    <link>${siteConfig.domain}/</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${latestUpdatedAt}</lastBuildDate>
    <atom:link href="${siteConfig.domain}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
