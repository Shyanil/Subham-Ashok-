import { project } from '@/content/site';

const WORDS = ['Stability', 'Grandeur', 'Connection', project.area, 'Calm', 'Harmony'];

/** Slow editorial ticker between chapters (CSS-only, pauses with reduced motion). */
export function Marquee() {
  const row = (hidden: boolean) => (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {WORDS.map((w, i) => (
        <span key={i} className="marquee__item">
          <span className={i % 2 ? 'marquee__outline' : 'accent'}>{w}</span>
          <span className="marquee__dot" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
