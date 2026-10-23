'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: 'power3.out', duration: 1 });
}

/**
 * Setup queue: every section's timelines / ScrollTriggers are created in their own
 * macrotask, in document order (so pins above measure before content below), instead
 * of all at once inside React's hydration commit — which was one long main-thread task.
 */
const queue: Array<() => void> = [];
let flushing = false;

function flush() {
  const job = queue.shift();
  if (!job) {
    flushing = false;
    return;
  }
  job();
  setTimeout(flush, 0);
}

/** Runs `job` after every setup queued before it, in a task of its own. Returns a cancel function. */
export function enqueueSetup(job: () => void) {
  queue.push(job);
  if (!flushing) {
    flushing = true;
    setTimeout(flush, 0);
  }
  return () => {
    const i = queue.indexOf(job);
    if (i >= 0) queue.splice(i, 1);
  };
}

type Config = { scope?: RefObject<Element | null>; dependencies?: unknown[]; revertOnUpdate?: boolean };

/**
 * Same call shape as @gsap/react's useGSAP, but the callback runs from the setup queue.
 * Everything it creates is scoped to a gsap.context and reverted on unmount / dependency change.
 */
export function useGSAP(fn: () => void | (() => void), { scope, dependencies = [] }: Config = {}) {
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    const cancel = enqueueSetup(() => {
      ctx = gsap.context(fn, scope?.current ?? undefined);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

export { gsap, ScrollTrigger };
