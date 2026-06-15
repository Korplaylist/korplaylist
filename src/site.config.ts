export const siteConfig = {
  siteName: "한국플레이리스트",
  domain: "https://korplaylist.com",
  defaultLocale: "ko-KR",
  description:
    "한국플레이리스트는 국내 여행지, 여행 코스, 맛집, 숙소, 교통과 계절 여행 정보를 객관적으로 정리하는 한국여행 가이드입니다.",
  googleSiteVerification: "",
  naverSiteVerification: "",
  contactEmail: "korplaylist.hong@gmail.com"
};

export const categories = ["여행 코스", "여행지", "맛집", "숙소", "교통 준비", "계절 축제", "외국인 여행 가이드"];

export const categoryDescriptions: Record<string, string> = {
  "여행 코스": "당일치기, 1박2일, 2박3일처럼 일정별로 바로 따라가기 좋은 국내 여행 동선을 정리합니다.",
  "여행지": "지역별 대표 명소, 산책 코스, 문화유산, 바다와 섬 여행지를 객관적으로 소개합니다.",
  "맛집": "시장, 로컬 음식, 식비 예산, 여행 동선과 함께 보기 좋은 먹거리 정보를 정리합니다.",
  "숙소": "여행 목적에 맞는 숙소 위치, 권역별 장단점, 이동 동선을 비교합니다.",
  "교통 준비": "뚜벅이 여행, 대중교통, 렌터카, 예산, 준비물처럼 여행 전 확인할 정보를 정리합니다.",
  "계절 축제": "봄꽃, 여름 바다, 가을 단풍, 겨울 여행과 축제 정보를 계절별로 정리합니다.",
  "외국인 여행 가이드": "영어와 일본어 콘텐츠 확장을 위한 한국 여행 기본 정보와 지역별 안내를 정리합니다."
};

export const regions = ["서울", "부산", "제주", "강릉", "전주", "경주", "여수", "속초", "통영", "인천", "대구", "춘천"];

export const regionGroups = [
  {
    name: "수도권",
    regions: ["서울", "인천"]
  },
  {
    name: "강원",
    regions: ["강릉", "속초", "춘천"]
  },
  {
    name: "영남",
    regions: ["부산", "경주", "대구", "통영"]
  },
  {
    name: "호남",
    regions: ["전주", "여수"]
  },
  {
    name: "제주",
    regions: ["제주"]
  }
];
