'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './icons';

type ImageItem = { slug: string; src: string; alt: string; title: string; blurDataURL?: string };
type Props = { items: ImageItem[]; index: number | null; onIndex: (i: number) => void; onClose: () => void };

/** In-page image viewer with zoom, gallery navigation and native modal focus handling. */
export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  const n = items.length;
  const item = index === null ? null : items[index];

  useEffect(() => {
    setZoom(1);
    viewport.current?.scrollTo(0, 0);
  }, [index, item?.src]);

  useEffect(() => {
    if (!item) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previous; };
  }, [!!item]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    else if (!item && d.open) d.close();
  }, [item]);

  const step = (dir: number) => index !== null && onIndex((index + dir + n) % n);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      const nodes = ref.current!.querySelectorAll<HTMLElement>('button:not([disabled])');
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={item ? `Image: ${item.title}` : 'Image viewer'}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
    >
      {item && index !== null && (
        <div
          className="flex h-full flex-col text-cream"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (zoom === 1 && Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className="flex items-center justify-between p-3 sm:p-4">
            <p className="tabular text-sm text-cream/80">
              {index + 1} / {n}
            </p>
            <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full bg-cream/10 hover:bg-cream/20" aria-label="Close" autoFocus>
              <CloseIcon />
            </button>
          </div>
          <div ref={viewport} className="relative min-h-0 flex-1 overflow-auto overscroll-contain">
            <div className="relative" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
              <Image key={item.slug} src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" placeholder={item.blurDataURL ? 'blur' : 'empty'} blurDataURL={item.blurDataURL} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
            <div className="min-w-0 flex-1 basis-40">
              <p className="font-serif text-xl !text-cream">{item.title}</p>
              <p className="text-xs text-cream/70">Artist&apos;s impression</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom === 1} className="grid size-11 place-items-center rounded-full bg-cream/10 text-xl disabled:opacity-30" aria-label="Zoom out">−</button>
              <button type="button" onClick={() => { setZoom(1); viewport.current?.scrollTo(0, 0); }} className="min-h-11 px-2 text-sm" aria-label="Reset image zoom">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => setZoom((z) => Math.min(3, z + 0.5))} disabled={zoom === 3} className="grid size-11 place-items-center rounded-full bg-cream/10 text-xl disabled:opacity-30" aria-label="Zoom in">+</button>
              {n > 1 && <>
              <button type="button" onClick={() => step(-1)} className="grid size-11 place-items-center rounded-full bg-cream/10 text-xl hover:bg-cream/20" aria-label="Previous image">
                ←
              </button>
              <button type="button" onClick={() => step(1)} className="grid size-11 place-items-center rounded-full bg-cream/10 text-xl hover:bg-cream/20" aria-label="Next image">
                →
              </button>
              </>}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            Image {index + 1} of {n}: {item.title}
          </p>
        </div>
      )}
    </dialog>
  );
}
