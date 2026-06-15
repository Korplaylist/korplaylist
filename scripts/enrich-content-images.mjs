import fs from "node:fs/promises";
import path from "node:path";

const serviceKey = process.env.KTO_PHOTO_API_KEY;

if (!serviceKey) {
  throw new Error("KTO_PHOTO_API_KEY environment variable is required.");
}

const outDir = "public/images/kto";
await fs.mkdir(outDir, { recursive: true });

const jobs = {
  "busan-market-food.md": "부산 자갈치시장",
  "busan-two-day-route.md": "부산 광안대교",
  "chuncheon-lake-day.md": "춘천 소양강",
  "daegu-modern-street.md": "대구 근대골목",
  "gangneung-sea-coffee.md": "강릉 안목해변",
  "gangneung-two-day.md": "강릉 주문진",
  "gyeongju-family.md": "경주 대릉원",
  "gyeongju-history-two-day.md": "경주 불국사",
  "incheon-open-port.md": "인천 차이나타운",
  "jeju-three-day-first.md": "제주 성산일출봉",
  "jeju-without-car.md": "제주 해안도로",
  "jeonju-food-cost.md": "전주 남부시장",
  "jeonju-hanok-day.md": "전주 한옥마을",
  "korea-season-travel-calendar.md": "진해 벚꽃",
  "seoul-hangang-evening.md": "서울 한강 야경",
  "seoul-one-day-palace-walk.md": "서울 경복궁",
  "sokcho-seoraksan-market.md": "속초 설악산",
  "sokcho-without-car.md": "속초 중앙시장",
  "tongyeong-island-view.md": "통영 동피랑",
  "tongyeong-two-day.md": "통영 한산도",
  "yeosu-island-day.md": "여수 오동도",
  "yeosu-night-sea.md": "여수 밤바다"
};

function slugOf(file) {
  return file.replace(/\.md$/, "");
}

function cleanCredit(name = "") {
  return name.replace(/^한국관광공사\s*/u, "").trim() || "한국관광공사";
}

function escapeAttr(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function search(keyword) {
  const url = new URL("https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1");
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("MobileOS", "ETC");
  url.searchParams.set("MobileApp", "Korplaylist");
  url.searchParams.set("_type", "json");
  url.searchParams.set("numOfRows", "5");
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("keyword", keyword);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${keyword}: ${res.status}`);
  }
  const json = await res.json();
  const items = json?.response?.body?.items?.item;
  return Array.isArray(items) ? items[0] : items;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${url}: ${res.status}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  await fs.writeFile(dest, bytes);
}

function insertFigure(markdown, figure) {
  if (markdown.includes('class="content-photo"')) {
    return markdown;
  }
  const match = markdown.match(/(## [^\n]+\n\n[\s\S]*?\n\n)/);
  if (match) {
    return markdown.replace(match[1], `${match[1]}${figure}\n\n`);
  }
  return `${markdown}\n\n${figure}\n`;
}

const results = [];

for (const [file, keyword] of Object.entries(jobs)) {
  try {
    const item = await search(keyword);
    if (!item?.galWebImageUrl) {
      throw new Error("no image");
    }

    const slug = slugOf(file);
    const dest = path.join(outDir, `${slug}-content.jpg`);
    const sourceUrl = item.galWebImageUrl.replace("http://", "https://");
    await download(sourceUrl, dest).catch(() => download(item.galWebImageUrl, dest));

    const title = item.galTitle || keyword;
    const credit = cleanCredit(item.galPhotographer);
    const imagePath = `/images/kto/${slug}-content.jpg`;
    const figure = `<figure class="content-photo">
  <img src="${imagePath}" alt="${escapeAttr(title)}" width="1200" height="800" loading="lazy" />
  <figcaption>ⓒ한국관광공사 포토코리아-${escapeAttr(credit)}</figcaption>
</figure>`;

    const mdPath = path.join("src/content/travel", file);
    const before = await fs.readFile(mdPath, "utf8");
    const after = insertFigure(before, figure);
    await fs.writeFile(mdPath, after, "utf8");

    results.push({ file, keyword, title, credit, imagePath });
    await new Promise((resolve) => setTimeout(resolve, 180));
  } catch (error) {
    results.push({ file, keyword, error: error.message });
  }
}

console.log(JSON.stringify(results, null, 2));
