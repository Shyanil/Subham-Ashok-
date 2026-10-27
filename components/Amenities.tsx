'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { site } from '@/content/site';
import { getImage, objectPosition } from '@/lib/media';
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

/** Closest project render for each lifestyle amenity (by icon key). */
const AMENITY_IMAGE: Record<string, string> = {
  pool: 'swimming-pool-view',
  gym: 'gym',
  club: 'club-house',
  games: 'indoor-games',
  kids: 'kids-play-day',
  lawn: 'aerial-day-view',
  opengym: 'kids-play-day',
  amphi: 'aerial-night-view',
  lobby: 'lift-lobby',
  parking: 'gate-view',
};

/** Pointer tilt via CSS variables (--rx/--ry/--px/--py); styles live in globals.css under .amenity-card. */
const onTilt = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`);
  el.style.setProperty('--ry', `${(x * 11).toFixed(2)}deg`);
  el.style.setProperty('--px', x.toFixed(3));
  el.style.setProperty('--py', y.toFixed(3));
};
const offTilt = (e: PointerEvent<HTMLElement>) => {
  for (const p of ['--rx', '--ry', '--px', '--py']) e.currentTarget.style.removeProperty(p);
};

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
  // Tapped card (touch has no hover, so a tap lifts and highlights it).
  const [active, setActive] = useState<string | null>(null);
  const tilt = (key: string) => ({
    'aria-pressed': active === key,
    onClick: () => setActive((k) => (k === key ? null : key)),
    onPointerMove: onTilt,
    onPointerLeave: offTilt,
  });

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
            <h2 id="amenities-title" className="h2 mt-5 lg:whitespace-nowrap">
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
                  // The 16:9 renders are cropped into a 4:5 stage on phones (≈2.3× wider than the
                  // viewport) and zoomed 1.1×, so request a source wide enough to stay sharp.
                  sizes="(min-width: 1280px) 1200px, (min-width: 640px) 100vw, 260vw"
                  quality={90}
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

        {a.groups.map((g, gi) => {
          const gallery = gi === 0;
          return (
            <div key={g.title} className="mt-16">
              <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                <div data-reveal>
                  <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-terra">
                    {String(gi + 1).padStart(2, '0')} — {g.items.length} amenities
                  </p>
                  <h3 className="mt-2 font-serif text-[34px] leading-none sm:text-[44px]">
                    {gallery ? g.title : <em className="text-terra">{g.title}</em>}
                  </h3>
                </div>
                {gallery && (
                  <div className="flex gap-2" aria-label={`${g.title} carousel controls`}>
                    <button type="button" onClick={() => scrollAmenities(g.title, -1)} aria-label={`Previous ${g.title} amenities`} className="grid size-10 place-items-center rounded-full border border-line text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button type="button" onClick={() => scrollAmenities(g.title, 1)} aria-label={`Next ${g.title} amenities`} className="grid size-10 place-items-center rounded-full border border-line text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  </div>
                )}
              </div>

              {gallery ? (
                <ul ref={(el) => { rails.current[g.title] = el; }} aria-label={`${g.title} amenities`} className="amenity-rail -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-10 pt-8 [scrollbar-width:none] sm:mx-0 sm:px-1">
                  {g.items.map((it, index) => {
                    const img = getImage(AMENITY_IMAGE[it.icon] ?? 'aerial-day-view');
                    const key = `${gi}-${index}`;
                    return (
                      <li key={it.name} className="w-[min(76vw,290px)] shrink-0 snap-center sm:w-[290px]">
                        <button type="button" className="amenity-card group block w-full text-left" data-active={active === key} {...tilt(key)}>
                          <span className="amenity-card__media relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-tan">
                            <Image src={img.src} alt="" fill sizes="(min-width: 640px) 760px, 200vw" quality={90} className="amenity-card__img object-cover" style={{ objectPosition: objectPosition(img.focus) }} />
                            <span className="absolute inset-0 bg-gradient-to-t from-[#1f0b08]/70 via-transparent to-transparent" aria-hidden="true" />
                            <span className="amenity-card__chip absolute left-4 top-4 grid size-11 place-items-center rounded-2xl bg-white/85 text-terra backdrop-blur" aria-hidden="true">
                              <AmenityIcon name={it.icon} className="size-5" />
                            </span>
                            <span className="absolute right-4 top-4 font-serif text-[22px] italic leading-none text-white/90" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            <span className="amenity-card__more absolute inset-x-4 bottom-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Lifestyle · Subham Ashok Heights</span>
                          </span>
                          <span className="amenity-card__body relative -mt-10 mx-3 block rounded-[1.25rem] border border-line bg-white px-5 pb-4 pt-4 shadow-[var(--shadow-soft)]">
                            <span className="block font-serif text-[26px] leading-[1.05] text-ink">{it.name}</span>
                            <span className="mt-1.5 block text-[13.5px] leading-snug text-muted">{it.note}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul aria-label={`${g.title} amenities`} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                  {g.items.map((it, index) => {
                    const key = `${gi}-${index}`;
                    const feature = index === 0;
                    // Asymmetric bento: feature tile 2×2, last tile 2 wide so no row is left with an orphan.
                    const span = feature ? 'col-span-2 lg:row-span-2' : index === g.items.length - 1 ? 'col-span-2' : '';
                    return (
                      <li key={it.name} className={span}>
                        <button
                          type="button"
                          className={`amenity-card amenity-tile group flex h-full w-full flex-col rounded-[1.75rem] border p-5 text-left sm:p-6 ${feature ? 'dark-card min-h-[220px] border-deep lg:min-h-[316px]' : 'min-h-[150px] border-line bg-cream/70'}`}
                          data-active={active === key}
                          {...tilt(key)}
                        >
                          <span className="flex items-start justify-between">
                            <span className={`amenity-card__chip grid place-items-center rounded-2xl ${feature ? 'size-14 bg-white/10 text-gold' : 'size-11 bg-white text-terra shadow-[var(--shadow-soft)]'}`} aria-hidden="true">
                              <AmenityIcon name={it.icon} className={feature ? 'size-7' : 'size-5'} />
                            </span>
                            <span className={`font-serif text-[20px] italic leading-none ${feature ? 'text-gold' : 'text-terra/50'}`} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                          </span>
                          <span className={`mt-auto block pt-6 font-serif leading-[1.05] ${feature ? 'text-[34px] text-white sm:text-[44px]' : 'text-[21px] text-ink sm:text-[24px]'}`}>{it.name}</span>
                          <span className={`mt-1.5 block text-[13px] leading-snug ${feature ? 'text-white/75 sm:text-[15px]' : 'text-muted'}`}>{it.note}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
