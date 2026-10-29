'use client';

import { useEffect, useState } from 'react';
import { project, site } from '@/content/site';
import { LeadButton } from './lead/LeadButton';
import { CloseIcon } from './icons';

/** White sticky header with the brown logo plaque, section anchors and a desktop site-visit button. */
export function Header() {
  const [menu, setMenu] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu]);

  return (
    <header className="site-header sticky top-0 z-50 h-[68px] border-b border-line/80 bg-white" data-track-section="header">
      <div className="container-x relative flex h-full items-center gap-3">
        <a
          href="#top"
          className="-mb-3 flex h-[calc(100%+12px)] shrink-0 items-center rounded-b-2xl bg-brand px-4 shadow-[0_10px_24px_-12px_rgb(46_17_12/0.6)]"
          aria-label={`${project.name}, back to top`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ashok-heights-logo.webp" alt="" width={480} height={210} className="h-10 w-auto sm:h-11" />
        </a>

        <nav aria-label="Sections" className="mx-auto hidden min-w-0 xl:block">
          <ul className="flex items-center gap-3 2xl:gap-5">
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

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LeadButton intent="visit" source="header" className="btn btn--sm hidden whitespace-nowrap !shadow-none lg:inline-flex">
            Schedule a Site Visit
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
        <ul className="container-x grid grid-cols-2 gap-x-3 gap-y-2 py-3 sm:grid-cols-3">
          {site.nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setMenu(false)} aria-current={active === n.href ? 'location' : undefined} className="block min-h-[44px] border-l-2 border-transparent px-3 py-3 font-medium text-ink hover:text-brand aria-[current]:border-terra aria-[current]:text-brand">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
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
