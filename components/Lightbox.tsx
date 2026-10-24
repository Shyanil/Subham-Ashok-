'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { MediaItem } from '@/lib/media';
import { CloseIcon } from './icons';

type Props = { items: MediaItem[]; index: number | null; onIndex: (i: number) => void; onClose: () => void };

/** Full-image viewer on a native <dialog>: arrows, swipe, Esc, focus trapped to its three buttons. */
export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const n = items.length;
  const item = index === null ? null : items[index];

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
      const nodes = ref.current!.querySelectorAll<HTMLElement>('button');
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
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
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
          <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <Image key={item.slug} src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" placeholder="blur" blurDataURL={item.blurDataURL} />
          </div>
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <div>
              <p className="font-serif text-xl !text-cream">{item.title}</p>
              <p className="text-xs text-cream/70">Artist&apos;s impression</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} className="grid size-11 place-items-center rounded-full bg-cream/10 text-xl hover:bg-cream/20" aria-label="Previous image">
                ←
              </button>
              <button type="button" onClick={() => step(1)} className="grid size-11 place-items-center rounded-full bg-cream/10 text-xl hover:bg-cream/20" aria-label="Next image">
                →
              </button>
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
