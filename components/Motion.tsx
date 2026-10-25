'use client';

import { useEffect } from 'react';

/**
 * Page-wide GSAP + ScrollTrigger, loaded after first paint so it never touches LCP.
 *  - [data-reveal]  fade + perspective fold-up, 600 ms, 50 ms stagger, only for elements still below the fold
 *  - [data-count]   number counters (SSR renders the final value, so no-JS is correct)
 *  - .site-header   `is-scrolled` state once the page moves
 * Deliberately minimal: nothing is pinned, no parallax. With prefers-reduced-motion only the header state runs.
 */
export function Motion() {
  useEffect(() => {
    let revert: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia();
      const header = document.querySelector('.site-header');

      const headerTrigger = header
        ? ScrollTrigger.create({
            start: 12,
            end: 'max',
            onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive),
          })
        : undefined;

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Reveals: skip anything already visible so nothing above the fold flashes.
        const vh = window.innerHeight;
        const targets = gsap.utils
          .toArray<HTMLElement>('[data-reveal]')
          .filter((el) => el.getBoundingClientRect().top > vh * 0.92);
        const flat = targets.filter((el) => el.dataset.reveal !== '3d');
        const deep = targets.filter((el) => el.dataset.reveal === '3d');
        // Flat reveals fold up gently in perspective, like a page turning toward the reader.
        gsap.set(flat, { autoAlpha: 0, y: 28, rotateX: 22, transformPerspective: 900, transformOrigin: '50% 100%' });
        ScrollTrigger.batch(flat, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05, overwrite: true, clearProps: 'transform' }),
        });
        // 3D fold-up: big cards and images rise out of the page in perspective.
        gsap.set(deep, { autoAlpha: 0, y: 70, rotateX: 14, scale: 0.96, transformPerspective: 1200, transformOrigin: '50% 100%' });
        ScrollTrigger.batch(deep, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06, overwrite: true, clearProps: 'transform' }),
        });

        // Pointer tilt for [data-tilt] cards (fine pointers only).
        let tiltCleanup: (() => void) | undefined;
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          let current: HTMLElement | null = null;
          const reset = (el: HTMLElement) => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            const el = (e.target as Element | null)?.closest?.('[data-tilt]') as HTMLElement | null;
            if (current && current !== el) reset(current);
            current = el;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 1000, duration: 0.4, ease: 'power2.out' });
          };
          document.addEventListener('pointermove', onMove, { passive: true });
          tiltCleanup = () => document.removeEventListener('pointermove', onMove);
        }

        // Counters.
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const end = parseFloat(el.dataset.count ?? '0');
          const decimals = parseInt(el.dataset.decimals ?? '0', 10);
          const plain = el.dataset.plain === 'true';
          const fmt = (v: number) =>
            plain ? String(Math.round(v)) : v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
          const from = plain ? Math.max(0, end - 19) : 0;
          const state = { v: from };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 95%',
            once: true,
            onEnter: () =>
              gsap.to(state, {
                v: end,
                duration: 1.6,
                ease: 'power2.out',
                onStart: () => void (el.textContent = fmt(from)),
                onUpdate: () => void (el.textContent = fmt(state.v)),
              }),
          });
        });

        return () => tiltCleanup?.();
      });

      revert = () => {
        headerTrigger?.kill();
        mm.revert();
      };
    };

    // Wait for the browser to be idle after load so hydration and LCP go first.
    const ric = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const handle = ric(() => void start(), { timeout: 1500 });
    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(handle as number);
      revert?.();
    };
  }, []);

  return null;
}
