import re
from pathlib import Path


ROOT = Path.cwd()
CONTENT_DIR = ROOT / "src" / "content" / "travel"
WIDTHS = [160, 240, 320, 330, 360, 480, 520, 640, 680, 768, 960, 1200]


def optimized_srcset(image_path: str) -> str:
    path = Path(image_path)
    stem = path.stem
    if image_path.startswith("/images/generated/unique/"):
        base = "/images/optimized/generated/unique"
    elif image_path.startswith("/images/generated/"):
        base = "/images/optimized/generated"
    elif image_path.startswith("/images/kto/"):
        base = "/images/optimized/kto"
    elif image_path.startswith("/images/myrealtrip/"):
        base = "/images/optimized/myrealtrip"
    else:
        base = "/images/optimized/generated"
    return ", ".join(f"{base}/{stem}-{width}.webp {width}w" for width in WIDTHS)


def credit_for(image_path: str) -> str:
    if image_path.startswith("/images/kto/"):
        return "ⓒ한국관광공사 포토코리아"
    if image_path.startswith("/images/myrealtrip/"):
        return "ⓒmyrealtrip"
    return "ⓒ한국플레이리스트 이미지 2.0"


def alt_for(file_path: Path, image_path: str) -> str:
    slug = file_path.stem.replace("-en", "").replace("-ja", "").replace("-", " ")
    subject = Path(image_path).stem.replace("-", " ")
    return f"{slug} travel guide image - {subject}"


def image_from_block(block: str):
    src_match = re.search(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"']", block)
    if src_match:
        return src_match.group(1)
    any_match = re.search(r"(/images/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp))", block)
    if any_match:
        image = any_match.group(1)
        image = re.sub(r"/images/optimized/(generated/unique|generated|kto|myrealtrip)/", r"/images/\1/", image)
        image = re.sub(r"-\d+\.webp$", ".jpg", image)
        return image
    return None


def rebuild_figure(file_path: Path, block: str) -> str:
    image = image_from_block(block)
    if not image:
        return block
    alt = alt_for(file_path, image)
    return f'''<figure class="content-photo">
  <picture>
    <source type="image/webp" srcset="{optimized_srcset(image)}" sizes="(max-width: 860px) calc(100vw - 36px), 792px" />
    <img src="{image}" alt="{alt}" width="1200" height="800" loading="lazy" decoding="async" sizes="(max-width: 860px) calc(100vw - 36px), 792px" />
  </picture>
  <figcaption>{credit_for(image)}</figcaption>
</figure>'''


def main():
    changed = 0
    for file_path in sorted(CONTENT_DIR.glob("*.md")):
        text = file_path.read_text(encoding="utf-8")
        updated = re.sub(
            r"<figure class=\"content-photo\">[\s\S]*?</figure>",
            lambda match: rebuild_figure(file_path, match.group(0)),
            text,
        )
        if updated != text:
            file_path.write_text(updated, encoding="utf-8", newline="")
            changed += 1
    print(f"repaired_files={changed}")


if __name__ == "__main__":
    main()
