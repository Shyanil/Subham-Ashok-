'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';
import { LeadModal } from './LeadModal';

export type LeadIntent = 'price' | 'reveal' | 'brochure' | 'visit';

export type LeadRequestOptions = {
  intent: LeadIntent;
  /** Where the click came from, e.g. "hero", "floor_plans". Sent with the lead. */
  source: string;
  /** Unit label for "Reveal price", e.g. "Block B · 3 BHK · 1,108 sq.ft". */
  unit?: string;
  /** Preselect the "Looking for" field. */
  configuration?: string;
  /** Custom heading / CTA text to display on the modal */
  title?: string;
  /** Custom submit button label */
  submitLabel?: string;
};

type Ctx = {
  openLead: (o: LeadRequestOptions) => void;
  markSubmitted: () => void;
  submitted: boolean;
};

const LeadContext = createContext<Ctx | null>(null);

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLead must be used inside <LeadProvider>');
  return ctx;
}

const LOCAL_SUBMITTED = 'ah_lead_submitted';

const safeGet = (s: Storage | undefined, k: string) => {
  try {
    return s?.getItem(k) ?? null;
  } catch {
    return null;
  }
};
const safeSet = (s: Storage | undefined, k: string, v: string) => {
  try {
    s?.setItem(k, v);
  } catch {
    /* storage blocked */
  }
};

/**
 * Owns the lead modal opened by explicit calls to action and tracks phone clicks.
 */
export function LeadProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<LeadRequestOptions | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const openLead = useCallback((o: LeadRequestOptions) => {
    setRequest(o);
    track('form_open', { intent: o.intent, source: o.source, unit: o.unit });
  }, []);

  const markSubmitted = useCallback(() => {
    safeSet(window.localStorage, LOCAL_SUBMITTED, '1');
    setSubmitted(true);
  }, []);

  useEffect(() => {
    captureAttribution();
    if (safeGet(window.localStorage, LOCAL_SUBMITTED)) setSubmitted(true);
  }, []);

  // Delegated tracking for call links anywhere on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const source = a.dataset.source ?? a.closest('[data-track-section]')?.getAttribute('data-track-section') ?? 'page';
      if (a.href.startsWith('tel:')) track('call_click', { source });
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  const value = useMemo(() => ({ openLead, markSubmitted, submitted }), [openLead, markSubmitted, submitted]);

  return (
    <LeadContext.Provider value={value}>
      {children}
      <LeadModal request={request} onClose={() => setRequest(null)} />
    </LeadContext.Provider>
  );
}
