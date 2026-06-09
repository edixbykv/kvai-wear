export type ColorKey =
  | "black" | "white" | "navy" | "charcoal" | "olive" | "forest"
  | "beige" | "cream" | "maroon" | "brown" | "slate";

export interface ProductColor {
  key: ColorKey;
  name: string;
  hex: string;
  family: "Neutral" | "Earth" | "Cool" | "Rich";
}

export const COLORS: Record<ColorKey, ProductColor> = {
  black:    { key: "black",    name: "Black",        hex: "#141414", family: "Neutral" },
  white:    { key: "white",    name: "Optic White",  hex: "#f1f1ef", family: "Neutral" },
  navy:     { key: "navy",     name: "Navy",         hex: "#202c46", family: "Cool" },
  charcoal: { key: "charcoal", name: "Charcoal",     hex: "#3a3d42", family: "Neutral" },
  olive:    { key: "olive",    name: "Olive",        hex: "#56532f", family: "Earth" },
  forest:   { key: "forest",   name: "Forest Green", hex: "#26432f", family: "Earth" },
  beige:    { key: "beige",    name: "Beige",        hex: "#c7b596", family: "Earth" },
  cream:    { key: "cream",    name: "Cream",        hex: "#ece2cd", family: "Neutral" },
  maroon:   { key: "maroon",   name: "Maroon",       hex: "#5d2330", family: "Rich" },
  brown:    { key: "brown",    name: "Espresso",     hex: "#5b4133", family: "Earth" },
  slate:    { key: "slate",    name: "Slate Grey",   hex: "#616d79", family: "Cool" },
};

export const COLOR_LIST = Object.values(COLORS);

export interface Product {
  id: string;
  slug: string;
  name: string;
  line: string;
  color: ColorKey;
  price: number;
  compareAt?: number;
  tagline: string;
  description: string;
  details: string[];
  badge?: string;
  fabric: string;
  rating: number;
  reviews: number;
}

export function imagesFor(color: ColorKey) {
  return {
    front: `/products/${color}-front.png`,
    side: `/products/${color}-side.png`,
    back: `/products/${color}-back.png`,
  };
}

const FABRIC =
  "Garment-dyed long-staple cotton piqué with a soft, structured hand that holds its shape wear after wear.";

const baseDetails = [
  "Long-staple combed cotton piqué, 220 GSM",
  "Tonal KVAI embroidery at the left chest",
  "Ribbed self-fabric collar and cuffs",
  "Two-button placket with horn-tone buttons",
  "Garment dyed for lived-in depth of colour",
  "Regular fit — true to size",
];

// 24 curated products spanning the 11 colourways and 8 product lines.
type Seed = [line: string, color: ColorKey, price: number, tagline: string, badge?: string, compareAt?: number];

const SEED: Seed[] = [
  ["Classic Polo",   "black",    2990, "The definitive black polo, refined to its essentials.", "Bestseller"],
  ["Classic Polo",   "white",    2990, "An optic-white staple cut for everyday elegance.", "Bestseller"],
  ["Classic Polo",   "navy",     2990, "Deep navy with a quiet, tailored confidence."],
  ["Essential Polo", "beige",    2790, "Warm beige that pairs with absolutely everything.", "New"],
  ["Essential Polo", "cream",    2790, "Soft cream for an understated, sunlit ease."],
  ["Essential Polo", "slate",    2790, "Cool slate grey — a modern neutral done right."],
  ["Signature Polo", "olive",    3290, "Muted olive with depth, our signature earth tone.", "New"],
  ["Signature Polo", "forest",   3290, "A rich forest green for considered wardrobes."],
  ["Signature Polo", "maroon",   3290, "Deep maroon with a heritage, hand-finished feel."],
  ["Premium Polo",   "charcoal", 3490, "Charcoal in our heaviest, most structured piqué.", "Premium"],
  ["Premium Polo",   "black",    3490, "Elevated black with a denser, luxurious weight.", "Premium"],
  ["Premium Polo",   "navy",     3490, "Premium navy, garment dyed for lasting depth."],
  ["Heritage Polo",  "brown",    3190, "Espresso brown with an archival, timeless tone."],
  ["Heritage Polo",  "olive",    3190, "Heritage olive, softened through garment dyeing."],
  ["Heritage Polo",  "maroon",   3190, "A vintage maroon with quiet old-world charm."],
  ["Tailored Polo",  "white",    3390, "A sharper, tailored white for polished days.", "Tailored fit"],
  ["Tailored Polo",  "navy",     3390, "Trim navy that moves from desk to dinner."],
  ["Tailored Polo",  "charcoal", 3390, "Tailored charcoal — sleek, slim, sophisticated."],
  ["Refined Polo",   "slate",    3090, "Refined slate with a clean, architectural line."],
  ["Refined Polo",   "cream",    3090, "Cream refined to a soft, gallery-quiet neutral."],
  ["Luxe Polo",      "forest",   3890, "Our most luxurious piqué in deep forest green.", "Limited", 4490],
  ["Luxe Polo",      "black",    3890, "The Luxe black — peak weight, peak finish.", "Limited", 4490],
  ["Luxe Polo",      "beige",    3890, "Luxe beige, an heirloom-grade everyday polo.", "Limited"],
  ["Luxe Polo",      "brown",    3890, "Espresso Luxe — warmth, weight and restraint."],
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const PRODUCTS: Product[] = SEED.map(([line, color, price, tagline, badge, compareAt], i) => {
  const colorName = COLORS[color].name;
  const name = `KVAI ${line} — ${colorName}`;
  const slug = slugify(`${line}-${colorName}-${i + 1}`);
  return {
    id: `kvai-${String(i + 1).padStart(2, "0")}`,
    slug,
    name,
    line,
    color,
    price,
    compareAt,
    tagline,
    badge,
    fabric: FABRIC,
    rating: 4.6 + ((i * 7) % 4) / 10, // 4.6 - 4.9, deterministic
    reviews: 38 + ((i * 17) % 180),
    description:
      `${tagline} Cut from ${COLORS[color].name.toLowerCase()} long-staple cotton piqué and finished with a discreet tonal KVAI embroidery at the chest, the ${line} is a study in quiet luxury — clean lines, honest fabric, nothing superfluous. Designed in the spirit of timeless basics to be worn season after season.`,
    details: baseDetails,
  };
});

export const LINES = Array.from(new Set(PRODUCTS.map((p) => p.line)));

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(p: Product, n = 4) {
  const sameLine = PRODUCTS.filter((x) => x.line === p.line && x.id !== p.id);
  const others = PRODUCTS.filter((x) => x.line !== p.line && x.id !== p.id);
  return [...sameLine, ...others].slice(0, n);
}
