import fs from "node:fs";
import path from "node:path";

const contentDir = path.resolve("src/content/travel");
const markerPath = path.resolve(".automation/published-posts.json");
const now = new Date();
const duePosts = [];

for (const file of fs.readdirSync(contentDir).filter((name) => name.endsWith(".md"))) {
  const source = fs.readFileSync(path.join(contentDir, file), "utf8");
  const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) continue;
  const publishedAt = field(frontmatter[1], "publishedAt");
  const draft = field(frontmatter[1], "draft");
  if (!publishedAt || draft === "true") continue;
  const publishedDate = new Date(publishedAt);
  if (!Number.isNaN(publishedDate.valueOf()) && publishedDate <= now) {
    duePosts.push(`${file}|${publishedDate.toISOString()}`);
  }
}

duePosts.sort();
const previous = readMarker();
const previousSet = new Set(previous.posts ?? []);
const newlyDue = duePosts.filter((post) => !previousSet.has(post));

if (!newlyDue.length) {
  console.log("No newly due posts.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(markerPath), { recursive: true });
fs.writeFileSync(markerPath, `${JSON.stringify({ updatedAt: now.toISOString(), posts: duePosts }, null, 2)}\n`, "utf8");
console.log(`Deployment due for ${newlyDue.length} post(s).`);

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, "m"));
  return match?.[1]?.trim() ?? "";
}

function readMarker() {
  try {
    return JSON.parse(fs.readFileSync(markerPath, "utf8"));
  } catch {
    return { posts: [] };
  }
}
