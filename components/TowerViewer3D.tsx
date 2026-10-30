'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { getImage } from '@/lib/media';
import { track } from '@/lib/analytics';
import { hasWebGL } from '@/lib/capable';
import { HOTSPOTS, HOTSPOT_ZOOM, VIEWS, ZOOM_MAX, ZOOM_MIN, type ViewId } from './three/towerData';
import { LeadButton } from './lead/LeadButton';
import { ArrowUpRight, CloseIcon, SparkIcon } from './icons';

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

/**
 * Still-by-default interactive scene with visible block labels and zoom controls.
 * It loads near the viewport and pauses when it leaves.
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
  const poster = getImage(night ? 'aerial-night-view' : 'aerial-day-view');

  useEffect(() => setGl(hasWebGL()), []);
  useEffect(() => {
    if (!gl || !root.current) return;

    const io = new IntersectionObserver(
      ([e]) => {
        setPaused(!e.isIntersecting);
        if (e.isIntersecting) setStarted(true);
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
    <section id="explore" aria-labelledby="explore-title" className="section relative bg-sand" data-track-section="tower_3d">
      <div className="container-x">
      {/* Section headline and interaction instructions. */}
      <div className="mb-5 grid gap-5 border-b border-line pb-5 sm:mb-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-6">
        <div>
          <p className="kicker">
            <SparkIcon className="size-3" /> {t.eyebrow}
          </p>
          <h2 id="explore-title" className="h2 mt-3 !text-brand">
            Discover Your World, <em className="whitespace-nowrap italic text-terra">in 3D.</em>
          </h2>
        </div>

        <div className="lg:pb-3">
          <p className="max-w-md border-l-2 border-tan pl-4 text-[15px] leading-relaxed text-muted lg:ml-auto lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-4 lg:text-right">{t.body}</p>
        </div>
      </div>
      <div ref={root} data-reveal="3d" className="on-dark relative aspect-[4/5] min-h-[320px] w-full overflow-hidden rounded-[1.5rem] bg-[#120605] shadow-[var(--shadow-lift)] sm:aspect-[16/9] sm:rounded-[2rem] lg:aspect-[16/7] lg:min-h-[520px]">
        {started ? (
          <TowerScene night={night} view={view} spot={spot} zoom={zoom} onSpot={selectSpot} onZoom={setZoom} paused={paused} />
        ) : (
          <button type="button" onClick={start} disabled={gl !== true} aria-label="Explore the interactive image" className="absolute inset-0 h-full w-full border-0 bg-transparent p-0 disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold">
            <Image src={poster.src} alt={poster.alt} fill sizes="100vw" className="object-cover" />
          </button>        )}

        {gl !== false && (
          <div role="group" aria-label="Lighting" className="absolute inset-x-0 bottom-4 z-10 mx-auto flex w-fit rounded-full bg-black/65 p-1.5 shadow-lg ring-1 ring-white/20 backdrop-blur-md sm:bottom-6">
            <button type="button" className={seg + ' min-h-11 min-w-20'} aria-pressed={!night} onClick={() => setNight(false)}>Day</button>
            <button type="button" className={seg + ' min-h-11 min-w-20'} aria-pressed={night} onClick={() => setNight(true)}>Night</button>
          </div>
        )}
        {started && (
          <>
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
        <LeadButton
          intent="brochure"
          source="tower_3d"
          title="Download The Brochure"
          submitLabel="Download The Brochure"
          className="btn"
        >
          {t.cta} <ArrowUpRight className="arrow size-4" />
        </LeadButton>
      </div>
      </div>
    </section>
  );
}
