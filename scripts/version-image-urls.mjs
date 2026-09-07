import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

// Old image URLs can hold cached HTML from an earlier deployment's fallback.
// Content hashes also refresh images when their bytes change in later builds.
export default function versionImageUrls() {
  return {
    name: "version-image-urls",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const versions = new Map();
        async function version(value) {
          return Promise.all(value.split(/(\s+|,)/).map(async (part) => {
            if (!part.startsWith("/images/")) return part;
            const url = new URL(part, "https://korplaylist.com");
            if (!versions.has(url.pathname)) {
              const bytes = await readFile(path.join(root, decodeURIComponent(url.pathname)));
              versions.set(url.pathname, createHash("sha256").update(bytes).digest("hex").slice(0, 12));
            }
            url.searchParams.set("v", versions.get(url.pathname));
            return url.pathname + url.search + url.hash;
          })).then((parts) => parts.join(""));
        }
        async function visitDirectory(directory) {
          for (const entry of await readdir(directory, { withFileTypes: true })) {
            const filename = path.join(directory, entry.name);
            if (entry.isDirectory()) {
              await visitDirectory(filename);
            } else if (entry.name.endsWith(".html")) {
              let html = await readFile(filename, "utf8");
              const document = parse(html, { sourceCodeLocationInfo: true });
              const edits = [];
              async function visit(node) {
                for (const attr of node.attrs ?? []) {
                  if (!["src", "srcset", "imagesrcset", "href", "poster", "content"].includes(attr.name)) continue;
                  if (!attr.value.startsWith("/images/")) continue;
                  const location = node.sourceCodeLocation?.attrs?.[attr.name];
                  if (!location) continue;
                  const value = (await version(attr.value)).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
                  edits.push({ start: location.startOffset, end: location.endOffset, text: `${attr.name}="${value}"` });
                }
                for (const child of node.childNodes ?? []) await visit(child);
                if (node.content) await visit(node.content);
              }
              await visit(document);
              for (const edit of edits.sort((a, b) => b.start - a.start)) {
                html = html.slice(0, edit.start) + edit.text + html.slice(edit.end);
              }
              if (edits.length) await writeFile(filename, html);
            }
          }
        }
        await visitDirectory(root);
        logger.info(`Versioned ${versions.size} image URLs with content hashes.`);
      }
    }
  };
}
