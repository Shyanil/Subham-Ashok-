'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useLead, type LeadIntent } from './LeadProvider';

type Props = {
  intent: LeadIntent;
  source: string;
  unit?: string;
  configuration?: string;
  title?: string;
  submitLabel?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Extracts plain string text from React children if simple */
function extractText(node: ReactNode): string | undefined {
  if (!node) return undefined;
  if (typeof node === 'string') return node.trim();
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) {
    for (const item of node) {
      const text = extractText(item);
      if (text) return text;
    }
  }
  if (typeof node === 'object' && node !== null && 'props' in node && (node as any).props?.children) {
    return extractText((node as any).props.children);
  }
  return undefined;
}

/** Lead actions open the matching enquiry modal with dynamic heading matching the CTA. */
export function LeadButton({
  intent,
  source,
  unit,
  configuration,
  title,
  submitLabel,
  className = 'btn',
  style,
  children,
}: Props) {
  const { openLead } = useLead();
  const ctaText = title || extractText(children);

  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-haspopup="dialog"
      onClick={() =>
        openLead({
          intent,
          source,
          unit,
          configuration,
          title: ctaText,
          submitLabel: submitLabel || ctaText,
        })
      }
    >
      {children}
    </button>
  );
}
