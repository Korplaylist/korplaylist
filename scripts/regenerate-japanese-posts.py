from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "src" / "content" / "travel"

PLAN = [
    ("korea-season-travel-calendar.md", "seasonal-korea-travel-calendar-2026", "seoul", "ソウル", "季節旅行"),
    ("seoul-one-day-palace-walk.md", "seoul-one-day-palace-walk", "seoul", "ソウル", "モデルコース"),
    ("seoul-hangang-evening.md", "seoul-hangang-night-walk", "seoul", "ソウル", "季節旅行"),
    ("busan-two-day-route.md", "busan-two-day-route", "busan", "釜山", "モデルコース"),
    ("busan-market-food.md", "busan-market-food-route", "busan", "釜山", "グルメ"),
    ("jeju-three-day-first.md", "jeju-three-day-first-trip", "jeju", "済州", "モデルコース"),
    ("jeju-without-car.md", "jeju-without-car-guide", "jeju", "済州", "交通準備"),
    ("gangneung-sea-coffee.md", "gangneung-sea-coffee-day-trip", "gangwon", "江陵", "モデルコース"),
    ("gangneung-two-day.md", "gangneung-two-day-route", "gangwon", "江陵", "モデルコース"),
    ("sokcho-seoraksan-market.md", "sokcho-seoraksan-market-route", "gangwon", "束草", "観光地"),
    ("sokcho-without-car.md", "sokcho-without-car-guide", "gangwon", "束草", "交通準備"),
    ("jeonju-hanok-day.md", "jeonju-hanok-village-day-trip", "jeonbuk", "全州", "モデルコース"),
    ("jeonju-food-cost.md", "jeonju-food-budget-guide", "jeonbuk", "全州", "グルメ"),
    ("gyeongju-history-two-day.md", "gyeongju-history-two-day-route", "gyeongbuk", "慶州", "モデルコース"),
    ("gyeongju-family.md", "gyeongju-family-trip-guide", "gyeongbuk", "慶州", "観光地"),
    ("yeosu-night-sea.md", "yeosu-night-sea-route", "jeonnam", "麗水", "季節旅行"),
    ("yeosu-island-day.md", "yeosu-island-day-trip", "jeonnam", "麗水", "モデルコース"),
    ("tongyeong-two-day.md", "tongyeong-two-day-island-route", "gyeongnam", "統営", "モデルコース"),
    ("tongyeong-island-view.md", "tongyeong-sea-view-route", "gyeongnam", "統営", "観光地"),
    ("chuncheon-lake-day.md", "chuncheon-lake-day-trip", "gangwon", "春川", "モデルコース"),
    ("incheon-open-port.md", "incheon-open-port-day-trip", "incheon", "仁川", "モデルコース"),
    ("daegu-modern-street.md", "daegu-modern-street-half-day", "daegu", "大邱", "観光地"),
]

TITLES = {
    "seasonal-korea-travel-calendar-2026": ("2026年の韓国旅行はいつ行く？季節別おすすめ旅行先と準備ポイント", "春の花、夏の海、秋の紅葉、冬の旅行まで、韓国旅行の時期選び、費用、天気確認、予約タイミングを整理します。"),
    "seoul-one-day-palace-walk": ("ソウル日帰り徒歩コース：景福宮・北村・仁寺洞を歩く1日旅", "初めてのソウル旅行で景福宮、北村韓屋村、仁寺洞を無理なく歩くための移動、写真、食事、時間配分を整理します。"),
    "seoul-hangang-night-walk": ("ソウル漢江夜景コース：汝矣島・盤浦の夕方散歩と準備物", "漢江の夜景を楽しむために、汝矣島、盤浦大橋、夕方の移動、ピクニック、夜の持ち物を整理します。"),
    "busan-two-day-route": ("釜山1泊2日モデルコース2026：海雲台・広安里・甘川文化村の失敗しにくい動線", "初めての釜山旅行で海雲台、広安里、甘川文化村、南浦洞を無理なく回る日程、宿泊エリア、交通、予算を整理します。"),
    "busan-market-food-route": ("釜山グルメ市場コース2026：チャガルチ市場から国際市場までの1日動線", "チャガルチ市場、国際市場、富平カントン市場を中心に、釜山の市場グルメ、予算、移動順、滞在時間を整理します。"),
    "jeju-three-day-first-trip": ("済州2泊3日モデルコース2026：初めてなら東側・西側をこう分ける", "初めての済州旅行で東側と西側を分ける考え方、レンタカー、宿泊エリア、海岸ルート、天気対策を整理します。"),
    "jeju-without-car-guide": ("レンタカーなしで済州旅行はできる？バス・タクシー・ツアーの組み合わせガイド", "レンタカーなしで済州を旅する時のバス、タクシー、現地ツアー、宿泊エリア、費用、移動の限界を整理します。"),
    "gangneung-sea-coffee-day-trip": ("江陵日帰り旅行コース2026：海・コーヒー通り・鏡浦湖を効率よく回る", "江陵駅から安木海岸、コーヒー通り、鏡浦湖をつなぐ日帰りルート、交通、食事、天気別の代案を整理します。"),
    "gangneung-two-day-route": ("江陵1泊2日モデルコース：海・烏竹軒・注文津をゆっくり見る方法", "江陵の海、烏竹軒、注文津を1泊2日で回る現実的な日程、宿泊エリア、食事、移動の注意点を整理します。"),
    "sokcho-seoraksan-market-route": ("束草旅行コース：雪岳山の短い散策と中央市場グルメの1日旅", "雪岳山、海、束草中央市場を1日で回るための移動、徒歩時間、食事、訪問前チェックを整理します。"),
    "sokcho-without-car-guide": ("車なし束草旅行ガイド：バスだけで海・市場・雪岳山へ行く方法", "車なしで束草を旅するためのバス、ターミナル移動、海、市場、雪岳山アクセス、費用、注意点を整理します。"),
    "jeonju-hanok-village-day-trip": ("全州韓屋村日帰りコース：慶基殿・南部市場まで回る1日旅", "全州韓屋村、慶基殿、南部市場を1日で回るための順番、食事、徒歩時間、帰りの交通を整理します。"),
    "jeonju-food-budget-guide": ("全州グルメ旅行予算：ビビンバ・豆もやしクッパ・市場おやつの費用整理", "全州のビビンバ、豆もやしクッパ、市場グルメ、カフェ休憩、1日の食費目安を旅行動線と一緒に整理します。"),
    "gyeongju-history-two-day-route": ("慶州1泊2日歴史旅行コース：大陵苑・瞻星台・仏国寺まで整理", "慶州の大陵苑、瞻星台、東宮と月池、仏国寺を1泊2日で回る日程、宿泊エリア、交通を整理します。"),
    "gyeongju-family-trip-guide": ("慶州家族旅行コース：子どもと行きやすい遺跡・博物館・散歩道", "子ども連れで行きやすい慶州の遺跡、博物館、散歩道、休憩場所、無理のない日程を整理します。"),
    "yeosu-night-sea-route": ("麗水夜の海旅行コース2026：海上ケーブルカー・浪漫屋台・梧桐島の動線", "麗水の夜景、海上ケーブルカー、浪漫屋台、梧桐島、宿泊エリア、時間配分、天気の注意点を整理します。"),
    "yeosu-island-day-trip": ("麗水島旅行日帰りガイド：船便・天気・時刻表のチェックポイント", "麗水の島旅で確認したい船便、天気、日帰り時間、代替案、乗船前の準備を整理します。"),
    "tongyeong-two-day-island-route": ("統営1泊2日モデルコース：島旅と市内名所を一緒に楽しむ日程", "統営の島旅、ケーブルカー、東ピラン、江口岸、海鮮、宿泊エリア、船便確認を1泊2日で整理します。"),
    "tongyeong-sea-view-route": ("統営の海景色旅行コース：東ピラン・ケーブルカー・江口岸の核心動線", "東ピラン村、統営ケーブルカー、江口岸をつなぐ海景色ルート、写真、徒歩時間、食事を整理します。"),
    "chuncheon-lake-day-trip": ("春川日帰り旅行コース：ITXで湖とタッカルビを楽しむ1日旅", "ITXで行く春川の日帰り旅行として、湖畔散歩、タッカルビ、駅からの移動、食事時間、帰りの流れを整理します。"),
    "incheon-open-port-day-trip": ("仁川日帰りコース：開港場・チャイナタウン・月尾島を巡る首都圏旅行", "仁川開港場、チャイナタウン、月尾島をソウル近郊日帰りで回る順番、写真、食事、地下鉄移動を整理します。"),
    "daegu-modern-street-half-day": ("大邱都心旅行コース：近代路地・桂山聖堂・金光石通りの半日動線", "大邱の近代路地、桂山聖堂、金光石通りを半日で歩く順番、カフェ、交通を整理します。"),
}

SUPPORTS = {
    "seasonal-korea-travel-calendar-2026": ["busan-two-day-route", "jeju-three-day-first-trip", "gangneung-sea-coffee-day-trip"],
    "seoul-one-day-palace-walk": ["seoul-hangang-night-walk", "incheon-open-port-day-trip", "seasonal-korea-travel-calendar-2026"],
    "seoul-hangang-night-walk": ["seoul-one-day-palace-walk", "seasonal-korea-travel-calendar-2026", "incheon-open-port-day-trip"],
    "busan-two-day-route": ["busan-market-food-route", "yeosu-night-sea-route", "gangneung-two-day-route"],
    "busan-market-food-route": ["busan-two-day-route", "jeonju-food-budget-guide", "chuncheon-lake-day-trip"],
    "jeju-three-day-first-trip": ["jeju-without-car-guide", "seasonal-korea-travel-calendar-2026", "yeosu-island-day-trip"],
    "jeju-without-car-guide": ["jeju-three-day-first-trip", "sokcho-without-car-guide", "seasonal-korea-travel-calendar-2026"],
    "gangneung-sea-coffee-day-trip": ["gangneung-two-day-route", "sokcho-seoraksan-market-route", "seasonal-korea-travel-calendar-2026"],
    "gangneung-two-day-route": ["gangneung-sea-coffee-day-trip", "sokcho-without-car-guide", "busan-two-day-route"],
    "sokcho-seoraksan-market-route": ["sokcho-without-car-guide", "gangneung-sea-coffee-day-trip", "chuncheon-lake-day-trip"],
    "sokcho-without-car-guide": ["sokcho-seoraksan-market-route", "jeju-without-car-guide", "gangneung-two-day-route"],
    "jeonju-hanok-village-day-trip": ["jeonju-food-budget-guide", "gyeongju-history-two-day-route", "seoul-one-day-palace-walk"],
    "jeonju-food-budget-guide": ["jeonju-hanok-village-day-trip", "busan-market-food-route", "gyeongju-family-trip-guide"],
    "gyeongju-history-two-day-route": ["gyeongju-family-trip-guide", "jeonju-hanok-village-day-trip", "tongyeong-two-day-island-route"],
    "gyeongju-family-trip-guide": ["gyeongju-history-two-day-route", "jeonju-food-budget-guide", "tongyeong-sea-view-route"],
    "yeosu-night-sea-route": ["yeosu-island-day-trip", "busan-two-day-route", "tongyeong-two-day-island-route"],
    "yeosu-island-day-trip": ["yeosu-night-sea-route", "jeju-three-day-first-trip", "tongyeong-sea-view-route"],
    "tongyeong-two-day-island-route": ["tongyeong-sea-view-route", "yeosu-island-day-trip", "gyeongju-history-two-day-route"],
    "tongyeong-sea-view-route": ["tongyeong-two-day-island-route", "yeosu-night-sea-route", "gyeongju-family-trip-guide"],
    "chuncheon-lake-day-trip": ["sokcho-seoraksan-market-route", "seoul-hangang-night-walk", "gangneung-sea-coffee-day-trip"],
    "incheon-open-port-day-trip": ["seoul-one-day-palace-walk", "seoul-hangang-night-walk", "daegu-modern-street-half-day"],
    "daegu-modern-street-half-day": ["incheon-open-port-day-trip", "gyeongju-history-two-day-route", "jeonju-hanok-village-day-trip"],
}

META = {}
for index, (file_name, key, region_slug, region, category) in enumerate(PLAN):
    source = (CONTENT_DIR / file_name).read_text(encoding="utf-8")
    fm = source.split("---", 2)[1]
    hero = fm.split('heroImage: "')[1].split('"')[0]
    image_credit = fm.split('imageCredit: "')[1].split('"')[0] if 'imageCredit: "' in fm else ""
    url_slug = file_name.removesuffix(".md")
    date = f"2026-05-{15 + index:02d}" if index < 17 else f"2026-06-{index - 16:02d}"
    META[key] = {
        "region_slug": region_slug,
        "region": region,
        "category": category,
        "hero": hero,
        "image_credit": image_credit,
        "url_slug": url_slug,
        "date": date,
    }


def quote(value: str) -> str:
    return value.replace('"', '\\"')


def link(key: str) -> str:
    target = META[key]
    title = TITLES[key][0]
    return f"[{title}](/ja/travel/{target['region_slug']}/{target['url_slug']}/)"


def body(key: str, description: str) -> str:
    meta = META[key]
    links = [link(target) for target in SUPPORTS[key]]
    return f"""{description}

<div class="article-summary">
  <strong>計画のポイント</strong>
  <ul>
    <li>{meta['region']}旅行、{meta['category']}、移動順、交通、費用、宿泊エリアを調べる人向けに整理した記事です。</li>
    <li>まずこのページで全体像をつかみ、下の関連記事でグルメ、交通、季節、近隣都市の情報を補足できます。</li>
    <li>訪問前には公式の営業時間、交通情報、天気、予約条件を必ず確認してください。</li>
  </ul>
</div>

## 旅行計画と検索意図

{meta['region']}を検索する旅行者は、行くべき場所の一覧だけでなく、どこから始めるか、何時間必要か、どのエリアに泊まると楽かを知りたい場合が多いです。このガイドでは、実際に動きやすい順番を優先して整理します。

内部リンクとしては、{"、".join(links)} もあわせて確認すると、食事、交通、季節、周辺都市まで一続きで計画しやすくなります。

## おすすめの組み立て方

日帰り、1泊2日、2泊3日のどれにするかを先に決めます。その後、移動が長くなりすぎない宿泊エリアや到着駅を選ぶと失敗しにくくなります。初めてなら、有名スポットを詰め込みすぎず、天気や食事のための余白を残すのがおすすめです。

## 費用・交通・宿泊エリア

費用は交通、食事、有料体験、カフェ休憩で変わります。荷物預かり、短距離タクシー、天候による予定変更も考えておくと安心です。坂道、島、海、山が含まれる場合は、帰りの交通時間を先に確認してください。

## 次に読む関連記事

{chr(10).join(f"- {item}" for item in links)}

## よくある質問

### 初めての韓国旅行でも使いやすいルートですか？
はい。観光地の一覧ではなく、移動しやすい順番と確認ポイントを中心に整理しています。

### 宿泊エリアは先に決めてもいいですか？
先に大まかなルートを決めてから、一番長い移動を短くできるエリアを選ぶと失敗しにくいです。

### 出発前に何を確認すべきですか？
営業時間、交通時刻、天気、荷物預かり、予約条件を公式サイトや予約ページで確認してください。
"""


for key, meta in META.items():
    title, description = TITLES[key]
    frontmatter = [
        f'title: "{quote(title)}"',
        f'description: "{quote(description)}"',
        f'category: "{quote(meta["category"])}"',
        f'region: "{quote(meta["region"])}"',
        'locale: "ja"',
        f'translationKey: "{key}"',
        f'regionSlug: "{meta["region_slug"]}"',
        f'urlSlug: "{meta["url_slug"]}"',
        f'tags: ["{quote(meta["region"])}", "{quote(meta["category"])}", "韓国旅行", "{meta["url_slug"].split("-")[0]}"]',
        f'publishedAt: "{meta["date"]}"',
        f'updatedAt: "{meta["date"]}"',
        f'heroImage: "{quote(meta["hero"])}"',
        f'imageAlt: "{quote(title)} メイン画像"',
    ]
    if meta["image_credit"]:
        frontmatter.append(f'imageCredit: "{quote(meta["image_credit"])}"')
    frontmatter.append("draft: false")

    output = f"---\n{chr(10).join(frontmatter)}\n---\n\n{body(key, description).strip()}\n"
    (CONTENT_DIR / f"{meta['url_slug']}-ja.md").write_text(output, encoding="utf-8")
