'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useLead, type LeadIntent } from './LeadProvider';

type Props = {
  intent: LeadIntent;
  source: string;
  unit?: string;
  configuration?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Lead actions open the matching enquiry modal. */
export function LeadButton({ intent, source, unit, configuration, className = 'btn', style, children }: Props) {
  const { openLead } = useLead();
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-haspopup="dialog"
      onClick={() => openLead({ intent, source, unit, configuration })}
    >
      {children}
    </button>
  );
}
