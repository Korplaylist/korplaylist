import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import versionImageUrls from "./version-image-urls.mjs";

test("versions nested image candidates, preserves markup, and refreshes changed files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "image-version-test-"));
  try {
    await mkdir(path.join(root, "images/unique"), { recursive: true });
    const asset = path.join(root, "images/unique/photo.jpg");
    await writeFile(asset, "first image bytes");
    const html = '<!doctype html><picture><source srcset="/images/unique/photo.jpg 480w, /images/unique/photo.jpg 960w"><img src="/images/unique/photo.jpg" alt="keep this"></picture><script>const src="/images/not-an-image.jpg";</script>';
    const page = path.join(root, "index.html");
    await writeFile(page, html);
    const build = () => versionImageUrls().hooks["astro:build:done"]({ dir: pathToFileURL(root + path.sep), logger: { info() {} } });
    await build();
    const first = await readFile(page, "utf8");
    assert.equal((first.match(/\?v=[a-f0-9]{12}/g) ?? []).length, 3);
    assert.ok(first.includes('alt="keep this"'));
    assert.ok(first.includes('<script>const src="/images/not-an-image.jpg";</script>'));
    await build();
    assert.equal(await readFile(page, "utf8"), first);
    await writeFile(asset, "changed image bytes");
    await build();
    assert.notEqual(await readFile(page, "utf8"), first);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
