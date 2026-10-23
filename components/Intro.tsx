'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { site } from '@/content/site';
import { useIntro } from '@/lib/store';

/**
 * Entrance sequence (~1s): Ashok wheel spins in → wordmark rises → curtain splits open.
 * Driven by CSS keyframes so it starts with the first paint instead of waiting for
 * hydration, and the hero underneath is already rendered. Decorative only: it never
 * blocks input or scroll. Replayable from the footer (remounting restarts the keyframes).
 */
export function Intro() {
  const phase = useIntro((s) => s.phase);
  const run = useIntro((s) => s.run);
  const finish = useIntro((s) => s.finish);
  const ref = useRef<HTMLDivElement>(null);

  // On slow devices hydration can land after the CSS sequence has already ended.
  useEffect(() => {
    const el = ref.current;
    if (!el || phase === 'done') return;
    const anims = el.getAnimations?.() ?? [];
    if (anims.length && anims.every((a) => a.playState === 'finished')) finish();
  }, [phase, run, finish]);

  return (
    <div
      key={run}
      ref={ref}
      id="intro"
      className="intro"
      data-phase={phase}
      aria-hidden="true"
      onAnimationEnd={(e) => e.target === e.currentTarget && finish()}
    >
      <div className="intro__panel intro__panel--top" />
      <div className="intro__panel intro__panel--bottom" />
      <div className="intro__glow" />
      <div className="intro__stage">
        <p className="intro__eyebrow label">{site.intro.eyebrow}</p>
        <div className="intro__mark">
          <span className="intro__logo-glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ashok-wheel.webp" alt="" className="intro__logo" width={444} height={436} />
        </div>
        <p className="intro__wordmark">
          {site.intro.wordmark.map((w, l) => (
            <span key={w} className="line">
              {[...w].map((c, i) => (
                <span key={i} className="intro__char" style={{ '--i': l * w.length + i } as CSSProperties}>
                  {c}
                </span>
              ))}
            </span>
          ))}
        </p>
        <p className="intro__caption label">{site.intro.caption}</p>
      </div>
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
