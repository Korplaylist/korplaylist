import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content/travel";
const PUBLIC_DIR = "public";
const failures = [];

for (const file of fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".md"))) {
  const source = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");

  for (const match of source.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const assetPath of extractAssetPaths(match[1])) {
      if (!assetPath.startsWith("/images/") && !assetPath.startsWith("/brand/") && !assetPath.startsWith("/icons/")) {
        continue;
      }

      if (/images\/(?:generated|myrealtrip|kt|gene)\/[a-z]+\/images\//.test(assetPath) || /jpg(?:width|height|\d)/.test(assetPath)) {
        failures.push({ file, path: assetPath, reason: "malformed asset path" });
        continue;
      }

      const localPath = path.join(PUBLIC_DIR, assetPath.slice(1));
      if (!fs.existsSync(localPath)) {
        failures.push({ file, path: assetPath, reason: "asset file does not exist" });
      }
    }
  }
}

if (failures.length) {
  console.error("Asset existence check failed.");
  console.table(failures.slice(0, 120));
  if (failures.length > 120) console.error(`...and ${failures.length - 120} more.`);
  process.exit(1);
}

console.log("Asset existence check passed.");

function extractAssetPaths(value) {
  return value
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}
