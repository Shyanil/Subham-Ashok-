'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { capable3d } from '@/lib/capable';

const HeroDepth = dynamic(() => import('./three/HeroDepth'), { ssr: false });

/**
 * Progressive 3D for the hero render: the static <Image> stays the LCP element; on capable
 * fine-pointer devices a depth-parallax canvas loads after the entrance settles and fades in on top.
 */
export function HeroDepthLayer({ src, depth, focus }: { src: string; depth: string; focus: [number, number] }) {
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || !capable3d()) return;
    // Wait out the preloader (first visit) and the hero entrance, then idle.
    const firstVisit = !document.documentElement.classList.contains('intro-seen');
    const t = setTimeout(() => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
      ric(() => setMount(true), { timeout: 1500 });
    }, firstVisit ? 3800 : 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mount || !box.current) return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting));
    io.observe(box.current);
    return () => io.disconnect();
  }, [mount]);

  if (!mount) return null;
  return (
    <div ref={box} className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
      <HeroDepth src={src} depth={depth} focus={focus} paused={paused} onReady={() => setReady(true)} />
    </div>
  );
}
