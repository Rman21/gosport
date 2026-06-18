from __future__ import annotations

import subprocess
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "images" / "sportil" / "generated"
TMP_DIR = ROOT.parent.parent / "tmp" / "sportil-ai-assets"
W, H = 1600, 900


@dataclass(frozen=True)
class AssetPrompt:
    filename: str
    seed: int
    prompt: str


ASSETS = [
    AssetPrompt(
        "tennis-courts.jpg",
        201,
        "photorealistic wide angle photo of outdoor tennis courts in a coastal Israeli municipal sports center similar to Netanya, Mediterranean daylight, palm trees, clean green hard court, subtle civic blue accents, a few diverse players far away, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "padel-courts.jpg",
        202,
        "photorealistic wide angle photo of modern outdoor padel courts in a coastal Israeli city similar to Netanya, glass walls, green turf, Mediterranean sunshine, palm trees, residential skyline in distance, a few players far away, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "swimming-pool.jpg",
        203,
        "photorealistic wide angle photo of bright municipal indoor swimming pool in Israel, lane ropes, clean tile deck, daylight from tall windows, family friendly civic sports center, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "skate-roller-park.jpg",
        204,
        "photorealistic wide angle photo of coastal Israeli public skate and roller park, smooth concrete bowls and ramps, palm trees, sea breeze, warm Mediterranean daylight, safe municipal public space, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "basketball-futsal-court.jpg",
        205,
        "photorealistic wide angle photo of outdoor blue basketball and futsal court in an Israeli municipal sports park, palm trees, fences, evening sun, clean court lines, a few young players far away, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "martial-arts-hall.jpg",
        206,
        "photorealistic wide angle photo of clean Israeli community martial arts hall, tatami mats, bright windows, simple civic sports center interior, a few children and coach far away, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "adapted-sport-hall.jpg",
        207,
        "photorealistic wide angle photo of accessible adapted sports hall in Israel, inclusive community training session, wheelchair sport equipment, bright clean civic interior, respectful realistic scene, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "functional-fitness.jpg",
        208,
        "photorealistic wide angle photo of modern functional fitness gym in Israel, pull up rigs, wooden plyo boxes, rings, rubber floor, bright windows, civic community sport feeling, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "football-field.jpg",
        209,
        "photorealistic wide angle photo of green outdoor football field in coastal Israeli municipal sports complex, palm trees, fence, small goals, warm Mediterranean daylight, a few players far away, no readable text, no logos, no watermark",
    ),
    AssetPrompt(
        "community-multisport.jpg",
        210,
        "photorealistic wide angle photo of community multisport indoor center in Israel, two activity courts, kids gymnastics and ball games zones, bright clean civic interior, welcoming for families, no readable text, no logos, no watermark",
    ),
]


def pollinations_url(asset: AssetPrompt) -> str:
    prompt = quote(asset.prompt)
    return (
        f"https://image.pollinations.ai/prompt/{prompt}"
        f"?width={W}&height={H}&seed={asset.seed}&nologo=true&model=flux&enhance=true"
    )


def download(asset: AssetPrompt) -> Path:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    target = TMP_DIR / asset.filename
    subprocess.run(
        [
            "curl",
            "-L",
            "--fail",
            "--retry",
            "2",
            "--retry-delay",
            "2",
            "--max-time",
            "120",
            "-A",
            "SportILAssetGenerator/1.0",
            pollinations_url(asset),
            "-o",
            str(target),
        ],
        check=True,
    )
    return target


def convert(source: Path, asset: AssetPrompt) -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUT_DIR / asset.filename
    image = Image.open(source).convert("RGB")
    image = ImageOps.fit(image, (W, H), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    image = image.filter(ImageFilter.UnsharpMask(radius=1.0, percent=80, threshold=4))
    image.save(output, "JPEG", quality=92, optimize=True, progressive=True)
    return output


def main() -> None:
    generated = []
    for asset in ASSETS:
        print(f"Generating {asset.filename}")
        source = download(asset)
        generated.append(convert(source, asset))
    print(f"Generated {len(generated)} realistic SportIL assets in {OUT_DIR}")


if __name__ == "__main__":
    main()
