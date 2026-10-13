'use client';

import { useEffect, useRef, useState } from 'react';
import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, advance, useFrame } from '@react-three/fiber';
import { gsap } from '@/lib/gsap';
import { runtime, scheduler } from '@/lib/runtime';
import { usePlanes } from '@/lib/planes';
import { useGLStatus } from '@/lib/store';
import { PlaneMesh } from './three/PlaneMesh';
import { Dust, PerspectiveScene } from './three/PerspectiveScene';
import { FooterGem } from './three/FooterGem';
import { AnchorObjects, HeroCrystals } from './three/AnchorObjects';
import { Effects } from './three/Effects';

/**
 * Renders on the GSAP ticker, right after Lenis and ScrollTrigger have updated,
 * so WebGL planes never lag a frame behind the DOM. Frames are only produced
 * when the scheduler says something on screen needs them.
 */
function FrameDriver() {
  useEffect(() => {
    const tick = () => {
      if (scheduler.needsFrame()) advance(performance.now());
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return null;
}

/** Smooths pointer + velocity once per frame for every consumer. */
function RuntimeSmoother() {
  const target = useRef({ x: 0, y: 0 }).current;
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
      if (scheduler.busy) scheduler.bump(1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-4 * Math.min(delta, 0.05));
    runtime.pointer.x += (target.x - runtime.pointer.x) * k;
    runtime.pointer.y += (target.y - runtime.pointer.y) * k;
    runtime.velocity += (runtime.velocityTarget - runtime.velocity) * (1 - Math.exp(-6 * Math.min(delta, 0.05)));
    runtime.velocityTarget *= 0.9;
  }, -1);
  return null;
}

export default function ThreeBackdrop({ simplified }: { simplified: boolean }) {
  const slots = usePlanes((s) => s.slots);
  const setLive = useGLStatus((s) => s.setLive);
  // Adaptive quality: drop resolution, then post-processing, if the GPU struggles.
  const maxDpr = simplified ? 1.25 : 1.5;
  const [dpr, setDpr] = useState(maxDpr);
  const [effects, setEffects] = useState(!simplified);

  useEffect(
    () => () => {
      setLive(false);
      document.documentElement.classList.remove('webgl-live');
    },
    [setLive],
  );

  return (
    <div className="webgl-backdrop" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={dpr}
        flat
        camera={{ fov: 35, position: [0, 0, 10], near: 0.1, far: 60 }}
        gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#461a13');
          setLive(true);
          document.documentElement.classList.add('webgl-live');
          scheduler.bump(4);
        }}
      >
        <color attach="background" args={['#461a13']} />
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => {
            setDpr((d) => Math.max(1, d - 0.25));
            if (dpr <= 1.25) setEffects(false);
          }}
          onFallback={() => {
            setDpr(1);
            setEffects(false);
          }}
        />
        <FrameDriver />
        <RuntimeSmoother />
        {Object.values(slots).map((slot) => (
          <PlaneMesh key={slot.id} slot={slot} />
        ))}
        <PerspectiveScene simplified={simplified} />
        {/* Sparse motes drifting over the hero, fading out as the reframe completes. */}
        <Dust count={simplified ? 70 : 160} source={runtime.hero} fade={(p) => 1 - p * 0.8} opacity={0.45} size={16} />
        <FooterGem simplified={simplified} />
        <AnchorObjects />
        <HeroCrystals count={simplified ? 7 : 14} />
        {effects && <Effects />}
      </Canvas>
    </div>
  );
}
