'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { getImage } from '@/lib/media';
import { Accent } from './Accent';
import { AmenityIcon } from './AmenityIcon';
import { PauseIcon, PlayIcon, SparkIcon } from './icons';

const SLIDES = [
  { slug: 'swimming-pool-view', name: 'Swimming Pool', line: 'Infinity edge with sun deck' },
  { slug: 'club-house', name: 'Clubhouse', line: 'Community and banquet hall' },
  { slug: 'gym', name: 'Gymnasium', line: 'Garden-facing fitness centre' },
  { slug: 'indoor-games', name: 'Indoor Games', line: 'Billiards, table tennis, chess' },
  { slug: 'kids-play-day', name: "Kids' Play Area", line: 'Safe, landscaped and in view' },
  { slug: 'lift-lobby', name: 'Grand Lift Lobby', line: 'OTIS / KONE / Schindler lifts' },
];
const MS = 5000;

/** Autoplay image showcase with swipeable amenity card carousels. */
export function Amenities() {
  const a = site.amenities;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const rails = useRef<Record<string, HTMLUListElement | null>>({});
  const playing = !paused && visible && !reduced;

  const scrollAmenities = (group: string, direction: -1 | 1) => {
    const rail = rails.current[group];
    const card = rail?.querySelector('li');
    if (!rail || !card) return;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 16;
    rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), MS);
    return () => clearTimeout(t);
  }, [i, playing]);

  return (
    <section id="amenities" aria-labelledby="amenities-title" className="section" data-track-section="amenities">
      <div className="container-x">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div data-reveal>
            <p className="kicker">
              <SparkIcon className="size-3" /> {a.eyebrow}
            </p>
            <h2 id="amenities-title" className="h2 mt-5 max-w-[11ch]">
              <Accent text={a.title} />
            </h2>
          </div>
          <p className="side-note text-[16px]" data-reveal>
            {a.body}
          </p>
        </div>

        <div
          ref={stage}
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-deep shadow-[var(--shadow-lift)] sm:aspect-[16/8] sm:rounded-[3rem]"
          aria-roledescription="carousel"
          aria-label="Amenity showcase"
          data-reveal="3d"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {SLIDES.map((s, n) => {
            const img = getImage(s.slug);
            return (
              <div
                key={s.slug}
                className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden={n !== i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${n + 1} of ${SLIDES.length}: ${s.name}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className={`object-cover transition-transform duration-[6000ms] ease-out ${n === i ? 'scale-100' : 'scale-110'}`}
                  loading={n < 2 ? 'eager' : 'lazy'}
                  placeholder="blur"
                  blurDataURL={img.blurDataURL}
                />
              </div>
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />

          <div className="absolute inset-x-6 bottom-8 flex flex-wrap items-end justify-between gap-4 sm:inset-x-12 sm:bottom-12">
            <div className="text-white" aria-live={playing ? 'off' : 'polite'}>
              <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-gold">
                {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </p>
              <p key={i} className="mt-2 animate-[rise_.7s_cubic-bezier(.2,.8,.2,1)_both] font-serif text-[44px] italic leading-none sm:text-[64px]">
                {SLIDES[i].name}
              </p>
              <p className="mt-2 text-[14.5px] text-white/75">{SLIDES[i].line}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="grid size-11 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25"
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {paused || reduced ? <PlayIcon className="ml-0.5 size-4" /> : <PauseIcon />}
              </button>
              <div className="flex">
                {SLIDES.map((s, n) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setI(n)}
                    aria-label={`Show ${s.name}`}
                    aria-current={n === i}
                    className="group/dot grid h-11 w-8 place-items-center"
                  >
                    <span
                      className={`block h-1.5 w-8 origin-center rounded-full transition-[transform,background-color] duration-300 ease-out ${n === i ? 'scale-x-100 bg-gold' : 'scale-x-[0.2] bg-white/60 group-hover/dot:bg-white'}`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* progress bar */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden="true">
            <div
              key={`${i}-${playing}`}
              className="h-full origin-left bg-gold"
              style={{ transform: playing ? undefined : 'scaleX(0)', animation: playing ? `grow ${MS}ms linear forwards` : undefined }}
            />
          </div>
        </div>

        {a.groups.map((g) => (
          <div key={g.title} className="mt-14">
            <div className="flex items-center justify-between gap-4">
              <p className="kicker !text-muted" data-reveal>
                {g.title} · {g.items.length}
              </p>
              <div className="flex gap-2" aria-label={`${g.title} carousel controls`}>
                <button type="button" onClick={() => scrollAmenities(g.title, -1)} aria-label={`Previous ${g.title} amenities`} className="grid size-11 place-items-center rounded-full border border-line bg-white text-brand transition-colors hover:bg-cream">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button type="button" onClick={() => scrollAmenities(g.title, 1)} aria-label={`Next ${g.title} amenities`} className="grid size-11 place-items-center rounded-full border border-line bg-white text-brand transition-colors hover:bg-cream">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
            <ul ref={(el) => { rails.current[g.title] = el; }} aria-label={`${g.title} amenities`} className="-mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
              {g.items.map((it, index) => (
                <li key={it.name} className={`flex min-h-[230px] w-[min(78vw,280px)] shrink-0 snap-start flex-col rounded-[2rem] border p-6 transition-colors sm:w-[280px] ${index === 0 ? 'border-deep bg-deep text-white' : 'border-line bg-cream/70 text-ink hover:bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <span className={`grid size-12 place-items-center rounded-2xl ${index === 0 ? 'bg-white/10 text-gold' : 'bg-white text-terra'}`}>
                      <AmenityIcon name={it.icon} className="size-6" />
                    </span>
                    <span className={`font-serif text-[26px] italic leading-none ${index === 0 ? 'text-gold' : 'text-terra/50'}`}>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="mt-auto pt-8 font-serif text-[29px] leading-none">{it.name}</p>
                  <p className={`mt-2 text-[14px] leading-snug ${index === 0 ? 'text-white/75' : 'text-muted'}`}>{it.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
