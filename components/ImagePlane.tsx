'use client';

import Image from 'next/image';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { objectPosition, type MediaItem } from '@/lib/media';
import {
  createPlaneController,
  defaultPlaneOptions,
  usePlanes,
  type PlaneController,
  type PlaneOptions,
  type PlaneSlot,
} from '@/lib/planes';
import { scheduler } from '@/lib/runtime';

type Props = Partial<PlaneOptions> & {
  /** Stable id; also used as the WebGL slot key. */
  id?: string;
  images: MediaItem[];
  index?: number;
  /** Optional controller (from usePlaneController) to drive mix / zoom / dim from GSAP. */
  controller?: PlaneController;
  /** Above-the-fold image: eager, no blur placeholder. Not preloaded or high-priority: Chrome never
   *  counts a full-viewport photo as LCP, so it shouldn't take bandwidth from fonts / CSS / text. */
  priority?: boolean;
  sizes?: string;
  /** Only render DOM images within ±window of the active index (large sets like the gallery). */
  renderWindow?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Custom cursor label when hovering ("View", "Drag"). */
  cursor?: string;
};

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function usePlaneController(initial?: Parameters<typeof createPlaneController>[0]) {
  const ref = useRef<PlaneController | null>(null);
  if (!ref.current) ref.current = createPlaneController(initial);
  return ref.current;
}

/**
 * A photo slot. Renders accessible next/image fallbacks and registers itself with
 * the persistent WebGL canvas, which draws a shader plane over this exact box.
 */
export function ImagePlane({
  id: idProp,
  images,
  index = 0,
  controller,
  priority = false,
  sizes = '100vw',
  renderWindow,
  className = '',
  style,
  children,
  cursor,
  ...optProps
}: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const ref = useRef<HTMLDivElement>(null);
  const ownCtrl = usePlaneController();
  const ctrl = controller ?? ownCtrl;
  const register = usePlanes((s) => s.register);
  const unregister = usePlanes((s) => s.unregister);
  const setIndex = usePlanes((s) => s.setIndex);
  const setNear = usePlanes((s) => s.setNear);

  const { mode, radius, dim, refract, depth, tilt, z } = { ...defaultPlaneOptions, ...optProps };
  const opts = useMemo<PlaneOptions>(
    () => ({ mode, radius, dim, refract, depth, tilt, z }),
    [mode, radius, dim, refract, depth, tilt, z],
  );

  // Register with the WebGL layer.
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    ctrl.el = el;
    ctrl.set({ ...ctrl.values, radius: Math.max(ctrl.values.radius, opts.radius) });
    const slot: PlaneSlot = {
      id,
      el,
      images,
      opts,
      ctrl,
      setReady: (ready) => {
        if (ready) el.dataset.gl = 'ready';
        else delete el.dataset.gl;
      },
    };
    register(slot);
    return () => unregister(id, slot);
  }, [id, images, opts, ctrl, register, unregister]);

  useEffect(() => setIndex(id, index), [id, index, setIndex]);

  // Inactive slides (step mode) are only rendered once the slot has come near the viewport.
  const [domNear, setDomNear] = useState(false);

  // Visibility: `near` loads textures ahead of time, `inView` keeps the canvas rendering.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(
      ([e]) => {
        setNear(id, e.isIntersecting);
        if (e.isIntersecting) setDomNear(true);
      },
      { rootMargin: '150% 0px' },
    );
    const viewObs = new IntersectionObserver(([e]) => scheduler.setInView(id, e.isIntersecting));
    nearObs.observe(el);
    viewObs.observe(el);
    return () => {
      nearObs.disconnect();
      viewObs.disconnect();
      scheduler.setInView(id, false);
    };
  }, [id, setNear]);

  // Mix layers (night view) only appear once the user scrolls, so they wait for real input
  // (`scroll` also fires programmatically during load, so it only counts once the page has moved).
  const [mixArmed, setMixArmed] = useState(false);
  useEffect(() => {
    if (opts.mode !== 'mix' || mixArmed) return;
    const events = ['wheel', 'pointerdown', 'touchstart', 'keydown', 'scroll'] as const;
    const arm = (e: Event) => (e.type !== 'scroll' || window.scrollY > 0) && setMixArmed(true);
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, arm));
  }, [opts.mode, mixArmed]);

  const visible = (i: number) => {
    if (opts.mode === 'mix' && i > 0 && !mixArmed) return false;
    if (opts.mode === 'step' && i !== index && !domNear) return false;
    if (renderWindow === undefined) return true;
    const n = images.length;
    const d = Math.min(Math.abs(i - index), n - Math.abs(i - index));
    return d <= renderWindow;
  };

  return (
    <div
      ref={ref}
      className={`plane ${opts.mode === 'mix' ? 'plane--mix' : ''} ${className}`}
      style={style}
      data-cursor={cursor}
      onPointerEnter={() => ctrl.set({ hover: 1 })}
      onPointerLeave={() => ctrl.set({ hover: 0 })}
    >
      <div className="plane__media">
        {images.map((img, i) =>
          visible(i) ? (
            <Image
              key={img.slug}
              src={img.src}
              alt={opts.mode === 'mix' && i > 0 ? '' : img.alt}
              fill
              sizes={sizes}
              loading={priority && i === 0 ? 'eager' : 'lazy'}
              placeholder={priority && i === 0 ? 'empty' : 'blur'}
              blurDataURL={img.blurDataURL}
              className="plane__img"
              data-active={opts.mode === 'mix' ? (i === 0 ? 'base' : 'mix') : i === index ? 'true' : 'false'}
              aria-hidden={opts.mode === 'step' && i !== index ? true : undefined}
              style={
                {
                  '--pos': objectPosition(img.focus),
                  '--pos-m': objectPosition(img.mobileFocus),
                  backgroundColor: img.color,
                } as CSSProperties
              }
            />
          ) : null,
        )}
      </div>
      {children}
    </div>
  );
}
