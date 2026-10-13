'use client';

import { useEffect, useId, useRef } from 'react';
import { useAnchors, type AnchorKind } from '@/lib/anchors';
import { scheduler } from '@/lib/runtime';

/** Reserves a box in the layout where the WebGL canvas draws a 3D object. */
export function Anchor3D({ kind, className = '' }: { kind: AnchorKind; className?: string }) {
  const id = `anchor-${useId()}`;
  const ref = useRef<HTMLDivElement>(null);
  const add = useAnchors((s) => s.add);
  const remove = useAnchors((s) => s.remove);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    add({ id, el, kind });
    const io = new IntersectionObserver(([e]) => scheduler.setInView(id, e.isIntersecting));
    io.observe(el);
    return () => {
      io.disconnect();
      scheduler.setInView(id, false);
      remove(id);
    };
  }, [id, kind, add, remove]);

  return <div ref={ref} className={`anchor-3d ${className}`} aria-hidden="true" />;
}
