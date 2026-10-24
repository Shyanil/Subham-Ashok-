/** Renders `_word_` segments as the italic accent (terracotta on light, gold inside `.on-dark`). */
export function Accent({ text }: { text: string; tone?: 'light' | 'dark' }) {
  return text.split(/(_[^_]+_)/g).map((part, i) =>
    part.startsWith('_') && part.endsWith('_') ? (
      <em key={i} className="accent">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}
