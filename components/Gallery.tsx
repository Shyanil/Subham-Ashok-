'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { site, type FilterId } from '@/content/site';
import { media, isNight, objectPosition, type MediaItem } from '@/lib/media';
import { SectionHeading } from './SectionHeading';
import { Lightbox } from './Lightbox';
import { ArrowUpRight } from './icons';

// Daylight first; the night renders live at the end of the gallery.
const ordered = [...media].sort((a, b) => Number(isNight(a)) - Number(isNight(b)));
const INITIAL = 6;

/** Gallery: rounded image cards with italic serif labels, filters, lightbox. */
export function Gallery() {
  const g = site.gallery;
  const [filter, setFilter] = useState<FilterId>('all');
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const items = useMemo<MediaItem[]>(() => (filter === 'all' ? ordered : ordered.filter((m) => m.tags.includes(filter))), [filter]);
  const shown = all ? items : items.slice(0, INITIAL);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section bg-sand" data-track-section="gallery">
      <div className="container-x">
        <SectionHeading id="gallery-title" eyebrow={g.eyebrow} title={g.title} body={`${media.length} views of Subham Ashok Heights — striking architecture, green open spaces and thoughtful interiors.`} />

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter images">
          {g.filters.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m, i) => (
            <li key={m.slug} data-reveal="3d">
              <button
                type="button"
                data-tilt
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-deep text-left shadow-[var(--shadow-soft)]"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(i);
                }}
                aria-label={`Open image: ${m.title}`}
              >
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  placeholder="blur"
                  blurDataURL={m.blurDataURL}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ objectPosition: objectPosition(m.focus) }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-80" aria-hidden="true" />
                <span className="absolute bottom-6 left-7 right-7 flex items-end justify-between gap-3">
                  <span className="font-serif text-[28px] italic leading-none text-white">{m.title}</span>
                  <span className="grid size-10 shrink-0 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3">
          {items.length > INITIAL && (
            <button type="button" className="btn btn--outline" onClick={() => setAll((v) => !v)} aria-expanded={all}>
              {all ? 'Show fewer' : `Open full gallery (${items.length})`} <ArrowUpRight className="arrow size-4" />
            </button>
          )}
          <p className="text-[12px] text-muted">Illustrative images and artist&apos;s impressions.</p>
        </div>
      </div>

      <Lightbox
        items={items}
        index={open}
        onIndex={setOpen}
        onClose={() => {
          setOpen(null);
          opener.current?.focus({ preventScroll: true });
        }}
      />
    </section>
  );
}
