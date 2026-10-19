import { motion } from 'framer-motion';
import { useId, useMemo, type ReactNode } from 'react';
import type { PhotoKey } from '../data/coven';
import { PHOTOS } from '../photos';

/** Paint flecks, like the yellow splatter on their black benches. Tiled so dots stay round. */
export function Splatter({ seed = 1, count = 40, tile = 300, className = '' }: { seed?: number; count?: number; tile?: number; className?: string }) {
  const id = 'sp' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const dots = useMemo(() => {
    let s = seed * 9301 + 49297;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const out: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = rnd() * tile;
      const y = rnd() * tile;
      const big = rnd() > 0.88;
      const r = big ? 3 + rnd() * 4 : 0.6 + rnd() * 1.6;
      out.push({ x, y, r });
      if (big) {
        // droplets thrown off a bigger splat
        const n = 3 + Math.floor(rnd() * 4);
        for (let k = 0; k < n; k++) {
          const a = rnd() * Math.PI * 2;
          const d = r * (1.6 + rnd() * 2.2);
          out.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, r: 0.5 + rnd() * r * 0.3 });
        }
      }
    }
    return out;
  }, [seed, count, tile]);
  return (
    <motion.svg
      className={`splatter ${className}`}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </motion.svg>
  );
}

export function Photo({
  name,
  sizes = '(min-width: 960px) 40vw, 92vw',
  className = '',
  caption,
  eager = false,
}: {
  name: PhotoKey;
  sizes?: string;
  className?: string;
  caption?: ReactNode;
  eager?: boolean;
}) {
  const p = PHOTOS[name];
  return (
    <figure className={`photo ${className}`}>
      <img
        src={p.src}
        srcSet={p.srcSet}
        sizes={sizes}
        alt={p.alt}
        width={p.w}
        height={p.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={{ aspectRatio: `${p.w} / ${p.h}` }}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function Money({ value }: { value: number }) {
  return (
    <span className="money">
      <span className="money__sign">£</span>
      {Number.isInteger(value) ? value : value.toFixed(2)}
    </span>
  );
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** The pentagram-in-a-circle that sits faintly behind their printed board */
export function BoardWatermark() {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (-90 + i * 144) * (Math.PI / 180);
    return `${50 + 44 * Math.cos(a)},${50 + 44 * Math.sin(a)}`;
  }).join(' ');
  return (
    <svg className="board__mark" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" />
      <circle cx="50" cy="50" r="44" />
      <polygon points={pts} />
    </svg>
  );
}
