import fs from "node:fs";
import path from "node:path";

const topics = [
  ["seoul", "서울 2호선 실내 여행 코스 2026: 성수·잠실·삼성을 비 적게 맞고 도는 동선", "서울 지하철 실내 여행", "rainy-day itinerary", ["seoul-rainy-day-first-trip", "seoul-one-day-palace-walk"]],
  ["busan", "부산 영도 하루 코스 2026: 흰여울·태종대·남항 야경을 덜 걷고 보는 순서", "부산 영도 여행 코스", "one-day itinerary", ["busan-station-half-day", "busan-two-day-route"]],
  ["jeju", "제주 서귀포 비 오는 날 코스 2026: 폭우에도 이동이 편한 실내·시장 동선", "제주 비오는날 서귀포", "rainy-day itinerary", ["jeju-three-day-first", "jeju-without-car"]],
  ["gangwon", "강릉 뚜벅이 여름 여행 2026: 강릉역·안목·경포를 버스로 잇는 하루 코스", "강릉 뚜벅이 여행", "transport itinerary", ["gangneung-sea-coffee", "gangneung-two-day"]],
  ["gyeongnam", "통영 여객선 결항 대체 코스 2026: 섬 여행이 취소돼도 하루를 살리는 동선", "통영 여객선 결항", "weather backup", ["tongyeong-island-view", "tongyeong-two-day"]],
  ["gyeongbuk", "경주 여름 야간 여행 2026: 대릉원·월정교·동궁과 월지를 덜 덥게 보는 순서", "경주 야간 여행 코스", "night itinerary", ["gyeongju-history-two-day", "gyeongju-family"]],
  ["incheon", "인천공항 8시간 환승 여행 2026: 짐·출입국 시간을 빼고 가능한 서울 밖 코스", "인천공항 환승 관광", "airport layover", ["incheon-open-port", "incheon-songdo-day-trip"]],
  ["jeonnam", "여수 해상케이블카 야경 코스 2026: 돌산·낭만포차까지 대기시간 줄이는 순서", "여수 케이블카 야경", "night itinerary", ["yeosu-night-sea", "yeosu-island-day"]],
  ["gangwon", "속초 여름 저녁 코스 2026: 해수욕장·시장·청초호 야경을 하루에 잇는 법", "속초 저녁 여행 코스", "evening itinerary", ["sokcho-seoraksan-market", "sokcho-without-car"]],
  ["jeonbuk", "전주 한옥마을 여름 저녁 코스 2026: 더위와 인파를 피하는 식사·야경 순서", "전주 한옥마을 야간", "evening itinerary", ["jeonju-hanok-day", "jeonju-food-cost"]],
  ["busan", "부산 기장 해안 하루 코스 2026: 해동용궁사·대변항·아난티 이동시간 정리", "부산 기장 여행 코스", "coastal itinerary", ["busan-two-day-route", "busan-haeundae-gwangalli-night"]],
  ["seoul", "서울 여름밤 여행 코스 2026: 청계천·DDP·광장시장을 늦게까지 걷는 동선", "서울 야간 여행 코스", "night itinerary", ["seoul-hangang-evening", "seoul-one-day-palace-walk"]],
  ["jeju", "제주 동쪽 여름 하루 코스 2026: 성산·섭지코지·세화 이동시간과 일몰 선택", "제주 동쪽 여행 코스", "coastal itinerary", ["jeju-three-day-first", "jeju-without-car"]],
  ["daejeon", "대전 아이와 비 오는 날 코스 2026: 국립중앙과학관·엑스포 실내 중심 동선", "대전 아이와 갈만한곳", "family rainy-day", ["daejeon-expo-evening-course", "daejeon-expo-night-walk"]],
  ["gyeonggi", "수원 화성 여름밤 코스 2026: 행궁동 저녁부터 방화수류정 야경까지", "수원 화성 야경 코스", "night itinerary", ["suwon-hwaseong-half-day"]],
  ["gyeongbuk", "경주 비 오는 날 가족 여행 2026: 박물관·황리단길·실내 유적 동선", "경주 비오는날 아이와", "family rainy-day", ["gyeongju-family", "gyeongju-history-two-day"]],
  ["daegu", "대구 폭염 피하는 하루 코스 2026: 실내 명소와 야간 산책을 잇는 방법", "대구 여름 실내 여행", "heat-wave itinerary", ["daegu-modern-street"]],
  ["gyeongnam", "통영 케이블카·미륵산 하루 코스 2026: 대기시간과 날씨별 대체 동선", "통영 케이블카 코스", "viewpoint itinerary", ["tongyeong-island-view", "tongyeong-two-day"]],
  ["jeonnam", "여수 부모님과 1박2일 2026: 걷는 거리 줄인 케이블카·오동도·시장 코스", "여수 부모님 여행", "accessible itinerary", ["yeosu-night-sea", "yeosu-island-day"]],
  ["seoul", "서울역 짐 보관 후 반나절 코스 2026: 남대문·덕수궁·청계천 이동 순서", "서울역 짐보관 반나절", "arrival itinerary", ["seoul-one-day-palace-walk", "seoul-rainy-day-first-trip"]],
  ["busan", "부산 해수욕장 비교 2026: 해운대·광안리·송정 숙소와 교통 선택 기준", "부산 해수욕장 추천", "beach comparison", ["busan-haeundae-gwangalli-stay-guide", "busan-stay-area-first-trip"]],
  ["jeju", "제주 서쪽 노을 하루 코스 2026: 협재·금능·애월을 역주행하는 시간표", "제주 서쪽 노을 코스", "sunset itinerary", ["jeju-three-day-first", "jeju-without-car"]],
  ["gangwon", "강릉 비 오는 날 여행 2026: 오죽헌·박물관·카페를 차 없이 잇는 코스", "강릉 비오는날 여행", "rainy-day itinerary", ["gangneung-sea-coffee", "gangneung-two-day"]],
  ["gangwon", "설악산 여름 산행 준비 2026: 비 예보·케이블카·속초 복귀 판단 기준", "설악산 여름 등산", "mountain planning", ["sokcho-seoraksan-market", "sokcho-without-car"]],
  ["jeonbuk", "전주 비 오는 날 먹거리 코스 2026: 한옥마을·시장·실내 문화공간 순서", "전주 비오는날 여행", "food rainy-day", ["jeonju-food-cost", "jeonju-hanok-day"]],
  ["busan", "부산 아이와 비 오는 날 2026: 해양박물관·실내 전망·시장 가족 코스", "부산 비오는날 아이와", "family rainy-day", ["busan-rainy-day-first-trip", "busan-station-half-day"]],
];

const start = new Date("2026-07-06T00:00:00+09:00");
const queue = topics.map((topic, index) => {
  const date = new Date(start.valueOf() + index * 86_400_000);
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const random = seededRandom(Number(dateKey.replaceAll("-", "")));
  const slots = [
    randomTime(random, 7, 10),
    randomTime(random, 12, 16),
    randomTime(random, 18, 22),
  ];
  const [regionSlug, title, keyword, intent, internalLinks] = topic;
  return {
    date: dateKey,
    regionSlug,
    title,
    primaryKeyword: keyword,
    searchIntent: intent,
    internalLinks,
    publications: [
      { locale: "ko", publishedAt: `${dateKey}T${slots[0]}:00+09:00` },
      { locale: "en", publishedAt: `${dateKey}T${slots[1]}:00+09:00` },
      { locale: "ja", publishedAt: `${dateKey}T${slots[2]}:00+09:00` },
    ],
    status: "queued",
  };
});

const output = path.resolve(".automation/july-2026-editorial-queue.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify({ timezone: "Asia/Seoul", queue }, null, 2)}\n`, "utf8");
console.log(`Created ${queue.length} daily plans and ${queue.length * 3} scheduled publications.`);

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 2 ** 32;
  };
}

function randomTime(random, startHour, endHour) {
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60 - 1;
  const minute = startMinutes + Math.floor(random() * (endMinutes - startMinutes + 1));
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}
