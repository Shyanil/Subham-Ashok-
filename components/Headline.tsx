import { Fragment } from 'react';

/** Splits "YOUR NEXT _horizon._" into plain and italic-accent runs. */
export function Accent({ text }: { text: string }) {
  return (
    <>
      {text.split(/(_[^_]+_)/g).map((part, i) =>
        part.startsWith('_') && part.endsWith('_') ? (
          <em key={i} className="accent">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Plain-text version for aria-labels and metadata. */
export const plain = (lines: string[]) => lines.join(' ').replace(/_/g, '');

type Props = {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
};

/** Display headline with masked line reveals (animated by useReveal / the hero timeline). */
export function Headline({ lines, as: Tag = 'h2', className = '', id }: Props) {
  return (
    <Tag className={`headline ${className}`} id={id} aria-label={plain(lines)}>
      {lines.map((line, i) => (
        <span key={i} className="line" aria-hidden="true">
          <span className="line-inner">
            <Accent text={line} />
          </span>
        </span>
      ))}
    </Tag>
  );
}
