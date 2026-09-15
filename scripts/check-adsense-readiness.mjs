import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content/travel";
const MIN_TEXT_CHARS = 3000;
const MIN_BODY_IMAGES = 3;

const failures = [];
const diagnostics = [];

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
  if (textChars === 0) failures.push(file);

  if (textChars < MIN_TEXT_CHARS || imageCount < MIN_BODY_IMAGES) {
    diagnostics.push({
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

console.log("Legacy length/image diagnostics only: these are not Google requirements or approval criteria.");
if (diagnostics.length) console.table(diagnostics);
if (failures.length) {
  console.error("Content check failed: empty article body. Review the affected draft; do not bulk change existing articles or indexing.");
  console.table(failures);
  process.exit(1);
}

console.log("Nonempty-body check passed. Human editorial review is still required; no Google approval is implied.");

function stripMarkup(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
