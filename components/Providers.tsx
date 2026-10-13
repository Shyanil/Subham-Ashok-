'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { runtime, scheduler } from '@/lib/runtime';
import { useIntro, useMotion, useScroll } from '@/lib/store';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Cursor } from './Cursor';
import { Lightbox } from './Lightbox';

const ThreeBackdrop = dynamic(() => import('./ThreeBackdrop'), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  const ready = useMotion((s) => s.ready);
  const reduced = useMotion((s) => s.reduced);
  const init = useMotion((s) => s.init);
  const setLenis = useScroll((s) => s.setLenis);
  const scrollTo = useScroll((s) => s.scrollTo);
  const webgl = useWebGLSupport();
  const mobile = useIsMobile();
  const [mountGL, setMountGL] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  // Animations are always on.
  useEffect(() => {
    init(false, null);
    document.documentElement.classList.remove('reduce-motion');
    document.documentElement.dataset.hydrated = 'true';
    setLowPower((navigator.hardwareConcurrency ?? 8) <= 4);
  }, [init]);

  // Lenis smooth scroll, driven by the GSAP ticker and wired to ScrollTrigger.
  useEffect(() => {
    if (!ready || reduced) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    lenis.on('scroll', (l: Lenis) => {
      runtime.velocityTarget = Math.max(-1, Math.min(1, l.velocity / 45));
      scheduler.bump(2);
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf, false, true);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    if (useIntro.getState().phase === 'playing' || document.documentElement.classList.contains('scroll-locked')) lenis.stop();
    ScrollTrigger.refresh();
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
      runtime.velocityTarget = 0;
    };
  }, [ready, reduced, setLenis]);

  // Native scroll still feeds velocity when Lenis is off (e.g. touch).
  useEffect(() => {
    const onScroll = () => scheduler.bump(2);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mount the WebGL layer when idle so it never competes with first paint.
  useEffect(() => {
    if (!ready || reduced || !webgl) {
      setMountGL(false);
      return;
    }
    const w = window as Window & { requestIdleCallback?: typeof requestIdleCallback; cancelIdleCallback?: typeof cancelIdleCallback };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMountGL(true), { timeout: 1800 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setMountGL(true), 600);
    return () => clearTimeout(t);
  }, [ready, reduced, webgl]);

  // Re-measure once fonts and images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  // In-page anchors go through Lenis (or native scroll) and move focus for keyboard users.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const hash = a.getAttribute('href')!;
      const target = hash === '#' || hash === '#top' ? document.body : document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      scrollTo(target === document.body ? 0 : target);
      if (target !== document.body) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [scrollTo]);

  return (
    <>
      {mountGL && <ThreeBackdrop simplified={mobile || lowPower} />}
      {children}
      <Lightbox />
      <Cursor />
    </>
  );
}
