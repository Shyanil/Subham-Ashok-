'use client';

import { useRef, type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Headline } from './Headline';
import { ScrubText } from './ScrubText';
import { Anchor3D } from './Anchor3D';
import type { AnchorKind } from '@/lib/anchors';

type Props = {
  id?: string;
  label: string;
  meta?: string;
  headline: string[];
  lead?: string;
  body?: string;
  /** Scroll-scrubbed word reveal for the body copy. */
  scrub?: boolean;
  children?: ReactNode;
  className?: string;
  /** Small 3D object floating beside the headline. */
  object?: AnchorKind;
};

/** Editorial chapter opener: mono label, large serif headline, offset copy. */
export function Chapter({ id, label, meta, headline, lead, body, scrub = false, children, className = '', object }: Props) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section ref={ref} id={id} className={`chapter container-x ${className}`} aria-labelledby={headingId}>
      <div className="chapter__rule" data-reveal aria-hidden="true" />
      {object && <Anchor3D kind={object} className="chapter__object" />}
      <div className="chapter__grid">
        <div className="chapter__meta">
          <p className="label text-[var(--gold)]" data-reveal>
            {label}
          </p>
          {meta && (
            <p className="label mt-3 text-[var(--muted)]" data-reveal>
              {meta}
            </p>
          )}
        </div>
        <Headline lines={headline} id={headingId} className="chapter__title" />
        {(lead || body) && (
          <div className="chapter__copy">
            {lead && (
              <p className="chapter__lead" data-reveal>
                {lead}
              </p>
            )}
            {body &&
              (scrub ? (
                <ScrubText text={body} className="chapter__body" />
              ) : (
                <p className="chapter__body" data-reveal>
                  {body}
                </p>
              ))}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
