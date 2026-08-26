"""Render the Open Graph share card.

The site is a static export with no image pipeline, so the card is generated once
here and committed as public/og.png rather than rendered per request.
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (7, 10, 19)
BLUE = (59, 130, 246)
CYAN = (34, 211, 238)
WHITE = (255, 255, 255)
SLATE = (148, 163, 184)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img, "RGBA")

# Soft brand aura behind the mark, drawn as stacked translucent discs.
for radius, alpha in ((360, 16), (280, 20), (200, 26), (130, 34)):
    draw.ellipse(
        (200 - radius, 315 - radius, 200 + radius, 315 + radius),
        fill=(59, 130, 246, alpha),
    )

# Brand tile with the three-stroke glyph, scaled from the 32x32 source viewBox.
TILE = 168
tx, ty = 116, 231
draw.rounded_rectangle((tx, ty, tx + TILE, ty + TILE), radius=38, fill=BLUE)

scale = TILE / 32 * 0.62
ox = tx + TILE / 2 - 16 * scale
oy = ty + TILE / 2 - 16 * scale


def pts(*pairs):
    return [(ox + x * scale, oy + y * scale) for x, y in pairs]


stroke = max(2, round(2.6 * scale))
draw.line(pts((9, 9), (4, 16), (9, 23)), fill=WHITE, width=stroke, joint="curve")
draw.line(pts((23, 9), (28, 16), (23, 23)), fill=WHITE, width=stroke, joint="curve")
draw.line(
    pts((12.5, 16.5), (15.5, 19.5), (20, 12)), fill=WHITE, width=stroke, joint="curve"
)


def font(path, size):
    return ImageFont.truetype(f"C:/Windows/Fonts/{path}", size)


heavy = font("segoeuib.ttf", 92)
mid = font("segoeuib.ttf", 38)
small = font("segoeui.ttf", 28)

text_x = 340
draw.text((text_x, 206), "ENGAZ", font=heavy, fill=WHITE)
draw.text((text_x, 314), "Smart software solutions", font=mid, fill=CYAN)

# Two short lines rather than one long one: a single run of services overflows 1200px.
draw.text((text_x, 382), "Restaurant & cafe systems  •  AI agents", font=small, fill=SLATE)
draw.text((text_x, 420), "Websites  •  Mobile apps  •  Custom software", font=small, fill=SLATE)
draw.text((text_x, 470), "engaz.tech", font=small, fill=BLUE)

# Accent rule along the bottom edge, fading out from the brand blue.
for x in range(W):
    ratio = 1 - x / W
    draw.line(
        (x, H - 8, x, H),
        fill=(
            int(BLUE[0] * ratio + CYAN[0] * (1 - ratio)),
            int(BLUE[1] * ratio + CYAN[1] * (1 - ratio)),
            int(BLUE[2] * ratio + CYAN[2] * (1 - ratio)),
        ),
    )

img.save("public/og.png", optimize=True)
print("wrote public/og.png", img.size)
