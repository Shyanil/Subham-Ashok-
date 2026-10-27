'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const KEY = 'ashok-heights-intro-seen';

const FLOORS = 11;
/** Window columns on the main tower, either side of the jaali strip. */
const COLS = [58, 66, 92, 100];
const v = (vars: Record<string, number>) => vars as CSSProperties;

/**
 * First-visit intro, pure CSS/SVG so it never delays the app bundle: a gold blueprint of the
 * tower draws itself, the windows light up floor by floor, the logo rises in with a shimmer
 * and a 0–100 counter, then two curtains split to reveal the hero (≈2.3s, matching --intro-delay).
 */
export function ThreeDPreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Return visits are decided before first paint by the inline script in layout.tsx (it adds
    // `intro-seen`). Only that class is checked here: re-reading storage would hide the intro on
    // React's dev-mode double effect run, right after this same effect stored the flag.
    if (document.documentElement.classList.contains('intro-seen')) {
      setVisible(false);
      return;
    }
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      // Private browsing may deny session storage. The animation still dismisses itself.
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="site-preloader" role="status" aria-label="Loading Subham Ashok Heights" onAnimationEnd={(event) => { if (event.animationName === 'preloader-exit') setVisible(false); }}>
      <div className="site-preloader__grid" aria-hidden="true" />
      <div className="site-preloader__content">
        <svg className="site-preloader__tower" viewBox="0 0 160 200" aria-hidden="true">
          {/* Blueprint outline */}
          <g className="site-preloader__lines" fill="none" strokeLinecap="round">
            <path pathLength={1} d="M10 186H150" />
            <path pathLength={1} d="M50 186V30h62v156" style={v({ '--d': 0.1 })} />
            <path pathLength={1} d="M112 56h30v130" style={v({ '--d': 0.25 })} />
            <path pathLength={1} d="M76 30v156M86 30v156" style={v({ '--d': 0.35 })} />
            <path pathLength={1} d="M54 30V18h18v12M92 30V18h18v12M50 18h26M88 18h26" style={v({ '--d': 0.5 })} />
            <path pathLength={1} d="M24 186v-30h22v30M120 186v-26h28" style={v({ '--d': 0.55 })} />
          </g>
          {/* Floors light up bottom to top */}
          {Array.from({ length: FLOORS }, (_, f) =>
            COLS.map((x) => (
              <rect
                key={`${f}-${x}`}
                className="site-preloader__window"
                x={x - 3}
                y={172 - f * 13}
                width={6}
                height={7}
                rx={1}
                style={v({ '--f': f })}
              />
            )),
          )}
        </svg>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="site-preloader__logo" src="/brand/ashok-heights-logo.webp" alt="" width={480} height={210} />
        <p className="site-preloader__caption">Beharbari · Guwahati</p>

        <div className="site-preloader__progress" aria-hidden="true">
          <span className="site-preloader__bar" />
          <span className="site-preloader__count" />
        </div>
      </div>
    </div>
  );
}
