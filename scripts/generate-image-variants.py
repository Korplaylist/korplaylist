from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIRS = [
    ROOT / "public" / "images" / "kto",
    ROOT / "public" / "images" / "myrealtrip",
]
OUTPUT_ROOT = ROOT / "public" / "images" / "optimized"
WIDTHS = (160, 240, 320, 330, 360, 480, 520, 640, 680, 768, 960, 1200)
BRAND_IMAGES = [
    (ROOT / "public" / "brand" / "korplaylist-logo-38.png", 38),
    (ROOT / "public" / "brand" / "korplaylist-logo.png", 76),
    (ROOT / "public" / "brand" / "apple-touch-icon.png", 180),
]


def save_variant(source: Path, output_dir: Path, width: int) -> None:
    with Image.open(source) as image:
        image = image.convert("RGB")
        target_width = min(width, image.width)
        target_height = round(image.height * target_width / image.width)
        resized = image if target_width == image.width else image.resize((target_width, target_height), Image.Resampling.LANCZOS)
        output = output_dir / f"{source.stem}-{width}.webp"
        resized.save(output, "WEBP", quality=62, method=6)


def main() -> None:
    total = 0
    for source_dir in SOURCE_DIRS:
        if not source_dir.exists():
            continue
        output_dir = OUTPUT_ROOT / source_dir.name
        output_dir.mkdir(parents=True, exist_ok=True)
        for source in sorted(source_dir.glob("*.jpg")):
            for width in WIDTHS:
                save_variant(source, output_dir, width)
                total += 1
    logo_source = ROOT / "public" / "brand" / "korplaylist-logo.png"
    for source, size in BRAND_IMAGES:
        input_source = source if source.exists() else logo_source
        if not input_source.exists():
            continue
        with Image.open(input_source) as image:
            image = image.convert("RGBA")
            if image.width != size or image.height != size:
                image = image.resize((size, size), Image.Resampling.LANCZOS)
            image.save(source, "PNG", optimize=True)
    print(f"generated {total} webp variants")


if __name__ == "__main__":
    main()
