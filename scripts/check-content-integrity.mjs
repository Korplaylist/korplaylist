import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content/travel";
const failures = [];

for (const file of fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".md"))) {
  const fullPath = path.join(CONTENT_DIR, file);
  const source = fs.readFileSync(fullPath, "utf8");
  const lines = source.split(/\r?\n/);
  let figureBalance = 0;
  let pictureBalance = 0;

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;
    figureBalance += count(line, /<figure\b/g);
    figureBalance -= count(line, /<\/figure>/g);
    pictureBalance += count(line, /<picture\b/g);
    pictureBalance -= count(line, /<\/picture>/g);

    if (/content-photo">/.test(line) && !/<figure\s+class="content-photo">/.test(line)) {
      fail(file, lineNumber, "content-photo HTML fragment is embedded in text");
    }

    if (/igure class="content-photo">/.test(line) && !/<figure\s+class="content-photo">/.test(line)) {
      fail(file, lineNumber, "figure start tag is broken");
    }

    if (/<picture>/.test(line) && figureBalance <= 0) {
      fail(file, lineNumber, "picture tag appears outside a figure");
    }

    if (/<source\b/.test(line) && !((lines[index - 1] ?? "").includes("<picture>"))) {
      fail(file, lineNumber, "source tag appears outside a picture");
    }

    if (/<img\b/.test(line)) {
      const alt = line.match(/alt="([^"]*)"/);
      if (!alt) fail(file, lineNumber, "image tag has a broken or missing alt attribute");
      if (!((lines[index - 1] ?? "").includes("<source"))) {
        fail(file, lineNumber, "image tag appears outside a source/picture block");
      }
      if (alt && /\b(width|height|loading|decoding|sizes)=/.test(alt[1])) {
        fail(file, lineNumber, "image attributes were absorbed into alt text");
      }
    }

    if (line.includes("[")) {
      const opens = count(line, /\[/g);
      const closes = count(line, /\]/g);
      if (opens !== closes) fail(file, lineNumber, "markdown link square brackets are unbalanced");
    }

    if (/\[[^\]]+\)[^\]]/.test(line) || /\]\([^)]*$/.test(line)) {
      fail(file, lineNumber, "markdown link appears to be unclosed");
    }

    if (/divrong|<\/p><\/divrong/.test(line)) {
      fail(file, lineNumber, "broken HTML table or div fragment");
    }

    if (/<stron(?!g)|^RW\s|<span>\?{2,}<\/span><strong>\?{2,}/.test(line)) {
      fail(file, lineNumber, "truncated HTML budget row");
    }

    if (/\?{4,}/.test(line)) {
      fail(file, lineNumber, "probable mojibake question-mark text");
    }
  }

  if (figureBalance !== 0) fail(file, "EOF", `figure tag balance is ${figureBalance}`);
  if (pictureBalance !== 0) fail(file, "EOF", `picture tag balance is ${pictureBalance}`);
}

if (failures.length) {
  console.error("Content integrity check failed.");
  console.table(failures);
  process.exit(1);
}

console.log("Content integrity check passed.");

function count(value, pattern) {
  return (value.match(pattern) ?? []).length;
}

function fail(file, line, reason) {
  failures.push({ file, line, reason });
}
