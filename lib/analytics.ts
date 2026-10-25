'use client';

export type TrackEvent = 'form_open' | 'form_submit' | 'form_error' | 'call_click' | 'tour_start' | 'chat_open' | 'chat_message';

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta standard events for the ones that matter for ad optimisation. */
const META_EVENT: Partial<Record<TrackEvent, string>> = {
  form_submit: 'Lead',
  call_click: 'Contact',
};

/** Pushes to window.dataLayer (GTM) and, when loaded, GA4 and Meta Pixel. */
export function track(event: TrackEvent, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const payload = { event, ...params };
  (window.dataLayer ??= []).push(payload);
  window.gtag?.('event', event, params);
  const meta = META_EVENT[event];
  if (meta) window.fbq?.('track', meta, params);
  if (process.env.NODE_ENV !== 'production') console.debug('[track]', payload);
}
