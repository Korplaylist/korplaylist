import { getCollection } from "astro:content";

export async function getPublishedTravelPosts() {
  const posts = await getCollection("travel", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function getPostUrl(post: { slug: string; data: { region: string } }) {
  return `/travel/${encodeURIComponent(post.data.region)}/${post.slug}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}
