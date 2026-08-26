"""Render the Open Graph share card.

The site is a static export with no image pipeline, so the card is generated once
here and committed as public/og.png rather than rendered per request.
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAGE = (255, 255, 255)
VOID = (208, 208, 208)
RULE = (240, 240, 240)
INK = (0, 0, 0)
CYAN = (102, 217, 239)
YELLOW = (255, 217, 61)
PINK = (255, 107, 157)
MINT = (168, 230, 207)

img = Image.new("RGB", (W, H), VOID)
draw = ImageDraw.Draw(img, "RGBA")


def font(name, size):
    return ImageFont.truetype(f"C:/Windows/Fonts/{name}", size)


def slab(box, fill, shadow=12, border=6):
    """A hard-edged panel with a zero-blur offset shadow, the core primitive."""
    x0, y0, x1, y1 = box
    draw.rectangle((x0 + shadow, y0 + shadow, x1 + shadow, y1 + shadow), fill=INK)
    draw.rectangle(box, fill=fill, outline=INK, width=border)


# The framed page: graph paper inside a heavy border, floating on the void colour.
FRAME = (28, 28, W - 40, H - 40)
draw.rectangle((FRAME[0] + 12, FRAME[1] + 12, FRAME[2] + 12, FRAME[3] + 12), fill=INK)
draw.rectangle(FRAME, fill=PAGE)
for x in range(FRAME[0], FRAME[2], 20):
    draw.line((x, FRAME[1], x, FRAME[3]), fill=RULE)
for y in range(FRAME[1], FRAME[3], 20):
    draw.line((FRAME[0], y, FRAME[2], y), fill=RULE)
draw.rectangle(FRAME, outline=INK, width=6)

# Brand tile with the three-stroke glyph, scaled from the 32x32 source viewBox.
TILE = 150
tx, ty = 76, 150
slab((tx, ty, tx + TILE, ty + TILE), CYAN, shadow=8, border=4)

scale = TILE / 32 * 0.6
ox = tx + TILE / 2 - 16 * scale
oy = ty + TILE / 2 - 16 * scale


def pts(*pairs):
    return [(ox + x * scale, oy + y * scale) for x, y in pairs]


stroke = max(2, round(2.6 * scale))
draw.line(pts((9, 9), (4, 16), (9, 23)), fill=INK, width=stroke, joint="curve")
draw.line(pts((23, 9), (28, 16), (23, 23)), fill=INK, width=stroke, joint="curve")
draw.line(pts((12.5, 16.5), (15.5, 19.5), (20, 12)), fill=INK, width=stroke, joint="curve")

text_x = 258
draw.text((text_x, 152), "ENGAZ", font=font("segoeuib.ttf", 96), fill=INK)

# The tagline sits on a highlighter bar, the way headings do on the site.
tag = "SMART SOFTWARE SOLUTIONS"
tag_font = font("segoeuib.ttf", 34)
tw = draw.textlength(tag, font=tag_font)
draw.rectangle((text_x - 6, 268, text_x + tw + 14, 316), fill=YELLOW)
draw.text((text_x, 272), tag, font=tag_font, fill=INK)

# Service chips: bordered slabs with offset shadows, alternating accents.
chip_font = font("segoeui.ttf", 26)
chips = [
    ("Restaurant & Cafe POS", CYAN),
    ("AI Agents", PINK),
    ("Websites", MINT),
    ("Mobile Apps", YELLOW),
]
cx, cy = text_x, 348
for label, fill in chips:
    cw = draw.textlength(label, font=chip_font) + 34
    if cx + cw > FRAME[2] - 40:
        cx = text_x
        cy += 74
    slab((cx, cy, cx + cw, cy + 56), fill, shadow=5, border=3)
    draw.text((cx + 17, cy + 12), label, font=chip_font, fill=INK)
    cx += cw + 20

draw.text((text_x, cy + 84), "engaz.tech", font=font("segoeuib.ttf", 30), fill=INK)

img.save("public/og.png", optimize=True)
print("wrote public/og.png", img.size)
