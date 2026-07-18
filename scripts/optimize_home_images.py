from pathlib import Path

from PIL import Image


ASSET_DIRECTORY = Path(__file__).resolve().parents[1] / "src" / "assets"
SOURCE_IMAGES = (
    "gallery-switzerland.jpg",
    "gallery-georgia.jpg",
    "gallery-maldives.jpg",
    "gallery-egypt.jpg",
    "gallery-visa.png",
)
MAX_SIZE = (1600, 1600)


def main() -> None:
    for filename in SOURCE_IMAGES:
        source_path = ASSET_DIRECTORY / filename
        output_path = source_path.with_suffix(".webp")

        with Image.open(source_path) as image:
            image.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
            image.save(output_path, "WEBP", quality=82, method=6)

        source_kb = source_path.stat().st_size / 1024
        output_kb = output_path.stat().st_size / 1024
        reduction = 100 - (output_kb / source_kb * 100)
        print(
            f"{source_path.name}: {source_kb:.0f} KB -> "
            f"{output_path.name}: {output_kb:.0f} KB ({reduction:.0f}% smaller)"
        )


if __name__ == "__main__":
    main()
