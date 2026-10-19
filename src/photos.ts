import type { PhotoKey } from './data/coven';

// All photos are the Coven's own (Instagram, Brixton Village listing, press kits).
const files = import.meta.glob('./assets/photos/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

const src = (name: string) => {
  const sizes = Object.entries(files)
    .map(([path, url]) => {
      const m = path.match(new RegExp(`/${name}-(\\d+)\\.webp$`));
      return m ? { w: Number(m[1]), url } : null;
    })
    .filter((x): x is { w: number; url: string } => !!x)
    .sort((a, b) => a.w - b.w);
  return { src: sizes[sizes.length - 1].url, srcSet: sizes.map((s) => `${s.url} ${s.w}w`).join(', ') };
};

export const PHOTOS: Record<PhotoKey, { src: string; srcSet: string; alt: string; w: number; h: number }> = {
  reuben: { ...src('reuben'), w: 1, h: 1, alt: 'The Reuben: vastrami, kraut and pickles stacked on toasted rye sourdough' },
  agatha: { ...src('agatha'), w: 1, h: 1, alt: 'The A.G.A.T.H.A: aubergine schnitzel, rocket and pink sauce in middle eastern bread' },
  marg: { ...src('marg'), w: 3, h: 4, alt: 'A frozen margarita with a chilli-salt rim, lime and fresh chillies' },
  cocktail: { ...src('cocktail'), w: 3, h: 4, alt: 'A pale cocktail with a cherry, next to a ceramic skull and apothecary jars' },
  'wiccan-liquor': { ...src('wiccan-liquor'), w: 1, h: 1, alt: 'A can of Wiccan Liquor from Gravity Well beside a pint glass printed with THE COVEN of WICHES' },
  'mr-bang': { ...src('mr-bang'), w: 8, h: 7, alt: 'A flask bottle of Mr. Bang hot pepper sauce, habanero and tomatillo' },
  spread: { ...src('spread'), w: 4, h: 5, alt: 'The full spread on a yellow-splattered table: Reuben, smash burger, loaded sub, fries, frozen margs, a COVEN pint and a can of Wiccan Liquor' },
  'shopfront-day': { ...src('shopfront-day'), w: 54, h: 71, alt: 'The yellow front of 14D Market Row by day, with a DIVE BAR CRAFT BEER VEGAN FOOD A-board and splattered benches' },
  'shopfront-night': { ...src('shopfront-night'), w: 2904, h: 1972, alt: 'The yellow fascia at night under blue arcade light: THE COVEN of WICHES, Sandwiches, pickles & boozes, oh my!' },
  door: { ...src('door'), w: 970, h: 1472, alt: 'The door of 14D before opening, chalked: 14D, The Coven lives!! August 19' },
};
