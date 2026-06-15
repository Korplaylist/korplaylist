export const siteConfig = {
  siteName: "한국플레이리스트",
  localizedSiteNames: {
    ko: "한국플레이리스트",
    en: "Korea Playlist",
    ja: "韓国プレイリスト"
  },
  domain: "https://korplaylist.com",
  defaultLocale: "ko-KR",
  description:
    "한국플레이리스트는 국내 여행지, 여행 코스, 맛집, 숙소, 교통과 계절 여행 정보를 객관적으로 정리하는 한국여행 가이드입니다.",
  googleSiteVerification: "",
  naverSiteVerification: "",
  contactEmail: "korplaylist.hong@gmail.com"
};

export const authorProfiles = {
  ko: {
    name: "임채홍",
    mark: "임",
    role: "한국플레이리스트 운영자·여행 콘텐츠 편집자",
    label: "작성자",
    summary:
      "국내 여행을 준비하는 사람이 일정, 이동, 비용, 숙소 위치를 빠르게 비교할 수 있도록 한국 여행 정보를 객관적인 기준으로 정리합니다.",
    detail:
      "공식 관광 정보, 교통 접근성, 실제 동선 흐름, 계절별 주의사항을 함께 확인해 과장된 후기보다 여행 준비에 바로 도움이 되는 가이드를 작성합니다."
  },
  en: {
    name: "Chaehong Lim",
    mark: "L",
    role: "Editor and operator of Korea Playlist",
    label: "Author",
    summary:
      "Chaehong Lim organizes Korea travel information so readers can compare itineraries, transport, costs, and stay locations quickly.",
    detail:
      "The guides focus on official tourism information, transport access, realistic route planning, seasonal cautions, and practical checks before visiting."
  },
  ja: {
    name: "イム・チェホン",
    mark: "イ",
    role: "韓国プレイリスト運営者・旅行コンテンツ編集者",
    label: "執筆者",
    summary:
      "韓国旅行を準備する人が、日程、移動、費用、宿泊エリアを比較しやすいように旅行情報を客観的に整理します。",
    detail:
      "公式観光情報、交通アクセス、現実的な移動ルート、季節ごとの注意点を確認し、旅行準備に役立つガイドを作成します。"
  }
};

export const categories = ["여행 코스", "여행지", "맛집", "숙소", "교통 준비", "계절 축제"];

export const categoryDescriptions: Record<string, string> = {
  "여행 코스": "당일치기, 1박2일, 2박3일처럼 일정별로 바로 따라가기 좋은 국내 여행 동선을 정리합니다.",
  "여행지": "지역별 대표 명소, 산책 코스, 문화유산, 바다와 섬 여행지를 객관적으로 소개합니다.",
  "맛집": "시장, 로컬 음식, 식비 예산, 여행 동선과 함께 보기 좋은 먹거리 정보를 정리합니다.",
  "숙소": "여행 목적에 맞는 숙소 위치, 권역별 장단점, 이동 동선을 비교합니다.",
  "교통 준비": "뚜벅이 여행, 대중교통, 렌터카, 예산, 준비물처럼 여행 전 확인할 정보를 정리합니다.",
  "계절 축제": "봄꽃, 여름 바다, 가을 단풍, 겨울 여행과 축제 정보를 계절별로 정리합니다."
};

export const regions = ["서울", "부산", "제주", "강릉", "전주", "경주", "여수", "속초", "통영", "인천", "대구", "춘천"];

export const localizedRegions: Record<string, string[]> = {
  ko: ["서울", "부산", "제주", "강릉", "전주", "경주", "여수", "속초", "통영", "인천", "대구", "춘천"],
  en: ["Seoul", "Busan", "Jeju", "Gangneung", "Jeonju", "Gyeongju", "Yeosu", "Sokcho", "Tongyeong", "Incheon", "Daegu", "Chuncheon"],
  ja: ["ソウル", "釜山", "済州", "江陵", "全州", "慶州", "麗水", "束草", "統営", "仁川", "大邱", "春川"]
};

export const localizedCategories: Record<string, string[]> = {
  ko: ["여행 코스", "여행지", "맛집", "숙소", "교통 준비", "계절 축제"],
  en: ["Itineraries", "Destinations", "Food", "Stays", "Transport", "Seasonal Trips"],
  ja: ["モデルコース", "観光地", "グルメ", "宿泊", "交通準備", "季節旅行"]
};

export const localeLabels = {
  ko: {
    homeHref: "/",
    navLabel: "주요 메뉴",
    regionLabel: "빠른 지역",
    languageLabel: "언어 선택",
    homeAria: "한국플레이리스트 홈",
    regions: "지역",
    categories: "테마",
    about: "소개",
    contact: "문의",
    footerText: "한국 여행을 준비하는 사람을 위한 객관적인 가이드입니다.",
    privacy: "개인정보처리방침",
    terms: "이용약관"
  },
  en: {
    homeHref: "/en/",
    navLabel: "Main navigation",
    regionLabel: "Quick regions",
    languageLabel: "Language selection",
    homeAria: "Korea Playlist home",
    regions: "Regions",
    categories: "Themes",
    about: "About",
    contact: "Contact",
    footerText: "An objective guide for planning travel in Korea.",
    privacy: "Privacy Policy",
    terms: "Terms"
  },
  ja: {
    homeHref: "/ja/",
    navLabel: "メインメニュー",
    regionLabel: "地域へのショートカット",
    languageLabel: "言語選択",
    homeAria: "韓国プレイリスト ホーム",
    regions: "地域",
    categories: "テーマ",
    about: "紹介",
    contact: "お問い合わせ",
    footerText: "韓国旅行を準備する人のための客観的なガイドです。",
    privacy: "プライバシーポリシー",
    terms: "利用規約"
  }
};

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
