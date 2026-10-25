'use client';

import { useEffect, useState } from 'react';

const KEY = 'ashok-heights-intro-seen';

/** Brief first-visit architectural reveal, built from CSS 3D so it never delays the app bundle. */
export function ThreeDPreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (document.documentElement.classList.contains('intro-seen') || sessionStorage.getItem(KEY)) {
        setVisible(false);
        return;
      }
      sessionStorage.setItem(KEY, '1');
    } catch {
      // Private browsing may deny session storage. The animation still dismisses itself.
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="site-preloader" role="status" aria-label="Loading Subham Ashok Heights" onAnimationEnd={(event) => { if (event.animationName === 'preloader-exit') setVisible(false); }}>
      <div className="site-preloader__content">
        <div className="site-preloader__scene" aria-hidden="true">
          <div className="site-preloader__ground" />
          <div className="site-preloader__tower site-preloader__tower--a"><i /></div>
          <div className="site-preloader__tower site-preloader__tower--b"><i /></div>
          <div className="site-preloader__tower site-preloader__tower--c"><i /></div>
        </div>
        <p className="site-preloader__brand">Subham Ashok Heights</p>
        <p className="site-preloader__caption">Beharbari · Guwahati</p>
      </div>
    </div>
  );
}
