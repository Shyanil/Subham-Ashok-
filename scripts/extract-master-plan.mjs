import fs from 'node:fs/promises';
import sharp from 'sharp';

// Convert the user-supplied landscape plan at its original resolution.
const source = process.argv[2] ?? 'public/images/interior/Lush Residential Complex Masterplan.png';
const output = 'public/brochure/master-plan-refined.webp';
await fs.mkdir('public/brochure', { recursive: true });
await sharp(source).webp({ quality: 94, effort: 6 }).toFile(output);
console.log(await sharp(output).metadata());
