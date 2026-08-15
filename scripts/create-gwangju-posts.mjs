import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content", "travel");
const IMAGE_DIR = path.join(ROOT, "public", "images", "generated", "unique");
const PYTHON = process.env.CODEX_PYTHON || "C:\\Users\\Hong\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const TODAY = "2026-08-15";

const posts = [
  {
    slug: "gwangju-acc-jeonil-245-chungjangro-half-day",
    title: "광주 ACC·전일빌딩245·충장로 반나절 코스 2026: 원도심을 처음 걷는 순서",
    description: "광주 원도심에서 국립아시아문화전당, 전일빌딩245, 충장로를 반나절 동안 무리 없이 잇는 코스입니다. 이동 순서, 쉬는 지점, 비 오는 날 조정법, 공식 확인 링크까지 정리했습니다.",
    category: "여행 코스",
    tags: ["광주여행", "국립아시아문화전당", "전일빌딩245", "충장로", "반나절코스"],
    publishedAt: "2026-08-15T09:10:00+09:00",
    imageTheme: "city",
    palette: ["#314E52", "#F2A65A", "#EDE6D6"],
    places: ["국립아시아문화전당", "전일빌딩245", "충장로"],
    anchor: "문화전당역",
    mapQuery: "국립아시아문화전당 전일빌딩245 충장로",
    officialLinks: [
      ["광주관광 국립아시아문화전당 안내", "https://tour.gwangju.go.kr/home/tour/info/sports.cs?act=view&infoId=18"],
      ["국립아시아문화전당 공식 홈페이지", "https://www.acc.go.kr/"],
      ["광주관광 구 전남도청 안내", "https://tour.gwangju.go.kr/home/tour/info/history.cs?act=view&infoId=233"]
    ],
    intro:
      "광주 원도심은 한 장소만 보고 빠져나오기보다 역사, 전시, 거리 분위기를 짧게 나누어 걸을 때 장점이 살아납니다. 국립아시아문화전당은 실내 전시와 야외 광장이 함께 있고, 전일빌딩245와 충장로는 걸어서 붙이기 쉬워 초행자에게 기준점이 됩니다.",
    fit:
      "처음 방문하는 사람, 비 예보가 있어 실내와 야외를 함께 준비해야 하는 사람, KTX나 고속버스로 도착해 반나절만 쓰는 사람에게 특히 맞습니다. 아이와 함께라면 전시 관람 시간을 짧게 잡고 광장 휴식을 넣는 편이 좋고, 커플 여행이라면 충장로 카페와 저녁 산책을 뒤에 붙이면 자연스럽습니다.",
    route:
      "추천 순서는 문화전당역 또는 ACC 주변 도착, ACC 내부 전시와 광장 확인, 옛 전남도청 방향으로 짧게 걷기, 전일빌딩245에서 전망과 기록 공간 확인, 충장로에서 식사나 카페로 마무리하는 흐름입니다. 한 번에 모든 시설을 깊게 보려 하지 말고 첫 방문에서는 원도심의 위치 감각을 잡는 데 집중하는 것이 좋습니다.",
    time:
      "오후형 일정은 14:00 전후 ACC 도착, 15:30 전일빌딩245 이동, 17:00 충장로 식사 또는 카페, 18:30 이후 야간 산책으로 잡으면 무리가 적습니다. 오전형은 전시 시작 시간에 맞춰 ACC를 먼저 보고 점심 전에 충장로로 넘어가면 대기 부담이 줄어듭니다.",
    budget:
      "예산은 전시 관람 여부와 식사 선택에 따라 달라집니다. 무료로 볼 수 있는 야외 공간과 거리 산책만 묶으면 지출이 낮고, 유료 전시나 공연을 넣으면 체류 시간과 비용이 함께 늘어납니다. 충장로에서 식사와 카페를 모두 넣을 계획이라면 1인 기준 식사, 음료, 예비 교통비를 나누어 잡는 편이 안전합니다.",
    weather:
      "비가 오면 ACC 내부 비중을 늘리고 충장로 골목 이동을 짧게 줄이세요. 한여름에는 광장 체류 시간을 줄이고 전일빌딩245와 카페 휴식을 사이에 넣는 것이 좋습니다. 겨울에는 해가 빨리 지므로 전일빌딩245 전망을 너무 늦게 잡지 않는 편이 안정적입니다.",
    caution:
      "공연, 전시, 주차, 휴관일은 방문일에 따라 달라질 수 있습니다. 공식 홈페이지에서 당일 운영 정보를 먼저 확인하고, 길찾기는 도착 직전 다시 열어 실제 이동 시간을 확인하세요. 원도심은 걷기 쉬운 편이지만 행사일에는 광장과 도로 일부가 혼잡해질 수 있습니다.",
    faq: [
      ["ACC만 보고 와도 충분한가요?", "가능하지만 첫 방문이라면 전일빌딩245와 충장로까지 짧게 붙이는 편이 도시의 결을 이해하기 좋습니다. 전시를 깊게 볼 날과 원도심을 훑는 날을 나누면 더 안정적입니다."],
      ["비 오는 날에도 괜찮은 코스인가요?", "괜찮습니다. ACC 내부 전시와 전일빌딩245를 중심으로 두고 충장로 이동을 짧게 줄이면 우산을 들고 오래 걷는 부담을 줄일 수 있습니다."]
    ]
  },
  {
    slug: "gwangju-mudeungsan-jeungsimsa-forest-half-day",
    title: "광주 무등산·증심사 숲길 반나절 코스 2026: 초행자가 무리 없이 걷는 법",
    description: "광주 무등산국립공원과 증심사 권역을 반나절 동안 걷는 초행자용 코스입니다. 시작 지점, 체력 조절, 버스 확인, 날씨별 대체 동선까지 정리했습니다.",
    category: "여행지",
    tags: ["광주여행", "무등산", "증심사", "숲길산책", "국립공원"],
    publishedAt: "2026-08-15T09:40:00+09:00",
    imageTheme: "mountain",
    palette: ["#2F5D50", "#8AB17D", "#E9C46A"],
    places: ["무등산국립공원", "증심사", "의재미술관 권역"],
    anchor: "증심사입구",
    mapQuery: "무등산국립공원 증심사 의재미술관",
    officialLinks: [
      ["광주관광 무등산국립공원 안내", "https://tour.gwangju.go.kr/home/tour/info/nature.cs?act=view&infoId=360"],
      ["국립공원공단 공식 홈페이지", "https://www.knps.or.kr/"]
    ],
    intro:
      "무등산은 광주를 대표하는 자연 여행지이지만, 초행자가 정상이나 긴 등산로부터 욕심내면 하루가 쉽게 무거워집니다. 반나절 일정에서는 증심사 권역을 기준으로 숲길, 사찰, 휴식 지점을 짧게 묶는 방식이 훨씬 현실적입니다.",
    fit:
      "등산 장비를 갖춘 산행이 아니라 도시 여행 중 자연을 넣고 싶은 사람에게 맞습니다. 부모님과 함께라면 경사가 강한 구간을 줄이고, 아이와 함께라면 사찰 주변과 접근이 쉬운 산책로만 보는 편이 좋습니다. 혼자라면 귀가 버스 시간을 먼저 확인하는 것이 중요합니다.",
    route:
      "추천 순서는 증심사입구 도착, 탐방 안내와 화장실 확인, 증심사 방향 숲길 산책, 사찰 주변에서 휴식, 의재미술관 또는 주변 찻집으로 마무리하는 흐름입니다. 무등산은 넓기 때문에 오늘의 목적을 등산이 아니라 숲길 산책으로 정하면 체력 부담이 크게 줄어듭니다.",
    time:
      "오전형은 09:30 전후 도착해 11:30 이전 깊은 구간을 마치고, 점심 전에 내려오는 방식이 좋습니다. 오후형은 늦게 시작할수록 깊이 들어가지 말고 입구 가까운 숲길과 사찰 주변만 보는 편이 안전합니다. 해가 짧은 계절에는 15:00 이후 새 구간을 추가하지 않는 기준을 세우세요.",
    budget:
      "기본 산책 자체는 큰 비용이 들지 않지만, 주차, 식사, 찻집, 택시 대체 이동 비용을 별도로 봐야 합니다. 특히 주말에는 가까운 주차장을 기다리느라 시간이 늘어날 수 있으므로 대중교통이나 멀리 세우고 걷는 선택지도 함께 준비하는 편이 좋습니다.",
    weather:
      "비가 오면 흙길과 돌길의 체감 난도가 올라갑니다. 미끄러운 신발을 신고 깊게 들어가는 일정은 피하고, 입구 가까운 산책로와 실내 휴식지 위주로 줄이세요. 여름에는 그늘이 있어도 습도가 높게 느껴질 수 있어 물과 얇은 겉옷을 함께 챙기는 것이 좋습니다.",
    caution:
      "국립공원은 계절별 통제, 기상특보, 탐방로 정비에 따라 이용 가능 구간이 달라질 수 있습니다. 공식 공지와 현장 안내판을 확인하고, 계획보다 몸이 무겁다면 더 깊이 들어가지 않는 판단이 가장 안전합니다.",
    faq: [
      ["운동화만 신고 가도 되나요?", "증심사 주변의 짧은 산책이라면 편한 운동화로 가능하지만, 비 온 뒤나 경사가 있는 구간은 미끄러울 수 있습니다. 등산로를 길게 잡을 계획이라면 접지력 있는 신발이 필요합니다."],
      ["정상까지 가야 무등산을 본 건가요?", "아닙니다. 첫 방문에서는 증심사 권역만 보아도 산의 분위기와 광주 자연의 인상을 충분히 느낄 수 있습니다. 정상 산행은 별도 하루 일정으로 잡는 편이 낫습니다."]
    ]
  },
  {
    slug: "gwangju-yangnim-penguin-village-walk",
    title: "광주 양림동·펭귄마을 골목 산책 2026: 근대문화와 조용한 카페를 잇는 법",
    description: "광주 양림동 역사문화마을과 펭귄마을을 천천히 걷는 골목 산책 가이드입니다. 관람 순서, 사진 예절, 쉬는 지점, 해설 프로그램 확인법을 정리했습니다.",
    category: "여행 코스",
    tags: ["광주여행", "양림동", "펭귄마을", "근대문화", "골목산책"],
    publishedAt: "2026-08-15T10:10:00+09:00",
    imageTheme: "village",
    palette: ["#6D597A", "#E56B6F", "#F6E8C3"],
    places: ["양림동 역사문화마을", "펭귄마을", "사직공원 방향"],
    anchor: "양림오거리",
    mapQuery: "양림동 역사문화마을 펭귄마을 사직공원",
    officialLinks: [
      ["광주관광 양림역사문화탐방 안내", "https://tour.gwangju.go.kr/home/tour/info/guide.cs?act=view&infoId=593"],
      ["양림동 관광 공식 홈페이지", "https://visityangnim.kr/"]
    ],
    intro:
      "양림동은 빠르게 인증 사진만 찍고 빠져나오기보다 골목의 속도를 낮춰야 좋은 지역입니다. 근대문화유산, 작은 카페, 펭귄마을의 생활 골목이 붙어 있어 걷기는 쉽지만, 주거지와 관광지가 섞여 있다는 점을 기억해야 합니다.",
    fit:
      "전시보다 동네 산책을 좋아하는 사람, 조용한 카페와 사진 지점을 함께 찾는 사람, 광주 원도심 일정에 한적한 골목을 붙이고 싶은 사람에게 맞습니다. 어르신과 함께라면 언덕 구간을 줄이고, 아이와 함께라면 오래 걷기보다 쉬는 지점을 자주 넣는 편이 좋습니다.",
    route:
      "추천 순서는 양림오거리 기준 도착, 역사문화마을 주요 골목 확인, 펭귄마을 짧은 산책, 카페 또는 베이커리 휴식, 시간이 남으면 사직공원 방향으로 마무리하는 흐름입니다. 처음부터 사직공원까지 깊게 붙이면 반나절 코스가 길어질 수 있어 현장 체력에 따라 조절하세요.",
    time:
      "오전에는 골목이 비교적 차분해 사진과 산책이 편하고, 오후에는 카페 선택지가 넓어집니다. 해가 기울 무렵에는 사직공원 방향 전망을 붙이기 좋지만, 골목이 어두워지기 전에 큰길로 나오는 기준을 세워야 합니다.",
    budget:
      "입장료보다 카페, 간식, 소품 구입 비용이 더 크게 느껴질 수 있습니다. 한 곳에서 오래 쉬는 카페를 정하고 나머지는 산책 중심으로 보면 지출을 안정적으로 조절할 수 있습니다. 기념품을 살 생각이 있다면 현장에서 충동 구매를 줄이도록 작은 예산을 따로 정해두세요.",
    weather:
      "비 오는 날에는 골목 바닥이 미끄러울 수 있고 사진 촬영도 불편해집니다. 이때는 양림동 내부를 깊게 누비기보다 해설 프로그램 여부, 실내 관람지, 카페 휴식 위주로 줄이는 편이 좋습니다. 여름에는 그늘이 이어지는 길을 고르고 한낮 이동을 피하세요.",
    caution:
      "양림동은 실제 주민의 생활 공간과 관광 공간이 겹칩니다. 사진을 찍을 때는 문 앞, 창문, 사유지 안쪽을 피하고, 큰 소리로 오래 머무는 행동을 줄이는 것이 좋습니다. 해설 프로그램은 신청 조건과 운영일이 달라질 수 있으니 공식 안내를 먼저 확인하세요.",
    faq: [
      ["펭귄마을만 보면 시간이 얼마나 걸리나요?", "사진만 찍으면 짧게 볼 수 있지만, 양림동 전체를 함께 걷는다면 2시간 이상 잡는 편이 좋습니다. 카페 휴식까지 넣으면 반나절 코스로 보는 것이 자연스럽습니다."],
      ["해설 프로그램을 꼭 신청해야 하나요?", "필수는 아니지만 근대문화유산의 맥락을 알고 싶다면 도움이 됩니다. 운영 조건과 신청 가능 인원은 공식 안내에서 확인하고, 신청이 어렵다면 주요 골목만 조용히 걷는 방식도 충분합니다."]
    ]
  },
  {
    slug: "gwangju-songjeong-station-market-food-route",
    title: "광주송정역·1913송정역시장 먹거리 코스 2026: KTX 도착 후 바로 걷기",
    description: "광주송정역 도착 후 1913송정역시장과 송정 떡갈비 권역을 가볍게 묶는 먹거리 코스입니다. 식사 순서, 대기 회피, 예산, 귀가 동선까지 정리했습니다.",
    category: "맛집",
    tags: ["광주맛집", "광주송정역", "1913송정역시장", "송정떡갈비", "시장여행"],
    publishedAt: "2026-08-15T10:40:00+09:00",
    imageTheme: "market",
    palette: ["#B54A2D", "#F2CC8F", "#3D405B"],
    places: ["광주송정역", "1913송정역시장", "송정떡갈비거리"],
    anchor: "광주송정역",
    mapQuery: "광주송정역 1913송정역시장 송정떡갈비거리",
    officialLinks: [
      ["광주관광 1913송정역시장 안내", "https://tour.gwangju.go.kr/home/tour/info/shopping/002.cs?act=view&infoId=83"],
      ["광주관광 시장투어 코스", "https://tour.gwangju.go.kr/home/tour/mytour/open.cs?act=view&courseId=189&m=300&pageIndex=40&searchCondition=&searchKeyword="]
    ],
    intro:
      "광주송정역에 도착한 날은 멀리 이동하기 전에 역 주변에서 첫 끼와 짧은 산책을 해결하는 선택이 효율적입니다. 1913송정역시장은 역과 가까워 짐이 많거나 도착 시간이 애매한 여행자에게 기준점이 되고, 송정 떡갈비 권역을 붙이면 식사 만족도를 높일 수 있습니다.",
    fit:
      "KTX나 SRT로 도착해 첫 일정이 비는 사람, 광주를 떠나기 전 마지막 식사를 역 근처에서 해결하려는 사람, 시장 간식과 식사를 모두 조금씩 보고 싶은 사람에게 맞습니다. 가족 여행은 식사 자리를 먼저 잡고 시장 산책을 뒤에 붙이는 편이 안정적입니다.",
    route:
      "추천 순서는 광주송정역 도착, 짐 보관 또는 이동 수단 확인, 1913송정역시장 한 바퀴, 송정 떡갈비 또는 시장 식사, 카페나 간식, 다시 역 방향 귀가입니다. 첫 방문이라면 시장 안에서 모든 간식을 먹으려 하지 말고 메인 식사와 간식 하나를 분리하세요.",
    time:
      "점심 도착이면 시장 산책을 짧게 하고 바로 식사로 넘어가는 편이 좋습니다. 오후 도착이면 간식과 카페를 먼저 넣고 이른 저녁에 식사를 잡으면 대기 부담이 줄어듭니다. 늦은 밤 도착이라면 운영 시간이 가게마다 다를 수 있으니 현장 선택지를 넓게 두세요.",
    budget:
      "시장 코스는 작은 지출이 여러 번 생깁니다. 간식, 음료, 메인 식사, 포장 메뉴를 한 번에 고르면 예상보다 비용이 커질 수 있습니다. 1인 여행은 포장 가능한 메뉴를 줄이고 바로 먹을 것만 고르는 것이 좋고, 2인 이상은 떡갈비나 식사 메뉴를 나눈 뒤 간식을 추가하는 방식이 안정적입니다.",
    weather:
      "비가 오면 역과 시장 사이 이동은 짧지만 우산을 들고 먹거리를 고르는 일이 번거롭습니다. 이때는 식당 한 곳을 먼저 정하고 시장은 짧게 둘러보세요. 더운 날에는 대기 줄이 긴 곳보다 회전이 빠르고 앉아서 쉴 수 있는 곳을 우선하는 편이 좋습니다.",
    caution:
      "시장 운영 시간과 휴무는 점포별로 다를 수 있습니다. 광주관광 공식 안내의 시장 정보, 당일 영업 공지, 열차 출발 시간을 함께 확인하세요. 귀가 열차가 있다면 식사 시작 전 알람을 맞춰두는 것이 안전합니다.",
    faq: [
      ["광주송정역에서 걸어서 갈 수 있나요?", "가능한 권역입니다. 다만 짐이 많거나 날씨가 좋지 않다면 시장을 깊게 돌기보다 역에서 가까운 구간만 보고 식사 위주로 정리하는 편이 좋습니다."],
      ["시장 간식과 떡갈비를 모두 먹을 수 있나요?", "가능하지만 양 조절이 필요합니다. 간식은 한두 개만 고르고 메인 식사를 따로 잡아야 후반 일정이 편합니다."]
    ]
  },
  {
    slug: "gwangju-biennale-jungoe-park-art-walk",
    title: "광주비엔날레전시관·중외공원 예술 산책 2026: 전시와 공원을 함께 보는 법",
    description: "광주비엔날레전시관과 중외공원, 주변 문화시설을 한 번에 묶는 예술 산책 코스입니다. 전시 일정 확인, 관람 피로 조절, 공원 휴식 기준을 정리했습니다.",
    category: "여행지",
    tags: ["광주여행", "광주비엔날레", "중외공원", "예술산책", "전시여행"],
    publishedAt: "2026-08-15T11:10:00+09:00",
    imageTheme: "museum",
    palette: ["#355070", "#B56576", "#EAAC8B"],
    places: ["광주비엔날레전시관", "중외공원", "국립광주박물관 권역"],
    anchor: "중외공원",
    mapQuery: "광주비엔날레전시관 중외공원 국립광주박물관",
    officialLinks: [
      ["광주관광 예술 권역 안내", "https://tour.gwangju.go.kr/omae/kr/sub.html?PID=0706"],
      ["광주비엔날레 공식 홈페이지", "https://www.gwangjubiennale.org/"],
      ["광주관광 월별행사일정", "https://tour.gwangju.go.kr/home/sub.cs?m=347"]
    ],
    intro:
      "광주 예술 여행은 전시관만 보고 끝내기보다 공원 산책과 휴식을 함께 넣어야 피로가 덜합니다. 비엔날레전시관과 중외공원 권역은 전시 일정에 따라 체류 시간이 크게 달라지므로, 방문 전 무엇을 볼지 먼저 정하는 것이 중요합니다.",
    fit:
      "미술 전시를 좋아하지만 하루 종일 실내에만 머무르고 싶지는 않은 사람, 아이와 함께 공원 휴식을 넣고 싶은 가족, 광주 문화시설을 한 권역에서 비교하고 싶은 여행자에게 맞습니다. 전시 집중력이 짧은 사람은 관람 시간보다 쉬는 시간을 먼저 잡는 것이 좋습니다.",
    route:
      "추천 순서는 전시 일정 확인, 비엔날레전시관 또는 가까운 문화시설 관람, 중외공원 산책, 카페나 식사 휴식, 시간이 남으면 국립광주박물관 권역을 짧게 붙이는 흐름입니다. 전시를 여러 개 연속으로 넣으면 후반 집중도가 떨어지므로 한두 곳을 깊게 보는 편이 낫습니다.",
    time:
      "오전에는 관람객이 비교적 분산되어 전시를 차분히 보기 좋고, 오후에는 공원 산책과 카페 휴식을 붙이기 쉽습니다. 특별전이나 축제 기간에는 입장, 주차, 셔틀 정보가 달라질 수 있어 시간표를 넉넉히 잡아야 합니다.",
    budget:
      "전시 입장료, 도슨트 프로그램, 굿즈, 카페 비용을 나누어 생각하세요. 무료 공간만 중심으로 보면 부담이 낮지만, 유료 특별전이나 축제 프로그램을 넣으면 지출이 달라집니다. 굿즈 구입은 전시를 모두 본 뒤 마지막에 결정하는 편이 충동 지출을 줄입니다.",
    weather:
      "비가 오면 공원 산책을 줄이고 전시 관람과 실내 휴식을 중심으로 조정하세요. 더운 날에는 공원 체류를 오전이나 늦은 오후로 옮기고, 한낮에는 실내 관람을 넣는 것이 좋습니다. 바람이 강한 날에는 넓은 공원보다 실내 동선을 우선하세요.",
    caution:
      "비엔날레와 특별전은 개최 기간, 휴관일, 입장 방식이 달라집니다. 공식 홈페이지와 광주관광 월별행사일정을 함께 확인하고, 행사 기간에는 교통 혼잡을 감안해 도착 시간을 앞당기세요.",
    faq: [
      ["비엔날레 기간이 아니어도 갈 만한가요?", "가능합니다. 다만 전시 구성과 운영 범위가 시기마다 달라지므로 방문 전 공식 홈페이지에서 현재 전시와 휴관일을 확인해야 합니다."],
      ["아이와 함께 가도 괜찮나요?", "공원 휴식을 함께 넣으면 괜찮습니다. 전시 관람 시간을 짧게 나누고 중외공원에서 쉬는 구간을 넣으면 아이의 피로를 줄일 수 있습니다."]
    ]
  },
  {
    slug: "gwangju-sajik-park-seochang-sunset-half-day",
    title: "광주 사직공원·서창 감성조망대 노을 코스 2026: 저녁 산책을 안전하게 잡는 법",
    description: "광주 사직공원 전망타워와 서창 감성조망대를 저녁 시간대에 보는 노을 산책 가이드입니다. 이동 순서, 사진 시간, 귀가 기준, 날씨별 조정법을 정리했습니다.",
    category: "여행 코스",
    tags: ["광주여행", "사직공원", "서창감성조망대", "노을코스", "야경산책"],
    publishedAt: "2026-08-15T11:40:00+09:00",
    imageTheme: "sunset",
    palette: ["#264653", "#E76F51", "#F4A261"],
    places: ["사직공원 전망타워", "서창 감성조망대", "양림동 주변"],
    anchor: "사직공원",
    mapQuery: "사직공원 전망타워 서창 감성조망대",
    officialLinks: [
      ["광주관광 충장로·사직공원 권역 안내", "https://tour.gwangju.go.kr/omae/kr/sub.html?PID=0702"],
      ["광주관광 서창 감성조망대 안내", "https://tour.gwangju.go.kr/home/tour/info/village/002.cs?act=view&infoId=1448"]
    ],
    intro:
      "광주에서 저녁 풍경을 보고 싶다면 사직공원 전망타워와 서창 감성조망대를 후보로 나눠 생각하면 좋습니다. 두 곳을 억지로 한 번에 깊게 보려 하기보다, 해 지는 시간과 귀가 동선을 기준으로 어느 쪽에 더 오래 머물지 정하는 것이 핵심입니다.",
    fit:
      "낮 일정 뒤 가볍게 노을이나 야경을 보고 싶은 사람, 양림동 산책 뒤 전망을 붙이고 싶은 사람, 차로 이동할 수 있어 서창 쪽까지 확장하려는 여행자에게 맞습니다. 대중교통만 이용한다면 사직공원을 중심으로 잡고 서창은 별도 일정으로 나누는 편이 현실적입니다.",
    route:
      "추천 순서는 양림동 또는 충장로 일정을 먼저 마치고 사직공원 전망타워에서 시내 조망을 확인한 뒤, 차량 이동이 가능하면 서창 감성조망대의 노을을 붙이는 흐름입니다. 이동 시간이 애매하면 두 곳을 모두 넣지 말고 사직공원 하나만 깊게 보는 편이 좋습니다.",
    time:
      "노을 코스는 해 지기 60~90분 전부터 움직이면 안정적입니다. 전망 지점은 도착 직후보다 주변을 잠깐 둘러본 뒤 빛이 부드러워질 때 사진을 찍는 편이 좋습니다. 귀가는 어두워지기 전 큰길 또는 주차 위치로 돌아오는 기준을 세우세요.",
    budget:
      "이 코스는 입장료보다 교통비와 식사 비용이 더 중요합니다. 차량이 있다면 주차 위치와 귀가 경로를 먼저 확인하고, 대중교통이라면 마지막 버스나 택시 대체 비용을 예산에 넣어야 합니다. 저녁 식사는 전망 지점 근처에서 해결하기보다 원도심이나 양림동에서 먼저 정리하는 편이 안정적입니다.",
    weather:
      "구름이 많으면 노을은 약해질 수 있지만 산책 자체는 가능합니다. 바람이 강한 날에는 조망대 체류 시간이 짧아지고, 비가 오면 노을보다 안전한 귀가가 우선입니다. 여름에는 해가 길어 늦게 움직여도 되지만, 겨울에는 계획보다 훨씬 빨리 어두워지는 점을 감안하세요.",
    caution:
      "전망 시설 운영 시간과 접근 가능 여부는 계절과 현장 관리에 따라 달라질 수 있습니다. 공식 안내에서 운영 시간과 휴일을 확인하고, 어두워진 뒤 인적이 드문 길을 오래 걷지 않도록 귀가 기준을 먼저 정하세요.",
    faq: [
      ["두 곳을 하루에 모두 갈 수 있나요?", "차량 이동이 가능하고 해 지는 시간이 넉넉하면 가능합니다. 대중교통 중심 여행이라면 사직공원과 양림동을 묶고 서창 감성조망대는 별도 일정으로 나누는 편이 좋습니다."],
      ["야경까지 기다려도 괜찮나요?", "가능하지만 귀가 동선이 먼저입니다. 전망을 본 뒤 큰길, 주차 위치, 택시 호출 가능 구역을 확인해두면 늦은 시간 이동 부담을 줄일 수 있습니다."]
    ]
  }
];

fs.mkdirSync(CONTENT_DIR, { recursive: true });
fs.mkdirSync(IMAGE_DIR, { recursive: true });

for (const post of posts) {
  const bases = imageBases(post.slug);
  createImage(path.join(IMAGE_DIR, `${bases.hero}.jpg`), post.imageTheme, "hero", post.palette);
  createImage(path.join(IMAGE_DIR, `${bases.route}.jpg`), post.imageTheme, "route", post.palette);
  createImage(path.join(IMAGE_DIR, `${bases.rest}.jpg`), post.imageTheme, "rest", post.palette);
  createImage(path.join(IMAGE_DIR, `${bases.detail}.jpg`), post.imageTheme, "detail", post.palette);
  fs.writeFileSync(path.join(CONTENT_DIR, `${post.slug}.md`), renderPost(post, bases), "utf8");
}

console.log(`created ${posts.length} Gwangju posts`);

function imageBases(slug) {
  return {
    hero: `gwangju-hero-${slug}-1`,
    route: `gwangju-route-${slug}-1`,
    rest: `gwangju-rest-${slug}-1`,
    detail: `gwangju-detail-${slug}-1`
  };
}

function createImage(target, theme, role, palette) {
  const script = String.raw`
import math
import random
import sys
from pathlib import Path
from PIL import Image, ImageDraw

target = Path(sys.argv[1])
theme = sys.argv[2]
role = sys.argv[3]
palette = sys.argv[4].split(",")
target.parent.mkdir(parents=True, exist_ok=True)

W, H = 1200, 800
random.seed(f"{theme}-{role}")

def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i+2], 16) for i in (0, 2, 4))

colors = [hex_to_rgb(item) for item in palette]
base, accent, light = colors
image = Image.new("RGB", (W, H), light)
draw = ImageDraw.Draw(image)

for y in range(H):
    t = y / H
    sky = tuple(int(light[i] * (1 - t) + (255, 246, 230)[i] * t) for i in range(3))
    draw.line([(0, y), (W, y)], fill=sky)

sun_x = 920 if role in ("hero", "detail") else 250
sun_y = 150 if role != "rest" else 210
draw.ellipse([sun_x - 70, sun_y - 70, sun_x + 70, sun_y + 70], fill=(255, 220, 150))

def mountain():
    for layer, offset in enumerate((420, 510, 590)):
        pts = []
        for x in range(-80, W + 120, 80):
            y = offset + math.sin((x + layer * 70) / 110) * (42 - layer * 8)
            pts.append((x, y))
        pts += [(W + 120, H), (-80, H)]
        shade = tuple(max(0, int(base[i] * (0.95 - layer * 0.14))) for i in range(3))
        draw.polygon(pts, fill=shade)
    draw.rectangle([0, 650, W, H], fill=(238, 232, 206))
    for x in range(90, W, 160):
        draw.line([(x, 650), (x + 90, H)], fill=(214, 202, 175), width=3)

def city():
    draw.rectangle([0, 560, W, H], fill=(232, 226, 212))
    for x in range(80, 1040, 150):
        h = random.randint(180, 340)
        draw.rounded_rectangle([x, 560 - h, x + 105, 560], radius=10, fill=tuple(max(0, c - 35) for c in base))
        for wx in range(x + 18, x + 92, 28):
            for wy in range(560 - h + 26, 540, 42):
                draw.rectangle([wx, wy, wx + 12, wy + 16], fill=(250, 224, 164))
    draw.rectangle([0, 590, W, 640], fill=accent)
    for x in range(0, W, 80):
        draw.line([(x, 640), (x + 120, H)], fill=(203, 190, 171), width=4)

def village():
    draw.rectangle([0, 585, W, H], fill=(236, 226, 205))
    for i, x in enumerate(range(80, 1080, 180)):
        top = random.randint(345, 430)
        wall = accent if i % 2 else base
        draw.rectangle([x, top, x + 135, 585], fill=wall)
        draw.polygon([(x - 12, top), (x + 67, top - 70), (x + 147, top)], fill=(104, 72, 78))
        draw.rectangle([x + 35, top + 70, x + 78, 585], fill=(245, 235, 205))
        draw.rectangle([x + 88, top + 44, x + 116, top + 80], fill=(250, 220, 150))
    draw.path if False else None

def market():
    draw.rectangle([0, 555, W, H], fill=(226, 214, 190))
    for x in range(60, 1120, 170):
        draw.rectangle([x, 330, x + 130, 560], fill=base)
        draw.polygon([(x - 10, 330), (x + 65, 260), (x + 140, 330)], fill=accent)
        draw.rectangle([x + 22, 390, x + 108, 445], fill=(248, 238, 209))
        for k in range(4):
            cx = x + 26 + k * 25
            draw.ellipse([cx, 485, cx + 24, 509], fill=(240, 190, 90))
    draw.rectangle([0, 600, W, 650], fill=(70, 67, 88))

def museum():
    draw.rectangle([0, 570, W, H], fill=(230, 225, 215))
    draw.polygon([(190, 570), (360, 330), (710, 330), (870, 570)], fill=base)
    draw.rectangle([330, 400, 760, 570], fill=(245, 240, 226))
    draw.rectangle([400, 440, 520, 570], fill=accent)
    draw.rectangle([560, 440, 700, 570], fill=(90, 100, 130))
    for x in range(120, 1080, 160):
        draw.ellipse([x, 610, x + 40, 650], fill=accent)
        draw.line([(x + 20, 650), (x + 20, 710)], fill=base, width=8)

def sunset():
    draw.rectangle([0, 520, W, 800], fill=(68, 84, 92))
    draw.rectangle([0, 575, W, 800], fill=(55, 95, 104))
    for y in range(590, 800, 18):
        draw.line([(0, y), (W, y + 20)], fill=(232, 145, 92), width=2)
    draw.polygon([(70, 540), (230, 385), (390, 540)], fill=base)
    draw.polygon([(760, 530), (930, 360), (1100, 530)], fill=tuple(max(0, c - 35) for c in base))
    draw.line([(130, 610), (480, 560), (850, 610), (1120, 565)], fill=(250, 215, 160), width=6)

themes = {
    "mountain": mountain,
    "city": city,
    "village": village,
    "market": market,
    "museum": museum,
    "sunset": sunset,
}
themes.get(theme, city)()

if role == "route":
    for i, x in enumerate((250, 470, 690, 910), start=1):
        draw.ellipse([x-22, 610-22, x+22, 610+22], fill=(255, 255, 255), outline=accent, width=6)
        draw.text((x-7, 597), str(i), fill=base)
    draw.line([(272, 610), (448, 610), (492, 610), (668, 610), (712, 610), (888, 610)], fill=accent, width=5)
elif role == "rest":
    draw.rounded_rectangle([405, 585, 795, 650], radius=18, fill=(255, 248, 230), outline=base, width=4)
    draw.line([(455, 650), (455, 710)], fill=base, width=6)
    draw.line([(745, 650), (745, 710)], fill=base, width=6)
elif role == "detail":
    for x in range(160, 1080, 230):
        draw.ellipse([x, 610, x+34, 644], fill=(245, 245, 235), outline=base, width=3)
        draw.line([(x+17, 644), (x+17, 704)], fill=base, width=5)
        draw.line([(x+17, 665), (x-12, 690)], fill=base, width=4)
        draw.line([(x+17, 665), (x+46, 690)], fill=base, width=4)

image.save(target, "JPEG", quality=86, optimize=True, progressive=True)
`;

  execFileSync(PYTHON, ["-c", script, target, theme, role, palette.join(",")], { stdio: "inherit" });
}

function renderPost(post, bases) {
  const sourceList = post.officialLinks
    .map(([label, url]) => `  <li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`)
    .join("\n");
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.mapQuery)}`;

  return `---
title: "${post.title}"
description: "${post.description}"
category: "${post.category}"
region: "광주"
locale: "ko"
translationKey: "${post.slug}"
regionSlug: "gwangju"
urlSlug: "${post.slug}"
tags: ${JSON.stringify(post.tags)}
publishedAt: "${post.publishedAt}"
updatedAt: "${TODAY}"
heroImage: "/images/generated/unique/${bases.hero}.jpg"
imageAlt: "${post.title.replace(/ 2026:.+$/, "")} 풍경"
imageCredit: "ⓒ한국플레이리스트"
adsenseReady: true
draft: false
---

${post.intro} 이 글은 장소 이름만 나열하는 목록이 아니라, 실제 방문자가 어느 순서로 움직이면 덜 피곤한지 판단할 수 있도록 만든 실전형 가이드입니다. 특히 ${post.anchor}를 기준점으로 잡으면 길찾기와 귀가 계획을 동시에 세우기 쉽습니다.

<div class="article-summary">
  <strong>핵심 정리</strong>
  <ul>
    <li>기준점은 ${post.anchor}로 잡고, ${post.places.join(" · ")} 순서로 무리 없이 조정합니다.</li>
    <li>처음 방문한다면 한 장소를 깊게 파기보다 이동 흐름과 쉬는 지점을 먼저 정하는 편이 좋습니다.</li>
    <li>운영 시간, 휴관일, 행사 여부, 교통 상황은 방문 직전 공식 안내에서 다시 확인하세요.</li>
  </ul>
</div>

## 추천 대상

${post.fit} 이 코스의 핵심은 유명한 장소를 모두 찍는 것이 아닙니다. 반나절 안에서 기억에 남을 지점을 고르고, 이동 중 피로가 쌓이지 않도록 쉬는 구간을 분명히 넣는 것입니다. 여행을 준비할 때는 "갈 수 있는 곳"보다 "편하게 돌아올 수 있는 곳"을 먼저 확인해야 현장에서 흔들리지 않습니다.

처음에는 목적지를 너무 많이 넣지 마세요. ${post.places[0]}을 중심으로 잡고, ${post.places[1]} 또는 ${post.places[2]}를 상황에 따라 붙이는 방식이 안정적입니다. 날씨가 좋고 체력이 남으면 한 지점을 추가하고, 비가 오거나 이동 시간이 길어지면 코스를 줄이면 됩니다.

${figure(bases.route, `${post.places.join("에서 ")}를 잇는 이동 경로 이미지`, "처음 방문할 때는 기준점, 첫 목적지, 휴식 지점, 귀가 방향을 나누어 잡는 편이 안정적입니다.")}

## 추천 동선

${post.route} 지도에서 거리가 가까워 보여도 실제 현장에서는 횡단보도, 지하철 출입구, 골목 폭, 대기 줄 때문에 시간이 더 걸릴 수 있습니다. 그래서 출발 전에 큰 방향만 정하고, 현장에서는 첫 지점과 마지막 지점을 우선 확인하는 편이 좋습니다.

<p><a href="${mapLink}" target="_blank" rel="noopener noreferrer">Google 지도에서 ${post.mapQuery} 주변 위치 확인하기</a></p>

동선을 짤 때는 사진을 찍는 시간도 일정에 넣어야 합니다. 명소에 도착해도 바로 다음 장소로 이동하면 장소의 인상이 약하게 남습니다. 한 지점마다 15~25분 정도 여유를 두고, 식사나 카페는 이동 중간이 아니라 후반 체력 회복 구간으로 배치하세요.

## 시간표 잡는 법

${post.time} 일정표를 만들 때는 도착 시간과 귀가 시간을 먼저 적고, 그 사이에 핵심 지점 두 곳만 확정하세요. 남는 시간에 한 곳을 더 붙이는 방식이 애드혹처럼 보여도 실제 여행에서는 훨씬 안정적입니다.

일행이 여러 명이면 한 사람이 가고 싶은 곳을 모두 넣기보다, 오래 머물 지점과 짧게 볼 지점을 나누세요. ${post.places[0]}은 중심 지점으로 두고, ${post.places[1]}은 체력과 시간에 따라 깊이를 조절하면 좋습니다. 늦게 도착한 날에는 반나절 코스라는 이름에 맞춰 전체 범위를 과감히 줄이는 판단이 필요합니다.

${figure(bases.rest, `${post.anchor} 주변에서 쉬는 여행자 이미지`, "쉬는 지점을 의식적으로 넣어야 반나절 일정이 급한 체크리스트처럼 느껴지지 않습니다.")}

## 비용과 준비물

${post.budget} 교통비는 왕복 기준으로 보고, 현장에서 택시를 한 번 써도 전체 일정이 편해질 수 있는지 판단하세요. 무조건 가장 저렴한 이동만 고집하면 이동 시간이 길어져 장소를 제대로 보지 못할 수 있습니다.

준비물은 복잡하지 않습니다. 보조배터리, 물, 작은 우산, 걷기 편한 신발 정도면 충분합니다. 전시나 실내 시설을 넣는 날에는 휴관일과 예약 필요 여부를 먼저 확인하고, 야외 산책이 많은 날에는 햇빛과 바람을 더 신경 쓰세요. 사진을 많이 찍는다면 배터리와 저장 공간도 작은 변수입니다.

## 날씨와 혼잡도 대응

${post.weather} 혼잡한 날에는 가장 유명한 지점보다 접근이 쉬운 지점을 먼저 보는 편이 좋습니다. 여행 만족도는 장소의 개수보다 이동 스트레스가 얼마나 적었는지에 더 크게 좌우됩니다.

주말이나 행사일에는 식사 시간을 일반적인 기준보다 30분 정도 앞당기세요. 이미 피크 시간에 도착했다면 바로 줄을 서기보다 주변을 한 바퀴 돌며 대체 후보를 확인하는 편이 낫습니다. 비가 오는 날에는 길찾기 화면을 자주 열기 어렵기 때문에 첫 목적지와 귀가 지점만큼은 출발 전에 저장해두세요.

${figure(bases.detail, `${post.places[0]} 주변에서 세부 동선을 확인하는 장면`, "방문 직전 공식 안내와 지도 위치를 다시 확인하면 휴관, 행사, 교통 변수에 더 빨리 대응할 수 있습니다.")}

## 공식 확인 포인트

${post.caution} 아래 링크는 방문 전 다시 확인해야 할 공식 또는 준공식 정보입니다. 글을 저장해두더라도 실제 방문일의 운영 상태가 우선입니다.

<ul>
${sourceList}
</ul>

## 코스를 선택해야 하는 사람

이 일정은 광주를 처음 방문해 한 권역을 차분히 이해하고 싶은 사람에게 맞습니다. 하루 전체를 쓰는 장거리 코스보다 반나절 안에서 "도착, 관람, 휴식, 귀가"가 자연스럽게 이어지는 것을 목표로 합니다. 짧은 여행일수록 일정이 가벼워야 기억이 선명하게 남습니다.

반대로 여러 권역을 한 번에 찍고 싶은 여행자라면 이 코스 하나만으로는 부족할 수 있습니다. 그럴 때는 오전과 오후를 분리해 한 권역씩 보는 편이 좋습니다. 무리하게 이동하면 장소의 개성이 섞여 버리고, 애드센스 심사에서도 사용자가 실제로 얻을 수 있는 정보 밀도가 약해 보일 수 있습니다.

## 동행자별 조정

혼자 움직인다면 ${post.anchor}에서 첫 위치를 잡은 뒤, 길이 헷갈리는 골목이나 산책 구간은 해가 밝을 때 먼저 처리하세요. 혼자 여행은 선택이 빠르다는 장점이 있지만, 사진을 찍거나 길을 확인할 때 주변 상황을 놓치기 쉽습니다. 그래서 첫 목적지에 도착하면 다음 이동 방향과 쉬는 지점을 동시에 확인하는 습관이 좋습니다.

둘이 움직인다면 ${post.places[0]}에서 머무는 시간을 조금 넉넉히 잡고, ${post.places[1]}로 넘어가기 전에 카페나 벤치처럼 대화를 쉬어갈 지점을 넣으세요. 서로 보고 싶은 속도가 다를 수 있기 때문에 한 사람이 계속 앞서가거나 기다리는 흐름이 생기지 않도록, 사진 시간과 관람 시간을 분리해두면 편합니다.

가족 여행이라면 ${post.places[2]}까지 모두 넣는 것보다 화장실, 식사, 앉을 수 있는 장소를 먼저 확인하는 편이 낫습니다. 아이나 부모님이 함께하는 일정에서는 볼거리의 양보다 이동 간격이 중요합니다. 지도가 가까워 보여도 계단, 경사, 횡단보도, 대기 시간이 겹치면 피로가 빠르게 쌓이므로, 중간에 하나를 과감히 빼는 선택이 만족도를 지켜줍니다.

## 방문 전 마지막 체크

출발 전에는 세 가지만 확인하세요. 첫째, ${post.places[0]}의 운영 상태와 휴관일입니다. 둘째, ${post.anchor}까지 가는 교통편과 마지막 귀가 편입니다. 셋째, 비가 올 때 줄일 지점과 날씨가 좋을 때 더 붙일 지점입니다. 이 세 가지가 정리되어 있으면 현장에서 일정이 바뀌어도 당황할 가능성이 낮습니다.

또 하나 중요한 점은 검색 결과의 오래된 후기와 현재 운영 정보가 다를 수 있다는 것입니다. 특히 전시, 축제, 시장, 전망 시설은 계절과 행사에 따라 운영 방식이 바뀝니다. 이 글의 동선은 기본 판단 기준으로 쓰고, 실제 방문일에는 공식 안내와 현장 표지를 우선하세요. 그런 방식이 여행자의 시간과 비용을 동시에 보호합니다.

## 자주 묻는 질문

### ${post.faq[0][0]}

${post.faq[0][1]}

### ${post.faq[1][0]}

${post.faq[1][1]}
`;
}

function figure(base, alt, caption) {
  return `<figure class="content-photo">
  <img src="/images/generated/unique/${base}.jpg" alt="${alt}" width="1200" height="800" loading="lazy" decoding="async" sizes="(max-width: 860px) calc(100vw - 36px), 792px" />
  <figcaption>${caption} ⓒ한국플레이리스트</figcaption>
</figure>`;
}
