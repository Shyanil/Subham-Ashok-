'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import { consumeLeadSuccess } from '@/lib/lead-success';

export function ThankYouTracking() {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    track('thank_you_view', { page_path: '/thank-you', page_location: window.location.href });
    const success = consumeLeadSuccess();
    if (success) track('generate_lead', { ...success, page_path: '/thank-you' });
  }, []);
  return null;
}
