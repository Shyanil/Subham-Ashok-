'use client';

import { useEffect, useState } from 'react';
import { useLead } from './lead/LeadProvider';

/** Mobile / tablet (<1024px): show an Enquire now bar after the hero. */
export function StickyBar() {
  const { openLead } = useLead();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const item = 'flex flex-1 items-center justify-center gap-2.5 rounded-full text-[13px] font-bold uppercase tracking-[0.16em] min-h-[52px]';
  return (
    <nav
      aria-label="Quick contact"
      data-track-section="sticky_bar"
      className={`fixed inset-x-2 bottom-[calc(8px+env(safe-area-inset-bottom))] z-40 rounded-full bg-deep/95 p-1 text-white shadow-[0_20px_40px_-16px_rgb(20_8_6/0.7)] ring-1 ring-white/10 backdrop-blur-md lg:hidden ${visible ? 'flex' : 'hidden'}`}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => openLead({ intent: 'price', source: 'sticky_enquire', title: 'Enquire Now', submitLabel: 'Enquire Now' })}
        className={`${item} bg-terra text-white`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M4 5h16v11H8l-4 3.5z" strokeLinejoin="round" />
          <path d="M8 9.5h8M8 12.5h5" strokeLinecap="round" />
        </svg>
        Enquire now
      </button>
    </nav>
  );
}
