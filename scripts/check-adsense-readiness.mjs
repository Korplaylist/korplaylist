import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content/travel";
const MIN_TEXT_CHARS = 3000;
const MIN_BODY_IMAGES = 3;

const failures = [];

for (const file of fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".md"))) {
  const fullPath = path.join(CONTENT_DIR, file);
  const source = fs.readFileSync(fullPath, "utf8");
  const frontmatter = source.match(/^---([\s\S]*?)---/)?.[1] ?? "";
  const body = source.replace(/^---[\s\S]*?---\s*/, "");

  if (/draft:\s*true/.test(frontmatter) || /adsenseReady:\s*false/.test(frontmatter)) {
    continue;
  }

  const textChars = (stripMarkup(body).match(/[\p{L}\p{N}]/gu) ?? []).length;
  const imageCount = (body.match(/!\[[^\]]*]\([^)]+\)|<img\b/gi) ?? []).length;

  if (textChars < MIN_TEXT_CHARS || imageCount < MIN_BODY_IMAGES) {
    failures.push({
      file,
      textChars,
      imageCount,
      reason: [
        textChars < MIN_TEXT_CHARS ? `text ${textChars}/${MIN_TEXT_CHARS}` : null,
        imageCount < MIN_BODY_IMAGES ? `images ${imageCount}/${MIN_BODY_IMAGES}` : null
      ].filter(Boolean).join(", ")
    });
  }
}

if (failures.length) {
  console.error("AdSense readiness check failed. Mark these posts adsenseReady: false or improve them first.");
  console.table(failures);
  process.exit(1);
}

console.log("AdSense readiness check passed.");

function stripMarkup(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
