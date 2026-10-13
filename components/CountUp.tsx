'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Number that counts up from 0 the first time it scrolls into view. Server-renders the final value. */
export function CountUp({ value, duration = 1.6 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      const obj = { v: 0 };
      el.textContent = '0';
      gsap.to(obj, {
        v: value,
        duration,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 96%', once: true },
        onUpdate: () => (el.textContent = String(Math.round(obj.v))),
      });
      return () => (el.textContent = String(value));
    },
    { dependencies: [value, reduced], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
