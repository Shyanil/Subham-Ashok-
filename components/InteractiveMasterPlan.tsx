'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import { masterPlanHotspots, masterPlanLegend } from '@/content/plans';
import { LeadButton } from './lead/LeadButton';
import { ArrowUpRight } from './icons';
import { Lightbox } from './Lightbox';

const SOURCE = { width: 1323, height: 1189 };

/** One shared selection connects every printed location to its brochure legend. */
export function InteractiveMasterPlan() {
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState(false);
  const pendingCenter = useRef<{ x: number; y: number } | null>(null);
  const [rotated, setRotated] = useState(true);
  const viewport = useRef<HTMLDivElement>(null);
  const displayWidth = rotated ? SOURCE.width : SOURCE.height;
  const displayHeight = rotated ? SOURCE.height : SOURCE.width;
  const position = (point: { x: number; y: number }) => rotated ? point : { x: point.y, y: 100 - point.x };
  const changeZoom = (next: number) => {
    const el = viewport.current;
    if (el) pendingCenter.current = {
      x: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth,
      y: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight,
    };
    setZoom(Math.min(3, Math.max(1, next)));
  };
  useLayoutEffect(() => {
    const el = viewport.current;
    const center = pendingCenter.current;
    if (el && center) el.scrollTo({ left: el.scrollWidth * center.x - el.clientWidth / 2, top: el.scrollHeight * center.y - el.clientHeight / 2, behavior: 'instant' });
    pendingCenter.current = null;
  }, [zoom]);
  const rotate = () => {
    setRotated((value) => !value);
    setZoom(1);
    pendingCenter.current = null;
    viewport.current?.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  };

  const select = (number: number, reveal = false) => {
    setSelected(number);
    // When enlarged, legend selections reveal the corresponding location inside
    // the scrollable image, without moving the page or stealing keyboard focus.
    if (reveal && zoom > 1 && viewport.current) {
      const point = position(masterPlanHotspots.find((h) => h.number === number)!);
      const el = viewport.current;
      el.scrollTo({
        left: el.scrollWidth * point.x / 100 - el.clientWidth / 2,
        top: el.scrollHeight * point.y / 100 - el.clientHeight / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  };

  return (
    <div className="grid gap-6 rounded-[2rem] bg-white p-3 shadow-[var(--shadow-soft)] sm:p-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:p-6">
      <div className="min-w-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-3 pt-1">
          <p id="master-plan-help" className="text-[10px] font-bold uppercase tracking-[0.16em] text-terra">Explore the master plan</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button type="button" onClick={rotate} aria-pressed={rotated} aria-controls="master-plan-viewport" aria-label="Rotate master plan 90 degrees" className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-[12px] font-bold text-terra hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 7V3m0 4h-4M20 7a9 9 0 1 0 1 8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Rotate
            </button>
            <div role="group" aria-label="Master plan zoom" className="flex items-center rounded-full border border-line">
              <button type="button" onClick={() => changeZoom(zoom - 0.5)} disabled={zoom === 1} aria-label="Zoom out" aria-controls="master-plan-viewport" className="grid size-10 place-items-center rounded-full text-xl text-terra hover:bg-cream disabled:opacity-30">−</button>
              <button type="button" onClick={() => changeZoom(1)} aria-label="Fit master plan" className="min-h-10 min-w-12 text-[12px] font-semibold text-brand">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => changeZoom(zoom + 0.5)} disabled={zoom === 3} aria-label="Zoom in" aria-controls="master-plan-viewport" className="grid size-10 place-items-center rounded-full text-xl text-terra hover:bg-cream disabled:opacity-30">+</button>
            </div>
            <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Open full-size master plan" className="inline-flex min-h-10 items-center gap-1 text-[12px] font-bold text-terra hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra">
              Full size <ArrowUpRight className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="rounded-[1.5rem] bg-white">
        <div id="master-plan-viewport" ref={viewport} className="mx-auto overflow-auto overscroll-contain rounded-[1.5rem]" style={{ aspectRatio: `${displayWidth} / ${displayHeight}`, maxWidth: `${560 * displayWidth / displayHeight}px` }}>
          <div id="master-plan-image" className="relative overflow-hidden" style={{ width: `${zoom * 100}%`, aspectRatio: `${displayWidth} / ${displayHeight}`, containerType: 'inline-size' }}>
            <Image src="/brochure/master-plan-refined.webp" alt="Landscape master plan of Subham Ashok Heights showing Block A, Block B, green lawn, kids' play area, amphitheatre and driveways" width={1323} height={1189} sizes="(min-width: 768px) 640px, 100vw" quality={90} className="absolute left-1/2 top-1/2 max-w-none" style={{ width: rotated ? '100%' : `${SOURCE.width / SOURCE.height * 100}%`, height: rotated ? '100%' : `${SOURCE.height / SOURCE.width * 100}%`, transform: `translate(-50%, -50%) rotate(${rotated ? 0 : -90}deg)` }} />
            {masterPlanHotspots.map((point) => {
              const active = selected === point.number;
              const coordinates = position(point);
              return (
                <button key={point.id} type="button" aria-label={`${point.number}. ${masterPlanLegend[point.number - 1]}`} aria-pressed={active} aria-controls={`master-legend-${point.number}`} title={masterPlanLegend[point.number - 1]} onClick={() => select(point.number)} style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%`, width: 'clamp(8px, 2.5cqw, 24px)', height: 'clamp(8px, 2.5cqw, 24px)' }} className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${active ? 'z-10' : 'z-0 hover:z-10'}`}>
                  <span style={{ fontSize: 'clamp(6px, 1.3cqw, 11px)' }} className={`grid size-full place-items-center rounded-full border font-sans font-bold shadow-sm transition-[background-color,color,box-shadow] duration-150 ${active ? 'border-white bg-brand text-white ring-2 ring-brand/50' : 'border-brand/45 bg-gold text-deep group-hover:bg-brand group-hover:text-white'}`}>
                    {point.number}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        </div>
        <p className="min-h-9 px-2 pt-3 text-[13px] text-muted" aria-live="polite" aria-atomic="true">
          {selected === null ? 'Select a number to discover each space.' : <><span className="font-bold text-terra">{selected.toString().padStart(2, '0')}</span><span className="ml-2 text-ink">{masterPlanLegend[selected - 1]}</span></>}
        </p>
      </div>

      <div className="grid min-w-0 content-start gap-5">
        <div className="border-t border-line px-1 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-2">
          <p className="kicker">Legend</p>
          <ol className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1.5 sm:grid-cols-3 sm:gap-x-3 lg:grid-cols-1 xl:grid-cols-2">
            {masterPlanLegend.map((label, i) => {
              const number = i + 1;
              const active = selected === number;
              return (
                <li key={label} className="min-w-0">
                  <button id={`master-legend-${number}`} type="button" aria-pressed={active} onClick={() => select(number, true)} className={`flex min-h-12 w-full items-center gap-2 rounded-xl border p-2 text-left text-[13px] leading-snug transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra sm:gap-2.5 sm:text-[14.5px] ${active ? 'border-terra/35 bg-cream text-brand' : 'border-transparent text-ink/90 hover:bg-cream/70'}`}>
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-bold ${active ? 'bg-brand text-white' : 'bg-brand/10 text-brand'}`}>{number}</span>
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <LeadButton
          intent="visit"
          source="master_plan"
          title="Book A Site Visit"
          submitLabel="Book A Site Visit"
          className="btn w-full sm:w-fit sm:justify-self-end"
        >
          Book a Site Visit <ArrowUpRight className="arrow size-4" />
        </LeadButton>
      </div>
      <Lightbox items={[{ slug: 'master-plan', src: '/brochure/master-plan-refined.webp', alt: 'Subham Ashok Heights master plan', title: 'Master plan' }]} index={open ? 0 : null} onIndex={() => {}} onClose={() => setOpen(false)} />
    </div>
  );
}
