import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const site = {
  siteName: "한국플레이리스트",
  domain: "https://korplaylist.com",
  description:
    "한국플레이리스트는 국내 여행지, 당일치기 코스, 1박2일 일정, 교통과 비용 정보를 객관적으로 정리하는 한국여행 가이드입니다."
};

await fs.rm(distDir, { recursive: true, force: true });
await copyDir(publicDir, distDir);

const css = await fs.readFile(path.join(srcDir, "styles", "global.css"), "utf8");
const posts = await readPosts();
await writePage("/", homePage(posts));
await writePage("/travel/", listingPage("전체 여행 글", "지역, 일정, 비용, 계절 정보를 기준으로 국내여행 준비에 필요한 글을 모았습니다.", posts));
await writePage("/regions/", indexPage("지역별 여행", "국내 주요 여행지를 지역별로 탐색합니다.", unique(posts.map((post) => post.region)).map((region) => [`/regions/${encodeURIComponent(region)}/`, region])));
await writePage("/categories/", indexPage("테마별 여행", "여행 목적과 일정에 맞춰 필요한 글을 찾을 수 있습니다.", unique(posts.map((post) => post.category)).map((category) => [`/categories/${encodeURIComponent(category)}/`, category])));
for (const region of unique(posts.map((post) => post.region))) {
  await writePage(`/regions/${encodeURIComponent(region)}/`, listingPage(`${region} 여행`, `${region} 여행 코스, 교통, 비용, 방문 팁을 정리한 글입니다.`, posts.filter((post) => post.region === region)));
}
for (const category of unique(posts.map((post) => post.category))) {
  await writePage(`/categories/${encodeURIComponent(category)}/`, listingPage(category, `${category} 국내여행 정보를 모았습니다.`, posts.filter((post) => post.category === category)));
}
for (const post of posts) {
  await writePage(`/travel/${encodeURIComponent(post.region)}/${post.slug}/`, articlePage(post));
}
await writePage("/about/", simplePage("소개", [
  "한국플레이리스트는 국내여행을 준비하는 사람이 지역, 일정, 교통, 비용 정보를 빠르게 비교할 수 있도록 만든 한국여행 가이드입니다.",
  "모든 글은 방문 전 확인해야 할 기본 정보, 이동 동선, 예상 예산, 계절별 주의사항을 중심으로 정리합니다."
]));
await writePage("/contact/", simplePage("문의", [
  "콘텐츠 오류 제보, 제휴 문의, 사이트 운영 관련 문의는 hello@korplaylist.com 으로 보내주세요.",
  "여행지 운영 시간, 요금, 교통편은 현장 상황과 기관 공지에 따라 달라질 수 있습니다."
]));
await writePage("/privacy/", simplePage("개인정보처리방침", [
  "현재 사이트는 회원가입, 댓글, 결제 기능을 제공하지 않습니다.",
  "향후 방문 통계와 광고 운영을 위해 외부 서비스를 사용할 수 있으며, 각 서비스 정책에 따라 쿠키나 비식별 정보가 처리될 수 있습니다."
]));
await writePage("/terms/", simplePage("이용약관 및 면책 안내", [
  "한국플레이리스트의 콘텐츠는 국내여행 준비를 돕기 위한 일반 정보입니다.",
  "여행지 운영 시간, 요금, 교통편, 예약 조건은 변경될 수 있으므로 방문 전 공식 안내를 확인해 주세요."
]));
await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemap(posts), "utf8");
await fs.writeFile(path.join(distDir, "sitemap-index.xml"), sitemap(posts), "utf8");

async function readPosts() {
  const dir = path.join(srcDir, "content", "travel");
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith(".md"));
  const result = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const [, frontmatter, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const data = parseFrontmatter(frontmatter);
    if (data.draft === "true") continue;
    result.push({ ...data, slug: file.replace(/\.md$/, ""), body: markdown(body) });
  }
  return result.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

function parseFrontmatter(text) {
  const data = {};
  for (const line of text.split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("[") && value.endsWith("]")) value = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^"|"$/g, ""));
    data[key] = value;
  }
  return data;
}

function markdown(text) {
  return text
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("## ")) return `<h2 id="${slugify(block.slice(3))}">${escapeHtml(block.slice(3))}</h2>`;
      if (block.startsWith("### ")) return `<h3>${escapeHtml(block.slice(4))}</h3>`;
      return `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
}

function homePage(posts) {
  return layout(site.siteName, site.description, "/", `
    <section class="hero">
      <div><p class="eyebrow">국내여행 준비를 위한 빠른 기준점</p><h1>한국여행 코스와 비용을 한눈에 정리합니다</h1><p>${site.description}</p><div class="hero-actions"><a class="button" href="/regions/">지역별 보기</a><a class="button secondary" href="/categories/">테마별 보기</a></div></div>
      <img src="/images/hero-korea-travel.png" alt="한국 여행지를 상징하는 지도와 도시 풍경 이미지" width="1200" height="760" loading="eager">
    </section>
    <section class="section"><div class="section-head"><div><h2>최신 여행 가이드</h2><p>실제 여행 준비에 도움이 되는 정보 구조로 작성합니다.</p></div><a class="button secondary" href="/travel/">전체 글</a></div><div class="post-grid">${posts.slice(0, 6).map(card).join("")}</div></section>
    <section class="feature-band"><div class="section"><h2>지역별 여행</h2><div class="filter-grid">${unique(posts.map((post) => post.region)).map((region) => `<a href="/regions/${encodeURIComponent(region)}/">${region}</a>`).join("")}</div></div></section>`);
}

function listingPage(title, description, list) {
  return layout(title, description, "", `<section class="page-shell"><p class="eyebrow">Guide</p><h1>${title}</h1><p>${description}</p></section><section class="section"><div class="post-grid">${list.map(card).join("")}</div></section>`);
}

function indexPage(title, description, links) {
  return layout(title, description, "", `<section class="page-shell"><p class="eyebrow">Index</p><h1>${title}</h1><p>${description}</p><div class="page-copy filter-grid">${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}</div></section>`);
}

function articlePage(post) {
  return layout(post.title, post.description, urlFor(post), `<article class="article-shell"><nav class="breadcrumb"><a href="/">홈</a><span>/</span><a href="/regions/${encodeURIComponent(post.region)}/">${post.region}</a><span>/</span><span>${post.title}</span></nav><header class="article-header"><p class="meta">${post.region} · ${post.category}</p><h1>${post.title}</h1><p>${post.description}</p><dl class="article-facts"><div><dt>게시일</dt><dd>${post.publishedAt}</dd></div><div><dt>업데이트</dt><dd>${post.updatedAt}</dd></div><div><dt>태그</dt><dd>${post.tags.join(", ")}</dd></div></dl><img src="${post.heroImage}" alt="" width="1200" height="760" loading="eager"></header><div class="article-content">${post.body}</div></article>`, post.heroImage, "article");
}

function simplePage(title, paragraphs) {
  return layout(title, `${title} 페이지입니다.`, "", `<section class="page-shell"><p class="eyebrow">Info</p><h1>${title}</h1><div class="page-copy">${paragraphs.map((text) => `<p>${text}</p>`).join("")}</div></section>`);
}

function layout(title, description, canonical, body, image = "/images/hero-korea-travel.png", type = "website") {
  const pageTitle = title === site.siteName ? title : `${title} | ${site.siteName}`;
  const url = new URL(canonical || "/", site.domain).toString();
  return `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${pageTitle}</title><meta name="description" content="${escapeAttr(description)}"><link rel="canonical" href="${url}"><meta property="og:locale" content="ko_KR"><meta property="og:type" content="${type}"><meta property="og:site_name" content="${site.siteName}"><meta property="og:title" content="${escapeAttr(pageTitle)}"><meta property="og:description" content="${escapeAttr(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${new URL(image, site.domain)}"><style>${css}</style></head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark">K</span><span>${site.siteName}</span></a><nav class="nav"><a href="/regions/">지역</a><a href="/categories/">테마</a><a href="/about/">소개</a><a href="/contact/">문의</a></nav><div class="quick-links"><a href="/regions/${encodeURIComponent("서울")}/">서울</a><a href="/regions/${encodeURIComponent("부산")}/">부산</a><a href="/regions/${encodeURIComponent("제주")}/">제주</a><a href="/regions/${encodeURIComponent("강릉")}/">강릉</a></div></header><main>${body}</main><footer class="site-footer"><div><strong>${site.siteName}</strong><p>국내 여행을 준비하는 사람을 위한 객관적이고 빠른 한국여행 가이드입니다.</p></div><nav><a href="/about/">소개</a><a href="/privacy/">개인정보처리방침</a><a href="/terms/">이용약관</a><a href="/contact/">문의</a></nav></footer></body></html>`;
}

function card(post) {
  return `<article class="post-card"><a href="${urlFor(post)}" class="post-image-link"><img src="${post.heroImage}" alt="" width="640" height="420" loading="lazy"></a><div class="post-card-body"><p class="meta">${post.region} · ${post.category}</p><h2><a href="${urlFor(post)}">${post.title}</a></h2><p>${post.description}</p><div class="tag-list">${post.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div></div></article>`;
}

function sitemap(posts) {
  const urls = ["/", "/travel/", "/regions/", "/categories/", "/about/", "/contact/", "/privacy/", "/terms/", ...posts.map(urlFor)];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${new URL(url, site.domain)}</loc></url>`).join("")}</urlset>`;
}

async function writePage(url, html) {
  const dir = path.join(distDir, decodeURIComponent(url));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), html, "utf8");
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dest);
    else await fs.copyFile(src, dest);
  }
}

function urlFor(post) {
  return `/travel/${encodeURIComponent(post.region)}/${post.slug}/`;
}

function unique(items) {
  return [...new Set(items)];
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/\n/g, " ");
}

function slugify(text) {
  return encodeURIComponent(text.trim().replace(/\s+/g, "-"));
}
