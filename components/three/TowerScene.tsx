'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { DepthPlane, clampCenter, type DepthState } from './DepthPlane';
import { HOTSPOTS, SCENES, VIEWS, ZOOM_MAX, ZOOM_MIN, type UV, type ViewId } from './towerData';

type Props = {
  night: boolean;
  view: ViewId;
  spot: string | null;
  /** Target zoom (1 = the render fills the frame). */
  zoom: number;
  onSpot: (id: string | null) => void;
  /** Pinch / ctrl + wheel asks the parent for a new zoom. */
  onZoom: (zoom: number) => void;
  paused?: boolean;
};

const LABELS: { title: string; note: string; day: UV; night: UV }[] = [
  { title: 'Block B', note: '11 floors · 2 towers', day: [0.5, 0.2], night: [0.52, 0.17] },
  { title: 'Block A', note: '6 floors · penthouses', day: [0.63, 0.47], night: [0.4, 0.44] },
];

/** Shared between the R3F frame loop and the DOM overlay without re-rendering React. */
type Live = {
  state: DepthState;
  goal: { center: [UV, UV]; zoom: number; mix: number };
  drag: [number, number];
  hover: [number, number];
  dragging: boolean;
  lastInput: number;
};

const ease = (dt: number, speed: number) => 1 - Math.exp(-Math.min(dt, 0.05) * speed);

function Scene({ live, onFrame }: { live: React.RefObject<Live>; onFrame: (covers: [number, number][]) => void }) {
  const [dayMap, dayDepth, nightMap, nightDepth] = useTexture([SCENES.day.src, SCENES.day.depth, SCENES.night.src, SCENES.night.depth]);
  const state = useRef<DepthState>(live.current.state);

  useFrame(({ clock }, dt) => {
    const l = live.current;
    const s = l.state;
    const k = ease(dt, 3);
    for (const i of [0, 1] as const) {
      s.center[i] = [s.center[i][0] + (l.goal.center[i][0] - s.center[i][0]) * k, s.center[i][1] + (l.goal.center[i][1] - s.center[i][1]) * k];
    }
    s.zoom += (l.goal.zoom - s.zoom) * k;
    s.mix += (l.goal.mix - s.mix) * ease(dt, 2.4);
    // Drag sets the "orbit"; idle adds a slow drift so the scene always feels alive.
    const idle = performance.now() - l.lastInput > 2500;
    const t = clock.elapsedTime;
    const drift: [number, number] = idle ? [Math.sin(t * 0.35) * 0.45, Math.cos(t * 0.27) * 0.25] : [0, 0];
    const target: [number, number] = [l.drag[0] + l.hover[0] * 0.25 + drift[0], l.drag[1] + l.hover[1] * 0.25 + drift[1]];
    const kp = ease(dt, l.dragging ? 10 : 2.2);
    s.pointer = [s.pointer[0] + (target[0] - s.pointer[0]) * kp, s.pointer[1] + (target[1] - s.pointer[1]) * kp];
  });

  return (
    <DepthPlane
      layers={[
        { map: dayMap, depth: dayDepth },
        { map: nightMap, depth: nightDepth },
      ]}
      state={state}
      onFrame={onFrame}
    />
  );
}

/**
 * Depth-photo site model: the real aerial renders move in 2.5D as you drag. Day / Night
 * cross-dissolves between the two renders; views and amenities glide the frame to a point.
 */
export default function TowerScene({ night, view, spot, zoom, onSpot, onZoom, paused = false }: Props) {
  const v = VIEWS[0];
  const live = useRef<Live>({
    state: { center: [v.day, v.night], zoom: 1.25, pointer: [0, 0], mix: night ? 1 : 0, strength: 0.05 },
    goal: { center: [v.day, v.night], zoom: v.zoom, mix: night ? 1 : 0 },
    drag: [0, 0],
    hover: [0, 0],
    dragging: false,
    lastInput: 0,
  });
  const box = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLElement | null)[]>([]);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const dragFrom = useRef<{ x: number; y: number; drag: [number, number] } | null>(null);

  useEffect(() => {
    const h = HOTSPOTS.find((x) => x.id === spot);
    const target = VIEWS.find((x) => x.id === view) ?? VIEWS[0];
    const l = live.current;
    l.goal = { center: h ? [h.day, h.night] : [target.day, target.night], zoom, mix: night ? 1 : 0 };
  }, [view, spot, night, zoom]);
  useEffect(() => {
    live.current.drag = [0, 0];
  }, [view, spot]);

  // Trackpad pinch arrives as ctrl + wheel; plain wheel keeps scrolling the page.
  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      onZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomRef.current * Math.exp(-e.deltaY * 0.01))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onZoom]);

  // Project image UVs to screen % so the DOM markers ride on the scene.
  const onFrame = (covers: [number, number][]) => {
    const s = live.current.state;
    const which = s.mix > 0.5 ? 1 : 0;
    const fade = Math.abs(s.mix - 0.5) * 2;
    const place = (el: HTMLElement | null, uv: UV) => {
      if (!el) return;
      const c = clampCenter(s.center[which], covers[which] as [number, number], s.zoom);
      const x = ((uv[0] - c[0]) * s.zoom) / covers[which][0] + 0.5;
      const y = ((uv[1] - c[1]) * s.zoom) / covers[which][1] + 0.5;
      const inside = x > 0.03 && x < 0.97 && y > 0.06 && y < 0.94;
      el.style.left = `${x * 100}%`;
      el.style.top = `${y * 100}%`;
      el.style.opacity = inside ? String(fade) : '0';
      el.style.visibility = inside && fade > 0.05 ? 'visible' : 'hidden';
    };
    HOTSPOTS.forEach((h, i) => place(markers.current[i], which ? h.night : h.day));
    LABELS.forEach((lb, i) => place(labels.current[i], which ? lb.night : lb.day));
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragFrom.current = { x: e.clientX, y: e.clientY, drag: live.current.drag };
    live.current.dragging = true;
    live.current.lastInput = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    const l = live.current;
    l.lastInput = performance.now();
    const from = dragFrom.current;
    if (from) {
      const clamp = (n: number) => Math.max(-1, Math.min(1, n));
      l.drag = [clamp(from.drag[0] + ((e.clientX - from.x) / r.width) * 2.4), clamp(from.drag[1] + ((e.clientY - from.y) / r.height) * 2.4)];
    } else if (e.pointerType === 'mouse') {
      l.hover = [((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2];
    }
  };
  const endDrag = () => {
    dragFrom.current = null;
    live.current.dragging = false;
  };

  return (
    <div
      ref={box}
      className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => (live.current.hover = [0, 0])}
    >
      <Canvas
        frameloop={paused ? 'never' : 'always'}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: 'default' }}
        aria-label="Interactive 3D depth view of Subham Ashok Heights"
        role="img"
      >
        <color attach="background" args={['#120605']} />
        <Suspense fallback={null}>
          <Scene live={live} onFrame={onFrame} />
        </Suspense>
      </Canvas>

      {/* Soft vignette keeps the overlay controls legible on bright renders. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(18,6,5,.55))]" aria-hidden="true" />

      {LABELS.map((lb, i) => (
        <div key={lb.title} ref={(el) => { labels.current[i] = el; }} className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-center opacity-0 shadow-lg ring-1 ring-black/5 transition-opacity duration-300" aria-hidden="true">
          <p className="font-serif text-[16px] leading-none text-ink">{lb.title}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-muted">{lb.note}</p>
        </div>
      ))}

      {HOTSPOTS.map((h, i) => (
        <button
          key={h.id}
          ref={(el) => { markers.current[i] = el; }}
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          title={h.name}
          onClick={() => onSpot(spot === h.id ? null : h.id)}
          className={`absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-[12px] font-bold opacity-0 shadow-[0_6px_18px_rgba(0,0,0,.35)] transition-[transform,background-color,opacity] duration-300 hover:scale-110 sm:size-9 ${
            spot === h.id ? 'scale-110 border-white bg-brand text-white' : 'border-brand bg-white text-brand'
          }`}
        >
          {spot === h.id && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white" aria-hidden="true" />}
          <span className="relative">{i + 1}</span>
        </button>
      ))}
    </div>
  );
}
