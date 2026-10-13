'use client';

import { useMemo, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { site } from '@/content/site';
import { pick } from '@/lib/media';
import { runtime } from '@/lib/runtime';
import { useIntro } from '@/lib/store';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ImagePlane, usePlaneController } from './ImagePlane';
import { Headline, Accent } from './Headline';
import { Magnetic } from './Magnetic';

/**
 * Pinned hero: day → night ripple dissolve, slow 1.15 → 1 scale, line-by-line
 * headline, then a "reframe" where the full-bleed plane pulls back into a
 * tilting card and the project name rises in.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const images = useMemo(() => pick('aerial-day-view', 'aerial-night-view'), []);
  const plane = usePlaneController({ zoom: 1.15 });
  const reduced = useReducedMotion();
  const introDone = useIntro((s) => s.phase === 'done');

  // Entrance — waits for the intro to close.
  useGSAP(
    () => {
      if (!introDone) return;
      const tl = gsap.timeline({ delay: 0.1 });
      if (reduced) {
        tl.to('.hero__veil', { opacity: 0, duration: 0.8 })
          .fromTo('.hero__title .line-inner', { yPercent: 0, y: 0, opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
          .fromTo('[data-hero-fade]', { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.05 }, 0.1);
        return;
      }
      tl.to('.hero__veil', { opacity: 0, duration: 1.6, ease: 'power2.inOut' })
        .fromTo('.hero__title .line-inner', { yPercent: 135, y: 0 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.2)
        .fromTo('[data-hero-fade]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.08 }, 0.5);
    },
    { scope: root, dependencies: [introDone, reduced], revertOnUpdate: true },
  );

  // Scroll choreography (pinned + scrubbed).
  useGSAP(
    () => {
      if (reduced) {
        plane.set({ zoom: 1, mix: 0, radius: 0, tilt: 0 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=115%',
          pin: true,
          scrub: 1,
          onUpdate: (st) => (runtime.hero.progress = st.progress),
          onToggle: (st) => (runtime.hero.active = st.isActive),
        },
      });
      runtime.hero.active = !!tl.scrollTrigger?.isActive || window.scrollY < 10;
      const proxy = { zoom: 1.15, mix: 0, radius: 0, tilt: 0, dim: 0 };
      const sync = () => plane.set(proxy);
      tl.to(proxy, { zoom: 1, duration: 0.6, onUpdate: sync }, 0)
        .to(proxy, { mix: 1, duration: 0.45, ease: 'power1.inOut', onUpdate: sync }, 0.12)
        .to('.hero__content', { yPercent: -18, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.3)
        .to('.hero__aside', { opacity: 0, duration: 0.2 }, 0.3)
        .to('.hero__shade', { opacity: 0.4, duration: 0.3 }, 0.55)
        .to('.hero__frame', { scale: 0.84, duration: 0.4, ease: 'power2.inOut' }, 0.6)
        .to(proxy, { radius: 28, tilt: 1, dim: 0.22, duration: 0.4, ease: 'power2.inOut', onUpdate: sync }, 0.6)
        .fromTo('.hero__reframe .line-inner', { yPercent: 135, y: 0 }, { yPercent: 0, duration: 0.3, ease: 'power3.out', stagger: 0.05 }, 0.7)
        .fromTo('.hero__reframe [data-reframe-fade]', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.82)
        .fromTo('.hero__daynight-fill', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power1.inOut' }, 0.12);
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__frame">
        <ImagePlane
          id="hero"
          images={images}
          mode="mix"
          controller={plane}
          priority
          depth={0.035}
          className="absolute inset-0"
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__content container-x">
        <p className="label text-[var(--gold)]" data-hero-fade>
          {site.hero.eyebrow}
        </p>
        <Headline as="h1" id="hero-title" lines={site.hero.headline} className="hero__title" />
        <p className="hero__sub" data-hero-fade>
          {site.hero.sub}
        </p>
        <div data-hero-fade>
          <Magnetic>
            <a href="#overview" className="btn btn--ghost">
              {site.hero.cta}
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="hero__aside" aria-hidden="true">
        <span className="hero__side label">{site.hero.side}</span>
        <span className="hero__caption label" data-hero-fade>
          {site.hero.caption}
        </span>
        <div className="hero__daynight label" data-hero-fade>
          <span>Day</span>
          <span className="hero__daynight-track">
            <span className="hero__daynight-fill" />
          </span>
          <span>Night</span>
        </div>
        <span className="hero__scroll" data-hero-fade>
          <span className="label">Scroll</span>
          <span className="hero__scroll-line" />
        </span>
      </div>

      <div className="hero__reframe" aria-hidden="true">
        <span className="label text-[var(--gold)]" data-reframe-fade>
          {site.hero.eyebrow}
        </span>
        <p className="hero__reframe-title">
          {site.hero.reframe.split(' ').map((w, i) => (
            <span key={w} className="line">
              <span className="line-inner">{i === 1 ? <Accent text={`_${w.toLowerCase()}_`} /> : w}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
