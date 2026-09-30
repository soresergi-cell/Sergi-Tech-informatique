# -*- coding: utf-8 -*-
"""
Génère les visuels produits WebP du catalogue SERGI-TECH.
2 images par produit (variante claire + variante sombre), 1000×1000,
fichiers légers optimisés pour les connexions mobiles lentes.

Usage :  python scripts/generate-images.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

SIZE = 1000
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "products")

# Palettes
LIGHT_BG_TOP, LIGHT_BG_BOTTOM = (255, 255, 255), (226, 232, 240)
DARK_BG_TOP, DARK_BG_BOTTOM = (15, 23, 42), (30, 58, 138)
CYAN = (6, 182, 212)
WHITE = (255, 255, 255)
NAVY = (15, 23, 42)
SLATE = (100, 116, 139)


def gradient(size, top, bottom):
    """Dégradé vertical."""
    img = Image.new("RGB", (size, size), top)
    d = ImageDraw.Draw(img)
    for y in range(size):
        t = y / size
        c = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (size, y)], fill=c)
    return img


def font(size, bold=True):
    path = "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def rounded(draw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


# ---------------------------------------------------------------- dessins ---
def laptop(d, body, screen, accent):
    d.polygon([(240, 660), (760, 660), (820, 715), (180, 715)], fill=body)
    rounded(d, [250, 250, 750, 655], 18, body)
    rounded(d, [272, 272, 728, 633], 8, screen)
    rounded(d, [310, 320, 560, 440], 8, accent)
    d.rectangle([590, 320, 690, 440], fill=(255, 255, 255) if screen != WHITE else accent)
    d.rectangle([310, 480, 690, 500], fill=(255, 255, 255) if screen != WHITE else accent)
    d.rectangle([310, 520, 610, 540], fill=(255, 255, 255) if screen != WHITE else accent)
    d.rectangle([430, 675, 570, 690], fill=accent)


def mouse(d, body, screen, accent):
    rounded(d, [370, 300, 630, 660], 120, body)
    d.line([(500, 330), (500, 430)], fill=accent, width=14)
    d.line([(500, 450), (500, 540)], fill=screen if screen != WHITE else SLATE, width=10)


def router(d, body, screen, accent):
    d.line([(310, 520), (260, 330)], fill=body, width=26)
    d.line([(690, 520), (740, 330)], fill=body, width=26)
    d.ellipse([244, 310, 276, 342], fill=accent)
    d.ellipse([724, 310, 756, 342], fill=accent)
    rounded(d, [230, 520, 770, 660], 30, body)
    for i in range(4):
        d.ellipse([300 + i * 100, 575, 330 + i * 100, 605], fill=accent)


def printer(d, body, screen, accent):
    rounded(d, [240, 480, 760, 680], 26, body)
    rounded(d, [330, 300, 670, 500], 12, (248, 250, 252))
    d.rectangle([365, 330, 635, 355], fill=SLATE)
    d.rectangle([365, 380, 590, 405], fill=SLATE)
    d.rectangle([365, 430, 540, 455], fill=CYAN)
    rounded(d, [300, 640, 700, 720], 16, accent)


def disk(d, body, screen, accent):
    rounded(d, [270, 330, 730, 670], 26, body)
    d.ellipse([330, 390, 560, 620], outline=accent, width=16)
    d.ellipse([415, 475, 475, 535], fill=accent)
    rounded(d, [600, 400, 690, 630], 10, screen)
    for y in range(420, 630, 46):
        d.rectangle([620, y, 670, y + 20], fill=accent)


def pcb(d, body, screen, accent):
    rounded(d, [230, 340, 770, 660], 18, body)
    rounded(d, [290, 400, 470, 560], 8, screen)
    d.rectangle([540, 400, 710, 450], fill=accent)
    d.rectangle([540, 480, 710, 530], fill=accent)
    d.rectangle([540, 560, 710, 610], fill=screen)
    for x in range(300, 480, 50):
        d.line([(x, 600), (x, 640)], fill=accent, width=10)


def accessory(d, body, screen, accent):
    d.arc([380, 300, 620, 480], start=180, end=360, fill=accent, width=24)
    rounded(d, [260, 400, 740, 690], 40, body)
    rounded(d, [320, 470, 680, 610], 14, screen)
    d.rectangle([360, 510, 640, 535], fill=accent)
    d.rectangle([360, 560, 560, 585], fill=accent)


SHAPES = {
    "ordinateurs": laptop,
    "composants": pcb,
    "stockage": disk,
    "peripheriques": mouse,
    "reseau": router,
    "impression": printer,
    "accessoires": accessory,
}


def generate(category, variant):
    dark = variant == 2
    img = gradient(
        SIZE,
        DARK_BG_TOP if dark else LIGHT_BG_TOP,
        DARK_BG_BOTTOM if dark else LIGHT_BG_BOTTOM,
    )
    d = ImageDraw.Draw(img)

    if dark:
        body, screen, accent = WHITE, NAVY, CYAN
        brand_col = (148, 163, 184)
    else:
        body, screen, accent = NAVY, (30, 58, 138), CYAN
        brand_col = SLATE

    # Halo décoratif
    halo = tuple(int(c * 0.25) for c in accent)
    d.ellipse([640, 120, 980, 460], fill=halo)
    if not dark:
        d.ellipse([40, 620, 320, 900], fill=(248, 250, 252))

    SHAPES[category](d, body, screen, accent)

    # Filigrane marque
    f = font(40)
    label = "SERGI-TECH"
    w = d.textbbox((0, 0), label, font=f)[2]
    d.text(((SIZE - w) / 2, 900), label, font=f, fill=brand_col)
    return img


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    # (slug, catégorie) – doit correspondre à src/data/products.ts
    products = [
        ("dell-latitude-5420", "ordinateurs"),
        ("hp-250-g9", "ordinateurs"),
        ("asus-vivobook-15", "ordinateurs"),
        ("lenovo-ideapad-slim-3", "ordinateurs"),
        ("asus-prime-b660m-a", "composants"),
        ("kingston-fury-beast-16go", "composants"),
        ("corsair-cv550", "composants"),
        ("samsung-980-nvme-1to", "stockage"),
        ("wd-blue-hdd-2to", "stockage"),
        ("sandisk-ultima-128go", "stockage"),
        ("logitech-g203", "peripheriques"),
        ("redragon-k552", "peripheriques"),
        ("jbl-tune-500bt", "peripheriques"),
        ("tp-link-archer-c6", "reseau"),
        ("tp-link-omada-eap225", "reseau"),
        ("hp-laserjet-m111w", "impression"),
        ("epson-l3251", "impression"),
        ("apc-ups-650va", "accessoires"),
        ("ugreen-hub-usb-c", "accessoires"),
    ]
    for slug, category in products:
        for variant in (1, 2):
            img = generate(category, variant)
            out = os.path.join(OUT_DIR, f"{slug}-{variant}.webp")
            img.save(out, "WEBP", quality=80, method=6)
    total_kb = (
        sum(
            os.path.getsize(os.path.join(OUT_DIR, f))
            for f in os.listdir(OUT_DIR)
            if f.endswith(".webp")
        )
        / 1024
    )
    print(f"{len(products) * 2} images generees - {total_kb:.0f} Ko au total")


if __name__ == "__main__":
    main()
