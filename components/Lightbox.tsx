'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { objectPosition } from '@/lib/media';
import { useLightbox, useScroll } from '@/lib/store';

type Orientation = 'horizontal' | 'vertical';
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Full-image viewer on a native <dialog> (top-layer, page made inert) with an
 * explicit focus trap, arrow keys, and a Horizontal / Vertical framing toggle.
 * Vertical shows a portrait crop that can be dragged to pan.
 */
export function Lightbox() {
  const { images, index, open, close, setIndex, returnFocus } = useLightbox();
  const lock = useScroll((s) => s.lock);
  const dialog = useRef<HTMLDialogElement>(null);
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [pan, setPan] = useState(0.5);
  const drag = useRef<{ x: number; pan: number } | null>(null);
  const n = images.length;
  const item = images[index];

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lock(true);
    } else if (!open && d.open) {
      d.close();
    }
  }, [open, lock]);

  useEffect(() => setPan(item?.mobileFocus[0] ?? 0.5), [item]);

  const onClose = () => {
    lock(false);
    close();
    returnFocus?.focus?.({ preventScroll: true });
  };

  const step = (d: number) => setIndex(((index + d) % n + n) % n);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      const focusables = dialog.current!.querySelectorAll<HTMLElement>('button:not([disabled])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
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
      ref={dialog}
      className="lightbox"
      aria-label={item ? `Full image: ${item.title}` : 'Full image'}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      {open && item && (
        <div className="lightbox__inner">
          <div className="lightbox__top">
            <p className="label text-[var(--gold)]">
              {pad(index + 1)} / {pad(n)}
            </p>
            <div className="lightbox__toggle" role="group" aria-label="Framing">
              {(['horizontal', 'vertical'] as const).map((o) => (
                <button key={o} type="button" aria-pressed={orientation === o} onClick={() => setOrientation(o)} className="label">
                  {o === 'horizontal' ? 'Horizontal' : 'Vertical'}
                </button>
              ))}
            </div>
            <button type="button" className="label link-underline" onClick={onClose} autoFocus>
              Close ×
            </button>
          </div>

          <div
            className="lightbox__stage"
            data-orientation={orientation}
            data-cursor={orientation === 'vertical' ? 'Drag' : undefined}
            onPointerDown={(e) => {
              if (orientation !== 'vertical') return;
              drag.current = { x: e.clientX, pan };
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              const w = (e.currentTarget as HTMLElement).clientWidth * 2;
              setPan(Math.max(0, Math.min(1, d.pan - (e.clientX - d.x) / w)));
            }}
            onPointerUp={() => (drag.current = null)}
          >
            <div className="lightbox__frame">
              <Image
                key={item.slug}
                src={item.src}
                alt={item.alt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={item.blurDataURL}
                className="lightbox__img"
                style={{
                  objectFit: orientation === 'horizontal' ? 'contain' : 'cover',
                  objectPosition: orientation === 'vertical' ? `${pan * 100}% 50%` : objectPosition([0.5, 0.5]),
                }}
              />
            </div>
          </div>

          <div className="lightbox__bottom">
            <div>
              <p className="lightbox__title">{item.title}</p>
              <p className="label mt-2 text-[var(--muted)]">Artist&apos;s impression</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="Previous image">
                ←
              </button>
              <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="Next image">
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
