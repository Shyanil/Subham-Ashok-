# Subham Ashok Heights — lead-generation landing page

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · GSAP + ScrollTrigger · Three.js via @react-three/fiber (one lazy-loaded 3D viewer) · zod.

```bash
npm install
npm run dev                  # http://localhost:3000
npm run lint                 # TypeScript check (tsc --noEmit)
npm run build && npm start   # production
```

## Before going live: fill the placeholders

Everything sales-related is in **`src/config/project.ts`**. Values marked `⚠ PLACEHOLDER` / `⚠ CONFIRM`:

| Key | What to enter | Until filled, the page shows |
| --- | --- | --- |
| `STARTING_PRICE` | e.g. `'62 Lakh'` → "Starting ₹62 Lakh*" | "Price on request" / "Reveal price" badge |
| `POSSESSION_DATE` | e.g. `'December 2028'` | "Date on request" |
| `BUDGET_RANGES` | budget options in the form | sample ranges |
| `PERKS` | buyer perks next to the forms | "Direct developer pricing", "Zero brokerage", "Free site visit", "Home-loan assistance" — keep only what sales can honour |
| `SITE_URL` | final domain (canonical, OG, sitemap, JSON-LD) | `https://subhambeharbari.com` |

Phone (`98540 41000`), e-mail and the RERA number (`RERAA KM 281 of 2026–2027`) come from the brochure and are already set there too.

## Environment variables

See `.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `FORM_ENDPOINT` | **yes (production)** | Webhook URL that receives each lead as JSON |
| `RESEND_API_KEY` | no | Also e-mail every lead via Resend |
| `LEAD_EMAIL_TO` | with Resend | Comma-separated recipients |
| `LEAD_EMAIL_FROM` | with Resend | Verified sender, e.g. `Ashok Heights <leads@yourdomain.com>` |
| `NEXT_PUBLIC_GA4_ID` | no | GA4 measurement ID; loads gtag lazily |
| `NEXT_PUBLIC_META_PIXEL_ID` | no | Meta Pixel ID; loads the pixel lazily |

Without `FORM_ENDPOINT` or Resend, `/api/lead` **logs** leads in development and returns **503** in production
(the form then asks the visitor to call), so leads are never silently dropped.

## Connecting the lead webhook

`POST /api/lead` validates with zod (same schema as the form), drops honeypot submissions, rate-limits
5 requests / 10 min per IP, then POSTs this JSON to `FORM_ENDPOINT`:

```json
{
  "project": "Subham Ashok Heights", "name": "Ravi Kumar", "phone": "+919854041000",
  "configuration": "3 BHK", "budget": "₹80 Lakh – 1 Cr", "consent": true,
  "source": "floor_plans", "unit": "Block B · 3 BHK · 1,108 sq.ft carpet",
  "utm_source": "facebook", "utm_medium": "cpc", "utm_campaign": "launch", "utm_term": "", "utm_content": "",
  "gclid": "", "fbclid": "", "page_url": "https://…/?utm_source=facebook", "referrer": "",
  "user_agent": "…", "timestamp": "2026-10-24T09:30:00.000Z"
}
```

**Google Sheets (Apps Script)**
1. Create a Sheet → Extensions → Apps Script, paste:
   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     const sh = SpreadsheetApp.getActive().getSheetByName('Leads') || SpreadsheetApp.getActive().insertSheet('Leads');
     const cols = ['timestamp','name','phone','configuration','budget','source','unit','utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','page_url','referrer','consent'];
     if (sh.getLastRow() === 0) sh.appendRow(cols);
     sh.appendRow(cols.map((c) => d[c] ?? ''));
     return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
   }
   ```
2. Deploy → New deployment → Web app → Execute as *Me*, access *Anyone* → copy the `/exec` URL into `FORM_ENDPOINT`.

**Make / Zapier**: create a "Custom webhook" / "Catch Hook" trigger, paste its URL into `FORM_ENDPOINT`, send one test lead, then map the fields to your CRM / Sheet / WhatsApp alert.

Test locally:
```bash
curl -X POST localhost:3000/api/lead -H 'content-type: application/json' \
  -d '{"name":"Test Lead","phone":"9854041000","configuration":"3 BHK","consent":true,"meta":{"source":"curl"}}'
```

## Lead system

- One `<LeadForm />` (`components/lead/LeadForm.tsx`), variants `inline` · `modal` · `floating` · `sticky` (one-row),
  fields `quick` (name, mobile, looking-for) or `full` (+ budget), always with consent + honeypot.
- `LeadModal` opens from every Get Price / Reveal Price / Download Brochure / Book Site Visit button (`LeadButton`).
  It auto-opens **once per session** after 12 s or 40 % scroll (first of the two), and on desktop exit-intent.
  It never opens in the first 5 s, never on mobile before a real interaction, never while someone is typing in a form,
  and never after a submission. Timings are in `src/config/project.ts`.
- Mobile: sticky Call · Site visit · Enquire bar. Desktop: floating "Get Price" pill → quick form.
- No WhatsApp chat buttons anywhere (by request).
- Thank-you state: a call button and a brochure download.
- Tracking (`lib/analytics.ts`): `form_open`, `form_submit`, `form_error`, `call_click` →
  `window.dataLayer`, plus GA4 `gtag` and Meta `fbq` (`Lead` / `Contact` for calls) when their IDs are set.
  First-touch UTM / gclid / fbclid are kept in sessionStorage (`lib/attribution.ts`).

## Performance & motion

- Hero image is the only `preload` image; everything else lazy-loads. next/image serves AVIF → WebP.
- GSAP loads after idle (`components/Motion.tsx`): scroll reveals, counters, header state. Nothing is pinned.
- Three.js (`components/three/TowerScene.tsx`, a stylised model built from the master plan) is loaded via
  `next/dynamic` (`ssr: false`) only on capable devices (`deviceMemory ≥ 4` where reported, `hardwareConcurrency ≥ 4`,
  no Save-Data, no reduced motion, WebGL) — after idle for the hero maquette, and on scroll for the tour (Day/Night,
  Aerial/East/North views, 10 amenity hotspots). Others get the photo / a play button.

## Content & images

- Copy and facts: `content/site.ts` (`_word_` marks the italic accent in headings). Plans, areas, specs, distances: `content/plans.ts`.
- Renders: put source photos in `EXTERIOR/` and `INTERIOR/` and run `npm run images` (sharp → `public/images`,
  `content/media.json`). Titles / alt / gallery tags: `content/images.ts`. Night renders appear only in the gallery.
- Brochure assets (`public/brochure`, `public/brand`) were extracted by `scripts/extract-brochure.py`.
  The full brochure PDF is served at `/brochure/subham-ashok-heights-brochure.pdf` after a lead submits.

## Design

Brochure palette only — white page, light-brown surfaces (`#F8F2EC`, `#F3EBE3`, `#E8D8C6`), brand brown `#461a13`
for type, buttons and dark bands, a mid brown `#7A4A35` for small accents and pale tan `#DCC0A0` on dark. No orange.
Tokens live in `app/globals.css` `@theme`. Instrument Serif (display, italic accent words via `_word_` in
`content/site.ts`) + DM Sans, via `next/font`. Layout ideas (rounded cards, tracked caps labels, marquee,
amenity showcase) are inspired by the sister Kishori Heights site, with Ashok Heights' own copy and structure.

- Header: white sticky bar with the brown logo plaque, anchors, phone and an always-visible "Get Price".
- Hero: white headline column (fact tiles, two CTAs, RERA) + the full daylight render in a 3D tilt card
  (`components/Tilt.tsx`: perspective tilt that follows the pointer; glass chips float on separate depth layers),
  plus a glass quick-enquiry bar overlapping the bottom edge on desktop.
- Floor plans: segmented tabs; the master plan has a 2D plan / Three.js 3D model toggle (3D by default on capable
  devices); each block has a swipeable unit rail, a large plan preview, area tiles and "Reveal price"; specs are icon tiles.
- Site-wide 3D motion (`components/Motion.tsx`): `data-reveal="3d"` cards fold up in perspective as they scroll in,
  `data-tilt` cards tilt toward the pointer. All off under reduced motion / touch.
- 3D tour section: starts by itself on capable devices when scrolled into view; a play button elsewhere.

Motion: CSS hero entrance, tower rise + auto-rotate, marquee, amenity slideshow, GSAP scroll reveals (≤400 ms,
40 ms stagger) and counters, hover lifts. Everything stops under `prefers-reduced-motion`.
