'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { site } from '@/content/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Chapter } from './Chapter';
import { AmenityIcon } from './AmenityIcon';

const AUTOPLAY_MS = 3200;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Amenities as a full-bleed card carousel: cards sweep in from the right as the
 * section scrolls into view, then the rail advances on its own (paused on hover,
 * focus, touch, off-screen and with reduced motion). Native scroll-snap underneath,
 * so trackpads, touch and keyboard all work without a custom drag layer.
 */
export function Amenities() {
  const a = site.amenities;
  const items = useMemo(() => a.groups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.title }))), [a.groups]);
  const rail = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  const step = useCallback(() => {
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>('.amen-card');
    if (!el || !card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
  }, []);

  const go = useCallback(
    (dir: number) => {
      const el = rail.current;
      if (!el) return;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (dir > 0 && end) el.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
      else el.scrollBy({ left: dir * step(), behavior: 'smooth' });
    },
    [step],
  );

  // Progress bar + counter follow the rail's scroll position.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${0.08 + p * 0.92})`;
      const s = step();
      if (s) setIndex(Math.min(items.length - 1, Math.round(el.scrollLeft / s)));
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [items.length, step]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !playing || hold || !inView) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [reduced, playing, hold, inView, go]);

  // Cards sweep in from the right as the rail scrolls into view.
  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        '.amen-card',
        { x: 140, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: wrap.current, start: 'top 85%', once: true },
        },
      );
    },
    { scope: wrap, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <Chapter id="amenities" label={a.label} headline={a.headline} body={a.body} className="surface-light amenities">
      <div
        ref={wrap}
        className="amen-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Amenities"
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
        onPointerDown={(e) => e.pointerType !== 'mouse' && setHold(true)}
        onPointerUp={(e) => {
          // Touch: resume auto-scroll a few seconds after the finger lifts.
          if (e.pointerType !== 'mouse') window.setTimeout(() => setHold(false), 4000);
        }}
      >
        <ul ref={rail} className="amen-carousel__rail" tabIndex={0} aria-label="Amenity list, scroll sideways">
          {items.map((item, i) => (
            <li key={item.name} className="amen-card">
              <span className="amen-card__top">
                <span className="amen-card__icon">
                  <AmenityIcon name={item.icon} />
                </span>
                <span className="label amen-card__n">{pad(i + 1)}</span>
              </span>
              <span className="label amen-card__group">{item.group}</span>
              <span className="amen-card__name">{item.name}</span>
              <span className="amen-card__note">{item.note}</span>
            </li>
          ))}
        </ul>

        <div className="container-x amen-carousel__bar">
          <span className="label amen-carousel__count" aria-hidden="true">
            {pad(index + 1)} / {pad(items.length)}
          </span>
          <span className="amen-carousel__progress" aria-hidden="true">
            <span ref={bar} className="amen-carousel__progress-fill" />
          </span>
          <div className="flex items-center gap-2">
            {!reduced && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                aria-label={playing ? 'Pause auto-scroll' : 'Start auto-scroll'}
              >
                {playing ? '❚❚' : '▷'}
              </button>
            )}
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Previous amenities">
              ←
            </button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next amenities">
              →
            </button>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
