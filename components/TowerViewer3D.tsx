'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { getImage, objectPosition } from '@/lib/media';
import { track } from '@/lib/analytics';
import { capable3d as capable, hasWebGL } from '@/lib/capable';
import { HOTSPOTS, HOTSPOT_ZOOM, VIEWS, ZOOM_MAX, ZOOM_MIN, type ViewId } from './three/towerData';
import { LeadButton } from './lead/LeadButton';
import { ArrowUpRight, CloseIcon, PlayIcon, SparkIcon } from './icons';

// Three.js + R3F live in their own chunk, fetched on demand.
const TowerScene = dynamic(() => import('./three/TowerScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-[#120605] text-[12px] font-bold uppercase tracking-[0.2em] text-gold" role="status">
      <span className="grid justify-items-center gap-4">
        <span className="scene-loader" aria-hidden="true"><i /><i /><i /></span>
        Building the 3D model…
      </span>
    </div>
  ),
});

/** Renders shown beside the headline — the masterplan aerial first, then key spaces. */
const VIEW_STRIP = [
  { slug: 'aerial-day-view', label: 'Master view' },
  { slug: 'swimming-pool-view', label: 'Pool deck' },
  { slug: 'club-house', label: 'Clubhouse' },
  { slug: 'lift-lobby', label: 'Lift lobby' },
];

/**
 * Large interactive 3D scene. It starts near the viewport on capable devices and pauses when
 * it leaves, while other WebGL devices can start it on demand.
 */
export function TowerViewer3D() {
  const t = site.tower;
  const root = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState<boolean | null>(null);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [night, setNight] = useState(false);
  const [view, setView] = useState<ViewId>('aerial');
  const [spot, setSpot] = useState<string | null>(null);
  const [zoom, setZoom] = useState(VIEWS[0].zoom);
  const poster = getImage('aerial-night-view');

  useEffect(() => setGl(hasWebGL()), []);
  useEffect(() => {
    if (!gl || !root.current) return;
    const autoStart = capable();
    const io = new IntersectionObserver(
      ([e]) => {
        setPaused(!e.isIntersecting);
        if (e.isIntersecting && autoStart) setStarted(true);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, [gl]);

  const start = () => {
    setStarted(true);
    setPaused(false);
    track('tour_start', { source: 'tower_3d' });
  };
  const viewZoom = (id: ViewId) => (VIEWS.find((v) => v.id === id) ?? VIEWS[0]).zoom;
  const selectSpot = (id: string | null) => {
    setSpot(id);
    setZoom(id ? HOTSPOT_ZOOM : viewZoom(view));
  };
  const selectView = (id: ViewId) => {
    setSpot(null);
    setView(id);
    setZoom(viewZoom(id));
  };
  const zoomBy = (f: number) => setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z * f)));
  const resetView = () => selectView('aerial');
  const isOverview = !spot && view === 'aerial' && zoom <= viewZoom('aerial') + 0.01;
  const active = HOTSPOTS.find((h) => h.id === spot);
  const zoomBtn = 'grid size-9 sm:size-10 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-35 disabled:hover:bg-transparent';
  const seg = 'whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] sm:px-3.5 sm:py-2 sm:text-[12px] sm:tracking-[0.14em] text-white/70 transition-colors hover:text-white aria-pressed:bg-gold aria-pressed:text-deep';

  return (
    <section id="explore" aria-labelledby="explore-title" className="relative bg-sand" data-track-section="tower_3d">
      <div className="container-x py-12 sm:py-16 lg:py-24">
      {/* Editorial masthead: headline left, render strip + instructions right. */}
      <div className="mb-8 grid gap-8 border-b border-line pb-8 sm:mb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-10">
        <div>
          <p className="kicker">
            <SparkIcon className="size-3" /> {t.eyebrow}
          </p>
          <h2 className="h2 mt-6 !text-brand">
            Discover Your World, <em className="whitespace-nowrap italic text-terra">in 3D.</em>
          </h2>
        </div>

        <div className="lg:pb-3">
          <ul className="grid grid-cols-4 gap-2 sm:gap-3">
            {VIEW_STRIP.map(({ slug, label }, n) => {
              const img = getImage(slug);
              return (
                <li key={slug} data-reveal>
                  <a href="#gallery" className="group block" data-tilt>
                    <span className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-tan ring-1 ring-line sm:rounded-2xl">
                      <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 420px, 70vw" quality={90} className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: objectPosition(img.focus) }} />
                      <span className="absolute left-1.5 top-1.5 font-serif text-[13px] italic text-white drop-shadow sm:left-2.5 sm:top-2 sm:text-[15px]">0{n + 1}</span>
                    </span>
                    <span className="mt-2 block truncate text-[10px] font-bold uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-ink sm:text-[11px]">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 max-w-md border-l-2 border-tan pl-4 text-[15px] leading-relaxed text-muted lg:ml-auto lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-4 lg:text-right">{t.body}</p>
        </div>
      </div>
      <div ref={root} data-reveal="3d" className="on-dark relative aspect-[4/5] min-h-[320px] w-full overflow-hidden rounded-[1.5rem] bg-[#120605] shadow-[var(--shadow-lift)] sm:aspect-[16/9] sm:rounded-[2rem] lg:aspect-[16/7] lg:min-h-[520px]">
        {started ? (
          <TowerScene night={night} view={view} spot={spot} zoom={zoom} onSpot={selectSpot} onZoom={setZoom} paused={paused} />
        ) : (
          <>
            <Image src={poster.src} alt="" fill sizes="100vw" className="scale-105 object-cover opacity-45 blur-[2px]" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,transparent,rgba(18,6,5,.85))]" aria-hidden="true" />
            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
              {gl !== false ? (
                <button type="button" onClick={start} className="group relative grid size-20 place-items-center rounded-full bg-gold text-deep shadow-[0_0_60px_rgba(229,168,60,.45)] transition-transform hover:scale-105 sm:size-24" aria-label="Start the interactive 3D model">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold" aria-hidden="true" />
                  <span className="absolute -inset-5 rounded-full border border-white/10" aria-hidden="true" />
                  <PlayIcon className="relative ml-1 size-9" />
                </button>
              ) : null}
              <h2 id="explore-title" className="h2 mt-6 !text-white" data-reveal>
                Discover Your World, <em className="whitespace-nowrap italic text-gold">in 3D.</em>
              </h2>
              <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.4em] text-white/65">
                {gl === false ? t.fallbackNote : t.body}
              </p>
            </div>
          </>
        )}

        {started && (
          <>
            <h2 id="explore-title" className="sr-only">
              See the towers in 3D — interactive tour
            </h2>
            <p className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/45 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur sm:left-8 sm:top-8 sm:gap-2 sm:px-3 sm:text-[12px] sm:tracking-[0.2em]">
              <svg viewBox="0 0 24 24" className="size-3.5 sm:size-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M8 7l-4 5 4 5M16 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Drag to explore<span className="hidden sm:inline"> · 3D depth view</span>
            </p>
            {/* Phones: lighting toggle sits top-right so the bottom bar stays one slim row. */}
            <div role="group" aria-label="Lighting" className="absolute right-3 top-3 flex rounded-full bg-black/55 p-1 ring-1 ring-white/10 backdrop-blur-md sm:hidden">
              <button type="button" className={seg} aria-pressed={!night} onClick={() => setNight(false)}>
                Day
              </button>
              <button type="button" className={seg} aria-pressed={night} onClick={() => setNight(true)}>
                Night
              </button>
            </div>
            <div className="absolute inset-x-3 bottom-3 flex justify-center sm:bottom-6">
              <div className="flex max-w-full flex-wrap items-center justify-center gap-x-1 gap-y-0.5 rounded-[1.25rem] bg-black/55 p-1 ring-1 ring-white/10 backdrop-blur-md sm:flex-nowrap sm:rounded-full">
                <div role="group" aria-label="Lighting" className="hidden shrink-0 sm:flex">
                  <button type="button" className={seg} aria-pressed={!night} onClick={() => setNight(false)}>
                    Day
                  </button>
                  <button type="button" className={seg} aria-pressed={night} onClick={() => setNight(true)}>
                    Night
                  </button>
                </div>
                <span className="mx-1 hidden h-5 w-px shrink-0 bg-white/15 sm:block" aria-hidden="true" />
                <div role="group" aria-label="Camera view" className="flex shrink-0">
                  {VIEWS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={seg}
                      aria-pressed={view === v.id && !spot}
                      onClick={() => selectView(v.id)}
                    >
                      {v.short}
                    </button>
                  ))}
                </div>
                <span className="mx-1 hidden h-5 w-px shrink-0 bg-white/15 sm:block" aria-hidden="true" />
                <label className="sr-only" htmlFor="tower-amenity">
                  Go to amenity
                </label>
                <select
                  id="tower-amenity"
                  value={spot ?? ''}
                  onChange={(e) => selectSpot(e.target.value || null)}
                  className="w-full shrink-0 cursor-pointer rounded-full border-t border-white/10 bg-transparent py-1 pl-3 pr-2 text-center text-[11px] sm:w-auto sm:border-0 sm:py-2 sm:text-left sm:text-[12px] font-bold uppercase tracking-[0.14em] text-white [&>option]:text-ink"
                >
                  <option value="">Amenities</option>
                  {HOTSPOTS.map((h, n) => (
                    <option key={h.id} value={h.id}>
                      {n + 1}. {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              {active ? `${active.name}: ${active.note}` : ''}
            </p>
            {active && (
              <div className="absolute inset-x-3 top-12 rounded-2xl sm:inset-x-auto sm:right-8 sm:top-8 sm:max-w-[260px] bg-white/95 p-4 pr-11 text-ink shadow-xl">
                <button type="button" onClick={() => selectSpot(null)} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink" aria-label="Close and zoom out">
                  <CloseIcon className="size-4" />
                </button>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-terra">Amenity</p>
                <p className="mt-1 font-serif text-[24px] leading-none">{active.name}</p>
                <p className="mt-1.5 text-[13px] text-muted">{active.note}</p>
                <button type="button" onClick={resetView} className="mt-3 text-[12px] font-bold uppercase tracking-[0.14em] text-terra underline-offset-4 hover:underline">
                  ← Back to full view
                </button>
              </div>
            )}

            {/* Zoom controls: always available, so a zoomed-in amenity view can be backed out of. */}
            <div role="group" aria-label="Zoom" className="absolute left-2 top-1/2 flex -translate-y-1/2 flex-col gap-0.5 rounded-full bg-black/55 p-0.5 sm:gap-1 sm:p-1 ring-1 ring-white/10 backdrop-blur-md sm:left-6">
              <button type="button" className={zoomBtn} onClick={() => zoomBy(1.25)} disabled={zoom >= ZOOM_MAX - 0.01} aria-label="Zoom in">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
              </button>
              <button type="button" className={zoomBtn} onClick={() => zoomBy(1 / 1.25)} disabled={zoom <= ZOOM_MIN + 0.01} aria-label="Zoom out">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M5 12h14" strokeLinecap="round" /></svg>
              </button>
              <span className="mx-auto h-px w-5 bg-white/15" aria-hidden="true" />
              <button type="button" className={zoomBtn} onClick={resetView} disabled={isOverview} aria-label="Reset to full view">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <LeadButton intent="brochure" source="tower_3d" className="btn">
          {t.cta} <ArrowUpRight className="arrow size-4" />
        </LeadButton>
      </div>
      </div>
    </section>
  );
}
