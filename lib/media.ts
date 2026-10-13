import manifest from '@/content/media.json';
import { imageMeta, type ImageMeta } from '@/content/images';

export type MediaItem = {
  slug: string;
  group: 'exterior' | 'interior';
  src: string; // base path without width suffix, e.g. /images/exterior/gate-view
  depth: string;
  widths: number[];
  width: number;
  height: number;
  color: string;
  blurDataURL: string;
} & ImageMeta & { focus: [number, number]; mobileFocus: [number, number] };

const titleFromSlug = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const media: MediaItem[] = manifest.items.map((raw) => {
  const meta = imageMeta[raw.slug];
  const focus = meta?.focus ?? [0.5, 0.5];
  return {
    ...(raw as Omit<MediaItem, keyof ImageMeta | 'focus' | 'mobileFocus'>),
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

/** Look up several slugs, silently skipping any that are missing (e.g. a removed file). */
export const pick = (...slugs: string[]) => slugs.flatMap((s) => (bySlug.has(s) ? [bySlug.get(s)!] : []));

export const exterior = media.filter((m) => m.group === 'exterior');
export const interior = media.filter((m) => m.group === 'interior');

/** Smallest generated rendition that is at least `px` wide. */
export function widthFor(item: Pick<MediaItem, 'widths'>, px: number) {
  return item.widths.find((w) => w >= px) ?? item.widths[item.widths.length - 1];
}

export const srcAt = (item: Pick<MediaItem, 'src' | 'widths'>, px: number) => `${item.src}-${widthFor(item, px)}.webp`;

export const objectPosition = ([x, y]: [number, number]) => `${x * 100}% ${y * 100}%`;

/** A journey entry may override the image's default title. */
export type JourneyItem = MediaItem & { caption?: string };
export const withTitles = (entries: [slug: string, title?: string][]): JourneyItem[] =>
  entries.flatMap(([slug, title]) => {
    const item = bySlug.get(slug);
    return item ? [{ ...item, title: title ?? item.title }] : [];
  });
