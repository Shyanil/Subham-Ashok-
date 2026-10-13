'use client';

import { create } from 'zustand';
import type Lenis from 'lenis';
import type { MediaItem } from './media';

/* ───────────────────────── Motion preference ───────────────────────── */

type MotionState = {
  system: boolean;
  user: boolean | null;
  reduced: boolean;
  ready: boolean;
  init(system: boolean, user: boolean | null): void;
  setUser(v: boolean): void;
};

export const useMotion = create<MotionState>((set, get) => ({
  system: false,
  user: null,
  reduced: false,
  ready: false,
  init: (system, user) => set({ system, user, reduced: user ?? system, ready: true }),
  setUser: (v) => {
    try {
      localStorage.setItem('sb:reduce-motion', v ? '1' : '0');
    } catch {}
    set({ user: v, reduced: v });
    document.documentElement.classList.toggle('reduce-motion', v);
  },
}));

/* ───────────────────────── Smooth scroll ───────────────────────── */

type ScrollState = {
  lenis: Lenis | null;
  setLenis(l: Lenis | null): void;
  scrollTo(target: number | string | HTMLElement, opts?: { offset?: number; immediate?: boolean; duration?: number }): void;
  lock(locked: boolean): void;
};

export const useScroll = create<ScrollState>((set, get) => ({
  lenis: null,
  setLenis: (lenis) => set({ lenis }),
  scrollTo: (target, opts = {}) => {
    const { lenis } = get();
    if (lenis) {
      lenis.scrollTo(target, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: opts.duration ?? 1.4 });
      return;
    }
    let top: number;
    if (typeof target === 'number') top = target;
    else {
      const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      top = el.getBoundingClientRect().top + window.scrollY;
    }
    window.scrollTo({ top: top + (opts.offset ?? 0), behavior: 'auto' });
  },
  lock: (locked) => {
    const { lenis } = get();
    if (lenis) locked ? lenis.stop() : lenis.start();
    document.documentElement.classList.toggle('scroll-locked', locked);
  },
}));

/* ───────────────────────── Intro ───────────────────────── */

type IntroState = {
  /** 'pending' before hydration decides, 'playing' while visible, 'done' after. */
  phase: 'pending' | 'playing' | 'done';
  /** Incremented on every replay so the intro can restart its timeline. */
  run: number;
  play(): void;
  finish(): void;
};

export const useIntro = create<IntroState>((set, get) => ({
  phase: 'pending',
  run: 0,
  play: () => set({ phase: 'playing', run: get().run + 1 }),
  finish: () => set({ phase: 'done' }),
}));

/* ───────────────────────── Lightbox ───────────────────────── */

type LightboxState = {
  images: MediaItem[];
  index: number;
  open: boolean;
  returnFocus: HTMLElement | null;
  show(images: MediaItem[], index: number): void;
  setIndex(i: number): void;
  close(): void;
};

export const useLightbox = create<LightboxState>((set) => ({
  images: [],
  index: 0,
  open: false,
  returnFocus: null,
  show: (images, index) =>
    set({ images, index, open: true, returnFocus: (document.activeElement as HTMLElement) ?? null }),
  setIndex: (index) => set({ index }),
  close: () => set({ open: false }),
}));

/* ───────────────────────── WebGL capability ───────────────────────── */

type GLState = {
  /** null until detected on the client. */
  supported: boolean | null;
  /** true once the canvas is mounted and rendering. */
  live: boolean;
  setSupported(v: boolean): void;
  setLive(v: boolean): void;
};

export const useGLStatus = create<GLState>((set) => ({
  supported: null,
  live: false,
  setSupported: (supported) => set({ supported }),
  setLive: (live) => set({ live }),
}));
