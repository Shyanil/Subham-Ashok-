'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { site } from '@/content/site';
import { useIntro, useMotion, useScroll } from '@/lib/store';

const FAILSAFE_MS = 4500;

/**
 * Entrance sequence: eyebrow → Ashok wheel spins in → wordmark rises → caption.
 * Plays on every load, can be skipped, always closes within 4.5s, and can be replayed from the footer.
 */
export function Intro() {
  const phase = useIntro((s) => s.phase);
  const run = useIntro((s) => s.run);
  const play = useIntro((s) => s.play);
  const finish = useIntro((s) => s.finish);
  const lock = useScroll((s) => s.lock);
  const motionReady = useMotion((s) => s.ready);
  const ref = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Start once the client is ready.
  useEffect(() => {
    if (!motionReady || useIntro.getState().phase !== 'pending') return;
    play();
  }, [motionReady, play, finish]);

  const done = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    document.documentElement.dataset.intro = 'seen';
    document.getElementById('page')?.removeAttribute('inert');
    lock(false);
    finish();
    returnFocus.current?.focus?.({ preventScroll: true });
  }, [finish, lock]);

  useEffect(() => {
    const root = ref.current;
    if (phase !== 'playing' || !root) return;
    closing.current = false;
    returnFocus.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    delete document.documentElement.dataset.intro;
    document.getElementById('page')?.setAttribute('inert', '');
    lock(true);
    skipRef.current?.focus({ preventScroll: true });

    const reduced = useMotion.getState().reduced;
    const ctx = gsap.context(() => {
      const chars = root.querySelectorAll('.intro__char');
      const count = root.querySelector<HTMLElement>('.intro__count');
      const meter = { v: 0 };
      const setMeter = () => {
        if (count) count.textContent = String(Math.round(meter.v)).padStart(3, '0');
      };
      const tl = gsap.timeline({ onComplete: done });
      tl.set(root, { autoAlpha: 1 }).set('.intro__panel', { yPercent: 0 });

      if (reduced) {
        tl.set(chars, { yPercent: 0, y: 0, rotate: 0 })
          .fromTo('.intro__stage', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.out' })
          .fromTo(['.intro__eyebrow', '.intro__caption'], { opacity: 0 }, { opacity: 1, duration: 0.6 }, '<0.2')
          .to(meter, { v: 100, duration: 1.2, ease: 'none', onUpdate: setMeter }, 0)
          .fromTo('.intro__bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'none' }, 0)
          .to(root, { autoAlpha: 0, duration: 0.7, ease: 'power1.inOut' }, '+=1.2');
        return;
      }

      tl
        // Loading meter + hairline progress.
        .to(meter, { v: 100, duration: 2.7, ease: 'power2.inOut', onUpdate: setMeter }, 0)
        .fromTo('.intro__bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 2.7, ease: 'power2.inOut' }, 0)
        .fromTo('.intro__meter', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
        // Mark.
        .fromTo('.intro__eyebrow', { opacity: 0, y: 14, letterSpacing: '0.5em' }, { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 1.2, ease: 'expo.out' }, 0.1)
        .fromTo('.intro__logo', { scale: 0.4, rotate: -180, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 2, ease: 'expo.out' }, 0.3)
        .fromTo('.intro__logo-glow', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' }, 1.2)
        // Wordmark, letter by letter.
        .fromTo(chars, { yPercent: 135, y: 0, rotate: 10 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.03 }, 1.45)
        .fromTo('.intro__caption', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 2.15)
        // Exit: content lifts away, curtain splits open.
        .to(['.intro__meter', '.intro__bar', '.intro__skip'], { opacity: 0, duration: 0.4 }, 2.95)
        .to('.intro__stage', { opacity: 0, yPercent: -12, scale: 0.96, duration: 0.55, ease: 'power2.in' }, 3.1)
        .to('.intro__glow', { opacity: 0, duration: 0.5 }, 3.1)
        .to('.intro__panel--top', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 3.35)
        .to('.intro__panel--bottom', { yPercent: 100, duration: 1, ease: 'expo.inOut' }, 3.35);
    }, root);

    const failsafe = window.setTimeout(done, FAILSAFE_MS);
    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [phase, run, done, lock]);

  const skip = () => {
    if (!ref.current) return done();
    gsap.to(ref.current, { autoAlpha: 0, duration: 0.45, ease: 'power2.out', onComplete: done });
  };

  return (
    <div
      ref={ref}
      id="intro"
      className="intro"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label={`${site.intro.eyebrow}. ${site.intro.wordmark.join(' ')}. ${site.intro.caption}.`}
      onKeyDown={(e) => e.key === 'Escape' && skip()}
    >
      <div className="intro__panel intro__panel--top" aria-hidden="true" />
      <div className="intro__panel intro__panel--bottom" aria-hidden="true" />
      <div className="intro__glow" aria-hidden="true" />
      <div className="intro__stage">
        <p className="intro__eyebrow label">{site.intro.eyebrow}</p>
        <div className="intro__mark">
          <span className="intro__logo-glow" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ashok-wheel.png" alt="" className="intro__logo" aria-hidden="true" />
        </div>
        <p className="intro__wordmark" aria-hidden="true">
          {site.intro.wordmark.map((w) => (
            <span key={w} className="line">
              {[...w].map((c, i) => (
                <span key={i} className="intro__char">
                  {c}
                </span>
              ))}
            </span>
          ))}
        </p>
        <p className="intro__caption label">{site.intro.caption}</p>
      </div>
      <div className="intro__meter label" aria-hidden="true">
        <span className="text-[var(--muted)]">Loading</span>
        <span className="intro__count">000</span>
      </div>
      <div className="intro__bar" aria-hidden="true">
        <span className="intro__bar-fill" />
      </div>
      <button ref={skipRef} type="button" className="intro__skip label link-underline" onClick={skip}>
        {site.intro.skip}
      </button>
    </div>
  );
}

/** Footer / anywhere: replays the entrance. */
export function ReplayIntroButton({ className = '' }: { className?: string }) {
  const play = useIntro((s) => s.play);
  return (
    <button type="button" className={`label link-underline ${className}`} onClick={play}>
      {site.intro.replay}
    </button>
  );
}
