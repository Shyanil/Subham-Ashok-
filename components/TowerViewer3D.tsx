'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { getImage } from '@/lib/media';
import { track } from '@/lib/analytics';
import { capable3d as capable, hasWebGL } from '@/lib/capable';
import { HOTSPOTS, VIEWS, type ViewId } from './three/towerData';
import { LeadButton } from './lead/LeadButton';
import { ArrowUpRight, PlayIcon } from './icons';

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
  const active = HOTSPOTS.find((h) => h.id === spot);
  const seg = 'whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white aria-pressed:bg-gold aria-pressed:text-deep';

  return (
    <section id="explore" aria-labelledby="explore-title" className="container-x py-12 sm:py-16 lg:py-24" data-track-section="tower_3d">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">{t.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-serif text-[42px] leading-[0.98] text-ink sm:text-[58px]">Explore the homes <em className="text-terra">in 3D.</em></h2>
        </div>
        <p className="max-w-md text-[14px] leading-relaxed text-muted sm:text-right">{t.body}</p>
      </div>
      <div ref={root} className="on-dark relative aspect-[4/3] min-h-[320px] overflow-hidden rounded-[1.5rem] bg-[#120605] shadow-[var(--shadow-lift)] sm:aspect-[16/9] sm:rounded-[2rem] lg:aspect-[16/7] lg:min-h-[520px]">
        {started ? (
          <TowerScene night={night} view={view} spot={spot} onSpot={setSpot} paused={paused} />
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
              <h2 id="explore-title" className="mt-6 font-serif text-[38px] leading-[0.98] !text-white sm:text-[64px]" data-reveal>
                Explore the homes <em className="italic text-gold">in 3D</em>
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
            <p className="pointer-events-none absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur sm:left-8 sm:top-8">
              Drag to rotate · 3D site model
            </p>
            <div className="absolute inset-x-3 bottom-3 flex justify-center sm:bottom-6">
              <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-black/55 p-1.5 ring-1 ring-white/10 backdrop-blur-md [scrollbar-width:none]">
                <div role="group" aria-label="Lighting" className="flex shrink-0">
                  <button type="button" className={seg} aria-pressed={!night} onClick={() => setNight(false)}>
                    Day
                  </button>
                  <button type="button" className={seg} aria-pressed={night} onClick={() => setNight(true)}>
                    Night
                  </button>
                </div>
                <span className="mx-1 h-5 w-px shrink-0 bg-white/15" aria-hidden="true" />
                <div role="group" aria-label="Camera view" className="flex shrink-0">
                  {VIEWS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={seg}
                      aria-pressed={view === v.id && !spot}
                      onClick={() => {
                        setSpot(null);
                        setView(v.id);
                      }}
                    >
                      {v.short}
                    </button>
                  ))}
                </div>
                <span className="mx-1 h-5 w-px shrink-0 bg-white/15" aria-hidden="true" />
                <label className="sr-only" htmlFor="tower-amenity">
                  Go to amenity
                </label>
                <select
                  id="tower-amenity"
                  value={spot ?? ''}
                  onChange={(e) => setSpot(e.target.value || null)}
                  className="shrink-0 cursor-pointer rounded-full bg-transparent py-2 pl-3 pr-2 text-[12px] font-bold uppercase tracking-[0.14em] text-white [&>option]:text-ink"
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
              <div className="absolute right-4 top-16 max-w-[240px] rounded-2xl bg-white/95 p-4 text-ink shadow-xl sm:right-8 sm:top-8">
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-terra">Amenity</p>
                <p className="mt-1 font-serif text-[24px] leading-none">{active.name}</p>
                <p className="mt-1.5 text-[13px] text-muted">{active.note}</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <LeadButton intent="brochure" source="tower_3d" className="btn">
          {t.cta} <ArrowUpRight className="arrow size-4" />
        </LeadButton>
      </div>
    </section>
  );
}
