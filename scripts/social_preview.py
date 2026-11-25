"""Social preview cards: the 1280x640 image GitHub shows when a repository link is shared.

    python scripts/social_preview.py                 # every card, into docs/img/
    python scripts/social_preview.py ev-charging     # one of them

The cards are built from the numbers in the READMEs, in the same colours and fonts as the projects'
own pages, so a card and a page cannot look like two different portfolios. Regenerate when the
numbers change, then upload in Settings -> General -> Social preview (GitHub has no API for it).

The display fonts are not installed on most machines. They are on npm, which is the easiest way to
get the real files:

    npm pack @fontsource/space-grotesk @fontsource/jetbrains-mono
    for f in fontsource-*.tgz; do tar xzf "$f"; done
    python - <<'EOF'
    from fontTools.ttLib import TTFont
    import pathlib
    out = pathlib.Path("build/fonts"); out.mkdir(parents=True, exist_ok=True)
    for src, dst in {
        "package/files/space-grotesk-latin-700-normal.woff2": "grotesk-700.ttf",
        "package/files/space-grotesk-latin-500-normal.woff2": "grotesk-500.ttf",
        "package/files/jetbrains-mono-latin-500-normal.woff2": "mono-500.ttf",
    }.items():
        font = TTFont(src); font.flavor = None; font.save(str(out / dst))
    EOF

Put the .ttf files in build/fonts/, or point FONTS at wherever they are. Without them the script
falls back to DejaVu, which is installed everywhere and looks plainer.
"""
from __future__ import annotations

import os
import pathlib
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = pathlib.Path(os.getenv("FONTS", ROOT / "build" / "fonts"))
FALLBACK = {
    "grotesk-700.ttf": "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "grotesk-600.ttf": "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "grotesk-500.ttf": "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "mono-500.ttf": "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "mono-700.ttf": "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
}
W, H = 1280, 640

BG = "#e9ecf4"
SURFACE = "#ffffff"
INK = "#16182b"
MUTED = "#595f7a"
LINE = "#ccd0e0"
SOLAR = "#b8780c"
WIRE = "#4b47c7"
OK = "#1f7a4d"


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = FONTS / name
    return ImageFont.truetype(str(path if path.exists() else FALLBACK[name]), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, f: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words, lines, line = text.split(), [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=f) <= width:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def sun(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: int, colour: str) -> None:
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=colour)
    for n in range(8):
        import math

        a = math.radians(n * 45)
        x1, y1 = cx + math.cos(a) * (r + 14), cy + math.sin(a) * (r + 14)
        x2, y2 = cx + math.cos(a) * (r + 30), cy + math.sin(a) * (r + 30)
        draw.line([x1, y1, x2, y2], fill=colour, width=7)


def bolt(draw: ImageDraw.ImageDraw, cx: int, cy: int, h: int, colour: str) -> None:
    """A charging bolt: the one symbol everyone reads without a caption."""
    w = h * 0.52
    points = [
        (cx + w * 0.18, cy - h / 2),
        (cx - w * 0.52, cy + h * 0.10),
        (cx - w * 0.04, cy + h * 0.10),
        (cx - w * 0.22, cy + h / 2),
        (cx + w * 0.54, cy - h * 0.14),
        (cx + w * 0.02, cy - h * 0.14),
    ]
    draw.polygon(points, fill=colour)


def card(path: pathlib.Path, *, repo: str, line: str, stats: list[tuple[str, str]], accent: str, mark: str) -> None:
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle([40, 40, W - 40, H - 40], radius=28, fill=SURFACE, outline=LINE, width=2)
    draw.rounded_rectangle([40, 40, 52, H - 40], radius=6, fill=accent)

    where = font("mono-500.ttf", 21)
    draw.text((96, 92), "GITHUB.COM/NAILKARIMOV", font=where, fill=MUTED)

    name = font("grotesk-700.ttf", 62)
    draw.text((96, 140), repo, font=name, fill=INK)

    body = font("grotesk-500.ttf", 29)
    y = 232
    for text in wrap(draw, line, body, 860)[:4]:
        draw.text((96, y), text, font=body, fill=MUTED)
        y += 44

    draw.line([96, 430, W - 96, 430], fill=LINE, width=2)

    big = font("grotesk-700.ttf", 52)
    small = font("mono-500.ttf", 19)
    x = 96
    for value, label in stats:
        draw.text((x, 470), value, font=big, fill=INK if label != "planted bugs caught" else OK)
        draw.text((x, 540), label.upper(), font=small, fill=MUTED)
        x += max(draw.textlength(value, font=big), draw.textlength(label.upper(), font=small)) + 76

    if mark == "sun":
        sun(draw, W - 190, 210, 54, accent)
    else:
        bolt(draw, W - 190, 205, 170, accent)

    image.save(path)
    print(f"{path}  {image.size[0]}x{image.size[1]}")


CARDS = {
    "ev-charging": {
        "repo": "ev-charging-testing",
        "line": "An EV charge point speaking OCPP 1.6J and 2.0.1 over WebSocket, with every message judged "
        "by the JSON schemas published with the standard.",
        "stats": [("269", "tests in four passes"), ("41/41", "planted bugs caught"), ("206", "official schemas")],
        "accent": WIRE,
        "mark": "bolt",
    },
    "solar-surplus": {
        "repo": "solar-surplus-charging",
        "line": "Charging a car on sunshine alone: one control law driven through a model, a Modbus wallbox "
        "and an OCPP station, priced in kilowatt-hours over whole days.",
        "stats": [("135", "tests"), ("38/38", "planted bugs caught"), ("0.8 %", "bought from the grid")],
        "accent": SOLAR,
        "mark": "sun",
    },
    "solar-inverter": {
        "repo": "solar-inverter-testing",
        "line": "A 5 kW solar inverter on Modbus RTU and TCP with the SunSpec map, driven by three "
        "independent clients: my own frames, pymodbus and the SunSpec Alliance's own.",
        "stats": [("359", "tests on three links"), ("38/38", "planted bugs caught"), ("3", "independent clients")],
        "accent": SOLAR,
        "mark": "sun",
    },
}


def main(argv: list[str]) -> int:
    out = ROOT / "docs" / "img"
    out.mkdir(parents=True, exist_ok=True)
    wanted = argv or list(CARDS)
    for key in wanted:
        if key not in CARDS:
            print(f"no card named {key}; try: {', '.join(CARDS)}", file=sys.stderr)
            return 1
        card(out / "social-preview.png" if len(wanted) == 1 else out / f"social-{key}.png", **CARDS[key])
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
