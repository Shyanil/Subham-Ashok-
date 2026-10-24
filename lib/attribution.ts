'use client';

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;
const STORE = 'ah_attribution';

/** First-touch UTM / click IDs for the session, so a lead filed on scroll still carries the ad that brought them. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(STORE)) return;
    const q = new URLSearchParams(location.search);
    const data: Record<string, string> = { referrer: document.referrer.slice(0, 500) };
    for (const k of KEYS) {
      const v = q.get(k);
      if (v) data[k] = v.slice(0, 200);
    }
    sessionStorage.setItem(STORE, JSON.stringify(data));
  } catch {
    /* storage blocked */
  }
}

export function getAttribution(): Record<string, string> {
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORE) ?? '{}');
  } catch {
    /* storage blocked */
  }
  // Fall back to the live URL when storage is unavailable.
  const q = new URLSearchParams(location.search);
  for (const k of KEYS) if (!stored[k] && q.get(k)) stored[k] = q.get(k)!.slice(0, 200);
  return { ...stored, page_url: location.href.slice(0, 500) };
}
