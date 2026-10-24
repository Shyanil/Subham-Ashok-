import type { ReactNode } from 'react';
import { Accent } from './Accent';
import { SparkIcon } from './icons';

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  body?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  action?: ReactNode;
};

/** Kishori-style head: tiny tracked kicker, oversized serif with an italic accent, gold-ruled side note. */
export function SectionHeading({ id, eyebrow, title, body, align = 'left', tone = 'light', action }: Props) {
  const center = align === 'center';
  return (
    <div className={`mb-12 flex flex-col gap-6 ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} ${tone === 'dark' ? 'on-dark' : ''}`}>
      <div data-reveal>
        <p className={`kicker ${tone === 'dark' ? '!text-gold' : ''}`}>
          <SparkIcon className="size-3" /> {eyebrow}
        </p>
        <h2 id={id} className={`h2 mt-5 ${center ? 'mx-auto max-w-4xl' : 'max-w-[14ch]'} ${tone === 'dark' ? '!text-white' : ''}`}>
          <Accent text={title} />
        </h2>
        {center && body && <p className="mx-auto mt-6 max-w-2xl text-[16.5px] leading-relaxed text-muted">{body}</p>}
      </div>
      {!center && (body || action) && (
        <div className="flex flex-col items-start gap-5" data-reveal>
          {body && <p className={`side-note text-[16px] ${tone === 'dark' ? '!text-white/65' : ''}`}>{body}</p>}
          {action}
        </div>
      )}
      {center && action && <div data-reveal>{action}</div>}
    </div>
  );
}
