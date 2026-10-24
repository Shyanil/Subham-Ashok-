import manifest from '@/content/media.json';
import { imageMeta, type ImageMeta } from '@/content/images';

export type MediaItem = {
  slug: string;
  group: 'exterior' | 'interior';
  /** Largest pre-generated rendition; next/image resizes it and serves AVIF / WebP. */
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
} & ImageMeta & { focus: [number, number]; mobileFocus: [number, number] };

const titleFromSlug = (slug: string) => slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const media: MediaItem[] = manifest.items.map((raw) => {
  const meta = imageMeta[raw.slug];
  const focus = meta?.focus ?? [0.5, 0.5];
  const widest = raw.widths[raw.widths.length - 1];
  return {
    slug: raw.slug,
    group: raw.group as MediaItem['group'],
    src: `${raw.src}-${widest}.webp`,
    width: raw.width,
    height: raw.height,
    blurDataURL: raw.blurDataURL,
    title: meta?.title ?? titleFromSlug(raw.slug),
    alt: meta?.alt ?? titleFromSlug(raw.slug),
    tags: meta?.tags ?? (raw.group === 'interior' ? ['interiors'] : ['outdoors']),
    focus,
    mobileFocus: meta?.mobileFocus ?? focus,
  };
});

const bySlug = new Map(media.map((m) => [m.slug, m]));

export function getImage(slug: string): MediaItem {
  const item = bySlug.get(slug);
  if (!item) throw new Error(`Unknown image "${slug}". Run \`npm run images\` and check content/images.ts.`);
  return item;
}

/** Night renders are kept to the gallery; the rest of the page leads with daylight. */
export const isNight = (m: Pick<MediaItem, 'slug'>) => m.slug.includes('night');

export const objectPosition = ([x, y]: [number, number]) => `${x * 100}% ${y * 100}%`;
