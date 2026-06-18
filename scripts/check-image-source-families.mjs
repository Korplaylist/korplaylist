import fs from "node:fs";
import path from "node:path";

const contentDir = path.join(process.cwd(), "src", "content", "travel");
const files = fs.readdirSync(contentDir).filter((file) => file.endsWith(".md"));
const imagePatterns = [
  /heroImage:\s*["']?([^"'\n\r]+)/g,
  /!\[[^\]]*\]\(([^)\s]+)\)/g,
  /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/g
];

const translationKeys = new Set();
const records = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(contentDir, file), "utf8");
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  translationKeys.add(field(fm, "translationKey") || translationKeyFromFile(file));
}

for (const file of files) {
  const text = fs.readFileSync(path.join(contentDir, file), "utf8");
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const translationKey = field(fm, "translationKey") || translationKeyFromFile(file);
  const locale = field(fm, "locale") || localeFromFile(file);

  for (const pattern of imagePatterns) {
    pattern.lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const image = normalizeImage((match[1] || "").trim());
      if (!image || image.startsWith("http")) continue;

      records.push({
        image,
        family: sourceFamily(image),
        file,
        locale,
        translationKey
      });
    }
  }
}

const problems = [];

for (const [family, familyRecords] of groupBy(records, (record) => record.family)) {
  const keys = unique(familyRecords.map((record) => record.translationKey));
  if (keys.length <= 1) continue;

  const generated2 = familyRecords.filter((record) => record.image.includes("/images/generated/"));
  const official = familyRecords.filter((record) => record.image.includes("/images/kto/") || record.image.includes("/images/myrealtrip/"));

  if (official.length > 1 || generated2.length > 1) {
    problems.push(
      `[source-family] ${family} appears in ${keys.length} different posts: ${unique(
        familyRecords.map((record) => `${record.file}:${record.image}`)
      ).join(", ")}`
    );
  }
}

if (problems.length) {
  console.error("Image source-family audit failed.");
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log("Image source-family audit passed.");

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*["']?([^"'\r\n]+)`, "m"));
  return match?.[1]?.trim() ?? "";
}

function localeFromFile(file) {
  if (file.endsWith("-en.md")) return "en";
  if (file.endsWith("-ja.md")) return "ja";
  return "ko";
}

function translationKeyFromFile(file) {
  return file.replace(/-(en|ja)\.md$/, "").replace(/\.md$/, "");
}

function normalizeImage(value) {
  return value.split("#")[0].split("?")[0].replace(/\/+$/, "");
}

function sourceFamily(image) {
  const stem = path.basename(image).replace(/\.(jpe?g|png|webp)$/i, "");
  const withoutSize = stem.replace(/-\d+$/, "");
  const withoutGeneratedSuffix = withoutSize.replace(/-generated$/, "");

  if (!image.includes("/images/generated/unique/")) {
    return image.replace(/-\d+\.(webp)$/i, ".$1").replace(/\.(jpe?g|png|webp)$/i, "");
  }

  for (const key of [...translationKeys].sort((a, b) => b.length - a.length)) {
    const slug = key.replace(/_/g, "-");
    const marker = `-${slug}-`;
    const index = withoutGeneratedSuffix.indexOf(marker);
    if (index > 0) {
      return `/images/generated/unique/${withoutGeneratedSuffix.slice(0, index)}`;
    }
  }

  return `/images/generated/unique/${withoutGeneratedSuffix.replace(/-\d+$/, "")}`;
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
