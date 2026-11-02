type Motif = 'woven' | 'waves' | 'corner' | 'root' | 'heart' | 'crown';

/** Original brochure artwork, decorative and masked to inherit the section's ink. */
export function BrochureMotif({ kind, className = '' }: { kind: Motif; className?: string }) {
  return <span aria-hidden="true" className={`brochure-motif brochure-motif--${kind} ${className}`} />;
}
