'use client';

import { useEffect, useState } from 'react';
import { useLead } from './lead/LeadProvider';
import { DESKTOP_ENQUIRY_QUERY } from '@/lib/breakpoints';

/** Touch devices and small screens: show a compact enquiry bar after the hero. */
export function StickyBar() {
  const { openLead } = useLead();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const enquire = document.getElementById('enquire');
    const desktop = window.matchMedia(DESKTOP_ENQUIRY_QUERY);
    let pastHero = false;
    let formInView = false;
    const updateVisibility = () => setVisible(!desktop.matches && pastHero && !formInView);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = !entry.isIntersecting;
        if (entry.target === enquire) formInView = entry.isIntersecting;
      }
      updateVisibility();
    });
    observer.observe(hero);
    if (enquire) observer.observe(enquire);
    desktop.addEventListener('change', updateVisibility);
    return () => {
      observer.disconnect();
      desktop.removeEventListener('change', updateVisibility);
    };
  }, []);

  return (
    <nav
      aria-label="Quick contact"
      data-track-section="sticky_bar"
      className={`fixed inset-x-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-40 mx-auto max-w-[480px] items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-deep/95 p-2.5 pl-4 text-white shadow-[0_8px_28px_-8px_rgb(20_8_6/0.55)] backdrop-blur-md ${visible ? 'flex' : 'hidden'}`}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-tight">Find your home</p>
        <p className="mt-1 text-[11px] leading-tight text-white/65">Prices &amp; availability</p>
      </div>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => openLead({ intent: 'price', source: 'sticky_enquire', title: 'Enquire Now', submitLabel: 'Enquire Now' })}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-4 text-[13px] font-bold text-deep transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Enquire now
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M5 12h14m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
