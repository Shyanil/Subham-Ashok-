import { site } from '@/content/site';
import { SparkIcon } from './icons';

/** Dark band with an endlessly scrolling line of gold caps (CSS only; stops under reduced motion). */
export function Marquee() {
  const items = site.marquee;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-8 px-8 text-[12px] font-bold uppercase tracking-[0.32em] text-gold">
          {t}
          <SparkIcon className="size-3 text-terra" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mt-3 overflow-hidden border-y border-gold/20 bg-deep py-4 sm:mt-4" aria-label="Project highlights">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
