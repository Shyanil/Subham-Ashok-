import type { SVGProps } from 'react';

/**
 * Faceted crystal mark. Every stroke path carries `data-draw` so the intro can
 * animate stroke-dashoffset (pathLength is normalised to 1).
 */
export function CrystalLogo({ title = 'Subham Beharbari', ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg viewBox="0 0 64 96" fill="none" role="img" aria-label={title} {...props}>
      <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
        {/* outer silhouette */}
        <path data-draw pathLength={1} d="M32 2 L56 30 L44 88 L20 88 L8 30 Z" />
        {/* crown girdle */}
        <path data-draw pathLength={1} d="M8 30 L56 30" />
        {/* facets */}
        <path data-draw pathLength={1} d="M32 2 L22 30 L32 88" />
        <path data-draw pathLength={1} d="M32 2 L42 30 L32 88" />
        <path data-draw pathLength={1} d="M22 30 L20 88" />
        <path data-draw pathLength={1} d="M42 30 L44 88" />
        <path data-draw pathLength={1} d="M8 30 L32 54 L56 30" />
        {/* horizon line */}
        <path data-draw pathLength={1} d="M2 94 L62 94" />
      </g>
    </svg>
  );
}
