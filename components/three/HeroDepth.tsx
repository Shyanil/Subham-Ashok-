'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { DepthPlane, coverFor, type DepthState } from './DepthPlane';

type Props = { src: string; depth: string; focus: [number, number]; onReady: () => void; paused: boolean };

/**
 * Hero depth layer. Starts framed exactly like the static <Image> (object-fit: cover at `focus`,
 * zoom 1, no offset) so the cross-fade is invisible, then eases in a little zoom and follows the
 * mouse and scroll.
 */
function Scene({ src, depth, focus, onReady }: Omit<Props, 'paused'>) {
  const [map, depthMap] = useTexture([src, depth]);
  const size = useThree((s) => s.size);
  const state = useRef<DepthState>({ center: [focus], zoom: 1, pointer: [0, 0], mix: 0, strength: 0.035, margin: 0 });
  const mouse = useRef<[number, number]>([0, 0]);
  const moved = useRef(false);
  const frames = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      moved.current = true;
      mouse.current = [(e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2];
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, dt) => {
    const s = state.current;
    const img = map.image as { width: number; height: number };
    const cover = coverFor(img.width / img.height, size.width / Math.max(1, size.height));
    // object-position: focus → visible window starts at focus × (1 − cover).
    s.center[0] = [focus[0] * (1 - cover[0]) + cover[0] / 2, focus[1] * (1 - cover[1]) + cover[1] / 2];
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 2.4);
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const goal: [number, number] = moved.current ? [mouse.current[0], mouse.current[1] * 0.6 + scroll * 0.8] : [0, scroll * 0.8];
    s.pointer = [s.pointer[0] + (goal[0] - s.pointer[0]) * k, s.pointer[1] + (goal[1] - s.pointer[1]) * k];
    // Kept tiny: the hero render's roofline sits right at the top edge.
    const zoomGoal = moved.current || scroll > 0 ? 1.02 : 1;
    s.zoom += (zoomGoal - s.zoom) * k * 0.6;
    // A few frames in, the texture is on screen at the right framing — fade the canvas in.
    if (++frames.current === 4) onReady();
  });

  return <DepthPlane layers={[{ map, depth: depthMap }]} state={state} />;
}


export default function HeroDepth({ src, depth, focus, onReady, paused }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power' }}
      onCreated={({ gl }) => gl.getContext().isContextLost() && setFailed(true)}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Scene src={src} depth={depth} focus={focus} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
