import re
from pathlib import Path

from PIL import Image, ImageEnhance


ROOT = Path.cwd()
PUBLIC = ROOT / "public"
CONTENT = ROOT / "src" / "content" / "travel"
WIDTHS = [160, 240, 320, 330, 360, 480, 520, 640, 680, 768, 960, 1200]


REPLACEMENTS = {
    "gangneung-sea-coffee-day-trip": {
        "/images/generated/gangneung-coffee-street-generated.jpg": "/images/generated/unique/gangneung-coffee-street-generated-gangneung-sea-coffee-day-trip-2.jpg",
        "/images/generated/unique/gangneung-coffee-street-generated-gangneung-sea-coffee-day-trip-1.jpg": "/images/generated/unique/gangneung-coffee-street-generated-gangneung-sea-coffee-day-trip-3.jpg",
    },
    "gangneung-two-day-route": {
        "/images/generated/gangneung-coffee-street-generated.jpg": "/images/generated/unique/gangneung-coffee-street-generated-gangneung-two-day-route-1.jpg",
    },
    "gyeongju-family-trip-guide": {
        "/images/generated/unique/gyeongju-history-walk-generated-gyeongju-family-trip-guide-1.jpg": "/images/generated/unique/gyeongju-history-walk-generated-gyeongju-family-trip-guide-2.jpg",
    },
    "jeju-without-car-guide": {
        "/images/generated/unique/jeju-east-coast-route-generated-jeju-without-car-guide-1.jpg": "/images/generated/unique/jeju-east-coast-route-generated-jeju-without-car-guide-2.jpg",
    },
    "seoul-hangang-night-walk": {
        "/images/generated/unique/seoul-hangang-evening-generated-seoul-hangang-night-walk-1.jpg": "/images/generated/unique/seoul-hangang-evening-generated-seoul-hangang-night-walk-2.jpg",
    },
    "tongyeong-sea-view-route": {
        "/images/generated/unique/tongyeong-island-view-generated-tongyeong-sea-view-route-1.jpg": "/images/generated/unique/tongyeong-island-view-generated-tongyeong-sea-view-route-2.jpg",
    },
}


def field(frontmatter: str, name: str) -> str:
    match = re.search(rf"^{re.escape(name)}:\s*[\"']?([^\"'\r\n]+)", frontmatter, re.M)
    return match.group(1).strip() if match else ""


def fm(text: str) -> str:
    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---", text)
    return match.group(1) if match else ""


def to_public(image_path: str) -> Path:
    return PUBLIC / image_path.lstrip("/").replace("/", "\\")


def optimized_srcset(image_path: str) -> str:
    stem = Path(image_path).stem
    return ", ".join(
        f"/images/optimized/generated/unique/{stem}-{width}.webp {width}w" for width in WIDTHS
    )


def create_variant(source_path: str, target_path: str) -> None:
    source = to_public(source_path)
    target = to_public(target_path)
    if target.exists():
        return
    if not source.exists():
        source = to_public(source_path.replace("/images/generated/unique/", "/images/generated/"))
    if not source.exists():
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    optimized_dir = PUBLIC / "images" / "optimized" / "generated" / "unique"
    optimized_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as img:
        img = img.convert("RGB")
        img = img.crop((18, 12, img.width - 18, img.height - 12))
        img = ImageEnhance.Contrast(img).enhance(1.04)
        img = ImageEnhance.Color(img).enhance(0.97)
        img = img.resize((1200, max(1, round(img.height * 1200 / img.width))), Image.Resampling.LANCZOS)
        img.save(target, "JPEG", quality=84, optimize=True, progressive=True)
        for width in WIDTHS:
            out = optimized_dir / f"{target.stem}-{width}.webp"
            if out.exists():
                continue
            resized = img.copy()
            if resized.width > width:
                resized = resized.resize((width, max(1, round(resized.height * width / resized.width))), Image.Resampling.LANCZOS)
            resized.save(out, "WEBP", quality=76, method=6)


def replace_img_srcs(text: str, old: str, new: str) -> str:
    def repl(match: re.Match) -> str:
        tag = match.group(0)
        if f'src="{old}"' not in tag and f"src='{old}'" not in tag:
            return tag
        tag = tag.replace(f'src="{old}"', f'src="{new}"').replace(f"src='{old}'", f"src='{new}'")
        return tag
    return re.sub(r"<img\b[^>]*>", repl, text)


def repair_sources(text: str) -> str:
    def repl(match: re.Match) -> str:
        block = match.group(0)
        img = re.search(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"']", block)
        if not img:
            return block
        image = img.group(1)
        if not image.startswith("/images/generated/unique/"):
            return block
        source = f'<source type="image/webp" srcset="{optimized_srcset(image)}" sizes="(max-width: 860px) calc(100vw - 36px), 792px" />'
        if re.search(r"<source\b[^>]*>", block):
            return re.sub(r"<source\b[^>]*>", source, block, count=1)
        return block.replace("<picture>", f"<picture>\n    {source}", 1)
    return re.sub(r"<picture>[\s\S]*?</picture>", repl, text)


def remove_stray_paths(text: str) -> str:
    cleaned_lines = []
    for line in text.splitlines():
        if "/images/generated/unique/" in line and all(token not in line for token in ["heroImage:", "src=", "srcset="]):
            line = re.sub(r"/images/generated/unique/[A-Za-z0-9_./-]+\.jpg", "", line)
        cleaned_lines.append(line)
    return "\n".join(cleaned_lines) + ("\n" if text.endswith("\n") else "")


def main():
    changed = 0
    for file_path in sorted(CONTENT.glob("*.md")):
        text = file_path.read_text(encoding="utf-8")
        key = field(fm(text), "translationKey")
        updated = remove_stray_paths(text)
        replacements = REPLACEMENTS.get(key, {})
        hero = field(fm(updated), "heroImage")
        for old, new in replacements.items():
            if old == hero:
                # Preserve the hero image and only split body image duplicates.
                create_variant(old, new)
                updated = replace_img_srcs(updated, old, new)
            else:
                create_variant(old, new)
                updated = updated.replace(old, new)
        updated = repair_sources(updated)
        if updated != text:
            file_path.write_text(updated, encoding="utf-8", newline="")
            changed += 1
    print(f"finalized_files={changed}")


if __name__ == "__main__":
    main()
