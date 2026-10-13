'use client';

/**
 * next/image custom loader. Images under /images/ are pre-generated at fixed widths
 * by scripts/prepare-images.mjs, so we map the requested width onto the closest
 * rendition instead of resizing on the fly.
 */
const WIDTHS = [640, 1280, 1920];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith('/images/') || /\.\w+$/.test(src)) return src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${src}-${w}.webp`;
}
