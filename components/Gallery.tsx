'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { site, type FilterId } from '@/content/site';
import { media } from '@/lib/media';
import { useLightbox } from '@/lib/store';
import { useReveal } from '@/hooks/useReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ImagePlane } from './ImagePlane';
import { Headline } from './Headline';
import { Magnetic } from './Magnetic';
import { Anchor3D } from './Anchor3D';

const AUTOPLAY_MS = 5000;
const pad = (n: number) => String(n).padStart(2, '0');

/** Filterable stage gallery: chips, prev/next, autoplay, arrow keys, swipe, lightbox. */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterId>('all');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const show = useLightbox((s) => s.show);
  const lightboxOpen = useLightbox((s) => s.open);
  useReveal(root);

  const images = useMemo(
    () => (filter === 'all' ? media : media.filter((m) => m.tags.includes(filter))),
    [filter],
  );
  const n = images.length;
  const current = images[Math.min(index, n - 1)];

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  // Autoplay only while visible, not hovered/focused, and no dialog is open.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || paused || !inView || lightboxOpen) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [playing, paused, inView, lightboxOpen, n]);

  // Swipe / drag.
  const drag = useRef<{ x: number; id: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    else if ((e.target as HTMLElement).closest('[data-stage-hit]')) show(images, index);
  };

  return (
    <section ref={root} id="gallery" className="gallery container-x relative" aria-labelledby="gallery-title">
      <Anchor3D kind="orbit" className="chapter__object chapter__object--gallery" />
      <div className="chapter__grid">
        <div className="chapter__meta">
          <p className="label text-[var(--gold)]" data-reveal>
            {site.gallery.label}
          </p>
        </div>
        <Headline lines={site.gallery.headline} id="gallery-title" className="chapter__title" />
        <div className="chapter__copy">
          <p className="chapter__body" data-reveal>
            {site.gallery.body(media.length)}
          </p>
        </div>
      </div>

      <div className="gallery__filters" role="group" aria-label="Filter images" data-reveal>
        {site.gallery.filters.map((f) => {
          const count = f.id === 'all' ? media.length : media.filter((m) => m.tags.includes(f.id as never)).length;
          if (!count) return null;
          return (
            <button
              key={f.id}
              type="button"
              className="chip"
              aria-pressed={filter === f.id}
              onClick={() => {
                setFilter(f.id);
                setIndex(0);
              }}
            >
              {f.label}
              <span className="chip__count">{pad(count)}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={stage}
        className="gallery__stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Project gallery"
        tabIndex={0}
        data-reveal
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            go(index + 1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            go(index - 1);
          } else if (e.key === 'Enter') show(images, index);
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <ImagePlane
          id="gallery"
          images={images}
          index={Math.min(index, n - 1)}
          renderWindow={1}
          tilt
          radius={4}
          depth={0.02}
          cursor="Drag"
          sizes="(max-width: 767px) 100vw, 90vw"
          className="gallery__plane"
        >
          <div
            data-stage-hit
            className="absolute inset-0 z-[1] touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
          />
        </ImagePlane>

        <div className="gallery__bar">
          <div className="min-w-0">
            <p className="label text-[var(--gold)]">
              {pad(index + 1)} / {pad(n)}
            </p>
            <p className="gallery__title" key={current?.slug}>
              {current?.title}
            </p>
          </div>
          <div className="gallery__controls">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={playing}
              aria-label={playing ? 'Pause autoplay' : 'Start autoplay'}
            >
              {playing ? '❚❚' : '▷'}
            </button>
            <button type="button" className="icon-btn" onClick={() => go(index - 1)} aria-label="Previous image">
              ←
            </button>
            <button type="button" className="icon-btn" onClick={() => go(index + 1)} aria-label="Next image">
              →
            </button>
            <Magnetic className="gallery__full">
              <button type="button" className="btn btn--small" onClick={() => show(images, index)}>
                {site.gallery.viewFull}
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="gallery__ticks" aria-hidden="true">
          {images.map((img, i) => (
            <span key={img.slug} data-active={i === index} />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {current ? `Image ${index + 1} of ${n}: ${current.title}${playing && !reduced ? ' (autoplay on)' : ''}` : ''}
      </p>
    </section>
  );
}
