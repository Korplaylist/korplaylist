from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIRS = [
    ROOT / "public" / "images" / "kto",
    ROOT / "public" / "images" / "myrealtrip",
]
OUTPUT_ROOT = ROOT / "public" / "images" / "optimized"
WIDTHS = (360, 480, 640, 768, 960, 1200)


def save_variant(source: Path, output_dir: Path, width: int) -> None:
    with Image.open(source) as image:
        image = image.convert("RGB")
        target_width = min(width, image.width)
        target_height = round(image.height * target_width / image.width)
        resized = image if target_width == image.width else image.resize((target_width, target_height), Image.Resampling.LANCZOS)
        output = output_dir / f"{source.stem}-{width}.webp"
        resized.save(output, "WEBP", quality=78, method=6)


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
    print(f"generated {total} webp variants")


if __name__ == "__main__":
    main()
