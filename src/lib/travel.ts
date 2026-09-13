import { getCollection } from "astro:content";
import { categorySlugMap, postRegionMap, regionSlugMap } from "../site.config";

export async function getPublishedTravelPosts(locale = "ko") {
  const posts = await getCollection("travel", ({ data }) => isIndexableTravelData(data) && (data.locale ?? "ko") === locale);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function isPublishedTravelData(data: { draft?: boolean; publishedAt: Date }) {
  return !data.draft && data.publishedAt.valueOf() <= Date.now();
}

export function isIndexableTravelData(data: { draft?: boolean; publishedAt: Date; adsenseReady?: boolean }) {
  return isPublishedTravelData(data) && data.adsenseReady !== false;
}

export function getPostLocale(post: { data: { locale?: string } }) {
  return post.data.locale ?? "ko";
}

export function getPostRegion(post: { data: { region: string } } | string) {
  const region = typeof post === "string" ? post : post.data.region;
  return postRegionMap[region] ?? region;
}

export function getRegionSlug(region: string) {
  return regionSlugMap[region] ?? slugify(region);
}

export function getPostRegionSlug(post: { data: { region: string; regionSlug?: string } }) {
  return post.data.regionSlug ?? getRegionSlug(getPostRegion(post));
}

export function getPostSlug(post: { slug: string; data: { urlSlug?: string } }) {
  return post.data.urlSlug ?? post.slug;
}

export function getRegionUrl(region: string) {
  return `/regions/${getRegionSlug(region)}/`;
}

export function getPostUrl(post: { slug: string; data: { region: string; locale?: string; regionSlug?: string; urlSlug?: string } }) {
  const locale = getPostLocale(post);
  const prefix = locale === "ko" ? "" : `/${locale}`;
  return `${prefix}/travel/${getPostRegionSlug(post)}/${getPostSlug(post)}/`;
}

export function getCategorySlug(category: string) {
  return categorySlugMap[category] ?? slugify(category);
}

export function getCategoryUrl(category: string) {
  return `/categories/${getCategorySlug(category)}/`;
}

export function getImageAlt(post: { data: { title: string; imageAlt?: string } }) {
  return post.data.imageAlt || `${post.data.title} 대표 이미지`;
}

export function getRelatedPosts(currentPost: any, posts: any[], limit = 5) {
  return posts
    .filter((post) => post.slug !== currentPost.slug && getPostLocale(post) === getPostLocale(currentPost) && post.data.region === currentPost.data.region)
    .map((post) => {
      const sharedTags = post.data.tags.filter((tag: string) => currentPost.data.tags.includes(tag)).length;
      const regionScore = getPostRegionSlug(post) === getPostRegionSlug(currentPost) ? 4 : 0;
      const categoryScore = post.data.category === currentPost.data.category ? 3 : 0;

      return {
        post,
        score: regionScore + categoryScore + sharedTags
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.post.data.updatedAt.valueOf() - a.post.data.updatedAt.valueOf();
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getTopRegions(posts: any[], limit = 4) {
  const regionStats = new Map<string, { count: number; latest: number }>();

  posts.forEach((post) => {
    const region = getPostRegion(post);
    const current = regionStats.get(region) ?? { count: 0, latest: 0 };
    regionStats.set(region, {
      count: current.count + 1,
      latest: Math.max(current.latest, post.data.updatedAt.valueOf())
    });
  });

  return [...regionStats.entries()]
    .sort((a, b) => b[1].count - a[1].count || b[1].latest - a[1].latest)
    .slice(0, limit)
    .map(([region]) => region);
}

export function getPopularPosts(posts: any[], limit = 6) {
  const selected = ["busan-station-luggage-first-day", "sokcho-without-car", "busan-gimhae-airport-to-gwangalli", "jongmyo-shrine-english-tour-guide", "seoul-sky-tickets-sunset-jamsil-guide", "cheonggyecheon-stream-walking-route-guide", "namdaemun-market-food-street-guide"];
  const rank = (post: any) => { const index = selected.indexOf(getPostSlug(post)); return index < 0 ? selected.length : index; };
  return [...posts]
    .sort((a, b) => rank(a) - rank(b) || b.data.updatedAt.valueOf() - a.data.updatedAt.valueOf())
    .slice(0, limit);
}

export function extractFaqItems(markdown: string) {
  const faqSection = markdown.match(/(?:^|\n)##\s+(?:자주 묻는 질문|FAQ|よくある質問)\s*\n([\s\S]*?)(?=\n##\s+|$)/);

  if (!faqSection) {
    return [];
  }

  const items = [];
  const questionPattern = /(?:^|\n)###\s+(.+?)\s*\n([\s\S]*?)(?=\n###\s+|$)/g;
  let match;

  while ((match = questionPattern.exec(faqSection[1])) !== null) {
    const question = stripMarkdown(match[1]);
    const answer = stripMarkdown(match[2]);

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

function stripMarkdown(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[`*_>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function formatDate(date: Date, locale = "ko") {
  const dateLocale = locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : "ko-KR";
  return new Intl.DateTimeFormat(dateLocale, {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}
