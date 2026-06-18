import hashlib
import re
from pathlib import Path

from PIL import Image, ImageEnhance


ROOT = Path.cwd()
CONTENT_DIR = ROOT / "src" / "content" / "travel"
PUBLIC_DIR = ROOT / "public"
GENERATED_DIR = PUBLIC_DIR / "images" / "generated" / "unique"
OPTIMIZED_DIR = PUBLIC_DIR / "images" / "optimized" / "generated" / "unique"
WIDTHS = [160, 240, 320, 330, 360, 480, 520, 640, 680, 768, 960, 1200]


def field(frontmatter: str, name: str) -> str:
    match = re.search(rf"^{re.escape(name)}:\s*[\"']?([^\"'\r\n]+)", frontmatter, re.M)
    return match.group(1).strip() if match else ""


def frontmatter(text: str) -> str:
    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---", text)
    return match.group(1) if match else ""


def normalize(value: str) -> str:
    return value.split("#", 1)[0].split("?", 1)[0].rstrip("/")


def public_path(image_path: str) -> Path:
    return PUBLIC_DIR / image_path.lstrip("/").replace("/", "\\")


def unique_slug(*parts: str) -> str:
    raw = "--".join(parts)
    raw = re.sub(r"[^a-zA-Z0-9_-]+", "-", raw).strip("-").lower()
    return re.sub(r"-{2,}", "-", raw)


def image_variant_name(image_path: str, translation_key: str, slot: int) -> str:
    stem = Path(image_path).stem
    return f"/images/generated/unique/{unique_slug(stem, translation_key, str(slot + 1))}.jpg"


def optimized_srcset(image_path: str) -> str:
    stem = Path(image_path).stem
    return ", ".join(
        f"/images/optimized/generated/unique/{stem}-{width}.webp {width}w" for width in WIDTHS
    )


def create_variant(source_path: str, target_path: str) -> None:
    source = public_path(source_path)
    target = public_path(target_path)
    if target.exists():
        return
    if not source.exists():
        raise FileNotFoundError(f"Missing source image: {source_path}")

    target.parent.mkdir(parents=True, exist_ok=True)
    OPTIMIZED_DIR.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as img:
        img = img.convert("RGB")
        seed = int(hashlib.sha256(target_path.encode("utf-8")).hexdigest()[:8], 16)
        width, height = img.size

        crop_x = max(0, int(width * (0.012 + (seed % 7) * 0.004)))
        crop_y = max(0, int(height * (0.012 + ((seed >> 3) % 7) * 0.004)))
        box = (crop_x, crop_y, width - crop_x, height - crop_y)
        img = img.crop(box)

        if seed % 2:
            img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

        color = 0.94 + ((seed >> 6) % 13) / 100
        contrast = 0.96 + ((seed >> 10) % 11) / 100
        brightness = 0.97 + ((seed >> 14) % 9) / 100
        img = ImageEnhance.Color(img).enhance(color)
        img = ImageEnhance.Contrast(img).enhance(contrast)
        img = ImageEnhance.Brightness(img).enhance(brightness)

        target_width = 1200
        if img.width != target_width:
            target_height = max(1, round(img.height * target_width / img.width))
            img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

        img.save(target, "JPEG", quality=84, optimize=True, progressive=True)

        for width in WIDTHS:
            out = OPTIMIZED_DIR / f"{target.stem}-{width}.webp"
            if out.exists():
                continue
            resized = img.copy()
            if resized.width > width:
                height = max(1, round(resized.height * width / resized.width))
                resized = resized.resize((width, height), Image.Resampling.LANCZOS)
            resized.save(out, "WEBP", quality=76, method=6)


def collect_occurrences(file_path: Path, text: str):
    fm = frontmatter(text)
    translation_key = field(fm, "translationKey") or file_path.stem.replace("-en", "").replace("-ja", "")
    occurrences = []

    hero_match = re.search(r"^heroImage:\s*[\"']([^\"'\r\n]+)[\"']", text, re.M)
    if hero_match:
        occurrences.append(
            {
                "kind": "hero",
                "image": normalize(hero_match.group(1)),
                "start": hero_match.start(1),
                "end": hero_match.end(1),
                "translation_key": translation_key,
            }
        )

    for match in re.finditer(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>", text):
        image = normalize(match.group(1))
        if image.startswith("http"):
            continue
        occurrences.append(
            {
                "kind": "img",
                "image": image,
                "start": match.start(1),
                "end": match.end(1),
                "tag_start": match.start(0),
                "tag_end": match.end(0),
                "translation_key": translation_key,
            }
        )

    occurrences.sort(key=lambda item: item["start"])
    per_image_count = {}
    for item in occurrences:
        image = item["image"]
        item["slot"] = per_image_count.get(image, 0)
        per_image_count[image] = item["slot"] + 1

    return translation_key, occurrences


def replace_picture_srcset(text: str, image_start: int, final_image: str) -> str:
    before = text.rfind("<picture", 0, image_start)
    after = text.find("</picture>", image_start)
    if before == -1 or after == -1:
        return text
    after += len("</picture>")
    block = text[before:after]
    if "srcset=" not in block:
        return text
    block = re.sub(
        r"(<source\b[^>]*\bsrcset=[\"'])([^\"']+)([\"'])",
        lambda m: f"{m.group(1)}{optimized_srcset(final_image)}{m.group(3)}",
        block,
        count=1,
    )
    return text[:before] + block + text[after:]


def main():
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    OPTIMIZED_DIR.mkdir(parents=True, exist_ok=True)

    files = sorted(CONTENT_DIR.glob("*.md"))
    file_texts = {file_path: file_path.read_text(encoding="utf-8") for file_path in files}
    file_occurrences = {}
    image_to_keys = {}

    for file_path, text in file_texts.items():
        key, occurrences = collect_occurrences(file_path, text)
        file_occurrences[file_path] = occurrences
        for item in occurrences:
            image_to_keys.setdefault(item["image"], set()).add(key)

    replacements = {}
    for file_path, occurrences in file_occurrences.items():
        counts_in_file = {}
        for item in occurrences:
            counts_in_file[item["image"]] = counts_in_file.get(item["image"], 0) + 1

        for item in occurrences:
            image = item["image"]
            key = item["translation_key"]
            needs_unique = len(image_to_keys.get(image, set())) > 1 or counts_in_file[image] > 1
            if not needs_unique:
                continue

            final_image = image_variant_name(image, key, item["slot"])
            replacements[(image, key, item["slot"])] = final_image

    for (source, _key, _slot), target in sorted(replacements.items()):
        create_variant(source, target)

    changed = 0
    for file_path, text in file_texts.items():
        occurrences = file_occurrences[file_path]
        updated = text
        shift = 0
        for item in occurrences:
            final_image = replacements.get((item["image"], item["translation_key"], item["slot"]))
            if not final_image:
                continue

            start = item["start"] + shift
            end = item["end"] + shift
            updated = updated[:start] + final_image + updated[end:]
            shift += len(final_image) - (end - start)

            if item["kind"] == "img":
                updated = replace_picture_srcset(updated, start, final_image)

        if updated != text:
            file_path.write_text(updated, encoding="utf-8", newline="")
            changed += 1

    print(f"updated_files={changed}")
    print(f"unique_variants={len(set(replacements.values()))}")


if __name__ == "__main__":
    main()
