import fs from "node:fs";
import path from "node:path";

const localeOrder = ["ko", "en", "ja"];
const keywordPlaybooks = {
  ko: {
    audience: "\uad6d\ub0b4 \uc5ec\ud589\uc790",
    keywordLanguage: "Korean",
    priorityModifiers: [
      "\ub2f9\uc77c\uce58\uae30",
      "1\ubc152\uc77c",
      "\ube44\uc624\ub294\ub0a0",
      "\uc544\uc774\uc640",
      "\ubd80\ubaa8\ub2d8",
      "\ub6b8\ubc85\uc774",
      "\uc5ec\ud589 \ucf54\uc2a4",
      "\uc219\uc18c \uc704\uce58",
      "\ub9db\uc9d1",
      "\ube44\uc6a9"
    ],
    titlePattern: "\uc9c0\uc5ed + \uac15\ud55c \uac80\uc0c9 \uc758\ub3c4 + \uc5f0\ub3c4 + \uc2e4\uc81c \uace0\ubbfc \ud574\uacb0 \ubb38\uc7a5",
    intentExamples: [
      "\ubd80\uc0b0 1\ubc152\uc77c \ucf54\uc2a4",
      "\uc81c\uc8fc \ube44\uc624\ub294\ub0a0 \uc11c\uadc0\ud3ec",
      "\uc11c\uc6b8 \uadfc\uad50 \ub2f9\uc77c\uce58\uae30",
      "\uac15\ub989 \ub6b8\ubc85\uc774 \uc5ec\ud589",
      "\uc804\uc8fc \ud55c\uc625\ub9c8\uc744 \ub9db\uc9d1 \ube44\uc6a9"
    ]
  },
  en: {
    audience: "English-speaking travelers planning Korea trips",
    keywordLanguage: "English",
    priorityModifiers: [
      "itinerary",
      "first time",
      "without car",
      "where to stay",
      "day trip from Seoul",
      "rainy day",
      "airport layover",
      "Korea travel",
      "budget",
      "public transport"
    ],
    titlePattern: "Place + practical English travel intent + year + decision-focused promise",
    intentExamples: [
      "Seoul rainy day itinerary",
      "Busan 2 day itinerary first time",
      "Jeju without car itinerary",
      "Incheon airport layover Korea",
      "where to stay in Busan first trip"
    ]
  },
  ja: {
    audience: "\u65e5\u672c\u8a9e\u3067\u97d3\u56fd\u65c5\u884c\u3092\u8abf\u3079\u308b\u65c5\u884c\u8005",
    keywordLanguage: "Japanese",
    priorityModifiers: [
      "\u97d3\u56fd\u65c5\u884c",
      "\u30e2\u30c7\u30eb\u30b3\u30fc\u30b9",
      "\u521d\u3081\u3066",
      "\u65e5\u5e30\u308a",
      "2\u6cca3\u65e5",
      "\u96e8\u306e\u65e5",
      "\u30b0\u30eb\u30e1",
      "\u30db\u30c6\u30eb\u30a8\u30ea\u30a2",
      "\u7a7a\u6e2f\u30a2\u30af\u30bb\u30b9",
      "\u5730\u4e0b\u9244"
    ],
    titlePattern: "\u5730\u57df\u540d + \u65e5\u672c\u8a9e\u691c\u7d22\u8a9e + 2026 + \u8ff7\u3044\u3092\u89e3\u304f\u5177\u4f53\u7684\u306a\u7d04\u675f",
    intentExamples: [
      "\u30bd\u30a6\u30eb \u96e8\u306e\u65e5 \u30e2\u30c7\u30eb\u30b3\u30fc\u30b9",
      "\u91dc\u5c71 2\u6cca3\u65e5 \u521d\u3081\u3066",
      "\u6e08\u5dde\u5cf6 \u30ec\u30f3\u30bf\u30ab\u30fc\u306a\u3057",
      "\u97d3\u56fd \u65e5\u5e30\u308a\u65c5\u884c \u30bd\u30a6\u30eb\u304b\u3089",
      "\u91dc\u5c71 \u30db\u30c6\u30eb\u30a8\u30ea\u30a2 \u304a\u3059\u3059\u3081"
    ]
  }
};

const policyPath = path.resolve(".automation/manual-editorial-policy.json");
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));
const args = parseArgs(process.argv.slice(2));
const date = args.date ?? todayKst();
const locale = args.locale ?? localeForDate(date);
const count = Number(args.count ?? policy.dailyCount.min);

if (!localeOrder.includes(locale)) {
  throw new Error(`Unsupported locale "${locale}". Use ko, en, or ja.`);
}

if (!Number.isInteger(count) || count < policy.dailyCount.min || count > policy.dailyCount.max) {
  throw new Error(`Count must be ${policy.dailyCount.min}-${policy.dailyCount.max}.`);
}

const plan = {
  date,
  locale,
  mode: "manual-request-only",
  status: "planning",
  count,
  keywordStrategy: keywordPlaybooks[locale],
  publishingSlots: makeSlots(date, locale, count),
  articlePlans: Array.from({ length: count }, (_, index) => ({
    order: index + 1,
    targetKeyword: "",
    secondaryKeywords: [],
    searchIntent: "",
    regionSlug: "",
    title: "",
    urlSlug: "",
    internalLinkTargets: [],
    imagePlan: [
      "unique hero image",
      "unique body image 1",
      "unique body image 2",
      "unique body image 3"
    ],
    status: "planned"
  }))
};

const outDir = path.resolve(".automation/manual-daily-plans");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${date}-${locale}.json`);
fs.writeFileSync(outPath, `${stringifyAsciiJson(plan)}\n`, "utf8");
console.log(`Created manual daily plan: ${outPath}`);

function parseArgs(argv) {
  const result = {};
  for (const item of argv) {
    const match = item.match(/^--([^=]+)=(.*)$/);
    if (match) result[match[1]] = match[2];
  }
  return result;
}

function todayKst() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function localeForDate(date) {
  const start = Date.UTC(2026, 6, 8);
  const [year, month, day] = date.split("-").map(Number);
  const current = Date.UTC(year, month - 1, day);
  const index = Math.max(0, Math.floor((current - start) / 86_400_000));
  return localeOrder[index % localeOrder.length];
}

function makeSlots(date, locale, count) {
  const windows = policy.publishingWindows[locale];
  const random = seededRandom(Number(date.replaceAll("-", "")) + locale.charCodeAt(0) * 17);
  return Array.from({ length: count }, (_, index) => {
    const window = windows[index % windows.length];
    const [start, end] = window.split("-");
    const minute = randomMinute(random, toMinutes(start), toMinutes(end));
    return {
      order: index + 1,
      publishedAt: `${date}T${fromMinutes(minute)}:00+09:00`
    };
  }).sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}

function toMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function fromMinutes(value) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function randomMinute(random, start, end) {
  return start + Math.floor(random() * (end - start + 1));
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 2 ** 32;
  };
}

function stringifyAsciiJson(value) {
  return JSON.stringify(value, null, 2).replace(/[^\x00-\x7F]/g, (char) => {
    const code = char.charCodeAt(0).toString(16).padStart(4, "0");
    return `\\u${code}`;
  });
}
