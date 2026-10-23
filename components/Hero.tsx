'use client';

import { useMemo, useRef, type CSSProperties } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { site } from '@/content/site';
import { pick } from '@/lib/media';
import { runtime } from '@/lib/runtime';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ImagePlane, usePlaneController } from './ImagePlane';
import { Headline, Accent } from './Headline';
import { Magnetic } from './Magnetic';

const fade = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Pinned hero: day → night ripple dissolve, slow 1.15 → 1 scale, line-by-line
 * headline, then a "reframe" where the full-bleed plane pulls back into a
 * tilting card and the project name rises in.
 * The entrance is pure CSS (globals.css, "Hero entrance"), timed to the intro
 * curtain, so the photo and headline are rendered at first paint.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const images = useMemo(() => pick('aerial-day-view', 'aerial-night-view'), []);
  const plane = usePlaneController({ zoom: 1.15 });
  const reduced = useReducedMotion();

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
          // Server-rendered spacer: GSAP won't re-parent the hero, which would repaint it as a new LCP candidate.
          pinSpacer: spacer.current,
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
        .fromTo(
          '.hero__reframe .line-inner',
          { yPercent: 135, y: 0 },
          { yPercent: 0, duration: 0.3, ease: 'power3.out', stagger: 0.05 },
          0.7,
        )
        .fromTo('.hero__reframe [data-reframe-fade]', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.82)
        .fromTo('.hero__daynight-fill', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power1.inOut' }, 0.12);
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={spacer} className="pin-spacer">
      <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero__frame">
          <ImagePlane id="hero" images={images} mode="mix" controller={plane} priority depth={0.035} className="absolute inset-0" />
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />

        <div className="hero__content container-x">
          <p className="label hero__eyebrow" data-hero-fade style={fade(0)}>
            {site.hero.eyebrow}
          </p>
          <Headline as="h1" id="hero-title" lines={site.hero.headline} className="hero__title" />
          {/* Not animated: this is the LCP element (Chrome ignores the full-viewport photo), and the curtain reveals it. */}
          <p className="hero__sub">{site.hero.sub}</p>
          <div data-hero-fade style={fade(2)}>
            <Magnetic>
              <a href="#overview" className="btn btn--ghost">
                {site.hero.cta}
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="hero__aside" aria-hidden="true">
          <span className="hero__side label">{site.hero.side}</span>
          <span className="hero__caption label" data-hero-fade style={fade(3)}>
            {site.hero.caption}
          </span>
          <div className="hero__daynight label" data-hero-fade style={fade(4)}>
            <span>Day</span>
            <span className="hero__daynight-track">
              <span className="hero__daynight-fill" />
            </span>
            <span>Night</span>
          </div>
          <span className="hero__scroll" data-hero-fade style={fade(5)}>
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
    </div>
  );
}
