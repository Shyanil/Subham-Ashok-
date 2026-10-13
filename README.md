# Subham Ashok Heights — cinematic landing page

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Three.js via @react-three/fiber + drei + postprocessing · GSAP + ScrollTrigger · Lenis.

## Run it

```bash
npm install
npm run images   # convert EXTERIOR/ + INTERIOR/ → public/images + content/media.json
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

`npm run dev` / `npm run build` run the image script automatically if outputs are missing.

## Images

Put source photos in `EXTERIOR/` and `INTERIOR/` (any jpg/png/webp/avif) and run `npm run images`.
Other folders: `IMG_EXTERIOR_DIR=/path IMG_INTERIOR_DIR=/path npm run images`.

The script (`scripts/prepare-images.mjs`, sharp) writes WebP at 640 / 1280 / 1920 widths, a pseudo depth map
per image (used by the shaders for cursor parallax), `public/images/og.jpg`, and `content/media.json`
(size, dominant colour, blur placeholder). File name → slug: `SWIMMING POOL VIEW.webp` → `swimming-pool-view`.

Then, in `content/images.ts`, add a title, alt text, tags (gallery filters) and `focus` / `mobileFocus`
(object-position 0–1; `mobileFocus` sets the portrait crop on phones). Images without an entry still work.

Which images appear where (photos are kept in the gallery so they don't repeat down the page):
- Hero day/night: `components/Hero.tsx` (`pick('aerial-day-view', 'aerial-night-view')`)
- Gallery: all images, filtered by `tags`

Section order (matches the nav): Overview → Amenities → Gallery → Floor Plans → Location → Contact → About Developer.

## Brochure assets

`scripts/extract-brochure.py` (needs `pip install pymupdf pillow numpy`) pulls the logos (`public/brand/`),
master plan, every floor plate, all 13 unit plans, the location map and the chairman portrait (`public/brochure/`)
out of the e-brochure PDF. Unit areas, floor list, specifications and key distances are in `content/plans.ts`.

## Copy, contact and SEO

Everything is in **`content/site.ts`**: project name/area/city/developer, every heading
(`_underscores_` mark the italic accent, e.g. `'YOUR NEXT', '_horizon._'`), stats, the
**WhatsApp number** and the **site URL** (`config`). No `.env` is needed.

## Colours and fonts

Brand palette from the logo/brochure. `app/globals.css` → `:root` tokens: `--ink #461a13` (maroon-brown),
`--ink-2 #55211a` (brochure maroon), `--champagne #d9b46a` (wheel gold), `--cream #fbf3e6` (logo cream),
`--paper #f3ebe3` (light sections), `--teal #ad6b46` (terracotta accent).
`.surface-light` remaps them for cream sections (gold becomes `--gold-ink` to keep AA contrast).
The WebGL clear colour is `#461a13` in `components/ThreeBackdrop.tsx` — change it with `--ink`.
Fonts (Cormorant Garamond / Manrope / DM Mono) are set in `app/layout.tsx`.

## How the 3D works

- `components/ImagePlane.tsx` renders accessible `next/image` fallbacks and registers a slot.
- One fixed `<Canvas>` (`components/ThreeBackdrop.tsx`) draws a shader plane over every slot's box
  (`components/three/PlaneMesh.tsx`, `shaders/imagePlane.ts`): noise ripple transitions, depth parallax,
  RGB shift on scroll velocity, refraction caustics, hover zoom, tilt. The DOM image fades out when the GPU frame is ready.
- `components/three/PerspectiveScene.tsx`: instanced glass shards (MeshPhysicalMaterial, transmission) + gold dust.
- `components/three/FooterGem.tsx`: faceted crystal (MeshTransmissionMaterial) behind the closing line.
- `components/three/Effects.tsx`: bloom, vignette, grain.
- Frames render on the GSAP ticker only when something on screen needs them (`lib/runtime.ts`), so planes never lag the DOM.
- Textures load near the viewport and are disposed when far away (`lib/textures.ts`).
- Without WebGL, or with "Reduce animations" / `prefers-reduced-motion`, the canvas, Lenis, pins and scrubbing are off and the page falls back to simple fades.
# Subham-Ashok-
