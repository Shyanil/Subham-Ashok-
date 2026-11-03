'use client';

type Success = { source: string; configuration: string; budget: string; form_variant: string };
const KEY = 'ah_pending_lead_success';
let pending: Success | undefined;

export function rememberLeadSuccess(value: Success) {
  pending = value;
  try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* Memory fallback when storage is blocked. */ }
}

export function consumeLeadSuccess(): Success | undefined {
  let value = pending;
  pending = undefined;
  try {
    const stored = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!value && stored) value = JSON.parse(stored);
  } catch { /* Use the memory fallback. */ }
  return value;
}
