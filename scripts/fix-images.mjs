import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const pythonCandidates = [
  process.env.PYTHON,
  path.join(
    os.homedir(),
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "python",
    "python.exe"
  ),
  "python",
  "py"
].filter(Boolean);

const python = pythonCandidates.find((candidate) => {
  if (candidate === "python" || candidate === "py") return true;
  return fs.existsSync(candidate);
});

run(python, [path.join("scripts", "resolve-image-duplicates.py")]);
run(process.execPath, [path.join("scripts", "check-image-duplicates.mjs")]);
run(process.execPath, [path.join("scripts", "check-image-source-families.mjs")]);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: false
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
