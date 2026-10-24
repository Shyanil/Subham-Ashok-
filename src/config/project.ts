/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROJECT CONFIG — the one file to edit before going live.
 *
 *  Anything marked  ⚠ PLACEHOLDER  is not in the brochure / repo and must be
 *  filled in by the sales team. While a value still equals its placeholder the
 *  page falls back to neutral copy ("Price on request", etc.) instead of showing
 *  the placeholder text, so nothing broken ever reaches a visitor.
 *
 *  Secrets and webhook URLs are NOT set here. They are environment variables
 *  (see `.env.example` and the README):
 *    FORM_ENDPOINT        webhook that receives every lead (Apps Script / Make / Zapier)
 *    RESEND_API_KEY       optional, also e-mails each lead via Resend
 *    LEAD_EMAIL_TO        recipient(s) for those e-mails, comma separated
 *    LEAD_EMAIL_FROM      verified Resend sender, e.g. "Ashok Heights <leads@yourdomain.com>"
 *    NEXT_PUBLIC_GA4_ID   optional GA4 measurement ID (G-XXXXXXX)
 *    NEXT_PUBLIC_META_PIXEL_ID  optional Meta Pixel ID
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Sentinel used for every value that still needs a real answer. */
export const PLACEHOLDER = '__FILL_ME__';
export const isSet = (v: string | null | undefined): v is string => !!v && v !== PLACEHOLDER;

export const projectConfig = {
  /** ⚠ PLACEHOLDER — e.g. '62 Lakh' renders as "Starting ₹62 Lakh*". */
  STARTING_PRICE: PLACEHOLDER as string,

  /** ⚠ PLACEHOLDER — e.g. 'December 2028'. */
  POSSESSION_DATE: PLACEHOLDER as string,

  /** Sales phone, as printed in the brochure. Display format + dialable E.164. */
  PHONE: '98540 41000',
  PHONE_E164: '+919854041000',


  EMAIL: 'marketing@subhamgroup.com',

  /** RERA number exactly as it appears in the brochure / current site. */
  RERA: 'RERAA KM 281 of 2026–2027',
  RERA_URL: 'https://www.rera.assam.gov.in',

  /** Public URL used for canonical, Open Graph, sitemap and JSON-LD. */
  SITE_URL: 'https://subhambeharbari.com',

  /**
   * Lead webhook. Read on the server from the FORM_ENDPOINT env var; this
   * field only documents the name so the whole checklist lives in one file.
   */
  FORM_ENDPOINT_ENV: 'FORM_ENDPOINT',

  /**
   * ⚠ PLACEHOLDER — budget ranges shown in the form. Adjust to the real price
   * ladder once pricing is approved.
   */
  BUDGET_RANGES: ['Under ₹60 Lakh', '₹60 – 80 Lakh', '₹80 Lakh – 1 Cr', '₹1 – 1.5 Cr', 'Above ₹1.5 Cr'],

  /**
   * ⚠ CONFIRM — buyer perks shown beside the forms. Not in the brochure; keep
   * only the ones sales can honour.
   */
  PERKS: ['Direct developer pricing', 'Zero brokerage', 'Free site visit', 'Home-loan assistance'],

  /** Configurations offered in the "Looking for" field. */
  CONFIGURATIONS: ['2 BHK', '3 BHK', '4 BHK', 'Penthouse'],

  /** Auto-popup timing (ms / fraction of page). */
  POPUP_DELAY_MS: 12_000,
  POPUP_SCROLL_FRACTION: 0.4,
  POPUP_MIN_MS: 5_000,
} as const;

export const telHref = `tel:${projectConfig.PHONE_E164}`;

export const priceLabel = isSet(projectConfig.STARTING_PRICE)
  ? `Starting ₹${projectConfig.STARTING_PRICE}*`
  : 'Price on request';
export const possessionLabel = isSet(projectConfig.POSSESSION_DATE)
  ? `Possession ${projectConfig.POSSESSION_DATE}`
  : 'Possession date on request';
