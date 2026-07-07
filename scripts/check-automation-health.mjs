import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const expectedCwd = root;
const policyPath = path.join(root, ".automation", "manual-editorial-policy.json");
const automationPath = path.join(
  os.homedir(),
  ".codex",
  "automations",
  "korplaylist-july-queue-writer",
  "automation.toml"
);
const failures = [];

checkManualPolicy();
checkLocalAutomation();

if (failures.length) {
  console.error("Automation health check failed.");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Automation health check passed.");

function checkManualPolicy() {
  let policy;
  try {
    policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));
  } catch (error) {
    failures.push(`cannot read manual editorial policy: ${error.message}`);
    return;
  }

  if (policy.mode !== "manual-request-only") {
    failures.push(`manual editorial policy mode must be manual-request-only, found "${policy.mode}"`);
  }

  if (policy.dailyCount?.min !== 3 || policy.dailyCount?.max !== 5) {
    failures.push("manual editorial policy must keep dailyCount at 3-5");
  }

  if (JSON.stringify(policy.rotation) !== JSON.stringify(["ko", "en", "ja"])) {
    failures.push("manual editorial policy rotation must be ko -> en -> ja");
  }

  for (const locale of ["ko", "en", "ja"]) {
    if (!Array.isArray(policy.publishingWindows?.[locale]) || policy.publishingWindows[locale].length < 3) {
      failures.push(`manual editorial policy needs at least three publishing windows for ${locale}`);
    }
  }
}

function checkLocalAutomation() {
  if (!fs.existsSync(automationPath)) return;

  const source = fs.readFileSync(automationPath, "utf8");
  const status = readTomlString(source, "status");
  const cwdValues = readTomlArray(source, "cwds");

  if (status === "ACTIVE") {
    failures.push("Codex queue writer automation is ACTIVE; keep it PAUSED for manual-only publishing");
  }

  if (cwdValues.length && !cwdValues.includes(expectedCwd)) {
    failures.push(`Codex queue writer cwd mismatch. Expected "${expectedCwd}", found ${JSON.stringify(cwdValues)}`);
  }
}

function readTomlString(source, key) {
  const match = source.match(new RegExp(`^${key}\\s*=\\s*"([\\s\\S]*?)"\\s*$`, "m"));
  return match?.[1] ?? "";
}

function readTomlArray(source, key) {
  const match = source.match(new RegExp(`^${key}\\s*=\\s*\\[(.*?)\\]\\s*$`, "m"));
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1].replace(/\\\\/g, "\\"));
}
