import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content/travel";
const PUBLIC_DIR = "public";
const changed = [];

for (const file of fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".md"))) {
  const fullPath = path.join(CONTENT_DIR, file);
  let source = fs.readFileSync(fullPath, "utf8");
  const original = source;

  source = source.replace(/\/images\/(?:generated|myrealtrip)\/[a-z]+\/images\/generated\/unique\/([^"\s>]*?\.jpg)[^"\s>]*/g, "/images/generated/unique/$1");
  source = source.replace(/\/images\/(?:kt|gene)\/images\/generated\/unique\/([^"\s>]*?\.jpg)[^"\s>]*/g, "/images/generated/unique/$1");
  source = source.replace(/\/images\/optimized\/(?:generated|myrealtrip)\/([^",\s]+?\.webp)/g, (match, fileName) => {
    const uniquePath = `/images/optimized/generated/unique/${fileName}`;
    return exists(uniquePath) ? uniquePath : match;
  });

  source = source.replace(/srcset="([^"]+)"/g, (match, srcset) => {
    const kept = srcset
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .filter((entry) => {
        const assetPath = entry.split(/\s+/)[0];
        return !assetPath.startsWith("/") || exists(assetPath);
      });

    return kept.length ? `srcset="${kept.join(", ")}"` : match;
  });

  if (source !== original) {
    fs.writeFileSync(fullPath, source);
    changed.push(file);
  }
}

if (changed.length) {
  console.log(`Repaired asset references in ${changed.length} files:`);
  for (const file of changed) console.log(`- ${file}`);
} else {
  console.log("No asset reference repairs needed.");
}

function exists(assetPath) {
  return fs.existsSync(path.join(PUBLIC_DIR, assetPath.slice(1)));
}
