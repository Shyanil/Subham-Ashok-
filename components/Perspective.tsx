'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { site } from '@/content/site';
import { runtime, scheduler } from '@/lib/runtime';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Headline } from './Headline';

/**
 * "Every chakra aligns": pinned chapter with the Ashok wheel turning behind the
 * title and the Three.js crystal shards + gold dust (components/three/PerspectiveScene)
 * driven by this section's progress. No photos here — they all live in the gallery.
 */
export function Perspective() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current!;
      if (reduced) {
        runtime.perspective.active = false;
        gsap.set('.persp__title .line-inner', { yPercent: 0, y: 0 });
        gsap.fromTo('.persp__content', { opacity: 0 }, { opacity: 1, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 70%', once: true } });
        return;
      }
      // 1. Entrance — a timed reveal (not scrubbed) as the chapter arrives.
      gsap.set('.persp__title .line-inner', { yPercent: 135, y: 0, rotate: 4 });
      gsap.set('.persp__eyebrow-char', { opacity: 0, yPercent: 100 });
      gsap.set(['.persp__sub', '.persp__cue', '.persp__rule'], { opacity: 0 });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 55%', toggleActions: 'play none none reverse' } })
        .to('.persp__rule', { opacity: 1, scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0)
        .to('.persp__eyebrow-char', { opacity: 1, yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.025 }, 0.1)
        .to('.persp__title .line-inner', { yPercent: 0, rotate: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.25)
        .fromTo('.persp__sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.7)
        .fromTo('.persp__cue', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.95);

      // 2. Pinned + scrubbed: title breathes, the wheel turns, content exits.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=95%', pin: true, scrub: 1 },
      });
      tl.fromTo('.persp__title', { scale: 1 }, { scale: 1.08, duration: 1 }, 0)
        .fromTo('.persp__wheel', { rotate: -40, scale: 0.85, opacity: 0.08 }, { rotate: 140, scale: 1.12, opacity: 0.2, duration: 1 }, 0)
        .to('.persp__content', { opacity: 0, yPercent: -8, duration: 0.15 }, 0.85);

      // Whole-section progress (including entry/exit) for the 3D scene.
      const spacer = el.parentElement ?? el;
      const scene = ScrollTrigger.create({
        trigger: spacer,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (st) => {
          runtime.perspective.progress = st.progress;
          scheduler.bump();
        },
        onToggle: (st) => {
          runtime.perspective.active = st.isActive;
          scheduler.bump(3);
        },
      });
      return () => {
        scene.kill();
        runtime.perspective.active = false;
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="perspective" className="persp" aria-labelledby="perspective-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/ashok-wheel.png" alt="" aria-hidden="true" className="persp__wheel" />
      <div className="persp__shade" aria-hidden="true" />
      <div className="persp__crystals" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>


      <div className="persp__content container-x">
        <span className="persp__rule" aria-hidden="true" />
        <p className="label persp__eyebrow text-[var(--gold)]" aria-label={site.perspective.eyebrow}>
          {[...site.perspective.eyebrow].map((c, i) => (
            <span key={i} className="persp__eyebrow-char" aria-hidden="true">
              {c === ' ' ? '\u00a0' : c}
            </span>
          ))}
        </p>
        <Headline lines={site.perspective.headline} id="perspective-title" className="persp__title" />
        <p className="persp__sub">
          {site.perspective.sub}
        </p>
        <p className="label persp__cue text-[var(--muted)]">
          {site.perspective.cue}
        </p>
      </div>
    </section>
  );
}
