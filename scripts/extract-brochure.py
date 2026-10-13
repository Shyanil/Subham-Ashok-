"""
One-off: pulls floor plans, master plan, location map, logos and the chairman
portrait out of the e-brochure into public/brochure + public/brand.

    pip install pymupdf pillow numpy
    python3 scripts/extract-brochure.py "Subham Ashok Heights E_Brochure (2).pdf"
"""
import io, os, sys
import numpy as np
import pymupdf
from PIL import Image

pdf = sys.argv[1] if len(sys.argv) > 1 else 'Subham Ashok Heights E_Brochure (2).pdf'
root = os.path.join(os.path.dirname(__file__), '..', 'public')
out = os.path.join(root, 'brochure')
brand = os.path.join(root, 'brand')
os.makedirs(out, exist_ok=True)
os.makedirs(brand, exist_ok=True)
d = pymupdf.open(pdf)


def render(page, clip=None, dpi=170):
    pix = d[page - 1].get_pixmap(dpi=dpi, clip=pymupdf.Rect(*clip) if clip else None)
    return Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')


def save(im, name, q=86):
    path = os.path.join(out, f'{name}.webp')
    im.save(path, 'WEBP', quality=q, method=6)
    print(name, im.size)


def unblend(page, clip, dpi, name, crop=None):
    """Recover a transparent logo from a flat dark background."""
    pix = d[page - 1].get_pixmap(dpi=dpi, clip=pymupdf.Rect(*clip))
    a = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, pix.n)[..., :3].astype(float)
    B = a[4, 4]
    alpha = np.max(np.clip((a - B) / (255 - B), 0, 1), axis=2)
    alpha = np.where(alpha < 0.06, 0, alpha)
    F = (a - (1 - alpha[..., None]) * B) / np.maximum(alpha[..., None], 1e-6)
    im = Image.fromarray(np.dstack([np.clip(F, 0, 255), alpha * 255]).astype(np.uint8))
    if crop:
        im = im.crop(crop)
    im = im.crop(im.getbbox())
    im.save(os.path.join(brand, f'{name}.png'), optimize=True)
    print(name, im.size)


# Logos
unblend(1, (260, 130, 680, 360), 300, 'ashok-heights-logo')
unblend(1, (260, 130, 680, 360), 300, 'ashok-wheel', crop=(905, 200, 1365, 650))
unblend(38, (380, 75, 552, 168), 300, 'subham-logo-light')

# Master plan (left half of the spread) and location map
w = d[13].rect.width
save(render(14, (0, 0, w * 0.47, 576), dpi=200), 'master-plan')
save(render(6, (20, 50, w * 0.6, 560), dpi=200), 'location-map')

# Typical floor plates: page 16 is one wide plan, the others are left/right spreads
for p in range(15, 21):
    r = d[p - 1].rect
    if p == 16:
        save(render(p, dpi=150), f'floor-{p}')
    else:
        save(render(p, (0, 0, r.width / 2, r.height), dpi=200), f'floor-{p}-l')
        save(render(p, (r.width / 2, 0, r.width, r.height), dpi=200), f'floor-{p}-r')

# Unit plans, one per page
for p in range(21, 34):
    save(render(p, dpi=150), f'unit-{p}')

# Chairman portrait (Developer's Note)
save(render(4, (312, 240, 402, 330), dpi=300), 'chairman', q=90)
