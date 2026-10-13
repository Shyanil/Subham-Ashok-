'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { site, project } from '@/content/site';
import { useMotion, useScroll } from '@/lib/store';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lock = useScroll((s) => s.lock);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Blur background once scrolled; tuck away while scrolling down.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > window.innerHeight * 0.8);
      last = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, stagger links in, close on Escape, keep focus inside.
  useEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;
    lock(true);
    const links = menu.querySelectorAll<HTMLElement>('a, button');
    links[0]?.focus();
    if (!useMotion.getState().reduced) {
      gsap.fromTo(
        menu.querySelectorAll('.menu-link'),
        { yPercent: 135, y: 0 },
        { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.1 },
      );
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab') {
        const first = toggleRef.current!;
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lock(false);
    };
  }, [open, lock]);

  return (
    <header className="site-header" data-scrolled={scrolled || open} data-hidden={hidden && !open}>
      <span ref={progressRef} className="site-header__progress" aria-hidden="true" />
      <div className="site-header__bar">
        <a href="#top" className="brand" aria-label={`${project.name} — back to top`} onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/ashok-heights-logo.png" alt="" className="brand__logo" width={1528} height={668} />
        </a>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="label link-underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="mobile-menu xl:hidden"
        data-open={open}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-3">
            {site.nav.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <a href={item.href} className="menu-link" onClick={() => setOpen(false)}>
                  <span className="label mr-4 text-[var(--gold)]">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="label mt-auto text-[var(--muted)]">
          {project.area} · {project.city}
        </p>
      </div>
    </header>
  );
}
