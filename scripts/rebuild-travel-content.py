from pathlib import Path
from urllib.parse import quote_plus
import re

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "src" / "content" / "travel"

PHOTO = {
    "busan-view": ("/images/kto/busan-haeundae-view.jpg", "부산 해운대와 도심 전경", "ⓒ한국관광공사 포토코리아-김미숙"),
    "busan-walk": ("/images/kto/busan-haeundae-walk.jpg", "부산 해운대 달맞이길", "ⓒ한국관광공사 포토코리아-박성근"),
    "busan-bridge": ("/images/kto/busan-gwangan-bridge.jpg", "부산 광안대교 야경", "ⓒ한국관광공사 포토코리아-박성근"),
    "busan-gamcheon": ("/images/kto/busan-gamcheon-village.jpg", "부산 감천문화마을 전경", "ⓒ한국관광공사 포토코리아-오한솔"),
    "busan-market": ("/images/kto/busan-jagalchi-market.jpg", "부산 자갈치시장", "ⓒ한국관광공사 포토코리아-김지호"),
    "busan-station": ("/images/kto/busan-station.jpg", "부산역 외관", "ⓒ한국관광공사 포토코리아-이범수"),
    "seoul-palace": ("/images/kto/seoul-one-day-palace-walk-content.jpg", "서울 고궁 단청", "ⓒ한국관광공사 포토코리아-김지호"),
    "seoul-hangang": ("/images/kto/seoul-hangang-evening-content.jpg", "서울 반포대교", "ⓒ한국관광공사 포토코리아-이범수"),
    "season": ("/images/kto/korea-season-travel-calendar-content.jpg", "진해 벚꽃 풍경", "ⓒ한국관광공사 포토코리아-박성근"),
    "jeju-olle": ("/images/kto/jeju-three-day-first-content.jpg", "제주 올레길", "ⓒ한국관광공사 포토코리아-김지호"),
    "jeju-walk": ("/images/kto/jeju-without-car-content.jpg", "제주 도보 여행길", "ⓒ한국관광공사 포토코리아-김지호"),
    "gangneung-sea": ("/images/kto/gangneung-sea-coffee-content.jpg", "강릉 안목해변", "ⓒ한국관광공사 포토코리아-김지호"),
    "gangneung-beach": ("/images/kto/gangneung-two-day-content.jpg", "강릉 영진해변", "ⓒ한국관광공사 포토코리아-강원지사"),
    "sokcho-mountain": ("/images/kto/sokcho-seoraksan-market-content.jpg", "설악산국립공원", "ⓒ한국관광공사 포토코리아-박은경"),
    "sokcho-market": ("/images/kto/sokcho-without-car-content.jpg", "속초 관광수산시장", "ⓒ한국관광공사 포토코리아-김지호"),
    "chuncheon": ("/images/kto/chuncheon-lake-day-content.jpg", "춘천 호수 여행 풍경", "ⓒ한국관광공사 포토코리아-이대순"),
    "jeonju-hanok": ("/images/kto/jeonju-hanok-day-content.jpg", "전주한옥마을", "ⓒ한국관광공사 포토코리아-김지호"),
    "jeonju-market": ("/images/kto/jeonju-food-cost-content.jpg", "전주남부시장", "ⓒ한국관광공사 포토코리아-김지호"),
    "gyeongju-bulguk": ("/images/kto/gyeongju-history-two-day-content.jpg", "경주 불국사", "ⓒ한국관광공사 포토코리아-이범수"),
    "gyeongju-daereung": ("/images/kto/gyeongju-family-content.jpg", "경주 대릉원", "ⓒ한국관광공사 포토코리아-IR 스튜디오"),
    "yeosu-night": ("/images/kto/yeosu-night-sea-content.jpg", "여수 밤바다 야경", "ⓒ한국관광공사 포토코리아-이범수"),
    "yeosu-cable": ("/images/kto/yeosu-island-day-content.jpg", "여수 해상케이블카", "ⓒ한국관광공사 포토코리아-김지호"),
    "tongyeong-sea": ("/images/kto/tongyeong-island-view-content.jpg", "통영 동피랑마을", "ⓒ한국관광공사 포토코리아-이범수"),
    "tongyeong-island": ("/images/kto/tongyeong-two-day-content.jpg", "통영 제승당", "ⓒ한국관광공사 포토코리아-이범수"),
    "incheon": ("/images/kto/incheon-open-port-content.jpg", "인천 차이나타운", "ⓒ한국관광공사 포토코리아-이범수"),
    "daegu": ("/images/kto/daegu-modern-street-content.jpg", "대구 계산예가", "ⓒ한국관광공사 포토코리아-김지호"),
}

DATA = {
    "seasonal-korea-travel-calendar-2026": {
        "photos": ["season", "seoul-hangang", "jeju-olle", "gangneung-sea", "gyeongju-daereung"],
        "stops": [("서울 봄꽃", "Seoul spring flowers", "ソウル春の花", "서울 벚꽃 명소"), ("강릉 바다", "Gangneung coast", "江陵の海", "강릉 안목해변"), ("경주 가을", "Gyeongju autumn", "慶州の秋", "경주 대릉원"), ("제주 겨울", "Jeju winter", "済州の冬", "제주 올레길")],
        "links": ["busan-two-day-route", "jeju-three-day-first-trip", "gangneung-sea-coffee-day-trip"],
    },
    "seoul-one-day-palace-walk": {
        "photos": ["seoul-palace", "seoul-hangang", "incheon", "seoul-palace", "seoul-hangang"],
        "stops": [("경복궁", "Gyeongbokgung Palace", "景福宮", "경복궁"), ("북촌한옥마을", "Bukchon Hanok Village", "北村韓屋村", "북촌한옥마을"), ("인사동", "Insadong", "仁寺洞", "인사동"), ("청계천", "Cheonggyecheon Stream", "清渓川", "청계천")],
        "links": ["seoul-hangang-night-walk", "incheon-open-port-day-trip", "seasonal-korea-travel-calendar-2026"],
    },
    "seoul-hangang-night-walk": {
        "photos": ["seoul-hangang", "seoul-palace", "incheon", "seoul-hangang", "seoul-palace"],
        "stops": [("여의도한강공원", "Yeouido Hangang Park", "汝矣島漢江公園", "여의도한강공원"), ("반포한강공원", "Banpo Hangang Park", "盤浦漢江公園", "반포한강공원"), ("세빛섬", "Sebitseom", "セビッソム", "세빛섬"), ("고속터미널역", "Express Bus Terminal Station", "高速ターミナル駅", "고속터미널역")],
        "links": ["seoul-one-day-palace-walk", "seasonal-korea-travel-calendar-2026", "incheon-open-port-day-trip"],
    },
    "busan-two-day-route": {
        "photos": ["busan-view", "busan-walk", "busan-bridge", "busan-gamcheon", "busan-market"],
        "stops": [("해운대해수욕장", "Haeundae Beach", "海雲台海水浴場", "해운대해수욕장"), ("동백섬", "Dongbaekseom", "冬柏島", "부산 동백섬"), ("광안리해수욕장", "Gwangalli Beach", "広安里海水浴場", "광안리해수욕장"), ("감천문화마을", "Gamcheon Culture Village", "甘川文化村", "감천문화마을"), ("자갈치시장", "Jagalchi Market", "チャガルチ市場", "자갈치시장")],
        "links": ["busan-market-food-route", "yeosu-night-sea-route", "gangneung-two-day-route"],
    },
    "busan-market-food-route": {
        "photos": ["busan-market", "busan-station", "busan-gamcheon", "busan-bridge", "busan-view"],
        "stops": [("자갈치시장", "Jagalchi Market", "チャガルチ市場", "자갈치시장"), ("국제시장", "Gukje Market", "国際市場", "부산 국제시장"), ("부평깡통시장", "Bupyeong Kkangtong Market", "富平カントン市場", "부평깡통시장"), ("BIFF광장", "BIFF Square", "BIFF広場", "BIFF광장")],
        "links": ["busan-two-day-route", "jeonju-food-budget-guide", "chuncheon-lake-day-trip"],
    },
    "jeju-three-day-first-trip": {
        "photos": ["jeju-olle", "jeju-walk", "jeju-olle", "jeju-walk", "jeju-olle"],
        "stops": [("제주공항", "Jeju International Airport", "済州国際空港", "제주국제공항"), ("성산일출봉", "Seongsan Ilchulbong", "城山日出峰", "성산일출봉"), ("월정리해변", "Woljeongri Beach", "月汀里海辺", "월정리해변"), ("협재해수욕장", "Hyeopjae Beach", "挟才海水浴場", "협재해수욕장"), ("동문시장", "Dongmun Market", "東門市場", "제주 동문시장")],
        "links": ["jeju-without-car-guide", "seasonal-korea-travel-calendar-2026", "yeosu-island-day-trip"],
    },
    "jeju-without-car-guide": {
        "photos": ["jeju-walk", "jeju-olle", "jeju-walk", "jeju-olle", "jeju-walk"],
        "stops": [("제주공항", "Jeju Airport", "済州空港", "제주국제공항"), ("제주시외버스터미널", "Jeju Bus Terminal", "済州市外バスターミナル", "제주시외버스터미널"), ("함덕해수욕장", "Hamdeok Beach", "咸徳海水浴場", "함덕해수욕장"), ("성산일출봉", "Seongsan Ilchulbong", "城山日出峰", "성산일출봉")],
        "links": ["jeju-three-day-first-trip", "sokcho-without-car-guide", "seasonal-korea-travel-calendar-2026"],
    },
    "gangneung-sea-coffee-day-trip": {
        "photos": ["gangneung-sea", "gangneung-beach", "sokcho-mountain", "sokcho-market", "chuncheon"],
        "stops": [("강릉역", "Gangneung Station", "江陵駅", "강릉역"), ("안목해변", "Anmok Beach", "安木海辺", "안목해변"), ("강릉커피거리", "Gangneung Coffee Street", "江陵コーヒー通り", "강릉커피거리"), ("경포호", "Gyeongpo Lake", "鏡浦湖", "경포호")],
        "links": ["gangneung-two-day-route", "sokcho-seoraksan-market-route", "seasonal-korea-travel-calendar-2026"],
    },
    "gangneung-two-day-route": {
        "photos": ["gangneung-beach", "gangneung-sea", "sokcho-mountain", "sokcho-market", "chuncheon"],
        "stops": [("강릉역", "Gangneung Station", "江陵駅", "강릉역"), ("경포해변", "Gyeongpo Beach", "鏡浦海辺", "경포해변"), ("오죽헌", "Ojukheon", "烏竹軒", "오죽헌"), ("주문진항", "Jumunjin Port", "注文津港", "주문진항")],
        "links": ["gangneung-sea-coffee-day-trip", "sokcho-without-car-guide", "busan-two-day-route"],
    },
    "sokcho-seoraksan-market-route": {
        "photos": ["sokcho-mountain", "sokcho-market", "gangneung-sea", "gangneung-beach", "chuncheon"],
        "stops": [("속초고속버스터미널", "Sokcho Express Bus Terminal", "束草高速バスターミナル", "속초고속버스터미널"), ("설악산국립공원", "Seoraksan National Park", "雪岳山国立公園", "설악산국립공원"), ("속초관광수산시장", "Sokcho Tourist & Fishery Market", "束草観光水産市場", "속초관광수산시장"), ("속초해수욕장", "Sokcho Beach", "束草海水浴場", "속초해수욕장")],
        "links": ["sokcho-without-car-guide", "gangneung-sea-coffee-day-trip", "chuncheon-lake-day-trip"],
    },
    "sokcho-without-car-guide": {
        "photos": ["sokcho-market", "sokcho-mountain", "gangneung-beach", "gangneung-sea", "chuncheon"],
        "stops": [("속초시외버스터미널", "Sokcho Intercity Bus Terminal", "束草市外バスターミナル", "속초시외버스터미널"), ("속초해수욕장", "Sokcho Beach", "束草海水浴場", "속초해수욕장"), ("속초관광수산시장", "Sokcho Market", "束草市場", "속초관광수산시장"), ("설악산소공원", "Seoraksan Sogongwon", "雪岳山小公園", "설악산소공원")],
        "links": ["sokcho-seoraksan-market-route", "jeju-without-car-guide", "gangneung-two-day-route"],
    },
    "jeonju-hanok-village-day-trip": {
        "photos": ["jeonju-hanok", "jeonju-market", "jeonju-hanok", "jeonju-market", "gyeongju-daereung"],
        "stops": [("전주역", "Jeonju Station", "全州駅", "전주역"), ("전주한옥마을", "Jeonju Hanok Village", "全州韓屋村", "전주한옥마을"), ("경기전", "Gyeonggijeon Shrine", "慶基殿", "경기전"), ("전주남부시장", "Nambu Market", "南部市場", "전주남부시장")],
        "links": ["jeonju-food-budget-guide", "gyeongju-history-two-day-route", "seoul-one-day-palace-walk"],
    },
    "jeonju-food-budget-guide": {
        "photos": ["jeonju-market", "jeonju-hanok", "jeonju-market", "jeonju-hanok", "gyeongju-daereung"],
        "stops": [("전주한옥마을", "Jeonju Hanok Village", "全州韓屋村", "전주한옥마을"), ("전주남부시장", "Nambu Market", "南部市場", "전주남부시장"), ("전주비빔밥거리", "Jeonju Bibimbap Street", "全州ビビンバ通り", "전주비빔밥거리"), ("객리단길", "Gaengnidan-gil", "客理団通り", "객리단길")],
        "links": ["jeonju-hanok-village-day-trip", "busan-market-food-route", "gyeongju-family-trip-guide"],
    },
    "gyeongju-history-two-day-route": {
        "photos": ["gyeongju-bulguk", "gyeongju-daereung", "gyeongju-bulguk", "gyeongju-daereung", "jeonju-hanok"],
        "stops": [("경주역", "Gyeongju Station", "慶州駅", "경주역"), ("대릉원", "Daereungwon", "大陵苑", "대릉원"), ("첨성대", "Cheomseongdae", "瞻星台", "첨성대"), ("동궁과 월지", "Donggung and Wolji", "東宮と月池", "동궁과 월지"), ("불국사", "Bulguksa Temple", "仏国寺", "불국사")],
        "links": ["gyeongju-family-trip-guide", "jeonju-hanok-village-day-trip", "tongyeong-two-day-island-route"],
    },
    "gyeongju-family-trip-guide": {
        "photos": ["gyeongju-daereung", "gyeongju-bulguk", "gyeongju-daereung", "gyeongju-bulguk", "jeonju-market"],
        "stops": [("대릉원", "Daereungwon", "大陵苑", "대릉원"), ("국립경주박물관", "Gyeongju National Museum", "国立慶州博物館", "국립경주박물관"), ("첨성대", "Cheomseongdae", "瞻星台", "첨성대"), ("동궁과 월지", "Donggung and Wolji", "東宮と月池", "동궁과 월지")],
        "links": ["gyeongju-history-two-day-route", "jeonju-food-budget-guide", "tongyeong-sea-view-route"],
    },
    "yeosu-night-sea-route": {
        "photos": ["yeosu-night", "yeosu-cable", "tongyeong-sea", "tongyeong-island", "busan-bridge"],
        "stops": [("여수엑스포역", "Yeosu Expo Station", "麗水エキスポ駅", "여수엑스포역"), ("오동도", "Odongdo Island", "梧桐島", "오동도"), ("여수해상케이블카", "Yeosu Maritime Cable Car", "麗水海上ケーブルカー", "여수해상케이블카"), ("낭만포차거리", "Romantic Pocha Street", "浪漫屋台通り", "여수 낭만포차거리")],
        "links": ["yeosu-island-day-trip", "busan-two-day-route", "tongyeong-two-day-island-route"],
    },
    "yeosu-island-day-trip": {
        "photos": ["yeosu-cable", "yeosu-night", "tongyeong-island", "tongyeong-sea", "busan-bridge"],
        "stops": [("여수연안여객선터미널", "Yeosu Coastal Ferry Terminal", "麗水沿岸旅客船ターミナル", "여수연안여객선터미널"), ("오동도", "Odongdo Island", "梧桐島", "오동도"), ("돌산공원", "Dolsan Park", "突山公園", "돌산공원"), ("여수해상케이블카", "Yeosu Cable Car", "麗水海上ケーブルカー", "여수해상케이블카")],
        "links": ["yeosu-night-sea-route", "jeju-three-day-first-trip", "tongyeong-sea-view-route"],
    },
    "tongyeong-two-day-island-route": {
        "photos": ["tongyeong-island", "tongyeong-sea", "yeosu-cable", "yeosu-night", "busan-bridge"],
        "stops": [("통영종합버스터미널", "Tongyeong Bus Terminal", "統営総合バスターミナル", "통영종합버스터미널"), ("통영케이블카", "Tongyeong Cable Car", "統営ケーブルカー", "통영케이블카"), ("동피랑마을", "Dongpirang Village", "東ピラン村", "동피랑마을"), ("강구안", "Gangguan Port", "江口岸", "강구안")],
        "links": ["tongyeong-sea-view-route", "yeosu-island-day-trip", "gyeongju-history-two-day-route"],
    },
    "tongyeong-sea-view-route": {
        "photos": ["tongyeong-sea", "tongyeong-island", "yeosu-night", "yeosu-cable", "busan-bridge"],
        "stops": [("동피랑마을", "Dongpirang Village", "東ピラン村", "동피랑마을"), ("통영중앙시장", "Tongyeong Jungang Market", "統営中央市場", "통영중앙시장"), ("통영케이블카", "Tongyeong Cable Car", "統営ケーブルカー", "통영케이블카"), ("강구안", "Gangguan Port", "江口岸", "강구안")],
        "links": ["tongyeong-two-day-island-route", "yeosu-night-sea-route", "gyeongju-family-trip-guide"],
    },
    "chuncheon-lake-day-trip": {
        "photos": ["chuncheon", "gangneung-sea", "gangneung-beach", "sokcho-mountain", "sokcho-market"],
        "stops": [("춘천역", "Chuncheon Station", "春川駅", "춘천역"), ("소양강스카이워크", "Soyanggang Skywalk", "昭陽江スカイウォーク", "소양강스카이워크"), ("춘천명동닭갈비골목", "Chuncheon Dakgalbi Street", "春川明洞タッカルビ通り", "춘천명동닭갈비골목"), ("공지천", "Gongjicheon", "孔之川", "공지천")],
        "links": ["sokcho-seoraksan-market-route", "seoul-hangang-night-walk", "gangneung-sea-coffee-day-trip"],
    },
    "incheon-open-port-day-trip": {
        "photos": ["incheon", "seoul-palace", "seoul-hangang", "incheon", "seoul-hangang"],
        "stops": [("인천역", "Incheon Station", "仁川駅", "인천역"), ("인천 차이나타운", "Incheon Chinatown", "仁川チャイナタウン", "인천 차이나타운"), ("개항장거리", "Open Port Area", "開港場通り", "인천 개항장거리"), ("월미도", "Wolmido", "月尾島", "월미도")],
        "links": ["seoul-one-day-palace-walk", "seoul-hangang-night-walk", "daegu-modern-street-half-day"],
    },
    "daegu-modern-street-half-day": {
        "photos": ["daegu", "gyeongju-bulguk", "gyeongju-daereung", "jeonju-hanok", "daegu"],
        "stops": [("반월당역", "Banwoldang Station", "半月堂駅", "반월당역"), ("계산성당", "Gyesan Cathedral", "桂山聖堂", "계산성당"), ("근대골목", "Modern Alley", "近代路地", "대구 근대골목"), ("김광석 다시그리기길", "Kim Gwangseok Street", "金光石通り", "김광석 다시그리기길")],
        "links": ["incheon-open-port-day-trip", "gyeongju-history-two-day-route", "jeonju-hanok-village-day-trip"],
    },
}

KEY_FROM_FILE = {
    "korea-season-travel-calendar": "seasonal-korea-travel-calendar-2026",
    "seoul-one-day-palace-walk": "seoul-one-day-palace-walk",
    "seoul-hangang-evening": "seoul-hangang-night-walk",
    "busan-two-day-route": "busan-two-day-route",
    "busan-market-food": "busan-market-food-route",
    "jeju-three-day-first": "jeju-three-day-first-trip",
    "jeju-without-car": "jeju-without-car-guide",
    "gangneung-sea-coffee": "gangneung-sea-coffee-day-trip",
    "gangneung-two-day": "gangneung-two-day-route",
    "sokcho-seoraksan-market": "sokcho-seoraksan-market-route",
    "sokcho-without-car": "sokcho-without-car-guide",
    "jeonju-hanok-day": "jeonju-hanok-village-day-trip",
    "jeonju-food-cost": "jeonju-food-budget-guide",
    "gyeongju-history-two-day": "gyeongju-history-two-day-route",
    "gyeongju-family": "gyeongju-family-trip-guide",
    "yeosu-night-sea": "yeosu-night-sea-route",
    "yeosu-island-day": "yeosu-island-day-trip",
    "tongyeong-two-day": "tongyeong-two-day-island-route",
    "tongyeong-island-view": "tongyeong-sea-view-route",
    "chuncheon-lake-day": "chuncheon-lake-day-trip",
    "incheon-open-port": "incheon-open-port-day-trip",
    "daegu-modern-street": "daegu-modern-street-half-day",
}

def parse_frontmatter(text):
    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$", text.lstrip("\ufeff"))
    if not match:
        raise ValueError("frontmatter not found")
    return match.group(1), match.group(2)

def field(fm, name):
    match = re.search(rf'{name}: "([^"]*)"', fm)
    return match.group(1) if match else ""

def array_field(fm, name):
    match = re.search(rf"{name}: \[(.*?)\]", fm)
    if not match:
        return []
    return [item.strip().strip('"') for item in match.group(1).split(",") if item.strip()]

def quote(value):
    return str(value).replace('"', '\\"')

def route_url(stops):
    queries = [stop[3] for stop in stops]
    if len(queries) < 2:
        return f"https://www.google.com/maps/search/?api=1&query={quote_plus(queries[0])}"
    origin = quote_plus(queries[0])
    destination = quote_plus(queries[-1])
    waypoints = quote_plus("|".join(queries[1:-1]))
    return f"https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}&waypoints={waypoints}&travelmode=transit"

def stop_link(query):
    return f"https://www.google.com/maps/search/?api=1&query={quote_plus(query)}"

def photo_figure(photo_key, locale):
    src, ko_alt, credit = PHOTO[photo_key]
    alt = ko_alt
    if locale == "en":
        alt = f"Korea travel photo: {ko_alt}"
    elif locale == "ja":
        alt = f"韓国旅行写真：{ko_alt}"
    return f'''<figure class="content-photo">
  <img src="{src}" alt="{quote(alt)}" width="1200" height="800" loading="lazy" decoding="async" />
  <figcaption>{credit}</figcaption>
</figure>'''

def closing_photo_key(photo_keys):
    if len(photo_keys) >= 5:
        return photo_keys[4]
    return photo_keys[0]

def contextual_links(key, locale):
    links = DATA[key]["links"]
    parts = []
    for target in links:
        meta = META[target][locale]
        title = meta["title"]
        prefix = "" if locale == "ko" else f"/{locale}"
        parts.append(f"[{title}]({prefix}/travel/{meta['regionSlug']}/{meta['urlSlug']}/)")
    if locale == "ko":
        return f"동선이 비슷한 고민이라면 {parts[0]}을 먼저 비교하고, 식비나 교통처럼 세부 조건이 중요할 때는 {parts[1]}도 함께 확인하면 계획이 더 현실적입니다."
    if locale == "en":
        return f"If you are comparing similar routes, read {parts[0]} first. For food, transport, or seasonal decisions, {parts[1]} can help refine the plan without adding unnecessary stops."
    return f"似たルートで迷う場合は、まず{parts[0]}を比較してください。食事、交通、季節の条件を詰めたい時は{parts[1]}も参考になります。"

def map_block(key, locale):
    stops = DATA[key]["stops"]
    labels = {
        "ko": ("Google Maps 동선", "전체 동선 열기", "지도에서 보기"),
        "en": ("Google Maps route", "Open full route", "Open in Maps"),
        "ja": ("Googleマップのルート", "全体ルートを開く", "地図で見る"),
    }[locale]
    index = {"ko": 0, "en": 1, "ja": 2}[locale]
    items = []
    for number, stop in enumerate(stops, 1):
        label = stop[index]
        items.append(f'''    <li>
      <span>{number}</span>
      <strong>{label}</strong>
      <a href="{stop_link(stop[3])}" target="_blank" rel="noopener noreferrer">{labels[2]}</a>
    </li>''')
    return f'''<div class="map-route">
  <div class="map-route-head">
    <strong>{labels[0]}</strong>
    <a href="{route_url(stops)}" target="_blank" rel="noopener noreferrer">{labels[1]}</a>
  </div>
  <ol class="map-stop-list">
{chr(10).join(items)}
  </ol>
</div>'''

def route_cards(key, locale):
    stops = DATA[key]["stops"]
    index = {"ko": 0, "en": 1, "ja": 2}[locale]
    if locale == "ko":
        descs = ["도착 직후 동선을 시작하기 좋은 기준점입니다.", "사진과 산책 시간을 넉넉히 잡기 좋은 구간입니다.", "식사나 휴식 시간을 넣기 좋은 중간 지점입니다.", "귀가 전 마지막으로 묶기 좋은 장소입니다.", "시간이 남을 때 추가하기 좋은 보조 코스입니다."]
    elif locale == "en":
        descs = ["Use this as the starting point after arrival.", "Allow enough time for photos and walking.", "This is a good middle stop for food or a break.", "Keep this as the final stop before returning.", "Add this only when the schedule has enough room."]
    else:
        descs = ["到着後の起点にしやすい場所です。", "写真と散歩の時間を多めに取りたい区間です。", "食事や休憩を入れやすい中間地点です。", "帰る前の最後の目的地にしやすい場所です。", "時間に余裕がある時だけ追加すると安心です。"]
    cards = []
    for i, stop in enumerate(stops):
        cards.append(f'''  <div>
    <span>{i + 1}</span>
    <strong>{stop[index]}</strong>
    <p>{descs[min(i, len(descs)-1)]}</p>
  </div>''')
    return f'''<div class="route-cards" aria-label="route summary">
{chr(10).join(cards)}
</div>'''

def place_checklist(key, locale):
    stops = DATA[key]["stops"]
    index = {"ko": 0, "en": 1, "ja": 2}[locale]
    if locale == "ko":
        title = "장소별 체크 포인트"
        notes = [
            "첫 목적지이므로 도착 시간, 짐 보관, 식사 전후 동선을 함께 확인하세요.",
            "도보 시간이 늘어날 수 있어 사진 촬영과 휴식 시간을 30분 이상 남겨두는 편이 좋습니다.",
            "점심 또는 카페 시간을 넣기 좋은 지점입니다. 주말에는 대기 시간을 일정에 포함하세요.",
            "해가 지기 전 방문이 필요한지, 야경이 좋은지에 따라 순서를 조정하면 좋습니다.",
            "마지막 장소는 귀가 교통과 가까운지 확인하고, 시간이 부족하면 과감히 빼도 됩니다."
        ]
    elif locale == "en":
        title = "Stop-by-Stop Planning Checks"
        notes = [
            "Use this first stop to check arrival time, luggage storage, and whether you need food before moving on.",
            "Leave at least 30 extra minutes here for photos, walking, and a short rest.",
            "This is a useful point for lunch, coffee, or a slower break. Add queue time on weekends.",
            "Adjust this stop depending on daylight, night views, and how far it is from your stay area.",
            "Before adding the final stop, check the return route. Skip it if transport time becomes tight."
        ]
    else:
        title = "スポット別チェックポイント"
        notes = [
            "最初の目的地なので、到着時間、荷物預かり、食事前後の動線を確認してください。",
            "写真と散歩で時間が延びやすいため、30分以上の余裕を残すと安心です。",
            "昼食やカフェを入れやすい地点です。週末は待ち時間も予定に入れてください。",
            "日没前に行くべきか、夜景が良い場所かによって順番を調整しましょう。",
            "最後の場所は帰りの交通に近いかを確認し、時間が足りなければ外しても構いません。"
        ]
    items = []
    for i, stop in enumerate(stops):
        items.append(f'''  <li>
    <strong>{stop[index]}</strong>
    <p>{notes[min(i, len(notes) - 1)]}</p>
  </li>''')
    return f'''<div class="place-checklist">
  <h2>{title}</h2>
  <ul>
{chr(10).join(items)}
  </ul>
</div>'''

def stop_names(key, locale):
    index = {"ko": 0, "en": 1, "ja": 2}[locale]
    return [stop[index] for stop in DATA[key]["stops"]]

def join_names(names, locale):
    if locale == "en":
        return ", ".join(names[:-1]) + (f", and {names[-1]}" if len(names) > 1 else names[0])
    if locale == "ja":
        return "、".join(names)
    return ", ".join(names)

def decision_block(key, locale):
    names = stop_names(key, locale)
    if locale == "ko":
        return f'''<div class="decision-grid">
  <div>
    <h2>이 일정이 잘 맞는 사람</h2>
    <ul>
      <li>{names[0]}에서 시작해 {names[-1]}까지 큰 방향만 정하고 움직이고 싶은 첫 방문자</li>
      <li>사진, 식사, 이동을 모두 넣되 하루를 너무 촘촘하게 만들고 싶지 않은 사람</li>
      <li>숙소 위치와 마지막 이동까지 함께 보고 여행 피로도를 줄이고 싶은 사람</li>
    </ul>
  </div>
  <div>
    <h2>다시 조정하면 좋은 경우</h2>
    <ul>
      <li>아이 또는 부모님과 함께 움직여 한 번에 40분 이상 걷는 일정이 부담스러운 경우</li>
      <li>비가 많이 오거나 강풍 예보가 있어 야외 사진과 해변·전망 동선이 어려운 경우</li>
      <li>당일 도착 시간이 오후라면 앞쪽 장소를 줄이고 식사와 숙소 이동을 우선해야 합니다.</li>
    </ul>
  </div>
</div>'''
    if locale == "en":
        return f'''<div class="decision-grid">
  <div>
    <h2>Who This Plan Works For</h2>
    <ul>
      <li>First-time visitors who want a clear route from {names[0]} to {names[-1]} without overplanning every minute.</li>
      <li>Travelers who want photos, food, transport, and rest time in the same day.</li>
      <li>People choosing a stay area based on the final evening movement and next-morning departure.</li>
    </ul>
  </div>
  <div>
    <h2>When to Adjust the Route</h2>
    <ul>
      <li>Adjust the walking sections if you travel with children, parents, or anyone who needs slower pacing.</li>
      <li>Prepare an indoor substitute if heavy rain or strong wind makes beaches, viewpoints, or long walks difficult.</li>
      <li>If you arrive in the afternoon, cut the first stop and prioritize food timing plus the stay-area transfer.</li>
    </ul>
  </div>
</div>'''
    return f'''<div class="decision-grid">
  <div>
    <h2>この日程が合う人</h2>
    <ul>
      <li>{names[0]}から{names[-1]}まで、大きな流れを決めて動きたい初めての旅行者</li>
      <li>写真、食事、移動、休憩を1日の中に無理なく入れたい人</li>
      <li>最後の移動と翌朝の出発まで考えて宿泊エリアを選びたい人</li>
    </ul>
  </div>
  <div>
    <h2>調整した方がよい場合</h2>
    <ul>
      <li>子どもや両親と一緒で、長い徒歩移動が負担になりやすい場合</li>
      <li>雨や強風で、海辺、展望、長い散策が難しい場合</li>
      <li>午後到着なら前半のスポットを減らし、食事と宿泊エリアへの移動を優先してください。</li>
    </ul>
  </div>
</div>'''

def timetable_block(key, locale):
    names = stop_names(key, locale)
    times = ["09:30", "11:00", "13:00", "15:30", "18:00"]
    ko_notes = [
        "도착 직후 방향을 잡고 화장실, 짐 보관, 첫 식사 후보를 확인합니다.",
        "가장 사진을 많이 찍는 구간입니다. 이동보다 체류 시간을 넉넉히 둡니다.",
        "점심, 카페, 시장을 넣기 좋은 시간입니다. 대기 시간을 일정 안에 포함합니다.",
        "해가 지기 전 봐야 하는 장소인지, 야경이 좋은 장소인지 판단해 순서를 조정합니다.",
        "숙소나 역으로 돌아가기 쉬운 마지막 장소만 남겨 이동 피로를 줄입니다."
    ]
    en_notes = [
        "Confirm the direction, restrooms, luggage storage, and the first food option right after arrival.",
        "This is usually the photo-heavy section, so leave more time for staying than moving.",
        "Use this slot for lunch, a cafe, or a market stop. Include queue time in the plan.",
        "Decide whether the stop needs daylight or works better as an evening view.",
        "Keep the final stop close to your stay area, station, or return transport."
    ]
    ja_notes = [
        "到着後すぐに方向、トイレ、荷物預かり、最初の食事候補を確認します。",
        "写真を撮る時間が長くなりやすい区間なので、移動より滞在時間を多めに取ります。",
        "昼食、カフェ、市場を入れやすい時間帯です。待ち時間も予定に含めます。",
        "日中に見るべき場所か、夜景が良い場所かで順番を調整します。",
        "最後は宿泊エリアや駅へ戻りやすい場所だけを残すと疲れにくいです。"
    ]
    notes = {"ko": ko_notes, "en": en_notes, "ja": ja_notes}[locale]
    labels = {
        "ko": ("시간대별 추천 일정", "시간", "장소", "확인할 점"),
        "en": ("Suggested Timeline", "Time", "Stop", "What to Check"),
        "ja": ("時間帯別モデルプラン", "時間", "場所", "確認ポイント"),
    }[locale]
    rows = []
    for i, name in enumerate(names):
        rows.append(f'''  <div>
    <span>{times[min(i, len(times) - 1)]}</span>
    <strong>{name}</strong>
    <p>{notes[min(i, len(notes) - 1)]}</p>
  </div>''')
    return f'''<section class="planning-table">
  <h2>{labels[0]}</h2>
  <div class="planning-table-head">
    <span>{labels[1]}</span>
    <span>{labels[2]}</span>
    <span>{labels[3]}</span>
  </div>
{chr(10).join(rows)}
</section>'''

def cost_block(locale):
    if locale == "ko":
        return '''<section class="planning-table compact">
  <h2>예상 비용과 예산 잡는 법</h2>
  <div class="planning-table-head"><span>항목</span><span>1인 기준</span><span>체크 포인트</span></div>
  <div><span>지역 내 교통</span><strong>8,000~25,000원</strong><p>지하철·버스 중심이면 낮고, 짧은 택시를 2회 이상 넣으면 올라갑니다.</p></div>
  <div><span>식사·카페</span><strong>35,000~70,000원</strong><p>시장 간식과 카페를 넣으면 만족도는 높지만 지출이 쉽게 늘어납니다.</p></div>
  <div><span>입장·체험</span><strong>0~30,000원</strong><p>무료 산책지 중심인지, 전망대·케이블카·박물관을 넣는지에 따라 달라집니다.</p></div>
  <div><span>비상 예산</span><strong>20,000~40,000원</strong><p>우천, 막차, 짐 이동 때문에 택시를 타야 할 상황을 대비합니다.</p></div>
</section>'''
    if locale == "en":
        return '''<section class="planning-table compact">
  <h2>Budget Range and Cost Planning</h2>
  <div class="planning-table-head"><span>Item</span><span>Per Person</span><span>Planning Note</span></div>
  <div><span>Local transport</span><strong>KRW 8,000-25,000</strong><p>Subway and bus routes stay low; several short taxis raise the total quickly.</p></div>
  <div><span>Meals and cafes</span><strong>KRW 35,000-70,000</strong><p>Markets and cafes improve the day but are usually where small costs stack up.</p></div>
  <div><span>Tickets and activities</span><strong>KRW 0-30,000</strong><p>The range depends on whether you choose free walks or paid viewpoints, museums, cable cars, or experiences.</p></div>
  <div><span>Backup budget</span><strong>KRW 20,000-40,000</strong><p>Keep room for rain, missed buses, luggage movement, or a taxi at the end of the day.</p></div>
</section>'''
    return '''<section class="planning-table compact">
  <h2>予算の目安と考え方</h2>
  <div class="planning-table-head"><span>項目</span><span>1人目安</span><span>確認ポイント</span></div>
  <div><span>地域内交通</span><strong>8,000〜25,000ウォン</strong><p>地下鉄やバス中心なら低め、短距離タクシーを複数回使うと上がります。</p></div>
  <div><span>食事・カフェ</span><strong>35,000〜70,000ウォン</strong><p>市場グルメやカフェを入れると満足度は上がりますが、小さな出費が増えます。</p></div>
  <div><span>入場・体験</span><strong>0〜30,000ウォン</strong><p>無料散策中心か、展望台、博物館、ケーブルカーを入れるかで変わります。</p></div>
  <div><span>予備費</span><strong>20,000〜40,000ウォン</strong><p>雨、終バス、荷物移動でタクシーが必要になる場合に備えます。</p></div>
</section>'''

def transport_block(key, locale):
    names = stop_names(key, locale)
    if locale == "ko":
        return f'''## 대중교통, 택시, 렌터카 선택 기준

{names[0]}에서 {names[-1]}까지 한 번에 이어 보면 지도상 거리는 짧아 보여도 실제 이동은 환승, 배차 간격, 짐 이동 때문에 달라질 수 있습니다.

도심형 코스는 대중교통과 짧은 택시 조합이 가장 안정적입니다. 해변·산·섬·외곽 전망대가 들어가면 렌터카나 택시 비중을 높이는 편이 좋습니다.

대중교통을 쓴다면 첫 목적지까지의 이동 시간보다 마지막 장소에서 숙소로 돌아오는 시간을 더 중요하게 보세요. 여행 만족도는 마지막 1시간에 크게 갈립니다.

렌터카를 쓰는 경우에는 주차장 위치, 야간 운전, 음주 가능성, 성수기 정체를 함께 고려해야 합니다. 택시는 2~3명이 함께 움직이면 효율적이지만, 축제·해변·막차 시간대에는 호출이 늦어질 수 있습니다.'''
    if locale == "en":
        return f'''## Public Transport, Taxi, or Rental Car

The route from {names[0]} to {names[-1]} may look simple on a map, but transfers, bus intervals, luggage, and the final return can change the real difficulty.

For city routes, public transport plus short taxi rides is usually the most balanced option. For beaches, mountains, islands, or outer viewpoints, a rental car or extra taxi budget may be more realistic.

If you use public transport, do not only check the first ride of the day. Check how you return from the final stop to your stay area.

If you rent a car, check parking, night driving, possible congestion, and whether the evening plan includes alcohol. Taxis work well for two or three people, but waits can be longer near beaches, festivals, and late-night transport hubs.'''
    return f'''## 公共交通・タクシー・レンタカーの選び方

{names[0]}から{names[-1]}まで地図上では簡単に見えても、乗り換え、バスの本数、荷物、最後の帰り道で実際の負担は変わります。

都市型のコースは公共交通と短距離タクシーの組み合わせが安定します。海辺、山、島、郊外の展望スポットを入れる場合はレンタカーやタクシー予算を多めに見ると安心です。

公共交通を使うなら、最初の移動より最後の場所から宿泊エリアへ戻る時間を重視してください。

レンタカーの場合は駐車場、夜間運転、渋滞、夕食時の飲酒予定も確認します。タクシーは2〜3人なら効率的ですが、海辺、祭り、終電前後は呼び出しに時間がかかることがあります。'''

def stay_food_weather_block(key, locale):
    names = stop_names(key, locale)
    if locale == "ko":
        return f'''## 숙소 위치와 식사 타이밍

숙소는 무조건 저렴한 곳보다 “마지막 일정 이후 돌아가기 쉬운 곳”이 좋습니다. {names[-1]} 근처에서 저녁을 마치거나 야경을 본다면 숙소가 너무 멀지 않아야 다음 날 피로가 줄어듭니다. 반대로 다음 날 아침 이동이 빠르다면 터미널, 역, 공항 접근성이 좋은 곳을 고르는 편이 안전합니다.

식사는 {names[1] if len(names) > 1 else names[0]} 이후에 한 번 길게 넣거나, {names[-1]} 근처에서 저녁을 먹는 방식이 무난합니다. 인기 식당 하나에 일정을 맞추기보다 같은 권역의 후보를 2~3개 저장해두세요. 웨이팅이 길면 카페나 시장 간식으로 먼저 체력을 회복하고, 본 식사는 다음 권역에서 해결하는 편이 낫습니다.

## 비 오는 날과 더운 날 대체 운영

비가 오면 야외 체류 시간을 줄이고 실내 전시, 시장, 카페, 짧은 택시 이동을 섞어야 합니다. 특히 사진 목적의 장소는 만족도가 떨어질 수 있으므로 낮 시간의 핵심 장소 1~2개만 남기는 편이 좋습니다.

나머지는 식사와 실내 휴식으로 바꾸면 일정이 덜 흔들립니다. 여름에는 한낮 이동을 줄이고, 겨울에는 해가 짧으니 야외 사진 장소를 오전과 이른 오후로 당기세요.'''
    if locale == "en":
        return f'''## Stay Area and Food Timing

The best stay area is not always the cheapest one. Choose a place that is easy to return to after the final stop. If you plan dinner or night views near {names[-1]}, staying too far away can make the next morning harder. If you leave early the next day, prioritize access to a station, terminal, or airport.

For food, place one longer meal after {names[1] if len(names) > 1 else names[0]} or keep dinner near {names[-1]}. Do not build the whole day around one popular restaurant. Save two or three options in the same area. If the queue is long, recover with a cafe or market snack first and move the main meal to the next zone.

## Rainy-Day and Hot-Weather Adjustments

On rainy days, reduce outdoor time and mix indoor exhibits, markets, cafes, and short taxi rides. Photo-focused stops may lose value, so keep only one or two essential daylight stops.

Use the rest of the day for food and rest. In summer, avoid long midday walks. In winter, move outdoor photo stops earlier because sunset comes quickly.'''
    return f'''## 宿泊エリアと食事のタイミング

宿泊エリアは安さだけでなく、最後の予定後に戻りやすい場所を選ぶのが大切です。{names[-1]}周辺で夕食や夜景を入れるなら、宿が遠すぎると翌朝まで疲れが残ります。翌朝の移動が早い場合は、駅、ターミナル、空港へのアクセスを優先してください。

食事は{names[1] if len(names) > 1 else names[0]}の後に長めに入れるか、{names[-1]}周辺で夕食を取る流れが無理なく組みやすいです。人気店1つに予定を合わせるより、同じエリアで2〜3軒の候補を保存しておきましょう。待ち時間が長ければ、先にカフェや市場の軽食で休み、次のエリアで食事を取る方が安定します。

## 雨の日・暑い日の代替案

雨の日は屋外の滞在時間を減らし、屋内展示、市場、カフェ、短距離タクシーを組み合わせます。写真目的の場所は満足度が下がることがあるため、日中の重要スポットを1〜2か所だけ残すと安心です。

残りは食事と休憩に切り替えます。夏は昼の長い徒歩移動を避け、冬は日没が早いので屋外写真スポットを前半に寄せてください。'''

def mistakes_block(key, locale):
    names = stop_names(key, locale)
    if locale == "ko":
        return f'''## 처음 가는 사람이 자주 하는 실수

가장 흔한 실수는 {join_names(names, locale)} 같은 장소를 모두 같은 무게로 보는 것입니다. 실제 일정에서는 반드시 오래 머무를 장소와 짧게 확인할 장소를 나눠야 합니다. 모든 장소에서 사진, 식사, 카페를 다 넣으면 이동 시간보다 체류 시간이 길어져 마지막 일정이 밀립니다.

두 번째 실수는 숙소를 먼저 정하고 코스를 끼워 맞추는 것입니다. 숙소는 가격보다 마지막 일정, 다음 날 출발지, 짐 보관 가능성을 함께 봐야 합니다.

세 번째는 지도상 이동 시간만 믿는 것입니다. 주말, 성수기, 비 오는 날에는 대기와 호출 시간이 늘어나므로 최소 20~30분의 여유를 남겨두세요.

## 사진 찍기 좋은 시간과 저장해둘 것

바다와 전망은 오전 또는 해 질 무렵이 좋고, 시장과 야경은 저녁에 분위기가 살아납니다. 단, 겨울에는 해가 빨리 지므로 야외 사진 장소를 너무 늦게 두지 마세요.

출발 전에는 Google Maps에 각 장소를 저장하고, 대체 식당, 근처 카페, 숙소 복귀 경로까지 같이 저장해두면 현장에서 흔들리지 않습니다.'''
    if locale == "en":
        return f'''## Common Mistakes First-Time Visitors Make

The biggest mistake is treating {join_names(names, locale)} as equally important.

In a real itinerary, you need to decide which stops deserve long stays and which stops are quick checks. If every place includes photos, food, and cafe time, the final part of the day will usually fall behind.

The second mistake is booking accommodation first and forcing the route around it. Check the final stop, next-day departure, and luggage storage before choosing the stay area.

The third mistake is trusting map travel time too literally. On weekends, during peak season, or in rain, queues and ride-hailing time can add 20-30 minutes or more.

## Best Photo Timing and What to Save

Coasts and viewpoints are usually better in the morning or near sunset, while markets and night-view areas work better in the evening. In winter, avoid placing outdoor photo stops too late.

Before leaving, save every stop in Google Maps along with backup restaurants, nearby cafes, and the return route to your stay area.'''
    return f'''## 初めての人がしやすい失敗

よくある失敗は、{join_names(names, locale)}をすべて同じ重要度で見ることです。実際の旅程では、長く滞在する場所と短く確認する場所を分ける必要があります。すべての場所で写真、食事、カフェを入れると、最後の予定が遅れやすくなります。

2つ目は、宿泊先を先に決めてから無理にコースを合わせることです。宿泊エリアは料金だけでなく、最後の予定、翌日の出発地、荷物預かりを一緒に見てください。

3つ目は地図上の移動時間だけを信じることです。週末、繁忙期、雨の日は待ち時間が増えるため、20〜30分の余裕を残すと安心です。

## 写真に向く時間帯と保存しておくもの

海や展望は午前または夕方、市場や夜景は夜の雰囲気が出やすいです。ただし冬は日没が早いため、屋外写真スポットを遅い時間に置きすぎないでください。

出発前にGoogleマップで各スポット、代替の食事候補、近くのカフェ、宿泊先への帰り道を保存しておくと現地で迷いにくくなります。'''

def budget_sentence(meta, locale):
    title = meta["title"]
    if locale == "ko":
        if "2박3일" in title:
            return "식비와 카페, 지역 내 교통, 짧은 택시, 짐 보관까지 포함하면 2박3일은 숙소 제외 1인 15만~28만 원 정도를 기본 범위로 보면 무난합니다."
        if "1박2일" in title:
            return "식비와 카페, 지역 내 교통, 짧은 택시, 짐 보관까지 포함하면 1박2일은 숙소 제외 1인 9만~15만 원 정도를 기본 범위로 보면 무난합니다."
        return "식비와 카페, 지역 내 교통, 짧은 택시, 짐 보관까지 포함하면 당일치기는 1인 5만~9만 원 정도를 기본 범위로 보면 무난합니다."
    if locale == "en":
        lowered = title.lower()
        if "3-day" in lowered or "three" in lowered:
            return "As a practical range, plan about KRW 150,000-280,000 per person for three days excluding accommodation and long-distance transport."
        if "2-day" in lowered or "two" in lowered:
            return "As a practical range, plan about KRW 90,000-150,000 per person for two days excluding accommodation and long-distance transport."
        return "As a practical range, plan about KRW 50,000-90,000 per person for a day trip excluding long-distance transport."
    if "2泊3日" in title:
        return "目安として、2泊3日は宿泊と長距離交通を除いて1人15万〜28万ウォン程度を見ておくと安心です。"
    if "1泊2日" in title:
        return "目安として、1泊2日は宿泊と長距離交通を除いて1人9万〜15万ウォン程度を見ておくと安心です。"
    return "目安として、日帰りは長距離交通を除いて1人5万〜9万ウォン程度を見ておくと安心です。"

def body(key, locale):
    meta = META[key][locale]
    data = DATA[key]
    p = data["photos"]
    closing_photo = closing_photo_key(p)
    map_html = map_block(key, locale)
    cards = route_cards(key, locale)
    checks = place_checklist(key, locale)
    decision = decision_block(key, locale)
    timetable = timetable_block(key, locale)
    cost = cost_block(locale)
    transport = transport_block(key, locale)
    stay_food_weather = stay_food_weather_block(key, locale)
    mistakes = mistakes_block(key, locale)
    budget = budget_sentence(meta, locale)
    link_text = contextual_links(key, locale)
    if locale == "ko":
        return f'''{meta["description"]}

이 글은 검색자가 가장 많이 궁금해하는 이동 순서, 대중교통 가능 여부, 숙소 위치, 예상 비용, 계절별 주의사항을 기준으로 정리했습니다. 단순히 유명한 곳을 나열하지 않고 실제 일정에 넣었을 때 피로도가 적은 순서로 설명합니다.

<div class="article-summary">
  <strong>핵심 요약</strong>
  <ul>
    <li>처음 방문한다면 장소를 많이 넣기보다 권역을 나눠 이동 시간을 줄이는 것이 중요합니다.</li>
    <li>숙소나 도착 지점은 첫 일정과 마지막 일정 사이의 이동 시간을 기준으로 고르는 편이 안전합니다.</li>
    <li>성수기, 우천, 야간 이동 여부에 따라 택시와 대중교통을 섞을지 미리 정해야 합니다.</li>
  </ul>
</div>

{decision}

## 추천 동선 한눈에 보기

{map_html}

{cards}

{checks}

{timetable}

## 사람들이 가장 궁금해하는 포인트

가장 먼저 확인할 것은 “하루에 가능한가”가 아니라 “어느 구간에서 시간이 새는가”입니다. 역이나 터미널에서 첫 목적지까지 멀고, 중간에 식사 대기가 생기면 일정 만족도가 떨어집니다.

마지막 장소에서 다시 숙소나 역으로 돌아오는 시간도 중요합니다. 그래서 이 코스는 시작 지점, 사진을 찍는 구간, 식사나 휴식 구간, 귀가 전 마지막 구간을 분리해 잡는 방식이 좋습니다.

{photo_figure(p[1], locale)}

## 시간대별로 짜는 방법

오전에는 이동이 길거나 사람이 몰리기 쉬운 장소를 먼저 넣는 편이 좋습니다. 점심 이후에는 걷기 좋은 구간과 실내 대체지를 함께 생각해두면 날씨 변화에 대응하기 쉽습니다.

저녁 일정이 있다면 야경이나 시장처럼 체류 시간이 자연스럽게 길어지는 장소를 마지막에 두는 것이 안정적입니다.

{link_text}

{photo_figure(p[2], locale)}

{transport}

## 교통, 숙소 위치, 예상 비용

뚜벅이 여행이라면 역과 터미널에서 첫 목적지까지의 시간을 먼저 확인하세요. 버스로 한 번에 이동할 수 있어도 배차 간격이 길면 실제 체감 시간은 크게 늘어납니다.

숙소는 가장 늦게 끝나는 일정 근처에 잡거나, 다음 날 출발지로 돌아가기 쉬운 곳을 고르는 편이 좋습니다. {budget}

{cost}

{photo_figure(p[3], locale)}

{stay_food_weather}

{photo_figure(closing_photo, locale)}

## 계절별 주의사항

여름에는 해변과 야외 이동 시간이 길어져 체력 소모가 큽니다. 우산보다 가벼운 우비와 여분 양말이 더 유용할 때가 많습니다.

겨울에는 해가 짧아 사진을 찍을 수 있는 시간이 줄어드니 야외 명소를 앞쪽에 두세요. 연휴와 주말에는 식당 대기, 주차, 택시 호출 시간이 길어질 수 있으므로 Google Maps에서 장소별 위치를 미리 저장해두는 것을 추천합니다.

{mistakes}

## 자주 묻는 질문

### 이 코스는 처음 가는 사람에게도 괜찮나요?
네. 처음 방문하는 사람이 길을 헤매기 쉬운 구간을 줄이고, 이동 순서를 단순하게 만드는 데 초점을 맞췄습니다.

### 렌터카가 꼭 필요한가요?
대부분의 도심형 코스는 대중교통과 짧은 택시 조합으로 가능합니다. 다만 섬, 산, 외곽 해변이 포함되면 배차 간격과 마지막 차 시간을 먼저 확인해야 합니다.

### 숙소는 어느 기준으로 고르면 좋나요?
가장 늦게 끝나는 일정과 다음 날 출발지를 기준으로 고르는 편이 좋습니다. 가격이 조금 저렴해도 밤에 돌아오기 어렵거나 짐 이동이 불편하면 전체 만족도가 떨어질 수 있습니다.

### 비가 오면 일정을 그대로 진행해도 되나요?
야외 사진과 해변, 전망 위주의 일정은 과감히 줄이는 것이 좋습니다. 시장, 실내 전시, 카페, 짧은 택시 이동을 섞어 핵심 장소만 남기면 실패 확률이 낮아집니다.
'''
    if locale == "en":
        return f'''{meta["description"]}

This guide is written around the questions travelers usually search before booking: route order, public transport, where to stay, realistic costs, food timing, and what to check when the weather changes. It avoids a simple list of famous places and focuses on how the trip actually works on the ground.

<div class="article-summary">
  <strong>Key takeaways</strong>
  <ul>
    <li>Group nearby stops together instead of trying to cover every famous place in one day.</li>
    <li>Choose your stay area by the longest movement of the trip, not by the cheapest room alone.</li>
    <li>Check opening hours, bus intervals, sunset time, and rain alternatives before finalizing the route.</li>
  </ul>
</div>

{decision}

## Route Overview With Google Maps

{map_html}

{cards}

{checks}

{timetable}

## What Travelers Usually Want to Know

The most important question is not only whether the route is possible. It is where time gets lost. Long station transfers, meal queues, luggage storage, and the return trip often decide whether the itinerary feels smooth or exhausting.

This route separates arrival, photo time, food breaks, and the final stop so you can adjust it without rebuilding the whole plan.

{photo_figure(p[1], locale)}

## How to Plan the Day

Put the longest or most crowded stop early in the day. Keep flexible time after lunch for cafes, indoor alternatives, or a slower walk.

If the route includes night views, markets, or the coast, place them near the end so you are not forced to cross the city after dark.

{link_text}

{photo_figure(p[2], locale)}

{transport}

## Transport, Stay Area, and Budget

For travelers without a car, check the time from the station or terminal to the first stop before anything else. A route may look close on the map but feel slow when buses are infrequent.

For accommodation, choose an area near the last evening stop or the next morning departure point. {budget}

{cost}

{photo_figure(p[3], locale)}

{stay_food_weather}

{photo_figure(closing_photo, locale)}

## Seasonal Notes

In summer, outdoor routes feel longer because of heat and crowds. In winter, sunset comes early, so outdoor photo stops should be placed earlier.

On weekends and holidays, restaurant queues and taxi waits can change the route. Save each stop in Google Maps before leaving so you can adjust quickly.

{mistakes}

## FAQ

### Is this route suitable for first-time visitors?
Yes. It is designed to reduce backtracking and keep the order easy to follow.

### Do I need a rental car?
Most city routes work with public transport and short taxi rides. For islands, mountains, and outer beaches, check the last bus or ferry first.

### Where should I stay for this itinerary?
Choose the stay area by the final evening stop and the next morning departure point. A cheaper room can become inconvenient if the late-night return or luggage movement is difficult.

### What should I change on a rainy day?
Reduce photo-heavy outdoor stops and keep only the most important places. Add markets, indoor exhibits, cafes, and short taxi rides so the day still works.
'''
    return f'''{meta["description"]}

この記事は、旅行者が予約前に知りたい移動順、公共交通、宿泊エリア、費用、食事のタイミング、天気が悪い時の確認ポイントを中心に整理しています。有名スポットの一覧ではなく、実際に歩いた時に無理が出にくい順番を重視します。

<div class="article-summary">
  <strong>要点</strong>
  <ul>
    <li>有名スポットを詰め込みすぎず、近い場所をまとめて移動時間を減らします。</li>
    <li>宿泊エリアは料金だけでなく、最後の予定と翌日の出発地から選ぶと失敗しにくいです。</li>
    <li>営業時間、バスの間隔、日没時間、雨の日の代案を事前に確認しておくと安心です。</li>
  </ul>
</div>

{decision}

## Googleマップで見るルート概要

{map_html}

{cards}

{checks}

{timetable}

## 旅行者が知りたいポイント

大切なのは「行けるかどうか」だけではありません。駅から最初の目的地までの移動、食事の待ち時間、荷物預かり、最後に戻る時間で満足度が変わります。

このルートでは、到着、写真、食事、最後の目的地を分けて考え、予定を調整しやすくしています。

{photo_figure(p[1], locale)}

## 時間帯ごとの考え方

午前中は移動が長い場所や混みやすい場所を先に入れると楽です。昼食後はカフェ、屋内スポット、短い散歩を組み合わせると天気に対応しやすくなります。

夜景や市場を入れる場合は、最後に置くと移動が単純になります。

{link_text}

{photo_figure(p[2], locale)}

{transport}

## 交通・宿泊エリア・予算

車なしで動く場合は、駅やターミナルから最初の目的地までの時間を先に確認してください。地図上で近く見えても、バスの本数が少ないと体感時間は長くなります。

宿泊は夜の予定に近い場所、または翌朝出発しやすい場所がおすすめです。{budget}

{cost}

{photo_figure(p[3], locale)}

{stay_food_weather}

{photo_figure(closing_photo, locale)}

## 季節別の注意点

夏は暑さと混雑で屋外移動が長く感じます。冬は日没が早いので、写真を撮りたい屋外スポットを前半に置くのがおすすめです。

週末や連休は食事の待ち時間、タクシー待ち、交通渋滞が増えるため、Googleマップで各スポットを保存しておくと変更しやすくなります。

{mistakes}

## よくある質問

### 初めての韓国旅行でも使いやすいですか？
はい。移動の戻りを減らし、初めてでも順番を追いやすいように構成しています。

### レンタカーは必要ですか？
都市型のコースは公共交通と短距離タクシーで十分な場合が多いです。島、山、郊外の海辺を入れる時は最終バスや船便を先に確認してください。

### 宿泊エリアはどう選べばいいですか？
最後の予定と翌朝の出発地を基準に選ぶのがおすすめです。安い宿でも、夜の帰り道や荷物移動が不便だと全体の満足度が下がります。

### 雨の日はどう変更すればいいですか？
屋外写真や海辺、展望中心の予定を減らし、重要な場所だけ残してください。市場、屋内展示、カフェ、短距離タクシーを組み合わせると無理が少なくなります。
'''

def rebuild_file(path):
    text = path.read_text(encoding="utf-8")
    fm, _ = parse_frontmatter(text)
    locale = field(fm, "locale") or "ko"
    key = field(fm, "translationKey")
    if not key:
        base = path.name.replace("-en.md", "").replace("-ja.md", "").replace(".md", "")
        key = KEY_FROM_FILE[base]
    data = DATA[key]
    title = field(fm, "title")
    description = field(fm, "description")
    category = field(fm, "category")
    region = field(fm, "region")
    tags = array_field(fm, "tags")
    published = field(fm, "publishedAt")
    updated = field(fm, "updatedAt")
    region_slug = field(fm, "regionSlug")
    url_slug = field(fm, "urlSlug")
    hero_src, hero_alt, hero_credit = PHOTO[data["photos"][0]]
    META[key][locale] = {
        "title": title,
        "description": description,
        "regionSlug": region_slug,
        "urlSlug": url_slug,
    }
    new_fm = [
        f'title: "{quote(title)}"',
        f'description: "{quote(description)}"',
        f'category: "{quote(category)}"',
        f'region: "{quote(region)}"',
        f'locale: "{locale}"',
        f'translationKey: "{key}"',
        f'regionSlug: "{region_slug}"',
        f'urlSlug: "{url_slug}"',
        f'tags: [{", ".join(fchr(t) for t in tags)}]',
        f'publishedAt: "{published}"',
        f'updatedAt: "{updated}"',
        f'heroImage: "{hero_src}"',
        f'imageAlt: "{quote(hero_alt if locale == "ko" else title + " main image")}"',
        f'imageCredit: "{hero_credit}"',
        "draft: false",
    ]
    path.write_text(f"---\n{chr(10).join(new_fm)}\n---\n\n{body(key, locale).strip()}\n", encoding="utf-8")

def fchr(value):
    return f'"{quote(value)}"'

META = {key: {} for key in DATA}

files = sorted(CONTENT_DIR.glob("*.md"))
for path in files:
    fm, _ = parse_frontmatter(path.read_text(encoding="utf-8"))
    key = field(fm, "translationKey")
    if key:
        META[key][field(fm, "locale") or "ko"] = {
            "title": field(fm, "title"),
            "description": field(fm, "description"),
            "regionSlug": field(fm, "regionSlug"),
            "urlSlug": field(fm, "urlSlug"),
        }

for path in files:
    rebuild_file(path)
