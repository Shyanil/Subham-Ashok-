'use client';

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import {
  DataTexture,
  LinearFilter,
  Mesh,
  NoColorSpace,
  PlaneGeometry,
  RGBAFormat,
  SRGBColorSpace,
  ShaderMaterial,
  Texture,
  Vector2,
} from 'three';
import { imagePlaneFragment, imagePlaneVertex } from '@/shaders/imagePlane';
import { usePlanes, type PlaneSlot } from '@/lib/planes';
import { srcAt, type MediaItem } from '@/lib/media';
import { releaseTexture, retainTexture } from '@/lib/textures';
import { runtime, scheduler } from '@/lib/runtime';

const geometry = new PlaneGeometry(1, 1, 1, 1);

/** 1×1 mid-grey: neutral depth when a plane has no depth map. */
const flatDepth = (() => {
  const t = new DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1, RGBAFormat);
  t.needsUpdate = true;
  return t;
})();

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt));

/** Loads one texture through useTexture, uploads it eagerly and reports it to the owning plane. */
function ManagedTexture({
  url,
  data,
  onChange,
}: {
  url: string;
  data?: boolean;
  onChange: (url: string, tex: Texture | null) => void;
}) {
  const tex = useTexture(url);
  const gl = useThree((s) => s.gl);

  useLayoutEffect(() => {
    tex.colorSpace = data ? NoColorSpace : SRGBColorSpace;
    tex.minFilter = LinearFilter;
    tex.magFilter = LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    gl.initTexture(tex);
    retainTexture(url);
    onChange(url, tex);
    return () => {
      onChange(url, null);
      releaseTexture(url, tex);
    };
  }, [tex, url, data, gl, onChange]);

  return null;
}

export function PlaneMesh({ slot }: { slot: PlaneSlot }) {
  const { opts, images, ctrl } = slot;
  const index = usePlanes((s) => s.index[slot.id] ?? 0);
  const near = usePlanes((s) => s.near[slot.id] ?? false);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  const dpr = useThree((s) => s.viewport.dpr);

  const mobile = size.width < 768;
  const portrait = size.height > size.width;

  // Pick the rendition the browser would pick for this box (shares the HTTP cache with next/image).
  const texWidth = useMemo(() => {
    const r = slot.el.getBoundingClientRect();
    const box = Math.max(r.width, r.height * (16 / 9)) || size.width;
    return Math.min(box * Math.min(dpr, 2), mobile ? 1280 : 1920);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot.el, mobile]);

  const urls = useMemo(() => images.map((img) => srcAt(img, texWidth)), [images, texWidth]);
  const itemByUrl = useMemo(() => new Map(urls.map((u, i) => [u, images[i]])), [urls, images]);

  const textures = useRef(new Map<string, Texture>());
  const shownRef = useRef<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  const anim = useRef<{ to: string; t: number; dur: number } | null>(null);
  const lastAnimEnd = useRef(0);
  const ready = useRef(false);
  const hover = useRef(0);
  const meshRef = useRef<Mesh>(null);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: imagePlaneVertex,
        fragmentShader: imagePlaneFragment,
        // Deep background planes stay opaque so glass shards can refract them.
        transparent: opts.z >= 0,
        uniforms: {
          uTex0: { value: null },
          uTex1: { value: null },
          uDepth0: { value: flatDepth },
          uDepth1: { value: flatDepth },
          uRes0: { value: new Vector2(1, 1) },
          uRes1: { value: new Vector2(1, 1) },
          uFocus0: { value: new Vector2(0.5, 0.5) },
          uFocus1: { value: new Vector2(0.5, 0.5) },
          uPlane: { value: new Vector2(1, 1) },
          uPointer: { value: new Vector2() },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uVelocity: { value: 0 },
          uHover: { value: 0 },
          uZoom: { value: 1 },
          uDepthStrength: { value: opts.depth },
          uAlpha: { value: 1 },
          uRadius: { value: opts.radius },
          uRefract: { value: opts.refract },
          uDim: { value: opts.dim },
          uSeed: { value: Math.random() * 100 },
        },
      }),
    [opts.radius, opts.depth, opts.refract, opts.dim, opts.z],
  );
  useEffect(() => () => material.dispose(), [material]);

  const onTexture = useCallback(
    (url: string, tex: Texture | null) => {
      if (tex) textures.current.set(url, tex);
      else {
        textures.current.delete(url);
        if (shownRef.current === url) {
          shownRef.current = null;
          setShown(null);
          anim.current = null;
          ready.current = false;
          slot.setReady(false);
        }
      }
    },
    [slot],
  );

  // Textures we keep resident: everything for 'mix' planes; current, target and neighbours for 'step' planes.
  const needed = useMemo(() => {
    if (!near) return [] as string[];
    if (opts.mode === 'mix') return urls;
    const set = new Set<string>();
    const n = urls.length;
    [index, index + 1, index - 1].forEach((i) => set.add(urls[((i % n) + n) % n]));
    if (shown) set.add(shown);
    return [...set];
  }, [near, opts.mode, urls, index, shown]);

  const depthFor = (item?: MediaItem) => (item && opts.depth > 0 ? textures.current.get(item.depth) : undefined);

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const delta = Math.min(rawDelta, 1 / 20);
    const u = material.uniforms;
    const tx = textures.current;

    // ── Resolve which textures are displayed and the transition progress.
    let from: string | null = null;
    let to: string | null = null;
    let progress = 0;

    if (opts.mode === 'mix') {
      from = tx.has(urls[0]) ? urls[0] : null;
      to = tx.has(urls[1]) ? urls[1] : from;
      progress = to === from ? 0 : ctrl.values.mix;
      if (from !== shownRef.current) shownRef.current = from;
    } else {
      const target = urls[Math.min(index, urls.length - 1)];
      if (!shownRef.current && tx.has(target)) {
        shownRef.current = target;
        setShown(target);
      } else if (!anim.current && shownRef.current && target !== shownRef.current && tx.has(target)) {
        const chained = state.clock.elapsedTime - lastAnimEnd.current < 0.15;
        anim.current = { to: target, t: 0, dur: chained ? 0.7 : 1.15 };
      }
      if (anim.current) {
        if (!tx.has(anim.current.to)) anim.current = null;
        else {
          anim.current.t += delta / anim.current.dur;
          scheduler.bump(2);
          if (anim.current.t >= 1) {
            shownRef.current = anim.current.to;
            setShown(anim.current.to);
            anim.current = null;
            lastAnimEnd.current = state.clock.elapsedTime;
          } else progress = easeInOut(anim.current.t);
        }
      }
      from = shownRef.current;
      to = anim.current?.to ?? from;
    }

    const rect = slot.el.getBoundingClientRect();
    const onScreen = rect.bottom > 0 && rect.top < size.height && rect.width > 0 && rect.height > 0;
    const tex0 = from ? tx.get(from) : undefined;
    mesh.visible = near && onScreen && !!tex0 && ctrl.values.alpha > 0.001;
    if (!mesh.visible || !tex0 || !from || !to) return;

    // ── Place the plane over the DOM box (compensating for depth when z ≠ 0).
    const camZ = camera.position.z;
    const f = (camZ - opts.z) / camZ;
    const vp = state.viewport.getCurrentViewport(camera, [0, 0, 0]);
    const k = (vp.width / size.width) * f;
    mesh.position.set(
      (rect.left + rect.width / 2 - size.width / 2) * k,
      -(rect.top + rect.height / 2 - size.height / 2) * k,
      opts.z,
    );
    mesh.scale.set(rect.width * k, rect.height * k, 1);

    const tilt = mobile ? 0 : Math.max(opts.tilt ? 1 : 0, ctrl.values.tilt);
    mesh.rotation.y = damp(mesh.rotation.y, runtime.pointer.x * 0.07 * tilt, 4, delta);
    mesh.rotation.x = damp(mesh.rotation.x, -runtime.pointer.y * 0.05 * tilt, 4, delta);

    // ── Uniforms.
    const a = itemByUrl.get(from)!;
    const b = itemByUrl.get(to)!;
    const focus = (item: MediaItem) => (mobile && portrait ? item.mobileFocus : item.focus);
    u.uTex0.value = tex0;
    u.uTex1.value = tx.get(to) ?? tex0;
    u.uDepth0.value = depthFor(a) ?? flatDepth;
    u.uDepth1.value = depthFor(b) ?? flatDepth;
    u.uRes0.value.set(a.width, a.height);
    u.uRes1.value.set(b.width, b.height);
    u.uFocus0.value.set(focus(a)[0], 1 - focus(a)[1]);
    u.uFocus1.value.set(focus(b)[0], 1 - focus(b)[1]);
    u.uPlane.value.set(rect.width, rect.height);
    u.uPointer.value.set(runtime.pointer.x, runtime.pointer.y);
    u.uProgress.value = progress;
    u.uTime.value = state.clock.elapsedTime;
    u.uVelocity.value = runtime.velocity;
    hover.current = damp(hover.current, ctrl.values.hover, 5, delta);
    if (Math.abs(hover.current - ctrl.values.hover) > 0.01) scheduler.bump(2);
    u.uHover.value = hover.current;
    u.uZoom.value = ctrl.values.zoom;
    u.uDim.value = Math.min(1, opts.dim + ctrl.values.dim);
    u.uAlpha.value = ctrl.values.alpha;
    u.uRadius.value = Math.max(opts.radius, ctrl.values.radius);

    if (!ready.current) {
      ready.current = true;
      slot.setReady(true);
    }
  });

  // Hide the DOM fallback only while this plane is alive.
  useEffect(() => () => slot.setReady(false), [slot]);

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} material={material} visible={false} frustumCulled={false} renderOrder={opts.z < 0 ? -1 : 0} />
      {needed.map((url) => (
        <Suspense key={url} fallback={null}>
          <ManagedTexture url={url} onChange={onTexture} />
          {opts.depth > 0 && itemByUrl.get(url) && (
            <ManagedTexture url={itemByUrl.get(url)!.depth} data onChange={onTexture} />
          )}
        </Suspense>
      ))}
    </>
  );
}
