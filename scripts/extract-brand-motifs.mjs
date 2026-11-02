/** Extract original decorative artwork from the supplied brochure; no runtime PDF dependency. */
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
const task = getDocument({ data: new Uint8Array(await fs.readFile('Subham Ashok Heights E_Brochure (2).pdf')), useSystemFonts: true });
const doc = await task.promise;
await fs.mkdir('public/brand/motifs', { recursive: true });
async function extract(name, pageNumber, crop, cover = false) {
  const page = await doc.getPage(pageNumber);
  const scale = 3;
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(Math.round(crop[2] * scale), Math.round(crop[3] * scale));
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport, transform: [1, 0, 0, 1, -crop[0] * scale, -crop[1] * scale] }).promise;
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const r = pixels.data[i], g = pixels.data[i + 1];
    // Flat cream pages: recover line coverage from the green channel.
    // Cover: separate the gold ink from the textured burgundy using chroma.
    const alpha = cover ? Math.max(0, Math.min(1, (g - r * 0.43 - 6) / 48)) : Math.max(0, Math.min(1, (230 - g) / 171));
    pixels.data[i] = 133; pixels.data[i + 1] = 67; pixels.data[i + 2] = 43;
    pixels.data[i + 3] = Math.round((alpha < (cover ? 0.055 : 0.18) ? 0 : alpha) * 255);
  }
  await sharp(Buffer.from(pixels.data), { raw: { width: canvas.width, height: canvas.height, channels: 4 } }).webp({ lossless: true }).toFile(`public/brand/motifs/${name}.webp`);
  console.log(name);
}
await extract('woven-border', 1, [0, 0, 312, 84], true);
await sharp('public/brand/motifs/woven-border.webp').rotate(90).toFile('public/brand/motifs/woven-border-vertical.webp');
await extract('flowing-waves', 2, [0, 515, 244, 52]);
await extract('mandala-corner', 5, [1207, 0, 212, 211]);
await extract('chakra-root', 2, [1180, 405, 47, 44]);
// The page-two heart is a clean, isolated symbol without the accompanying copy.
await extract('chakra-heart', 2, [1180, 239, 47, 44]);
await extract('chakra-crown', 2, [1180, 69, 47, 43]);
await task.destroy();
