import fs from 'node:fs/promises';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
import sharp from 'sharp';

Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
const data = new Uint8Array(await fs.readFile('Subham Ashok Heights E_Brochure (2).pdf'));
const loadingTask = getDocument({ data, useSystemFonts: true });
const doc = await loadingTask.promise;
const page = await doc.getPage(1);
const scale = 8;
const viewport = page.getViewport({ scale });
// Isolate the chakra in the cover wordmark at 576 dpi.
const crop = { x: 477, y: 178, width: 112, height: 110 };
const canvas = createCanvas(crop.width * scale, crop.height * scale);
await page.render({ canvasContext: canvas.getContext('2d'), viewport,
  transform: [1, 0, 0, 1, -crop.x * scale, -crop.y * scale] }).promise;
await fs.mkdir('public/brand', { recursive: true });
const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
// The gold has a much higher green channel than the textured brown cover.
// Keep its original texture; remove brown and soften only the antialiased edge.
for (let i = 0; i < pixels.data.length; i += 4) {
  const alpha = Math.max(0, Math.min(1, (pixels.data[i + 1] - 70) / 40));
  if (alpha > 0 && alpha < 1) {
    for (let c = 0; c < 3; c++) {
      const background = [85, 35, 20][c];
      pixels.data[i + c] = Math.max(0, Math.min(255, (pixels.data[i + c] - (1 - alpha) * background) / alpha));
    }
  }
  pixels.data[i + 3] = Math.round(alpha * 255);
}
await sharp(Buffer.from(pixels.data), { raw: { width: canvas.width, height: canvas.height, channels: 4 } })
  .trim().png().toFile('public/brand/ashok-chakra.png');
console.log('Saved transparent brochure chakra at 576 dpi.');
await loadingTask.destroy();
