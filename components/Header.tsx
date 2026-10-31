'use client';

import { useEffect, useRef, useState } from 'react';
import { project, site } from '@/content/site';
import { LeadButton } from './lead/LeadButton';
import { CloseIcon } from './icons';
import { useLead } from './lead/LeadProvider';

/** White sticky header with the brown logo plaque, section anchors and a desktop site-visit button. */
export function Header() {
  const [menu, setMenu] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { openLead } = useLead();
  const active = useActiveSection();

  useEffect(() => {
    const dialog = drawer.current;
    if (!menu || !dialog) return;
    dialog.showModal();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenu(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previous;
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menu]);

  return (
    <header className="site-header sticky top-0 z-50 h-[68px] border-b border-line/80 bg-white" data-track-section="header">
      <div className="container-x relative flex h-full items-center justify-between gap-4">
        <a
          href="#top"
          className="-mb-3 flex h-[calc(100%+12px)] shrink-0 items-center rounded-b-2xl bg-brand px-4 shadow-[0_10px_24px_-12px_rgb(46_17_12/0.6)]"
          aria-label={`${project.name}, back to top`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ashok-heights-logo.webp" alt="" width={480} height={210} className="h-10 w-auto sm:h-11" />
        </a>

        {/* Right side: Desktop nav + CTA positioned close together */}
        <div className="ml-auto flex items-center gap-4 xl:gap-6">
          <nav aria-label="Sections" className="hidden min-w-0 xl:block">
            <ul className="flex items-center gap-1.5 xl:gap-2.5 2xl:gap-4">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    aria-current={active === n.href ? 'location' : undefined}
                    className="relative inline-flex whitespace-nowrap border-b-2 border-transparent px-1.5 py-2.5 text-[14px] font-medium text-ink/70 transition-colors hover:text-brand aria-[current]:border-terra aria-[current]:text-brand"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LeadButton
              intent="visit"
              source="header"
              title="Schedule A Site Visit"
              submitLabel="Schedule A Site Visit"
              className="btn btn--sm hidden whitespace-nowrap !shadow-none lg:inline-flex"
            >
              Schedule a Site Visit
            </LeadButton>
            <button
              ref={menuButton}
              type="button"
              className="grid size-11 place-items-center rounded-xl border border-line bg-cream/60 text-brand transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:hidden"
              aria-expanded={menu}
              aria-controls="mobile-nav"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu((m) => !m)}
            >
              {menu ? (
                <CloseIcon />
              ) : (
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <dialog
        ref={drawer}
        id="mobile-nav"
        aria-labelledby="mobile-nav-title"
        className="mobile-menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-ink backdrop:bg-deep/45 backdrop:backdrop-blur-sm"
        onCancel={() => setMenu(false)}
        onClose={() => { setMenu(false); menuButton.current?.focus({ preventScroll: true }); }}
        onClick={(event) => { if (event.target === event.currentTarget) setMenu(false); }}
      >
        <div className="mobile-menu-panel ml-auto flex h-full w-[min(88vw,400px)] flex-col bg-cream shadow-[-16px_0_60px_#14080630]">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-6 pb-5 pt-[max(24px,env(safe-area-inset-top))]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-terra">Subham Ashok Heights</p>
              <h2 id="mobile-nav-title" className="mt-1 font-serif text-[30px] leading-tight text-brand">Explore your home</h2>
            </div>
            <button type="button" autoFocus onClick={() => setMenu(false)} aria-label="Close menu" className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white text-brand focus-visible:outline-2 focus-visible:outline-brand"><CloseIcon className="size-5" /></button>
          </div>
          <nav aria-label="Mobile sections" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
            <ul className="divide-y divide-line/70">
              {site.nav.map((n, i) => (
                <li key={n.href}>
                  <a href={n.href} onClick={() => setMenu(false)} aria-current={active === n.href ? 'location' : undefined} className="group flex min-h-14 items-center gap-4 rounded-lg px-2 py-3 text-[17px] font-medium text-ink/80 transition-colors hover:bg-white hover:text-brand focus-visible:outline-2 focus-visible:outline-brand aria-[current]:bg-brand/5 aria-[current]:text-brand">
                    <span className="text-[10px] font-semibold tabular-nums text-terra/70">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1">{n.label}</span>
                    <svg viewBox="0 0 24 24" className="size-4 text-terra/60" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="shrink-0 border-t border-line bg-white px-6 pt-5 pb-[max(24px,env(safe-area-inset-bottom))]">
            <p className="mb-3 text-[12px] text-muted">Your next chapter starts here.</p>
            <button type="button" className="btn w-full" onClick={() => {
              setMenu(false);
              requestAnimationFrame(() => openLead({ intent: 'visit', source: 'mobile_menu', title: 'Schedule A Site Visit', submitLabel: 'Schedule A Site Visit' }));
            }}>Schedule a Site Visit <span aria-hidden="true">&rarr;</span></button>
          </div>
        </div>
      </dialog>
    </header>
  );
}

/** Scroll-spy: the nav href (e.g. "#amenities") whose section crosses the middle band of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = site.nav.map((n) => document.querySelector<HTMLElement>(n.href)).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(`#${e.target.id}`);
          else inView.delete(`#${e.target.id}`);
        }
        setActive(site.nav.find((n) => inView.has(n.href))?.href ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}
