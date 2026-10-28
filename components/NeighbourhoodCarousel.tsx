'use client';

import { useEffect, useRef, useState } from 'react';
import { keyDistances } from '@/content/plans';

const CATEGORIES = keyDistances.filter((category) => category.group !== 'Showrooms');
const LABELS: Record<string, string> = {
  Education: 'Schools & university',
  Hospitals: 'Hospitals',
  'Sports and leisure': 'Sports & leisure',
  'Shopping and markets': 'Shopping & markets',
  Banks: 'Banks',
  Civic: 'Civic services',
  Temples: 'Places of worship',
};

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
      <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white lg:grid-cols-[230px_minmax(0,1fr)]">
        <div ref={tabs} className="flex min-w-0 gap-1 overflow-x-auto border-b border-line bg-tan/15 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4" role="group" aria-label="Nearby categories">
          {CATEGORIES.map((item, i) => (
            <button key={item.group} type="button" aria-pressed={index === i} aria-controls="nearby-category-panel" onClick={() => choose(i)} className={`flex min-h-11 shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra lg:whitespace-normal lg:text-[13px] ${index === i ? 'bg-brand text-white' : 'text-muted hover:bg-cream hover:text-brand'}`}>
              {LABELS[item.group]}<span className={index === i ? 'text-gold' : 'text-terra/50'} aria-hidden="true">{String(item.items.length).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <div id="nearby-category-panel" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${CATEGORIES.length}: ${category.group}`} aria-live={playing ? 'off' : 'polite'} className="min-w-0 px-5 py-6 sm:px-7 sm:py-7 min-h-[540px] sm:min-h-[390px]">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
            <p className="font-serif text-[26px] italic leading-tight text-terra sm:text-[30px]">{LABELS[category.group]}</p>
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">Distance</span>
          </div>
          <ul className="mt-2 grid gap-x-7 sm:grid-cols-2">
            {category.items.map(([name, distance]) => (
              <li key={name} className="flex min-h-[84px] min-w-0 items-center justify-between gap-4 border-b border-line/70 py-4">
                <span className="max-w-[230px] text-[13px] leading-relaxed text-ink sm:text-[14px]">{name}</span>
                <span className="shrink-0 whitespace-nowrap font-serif text-[22px] text-terra">{distance}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
