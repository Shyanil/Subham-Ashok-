#!/usr/bin/env node
/**
 * Image preparation pipeline.
 *
 *   node scripts/prepare-images.mjs                 # (re)build everything
 *   node scripts/prepare-images.mjs --if-missing    # skip when outputs already exist
 *
 * Source folders (override with env vars):
 *   IMG_EXTERIOR_DIR  default: ./EXTERIOR
 *   IMG_INTERIOR_DIR  default: ./INTERIOR
 *
 * Output:
 *   public/images/<group>/<slug>-{640,1280,1920}.webp   responsive renditions
 *   public/images/<group>/<slug>-depth.webp             pseudo depth map (used by the WebGL shaders)
 *   public/images/og.jpg                                1200×630 Open Graph image
 *   content/media.json                                  manifest: size, dominant colour, blur placeholder
 */
import { existsSync } from 'node:fs';
import { mkdir, readdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTHS = [640, 1280, 1920];
const SOURCES = [
  { group: 'exterior', dir: process.env.IMG_EXTERIOR_DIR ?? path.join(root, 'EXTERIOR') },
  { group: 'interior', dir: process.env.IMG_INTERIOR_DIR ?? path.join(root, 'INTERIOR') },
];
const EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const manifestPath = path.join(root, 'content', 'media.json');
const ogSource = process.env.OG_IMAGE ?? 'aerial-day-view';

const slugify = (name) =>
  name
    .replace(EXT, '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

async function listSources() {
  const files = [];
  for (const { group, dir } of SOURCES) {
    if (!existsSync(dir)) {
      console.warn(`⚠︎  Missing source folder for "${group}": ${dir}`);
      continue;
    }
    const entries = (await readdir(dir)).filter((f) => EXT.test(f) && !f.startsWith('.')).sort();
    for (const file of entries) files.push({ group, file, abs: path.join(dir, file), slug: slugify(file) });
  }
  return files;
}

function outputsExist(files) {
  if (!existsSync(manifestPath)) return false;
  return files.every(({ group, slug }) =>
    [...WIDTHS.map((w) => `${slug}-${w}.webp`), `${slug}-depth.webp`].every((f) =>
      existsSync(path.join(root, 'public', 'images', group, f)),
    ),
  );
}

/** Heuristic depth: blurred luminance blended with a vertical "sky far / ground near" gradient. */
async function depthMap(input, out, meta) {
  const w = 640;
  const height = Math.round(((meta.height ?? w) / (meta.width ?? w)) * w);
  const base = sharp(input).rotate().resize({ width: w, height, fit: 'fill' }).greyscale();
  const lum = await base.clone().blur(18).normalise().toBuffer();
  const gradient = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${height}">
       <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="#000"/><stop offset="0.55" stop-color="#777"/><stop offset="1" stop-color="#fff"/>
       </linearGradient></defs>
       <rect width="100%" height="100%" fill="url(#g)" opacity="0.72"/>
     </svg>`,
  );
  await sharp(lum)
    .composite([{ input: gradient, blend: 'over' }])
    .blur(6)
    .greyscale()
    .webp({ quality: 70 })
    .toFile(out);
}

async function processImage({ group, abs, slug, file }) {
  const outDir = path.join(root, 'public', 'images', group);
  await mkdir(outDir, { recursive: true });
  const img = sharp(abs, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const { dominant } = await img.clone().stats();

  for (const w of WIDTHS) {
    await img
      .clone()
      .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true })
      .webp({ quality: w === 640 ? 72 : 78, effort: 5 })
      .toFile(path.join(outDir, `${slug}-${w}.webp`));
  }
  await depthMap(abs, path.join(outDir, `${slug}-depth.webp`), meta);

  const blur = await img.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  console.log(`✓ ${group}/${slug}  (${meta.width}×${meta.height})`);
  return {
    slug,
    group,
    file,
    src: `/images/${group}/${slug}`,
    depth: `/images/${group}/${slug}-depth.webp`,
    widths: WIDTHS,
    width: meta.width,
    height: meta.height,
    color: hex(dominant),
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
  };
}

async function main() {
  const files = await listSources();
  if (!files.length) {
    console.error('No source images found. Set IMG_EXTERIOR_DIR / IMG_INTERIOR_DIR.');
    process.exit(1);
  }
  if (process.argv.includes('--if-missing') && outputsExist(files)) {
    console.log('Images already prepared — skipping (run `npm run images` to rebuild).');
    return;
  }
  for (const { group } of SOURCES) await rm(path.join(root, 'public', 'images', group), { recursive: true, force: true });

  const items = [];
  for (const f of files) items.push(await processImage(f));

  const og = files.find((f) => f.slug === ogSource) ?? files[0];
  await sharp(og.abs)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(root, 'public', 'images', 'og.jpg'));

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2) + '\n');
  console.log(`\nWrote ${items.length} images → content/media.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
