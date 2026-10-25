'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { LeadForm } from './lead/LeadForm';
import { useLead } from './lead/LeadProvider';
import { CloseIcon } from './icons';

/** A slim desktop priority form that appears after scrolling past the hero. */
export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { submitted } = useLead();

  useEffect(() => {
    const hero = document.getElementById('top');
    const enquire = document.getElementById('enquire');
    let pastHero = false;
    let formInView = false;
    const update = () => setVisible(pastHero && !formInView);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = !entry.isIntersecting;
        if (entry.target === enquire) formInView = entry.isIntersecting;
      }
      update();
    });
    if (hero) observer.observe(hero);
    if (enquire) observer.observe(enquire);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) setExpanded(false);
    else if (!dismissed && !submitted) setExpanded(true);
  }, [visible, dismissed, submitted]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
        setDismissed(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded]);

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 lg:flex ${expanded ? 'w-[min(1240px,calc(100vw-32px))]' : ''} ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-300`}
      data-visible={visible}
      data-track-section="floating_priority"
      aria-hidden={!visible}
      inert={!visible}
    >
      {expanded ? (
        <div id="priority-form" role="region" aria-label="Book a Property Slot" className="max-h-[calc(100dvh-32px)] w-full overflow-y-auto rounded-2xl border border-line bg-white px-4 pb-2.5 pt-2 shadow-[0_18px_40px_-24px_rgba(31,13,9,0.45)] xl:px-5">
          <h2 className="mb-1 font-serif text-[16px] leading-tight text-ink">Book a Property Slot</h2>
          <LeadForm
            variant="floating"
            fields="priority"
            source="floating_priority"
            submitLabel="Book a Property Slot"
            trailing={
              <button type="button" onClick={() => { setExpanded(false); setDismissed(true); }} className="grid size-9 shrink-0 place-items-center rounded-full bg-cream text-ink hover:bg-sand" aria-label="Close property slot form">
                <CloseIcon />
              </button>
            }
          />
        </div>
      ) : (
        <button type="button" className="btn h-14 px-7" aria-expanded={expanded} aria-controls="priority-form" onClick={() => { setDismissed(false); setExpanded(true); track('form_open', { intent: 'visit', source: 'floating_priority' }); }}>
          Book a Property Slot <span className="arrow" aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}
