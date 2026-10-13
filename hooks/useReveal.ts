'use client';

import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Scroll-triggered reveal for everything inside `scope`:
 *  - `.line-inner`          masked line slides up (expo.out, 0.08s stagger)
 *  - `[data-reveal]`        fade + rise (power3.out)
 *  - `[data-reveal-scale]`  image scales 1.15 → 1
 * Falls back to plain opacity fades when motion is reduced.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, opts: { start?: string } = {}) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const lines = gsap.utils.toArray<HTMLElement>('.line-inner', root);
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
      const scales = gsap.utils.toArray<HTMLElement>('[data-reveal-scale]', root);
      const scrollTrigger = { trigger: root, start: opts.start ?? 'top 78%', once: true };

      if (reduced) {
        gsap.set(lines, { yPercent: 0, y: 0 });
        gsap.fromTo(
          [...lines, ...items],
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.04, scrollTrigger },
        );
        return;
      }

      const tl = gsap.timeline({ scrollTrigger });
      if (lines.length) tl.fromTo(lines, { yPercent: 135, y: 0 }, { yPercent: 0, duration: 0.95, ease: 'expo.out', stagger: 0.07 }, 0);
      if (items.length)
        tl.fromTo(items, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: { each: 0.04, amount: 0.6 } }, 0.12);
      if (scales.length) tl.fromTo(scales, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: 'expo.out' }, 0);
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
