// One-off: build public/og.jpg (1200x630) for link previews.
// Their spread photo on the left, a yellow fascia panel with the wordmark on the right.
import sharp from 'sharp';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// sharp's text renderer wants a TTF; fontsource ships WOFF, which is just zlib'd sfnt tables
async function woffToTtf(src, dest) {
  const b = await readFile(src);
  const flavor = b.readUInt32BE(4);
  const n = b.readUInt16BE(12);
  const tables = [];
  for (let i = 0; i < n; i++) {
    const o = 44 + i * 20;
    const [tag, off, comp, orig, sum] = [b.readUInt32BE(o), b.readUInt32BE(o + 4), b.readUInt32BE(o + 8), b.readUInt32BE(o + 12), b.readUInt32BE(o + 16)];
    const raw = b.subarray(off, off + comp);
    tables.push({ tag, sum, data: comp < orig ? inflateSync(raw) : raw });
  }
  const head = 12 + 16 * n;
  let size = head;
  for (const t of tables) size += (t.data.length + 3) & ~3;
  const out = Buffer.alloc(size);
  let pow = 1;
  while (pow * 2 <= n) pow *= 2;
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(n, 4);
  out.writeUInt16BE(pow * 16, 6);
  out.writeUInt16BE(Math.log2(pow), 8);
  out.writeUInt16BE(n * 16 - pow * 16, 10);
  let at = head;
  tables.forEach((t, i) => {
    const r = 12 + i * 16;
    out.writeUInt32BE(t.tag, r);
    out.writeUInt32BE(t.sum, r + 4);
    out.writeUInt32BE(at, r + 8);
    out.writeUInt32BE(t.data.length, r + 12);
    t.data.copy(out, at);
    at += (t.data.length + 3) & ~3;
  });
  await writeFile(dest, out);
}

const tmp = join(tmpdir(), 'coven-og');
await mkdir(tmp, { recursive: true });
const anton = join(tmp, 'Anton.ttf');
const fell = join(tmp, 'IMFellEnglishSC.ttf');
await woffToTtf('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff', anton);
await woffToTtf('node_modules/@fontsource/im-fell-english-sc/files/im-fell-english-sc-latin-400-normal.woff', fell);

const W = 1200;
const H = 630;
const PHOTO_W = 690;
const YELLOW = '#FFF200';
const INK = '#0b0b0b';

// The spread: frozen marg, Reuben, sub, fries, Wiccan Liquor can, on their splattered table
const photo = await sharp('research/mfm-2-IMG_9040.jpg')
  .extract({ left: 0, top: 160, width: 1536, height: 1404 })
  .resize(PHOTO_W, H, { fit: 'cover', position: 'centre' })
  .modulate({ saturation: 1.05 })
  .toBuffer();

const logo = await sharp('src/assets/brand/logo.png').resize({ width: 440 }).toBuffer();
const logoMeta = await sharp(logo).metadata();

const text = (markup, fontfile, width) =>
  sharp({ text: { text: markup, fontfile, width, rgba: true, dpi: 72, align: 'left' } }).png().toBuffer();

const line1 = await text(`<span foreground="${INK}" font="Anton 46" letter_spacing="1024">666% VEGAN 'WICHES</span>`, anton, 460);
const line2 = await text(`<span foreground="${INK}" font="Anton 46" letter_spacing="1024">&amp; A DIVE BAR</span>`, anton, 460);
const addr = await text(`<span foreground="${INK}" font="IM FELL English SC 34">14D Market Row, Brixton</span>`, fell, 460);

// A few paint flecks like the ones on their benches
const flecks = Array.from({ length: 34 }, (_, i) => {
  const x = PHOTO_W + 20 + ((i * 137) % 480);
  const y = 18 + ((i * 89) % 590);
  const r = 1.4 + ((i * 7) % 5) * 0.7;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}" opacity="0.13"/>`;
}).join('');

const panel = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="${PHOTO_W}" y="0" width="${W - PHOTO_W}" height="${H}" fill="${YELLOW}"/>
  ${flecks}
  <rect x="${PHOTO_W - 8}" y="0" width="8" height="${H}" fill="${INK}"/>
</svg>`);

const x0 = PHOTO_W + 44;
await sharp({ create: { width: W, height: H, channels: 3, background: YELLOW } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: panel, left: 0, top: 0 },
    { input: logo, left: x0 - 8, top: 52 },
    { input: line1, left: x0, top: 52 + logoMeta.height + 34 },
    { input: line2, left: x0, top: 52 + logoMeta.height + 94 },
    { input: addr, left: x0, top: 52 + logoMeta.height + 176 },
  ])
  .flatten({ background: YELLOW })
  .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile('public/og.jpg');

const { size } = await stat('public/og.jpg');
const meta = await sharp('public/og.jpg').metadata();
console.log(`og.jpg ${meta.width}x${meta.height} ${meta.format} ${Math.round(size / 1024)}KB`);
