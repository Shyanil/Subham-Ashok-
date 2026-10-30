'use client';

import { useEffect, useRef, useState } from 'react';
import { keyDistances } from '@/content/plans';
import { BrandChakra } from './BrandChakra';
import { PinIcon } from './icons';

const CATEGORIES = [
  ...keyDistances.filter((category) => ['Education', 'Hospitals', 'Shopping and markets', 'Banks'].includes(category.group)),
  {
    group: 'Transport',
    // Approximate driving routes calculated with OSRM / OpenStreetMap on 2026-10-29.
    // Origin: 91.7719754,26.1071153 (the site map pin). Destination coordinates
    // from Photon: airport 91.5830728,26.1113723; GHY 91.7507423,26.1821371;
    // KYQ 91.6920689,26.1572797; ISBT 91.7218831,26.1163561.
    // https://router.project-osrm.org/route/v1/driving/{origin};{destination}?overview=false
    items: [
      ['Lokpriya Gopinath Bordoloi International Airport', '30.5 km'],
      ['Guwahati Railway Station', '12 km'],
      ['Kamakhya Junction Railway Station', '14.9 km'],
      ['ISBT Betkuchi', '5.8 km'],
    ],
  },
];

const LABELS: Record<string, string> = {
  Education: 'Schools and university',
  Hospitals: 'Hospitals',
  'Shopping and markets': 'Shopping and markets',
  Banks: 'Banks',
  Transport: 'Transport',
};

function CategoryIcon({ group, className = 'size-5' }: { group: string; className?: string }) {
  if (group === 'Education') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    );
  }
  if (group === 'Hospitals') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }
  if (group === 'Shopping and markets') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
    );
  }
  if (group === 'Banks') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m2 7 10-5 10 5v2H2zM4 11v6M9 11v6M15 11v6M20 11v6M2 20h20" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="15" rx="2" />
      <path d="M3 11h18M7 15h.01M17 15h.01M5 18l-2 3M19 18l2 3" />
    </svg>
  );
}

export function NeighbourhoodCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const category = CATEGORIES[index];
  const playing = !paused && !hovered && !focused && !reducedMotion && inView;

  useEffect(() => {
    const rail = tabs.current;
    const active = rail?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!rail || !active || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({
      left: rail.scrollLeft + active.getBoundingClientRect().left - rail.getBoundingClientRect().left - (rail.clientWidth - active.offsetWidth) / 2,
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  }, [index, reducedMotion]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    if (root.current) observer.observe(root.current);
    return () => { query.removeEventListener('change', update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % CATEGORIES.length), 6500);
    return () => window.clearInterval(timer);
  }, [playing, index]);

  const choose = (next: number) => {
    setIndex((next + CATEGORIES.length) % CATEGORIES.length);
    setPaused(true);
  };
  const control = 'grid size-10 shrink-0 place-items-center rounded-full border border-line text-terra transition-colors hover:border-terra/40 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra';

  return (
    <div ref={root} role="region" aria-roledescription="carousel" aria-label="Nearby essentials" className="mt-10 sm:mt-12" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-terra">Around your neighbourhood</p>
          <h3 className="mt-2 font-serif text-[28px] text-ink sm:text-[34px]">Nearby essentials</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-[12px] tabular-nums text-muted">{String(index + 1).padStart(2, '0')} / {String(CATEGORIES.length).padStart(2, '0')}</span>
          {!reducedMotion && <button type="button" className={control} aria-label={paused ? 'Resume category rotation' : 'Pause category rotation'} onClick={() => setPaused((value) => !value)}>
            {paused ? <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg> : <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>}
          </button>}
          <button type="button" className={control} aria-label="Previous nearby category" onClick={() => choose(index - 1)}><span aria-hidden="true">←</span></button>
          <button type="button" className={control} aria-label="Next nearby category" onClick={() => choose(index + 1)}><span aria-hidden="true">→</span></button>
        </div>
      </div>
      <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Left category navigation */}
        <div ref={tabs} className="flex min-w-0 gap-1.5 overflow-x-auto border-b border-line bg-tan/15 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4" role="group" aria-label="Nearby categories">
          {CATEGORIES.map((item, i) => (
            <button
              key={item.group}
              type="button"
              aria-pressed={index === i}
              aria-controls="nearby-category-panel"
              onClick={() => choose(i)}
              className={`flex min-h-[46px] shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra lg:whitespace-normal ${
                index === i
                  ? 'bg-brand text-white shadow-xs ring-1 ring-gold/25'
                  : 'text-muted hover:bg-cream hover:text-brand'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <CategoryIcon group={item.group} className={`size-4 shrink-0 ${index === i ? 'text-gold' : 'text-terra/70'}`} />
                <span className="truncate">{LABELS[item.group]}</span>
              </span>
              <span className={`text-[12px] font-bold tabular-nums shrink-0 ${index === i ? 'text-gold' : 'text-terra/50'}`} aria-hidden="true">
                {String(item.items.length).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        {/* Right active category panel */}
        <div id="nearby-category-panel" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${CATEGORIES.length}: ${category.group}`} aria-live={playing ? 'off' : 'polite'} className="relative min-w-0 px-5 py-6 sm:px-7 sm:py-7 min-h-[460px] sm:min-h-[380px] overflow-hidden">
          <BrandChakra subtle className="pointer-events-none absolute -bottom-16 -right-16 size-[200px] rotate-12 sm:-bottom-24 sm:-right-24 sm:size-[340px]" />
          <div className="relative z-10">
            {/* Header: Bold standout category title with icon and distance pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-terra text-white shadow-xs" aria-hidden="true">
                  <CategoryIcon group={category.group} className="size-6 text-white" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-terra">Nearby Category</span>
                  <h4 className="font-serif text-[28px] sm:text-[34px] font-bold text-brand leading-tight">
                    {LABELS[category.group]}
                  </h4>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-terra/30 bg-cream/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-terra shadow-2xs">
                <PinIcon className="size-3.5 text-terra" />
                <span>{category.group === 'Transport' ? 'Approx. Distance' : 'Distance From Site'}</span>
              </span>
            </div>

            {/* Landmark items list with prominent highlighted font size and distances */}
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {category.items.map(([name, distance]) => (
                <li
                  key={name}
                  className="group flex min-h-[76px] min-w-0 items-center justify-between gap-4 rounded-2xl border border-line/70 bg-cream/35 p-3.5 sm:p-4 transition-all duration-200 hover:border-terra/40 hover:bg-cream hover:shadow-xs"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white text-terra shadow-2xs ring-1 ring-terra/15 group-hover:bg-terra group-hover:text-white transition-colors" aria-hidden="true">
                      <PinIcon className="size-4" />
                    </span>
                    <span className="text-[15px] sm:text-[16px] font-bold leading-snug text-ink group-hover:text-brand transition-colors">
                      {name}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="whitespace-nowrap font-serif text-[24px] sm:text-[27px] font-bold text-terra tabular">
                      {distance}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {category.group === 'Transport' && (
              <p className="mt-4 text-[12px] leading-relaxed text-muted">
                Approximate road distances from the site. Distance varies by route and entry point.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
