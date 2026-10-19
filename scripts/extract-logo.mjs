// One-off: lift the wordmark off the yellow weekly menu board so it can sit on any colour.
// The board is flat yellow with white + black brush lettering, so each pixel is unmixed
// into white / black / yellow coverage and the yellow share becomes transparency.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'research/menu-oct-13-17.png';
const OUT_DIR = 'src/assets/brand';

const YELLOW = [245, 238, 54];
const WHITE = [255, 255, 255];
const BLACK = [12, 12, 12];

// Rough box around the wordmark on the 2481x3508 board
const box = { left: 150, top: 160, width: 880, height: 480 };

const { data, info } = await sharp(SRC)
  .extract(box)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(info.width * info.height * 4);

// Solve p = aw*W + ak*K + (1-aw-ak)*Y on the red and blue channels
const det = (WHITE[0] - YELLOW[0]) * (BLACK[2] - YELLOW[2]) - (BLACK[0] - YELLOW[0]) * (WHITE[2] - YELLOW[2]);

for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
  const dr = data[i] - YELLOW[0];
  const db = data[i + 2] - YELLOW[2];
  let aw = (dr * (BLACK[2] - YELLOW[2]) - (BLACK[0] - YELLOW[0]) * db) / det;
  let ak = ((WHITE[0] - YELLOW[0]) * db - dr * (WHITE[2] - YELLOW[2])) / det;
  aw = Math.min(1, Math.max(0, aw));
  ak = Math.min(1, Math.max(0, ak));
  let a = Math.min(1, aw + ak);
  // drop the faint watermark on the board
  if (a < 0.14) a = 0;
  const share = aw + ak > 0 ? aw / (aw + ak) : 0;
  const v = Math.round(BLACK[0] + share * (WHITE[0] - BLACK[0]));
  out[o] = v;
  out[o + 1] = v;
  out[o + 2] = v;
  out[o + 3] = Math.round(a * 255);
}

await mkdir(OUT_DIR, { recursive: true });

const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 1 })
  .png()
  .toBuffer();
await sharp(trimmed).resize({ width: 720 }).png({ compressionLevel: 9 }).toFile(`${OUT_DIR}/logo.png`);

// The yellow "C" tile from their Linktree avatar -> favicons
const C = 'research/linktree-profile.png';
await sharp(C).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(C).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(C).resize(180, 180).png().toFile('public/apple-touch-icon.png');

console.log('logo + icons written');
