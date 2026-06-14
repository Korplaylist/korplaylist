import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const outDir = path.join(process.cwd(), "public", "images");
await fs.mkdir(outDir, { recursive: true });

const images = [
  ["hero-korea-travel", [15, 118, 110], [245, 158, 11]],
  ["seoul-palace", [51, 65, 85], [194, 65, 12]],
  ["seoul-hangang", [15, 118, 110], [37, 99, 235]],
  ["busan-coast", [2, 132, 199], [249, 115, 22]],
  ["busan-market", [180, 83, 9], [220, 38, 38]],
  ["jeju-coast", [15, 118, 110], [34, 197, 94]],
  ["jeju-bus", [3, 105, 161], [132, 204, 22]],
  ["gangneung-sea", [37, 99, 235], [20, 184, 166]],
  ["gangneung-two-day", [29, 78, 216], [245, 158, 11]],
  ["jeonju-hanok", [146, 64, 14], [15, 118, 110]],
  ["jeonju-food", [180, 83, 9], [239, 68, 68]],
  ["gyeongju-history", [133, 77, 14], [71, 85, 105]],
  ["gyeongju-family", [77, 124, 15], [217, 119, 6]],
  ["yeosu-night", [30, 41, 59], [14, 165, 233]],
  ["yeosu-island", [8, 145, 178], [101, 163, 13]],
  ["sokcho-mountain", [22, 101, 52], [15, 118, 110]],
  ["sokcho-bus", [71, 85, 105], [2, 132, 199]],
  ["tongyeong-sea", [3, 105, 161], [249, 115, 22]],
  ["tongyeong-island", [14, 116, 144], [132, 204, 22]],
  ["incheon-port", [71, 85, 105], [180, 83, 9]],
  ["daegu-street", [124, 45, 18], [37, 99, 235]],
  ["chuncheon-lake", [15, 118, 110], [96, 165, 250]],
  ["korea-season", [190, 18, 60], [22, 163, 74]]
];

for (const [name, a, b] of images) {
  await fs.writeFile(path.join(outDir, `${name}.png`), png(1200, 760, a, b));
}

function png(width, height, a, b) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = row + 1 + x * 3;
      const sky = mix([248, 250, 252], [226, 232, 240], y / height);
      const sun = Math.hypot(x - 930, y - 150) < 88 ? [253, 230, 138] : sky;
      const hill1 = y > 470 + Math.sin(x / 90) * 38;
      const hill2 = y > 570 + Math.cos(x / 120) * 30;
      const color = hill2 ? b : hill1 ? a : sun;
      raw[i] = color[0];
      raw[i + 1] = color[1];
      raw[i + 2] = color[2];
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", Buffer.concat([u32(width), u32(height), Buffer.from([8, 2, 0, 0, 0])])),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function mix(a, b, t) {
  return a.map((value, index) => Math.round(value + (b[index] - value) * t));
}

function chunk(type, data) {
  const name = Buffer.from(type);
  return Buffer.concat([u32(data.length), name, data, u32(crc(Buffer.concat([name, data])))]);
}

function u32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value >>> 0);
  return buffer;
}

function crc(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}
