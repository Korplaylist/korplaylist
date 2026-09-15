import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const policy = JSON.parse(fs.readFileSync(".automation/manual-editorial-policy.json", "utf8"));
const run = (script, args = [], cwd = root) => spawnSync(process.execPath, [path.join(root, script), ...args], { cwd, encoding: "utf8" });

test("manual policy points to the shared prompt and protects existing content", () => {
  assert.equal(policy.mode, "manual-request-only");
  assert.ok(fs.existsSync(policy.writingPrompt));
  assert.ok(fs.existsSync(policy.imagePolicy));
  assert.equal(policy.policyVersion, "2026-09-16-final");
  assert.match(policy.scope, /Existing articles/);
});

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale} plan uses evidence-based briefing without image quotas`, () => {
    const result = run("scripts/create-manual-daily-plan.mjs", [`--locale=${locale}`, "--date=2026-09-15", "--count=4", "--stdout=true"]);
    assert.equal(result.status, 0, result.stderr);
    const plan = JSON.parse(result.stdout);
    assert.equal(plan.writingPrompt, policy.writingPrompt);
    assert.equal(plan.imagePolicy, policy.imagePolicy);
    assert.equal(plan.articlePlans.length, 4);
    assert.match(plan.keywordStrategy.titlePattern, /year only when essential/);
    for (const article of plan.articlePlans) {
      assert.equal(article.demandEvidence.basis, "hypothesis");
      assert.equal(article.existingIntentReview.decision, "pending");
      assert.equal(article.editorialReview.status, "pending");
      assert.deepEqual(article.claimLedger, []);
      assert.deepEqual(article.imagePlan, []);
      assert.equal(article.imageReview.status, "pending");
      assert.equal(article.presentationReview.mobile, "pending");
      for (const field of ["licenseEvidenceUrl", "commercialUse", "modificationAllowed", "referenceInputAllowed", "similarityReview", "rightsReviewStatus"]) assert.ok(article.imagePlanFields.includes(field));
    }
  });
}

test("legacy diagnostics allow short content without images but reject empty bodies", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "korplaylist-editorial-test-"));
  try {
    const content = path.join(temp, "src/content/travel");
    fs.mkdirSync(content, { recursive: true });
    const fixture = path.join(content, "fixture.md");
    fs.writeFileSync(fixture, "---\ntitle: Test\n---\nA short factual answer.\n");
    const before = fs.readFileSync(fixture, "utf8");
    const short = run("scripts/check-adsense-readiness.mjs", [], temp);
    assert.equal(short.status, 0, short.stderr);
    assert.match(short.stdout, /not Google requirements/);
    assert.equal(fs.readFileSync(fixture, "utf8"), before);
    fs.writeFileSync(fixture, "---\ntitle: Empty\n---\n");
    const empty = run("scripts/check-adsense-readiness.mjs", [], temp);
    assert.equal(empty.status, 1);
    assert.match(empty.stderr, /empty article body/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
