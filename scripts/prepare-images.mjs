// One-off: resize the Coven's own photos (saved in research/) into web-sized WebP.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'src/assets/photos';

// name: [source, widths, optional crop {left, top, width, height} on the source]
const photos = {
  'shopfront-night': ['research/timeout-shopfront.jpg', [640, 1200]],
  'shopfront-day': ['research/mfm-1-IMG_9007.jpg', [600, 1000]],
  door: ['research/bv-2026-08-18.png', [560, 900]],
  spread: ['research/mfm-2-IMG_9040.jpg', [640, 1200]],
  reuben: ['research/fgv-2025-the-reuben.jpg', [560, 1000]],
  marg: ['research/mfm-4-22DC6DDC.jpg', [480, 900]],
  cocktail: ['research/mfm-6-721E5FC4.jpg', [480, 900]],
  'wiccan-liquor': ['research/fgv-2025-gravity-well-birthday-beer.jpg', [560, 1000]],
  'mr-bang': ['research/fgv-2025-our-hot-sauce.png', [480, 900]],
  agatha: ['research/fgv-2025-agatha.jpg', [480, 900]],
};

await mkdir(OUT, { recursive: true });

for (const [name, [src, widths, crop]] of Object.entries(photos)) {
  for (const w of widths) {
    let img = sharp(src).rotate();
    if (crop) img = img.extract(crop);
    await img
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 74, effort: 6 })
      .toFile(`${OUT}/${name}-${w}.webp`);
  }
  console.log('done', name);
}
