'use client';

import { useEffect, useState } from 'react';
import { project, site } from '@/content/site';
import { LeadButton } from './lead/LeadButton';
import { CloseIcon } from './icons';

/** White sticky header with the brown logo plaque, anchors and brochure access. */
export function Header() {
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu]);

  return (
    <header className="site-header sticky top-0 z-50 h-[68px] border-b border-line/80 bg-white" data-track-section="header">
      <div className="container-x flex h-full items-center gap-3">
        <a
          href="#top"
          className="-mb-3 flex h-[calc(100%+12px)] shrink-0 items-center rounded-b-2xl bg-brand px-4 shadow-[0_10px_24px_-12px_rgb(46_17_12/0.6)]"
          aria-label={`${project.name}, back to top`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ashok-heights-logo.webp" alt="" width={480} height={210} className="h-10 w-auto sm:h-11" />
        </a>

        <nav aria-label="Sections" className="ml-6 hidden xl:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-3.5 py-2.5 text-[14.5px] font-medium text-ink/80 transition-colors hover:bg-cream hover:text-brand">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LeadButton intent="brochure" source="header" className="btn btn--sm whitespace-nowrap !shadow-none">
            <span className="sm:hidden">Brochure</span><span className="hidden sm:inline">Download Brochure</span>
          </LeadButton>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-brand hover:bg-cream xl:hidden"
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

      <nav id="mobile-nav" aria-label="Sections" hidden={!menu} className="border-b border-line bg-white shadow-lg xl:hidden">
        <ul className="container-x grid grid-cols-2 gap-1 py-3 sm:grid-cols-3">
          {site.nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setMenu(false)} className="block min-h-[44px] rounded-xl px-3 py-3 font-medium text-ink hover:bg-cream">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
