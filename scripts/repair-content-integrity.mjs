import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content/travel";
const WIDTHS = [160, 240, 320, 330, 360, 480, 520, 640, 680, 768, 960, 1200];

const paragraphs = {
  ko: "관련 글은 지역, 교통수단, 체류 시간이 실제로 겹칠 때만 함께 보는 것이 좋습니다. 유명한 장소를 더 넣기보다 같은 권역 안에서 우선순위를 정하는 편이 일정 만족도를 높입니다.",
  en: "Use related guides only when the route, transport method, and travel area actually overlap. Adding extra stops just because another guide exists usually makes the day harder rather than better.",
  ja: "関連ガイドは、エリア・交通手段・滞在時間が実際に重なる場合だけ参考にしてください。別エリアの目的地を無理に足すより、同じ移動条件の中で優先順位を決める方が現実的です。"
};

let changed = 0;

for (const file of fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".md"))) {
  const fullPath = path.join(CONTENT_DIR, file);
  const source = fs.readFileSync(fullPath, "utf8");
  const lines = source.split(/\r?\n/);
  const title = source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? file.replace(/\.md$/, "");
  const lang = file.endsWith("-en.md") ? "en" : file.endsWith("-ja.md") ? "ja" : "ko";
  const out = [];
  let fileChanged = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const malformedFigure = /^\s*<figure\b/.test(line) && line.trim() !== '<figure class="content-photo">';
    const inlinePicture = /<picture>/.test(line) && !/^\s*<picture>\s*$/.test(line);
    const inlineFigure = /content-photo">/.test(line) && !/<figure\s+class="content-photo">/.test(line);
    const sourceOutsidePicture = /^\s*<source\b/.test(line) && !(lines[i - 1] ?? "").includes("<picture>");
    const imageOutsideSource = /^\s*<img\b/.test(line) && !(lines[i - 1] ?? "").includes("<source");
    const nextIsPicture = i + 1 < lines.length && /^\s*<picture>\s*$/.test(lines[i + 1]);
    const textBeforePicture = nextIsPicture && !/^\s*<figure\s+class="content-photo">\s*$/.test(line) && line.trim() !== "";
    const squareImbalance = line.includes("[") && count(line, /\[/g) !== count(line, /\]/g);
    const unclosedLink = /\[[^\]]+\)[^\]]/.test(line) || /\]\([^)]*$/.test(line);

    if (line.includes("divrong")) {
      if (lang === "ja") {
        out.push("  <div><span>地域内交通</span><strong>8,000〜25,000ウォン</strong><p>地下鉄やバス中心なら低め、短距離タクシーを複数回使うと上がります。</p></div>");
        out.push("  <div><span>食事・カフェ</span><strong>35,000〜70,000ウォン</strong><p>市場グルメやカフェを入れると満足度は上がりますが、小さな出費が増えます。</p></div>");
      } else if (lang === "en") {
        out.push("  <div><span>Local transport</span><strong>KRW 8,000-25,000</strong><p>Subway and bus routes stay low; several short taxis raise the total quickly.</p></div>");
        out.push("  <div><span>Food and cafes</span><strong>KRW 35,000-70,000</strong><p>Markets and cafes improve the trip, but small purchases add up quickly.</p></div>");
      } else {
        out.push("  <div><span>지역 내 교통</span><strong>8,000~25,000원</strong><p>지하철·버스 중심이면 낮고, 짧은 택시를 2회 이상 넣으면 올라갑니다.</p></div>");
        out.push("  <div><span>식사·카페</span><strong>35,000~70,000원</strong><p>시장 음식과 카페를 넣으면 만족도는 올라가지만 작은 지출이 늘어납니다.</p></div>");
      }
      fileChanged = true;
      continue;
    }

    if (/^RW\s|<stron(?!g)|<span>入場・体験<\/span><strong>0〜30ー/.test(line)) {
      out.push(backupBudgetLine(lang));
      fileChanged = true;
      continue;
    }

    if (/\?{4,}/.test(line)) {
      if (/<figcaption>/.test(line)) {
        out.push(line.includes("2.0") ? "  <figcaption>ⓒKorea Playlist Image 2.0</figcaption>" : "  <figcaption>ⓒ한국관광공사 포토코리아</figcaption>");
      } else if (/<img\b/.test(line)) {
        out.push(line.replace(/alt="[^"]*"/, `alt="${escapeAttr(title + (lang === "en" ? " travel guide image" : lang === "ja" ? " 旅行ガイド画像" : " 여행 가이드 이미지"))}"`));
      } else {
        pushParagraph(out, lang);
      }
      fileChanged = true;
      continue;
    }

    if (malformedFigure || inlinePicture || inlineFigure || sourceOutsidePicture || imageOutsideSource || textBeforePicture) {
      let end = i;
      while (end < lines.length && !/<\/figure>/.test(lines[end])) end++;
      if (end >= lines.length) end = i;

      const block = lines.slice(i, end + 1).join("\n");
      const imgLine = block.match(/<img\b[^>]*>/)?.[0];
      if (imgLine) {
        if (!/^\s*<figure\b/.test(line)) {
          pushParagraph(out, lang);
        }
        out.push(...figureFromImg(imgLine, title, lang));
        fileChanged = true;
        i = end;
        continue;
      }
    }

    if (squareImbalance || unclosedLink) {
      pushParagraph(out, lang);
      fileChanged = true;
      continue;
    }

    out.push(line);
  }

  if (fileChanged) {
    fs.writeFileSync(fullPath, out.join("\n"), "utf8");
    console.log(`repaired ${file}`);
    changed++;
  }
}

console.log(`changed files: ${changed}`);

function pushParagraph(out, lang) {
  if (out.length && out[out.length - 1] !== "") out.push("");
  if (out[out.length - 1] !== paragraphs[lang]) out.push(paragraphs[lang]);
  out.push("");
}

function figureFromImg(imgLine, title, lang) {
  const src = attr(imgLine, "src") || "/images/generated/korplaylist-logo-og.jpg";
  const width = attr(imgLine, "width") || "1200";
  const height = attr(imgLine, "height") || "800";
  const alt = escapeAttr(`${title}${lang === "en" ? " travel guide image" : lang === "ja" ? " 旅行ガイド画像" : " 여행 가이드 이미지"}`);
  const caption = src.includes("/generated/") ? "ⓒKorea Playlist Image 2.0" : "ⓒ한국관광공사 포토코리아";

  return [
    '<figure class="content-photo">',
    "  <picture>",
    `    <source type="image/webp" srcset="${srcsetFor(src)}" sizes="(max-width: 860px) calc(100vw - 36px), 792px" />`,
    `    <img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy" decoding="async" sizes="(max-width: 860px) calc(100vw - 36px), 792px" />`,
    "  </picture>",
    `  <figcaption>${caption}</figcaption>`,
    "</figure>"
  ];
}

function backupBudgetLine(lang) {
  if (lang === "en") return "  <div><span>Backup budget</span><strong>KRW 20,000-40,000</strong><p>Keep room for rain, missed buses, luggage movement, or a taxi at the end of the day.</p></div>";
  if (lang === "ja") return "  <div><span>予備費</span><strong>20,000〜40,000ウォン</strong><p>雨、終バス、荷物移動でタクシーが必要になる場合に備えます。</p></div>";
  return "  <div><span>비상 예산</span><strong>20,000~40,000원</strong><p>비, 막차, 짐 이동 때문에 택시를 타야 할 상황을 대비합니다.</p></div>";
}

function srcsetFor(src) {
  const withoutExtension = src.replace(/\.(jpe?g|png|webp)$/i, "");
  const optimized = withoutExtension.replace("/images/", "/images/optimized/");
  return WIDTHS.map((width) => `${optimized}-${width}.webp ${width}w`).join(", ");
}

function attr(tag, name) {
  return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function count(value, pattern) {
  return (value.match(pattern) ?? []).length;
}
