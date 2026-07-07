import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const expectedCwd = root;
const automationPath = path.join(
  os.homedir(),
  ".codex",
  "automations",
  "korplaylist-july-queue-writer",
  "automation.toml"
);
const queuePath = path.join(root, ".automation", "july-2026-editorial-queue.json");
const failures = [];

checkQueue();
checkLocalAutomation();

if (failures.length) {
  console.error("Automation health check failed.");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Automation health check passed.");

function checkQueue() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(queuePath, "utf8"));
  } catch (error) {
    failures.push(`cannot read editorial queue: ${error.message}`);
    return;
  }

  if (!Array.isArray(payload.queue)) {
    failures.push("editorial queue is missing a queue array");
    return;
  }

  for (const item of payload.queue) {
    if (!item.date || !item.regionSlug || !item.title || !item.primaryKeyword) {
      failures.push(`queue item has missing planning fields: ${JSON.stringify(item)}`);
      continue;
    }

    if (hasReplacementChars(item.title) || hasReplacementChars(item.primaryKeyword)) {
      failures.push(`queue item appears mojibake/corrupted: ${item.date}`);
    }

    if (!["queued", "prepared"].includes(item.status)) {
      failures.push(`queue item has unsupported status "${item.status}": ${item.date}`);
    }

    if (!Array.isArray(item.publications) || item.publications.length !== 3) {
      failures.push(`queue item must have ko/en/ja publication times: ${item.date}`);
    }
  }
}

function checkLocalAutomation() {
  if (!fs.existsSync(automationPath)) return;

  const source = fs.readFileSync(automationPath, "utf8");
  const status = readTomlString(source, "status");
  const cwdValues = readTomlArray(source, "cwds");
  const prompt = readTomlString(source, "prompt");

  if (status === "ACTIVE") {
    failures.push("Codex queue writer automation is ACTIVE; keep it PAUSED unless manually supervised");
  }

  if (cwdValues.length && !cwdValues.includes(expectedCwd)) {
    failures.push(`Codex queue writer cwd mismatch. Expected "${expectedCwd}", found ${JSON.stringify(cwdValues)}`);
  }

  if (hasReplacementChars(source) || /異|뷴|�/.test(source)) {
    failures.push("Codex queue writer automation file contains mojibake/corrupted Korean text");
  }

  if (prompt && !/never display source lists/i.test(prompt)) {
    failures.push("Codex queue writer prompt is missing the no-source-list rule");
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

function hasReplacementChars(value) {
  return /�|\?{2,}|[縺譁蜊遺쒖쿂]/.test(value);
}
