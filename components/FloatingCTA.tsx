'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { projectConfig } from '@/src/config/project';
import { LeadForm } from './lead/LeadForm';
import { useLead } from './lead/LeadProvider';
import { CheckIcon, CloseIcon } from './icons';

/**
 * Desktop priority form as a full-height left side panel below the header. It slides in once the visitor scrolls past
 * the hero (and steps aside while the main enquiry form is on screen). Closing it leaves a slim
 * vertical tab on the edge to bring it back.
 */
export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { submitted } = useLead();

  useEffect(() => {
    const hero = document.getElementById('top');
    const enquire = document.getElementById('enquire');
    let pastHero = false;
    let formInView = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = !entry.isIntersecting;
        if (entry.target === enquire) formInView = entry.isIntersecting;
      }
      setVisible(pastHero && !formInView);
    });
    if (hero) observer.observe(hero);
    if (enquire) observer.observe(enquire);
    return () => observer.disconnect();
  }, []);

  // Slide in once on the first scroll past the hero; after a close it stays a tab.
  useEffect(() => {
    if (!visible) setOpen(false);
    else if (!dismissed && !submitted) setOpen(true);
  }, [visible, dismissed, submitted]);

  // Share the open state with other floating controls.
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.dataset.sidePanel = 'open';
    else delete root.dataset.sidePanel;
    return () => void delete root.dataset.sidePanel;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    setDismissed(true);
  };
  const reopen = () => {
    setDismissed(false);
    setOpen(true);
    track('form_open', { intent: 'visit', source: 'floating_priority' });
  };

  return (
    <div className="hidden lg:block" data-track-section="floating_priority" aria-hidden={!visible} inert={!visible}>
      {/* Edge tab: a slim, quiet handle that brings the panel back. */}
      <button
        type="button"
        onClick={reopen}
        aria-expanded={open}
        aria-controls="priority-form"
        aria-label="Book a Property Slot"
        className={`group fixed left-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-3 rounded-r-2xl border border-l-0 border-gold/25 bg-gradient-to-b from-brand to-deep py-4 pl-2 pr-2.5 text-white shadow-[0_16px_36px_-14px_rgb(46_17_12/0.65)] transition-all duration-500 hover:pl-3.5 ${visible && !open ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-full opacity-0'}`}
      >
        <span className="grid size-8 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/30" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
            <path d="M4 10h16M9 3.5v4M15 3.5v4" />
          </svg>
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] [writing-mode:vertical-rl]">Book a Slot</span>
        <svg viewBox="0 0 24 24" className="size-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Side panel */}
      <aside
        id="priority-form"
        aria-label="Book a Property Slot"
        className={`fixed bottom-0 left-0 top-[68px] z-40 flex w-[400px] flex-col overflow-hidden border-r border-line bg-white shadow-[16px_0_48px_-16px_rgb(31_13_9/0.25)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] xl:w-[420px] ${visible && open ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-full opacity-0'}`}
      >
        <header className="relative shrink-0 bg-deep px-7 pb-6 pt-7 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Priority booking</p>
          <h2 className="mt-2 pr-7 font-serif text-[30px] leading-tight !text-white">Book a Property Slot</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {projectConfig.PERKS.slice(0, 2).map((p) => (
              <li key={p} className="flex items-center gap-1.5 text-[12px] text-white/75">
                <CheckIcon className="size-3 text-gold" /> {p}
              </li>
            ))}
          </ul>
          <button type="button" onClick={close} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" aria-label="Close property slot form">
            <CloseIcon className="size-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7 pb-8 pt-6">
          <LeadForm variant="modal" fields="priority" source="floating_priority" submitLabel="Book a Property Slot" />
        </div>
      </aside>
    </div>
  );
}
