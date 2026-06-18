import fs from "node:fs";
import path from "node:path";

const contentDir = path.join(process.cwd(), "src", "content", "travel");
const files = fs.readdirSync(contentDir).filter((file) => file.endsWith(".md"));
const imagePattern = /(?:heroImage:\s*["']?([^"'\n\r]+)|!\[[^\]]*\]\(([^)\s]+))/g;

const records = [];

for (const file of files) {
  const fullPath = path.join(contentDir, file);
  const text = fs.readFileSync(fullPath, "utf8");
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const locale = field(frontmatter, "locale") || localeFromFile(file);
  const regionSlug = field(frontmatter, "regionSlug") || "unknown";
  const title = field(frontmatter, "title") || file;
  const seenInArticle = new Map();
  let match;

  while ((match = imagePattern.exec(text)) !== null) {
    const raw = (match[1] || match[2] || "").trim();
    const image = normalizeImage(raw);

    if (!image || image.startsWith("http")) continue;

    seenInArticle.set(image, (seenInArticle.get(image) || 0) + 1);
    records.push({ image, file, title, locale, regionSlug });
  }

  const duplicatesInArticle = [...seenInArticle.entries()].filter(([, count]) => count > 1);
  for (const [image, count] of duplicatesInArticle) {
    records.push({
      image,
      file,
      title,
      locale,
      regionSlug,
      duplicateInSameArticle: count
    });
  }
}

const problems = [];

for (const item of records.filter((record) => record.duplicateInSameArticle)) {
  problems.push(
    `[same-article] ${item.file} uses ${item.image} ${item.duplicateInSameArticle} times`
  );
}

for (const [groupKey, groupRecords] of groupBy(records, (record) => `${record.locale}:${record.regionSlug}`)) {
  const [, regionSlug] = groupKey.split(":");
  if (regionSlug === "unknown") continue;

  for (const [image, imageRecords] of groupBy(groupRecords, (record) => record.image)) {
    const filesUsingImage = unique(imageRecords.map((record) => record.file));
    if (filesUsingImage.length > 1) {
      problems.push(
        `[same-region] ${groupKey} reuses ${image} in ${filesUsingImage.join(", ")}`
      );
    }
  }
}

if (problems.length) {
  console.error("Image duplicate check failed.");
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log("Image duplicate check passed.");

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*["']?([^"'\r\n]+)`, "m"));
  return match?.[1]?.trim() ?? "";
}

function localeFromFile(file) {
  if (file.endsWith("-en.md")) return "en";
  if (file.endsWith("-ja.md")) return "ja";
  return "ko";
}

function normalizeImage(value) {
  return value.split("#")[0].split("?")[0].replace(/\/+$/, "");
}

function unique(values) {
  return [...new Set(values)];
}

function groupBy(values, keyFn) {
  const groups = new Map();
  for (const value of values) {
    const key = keyFn(value);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(value);
  }
  return groups;
}
