import type { Product } from "@/lib/types";
import type { ProductCategoryFilter, SortKey } from "./product-queries.shared";

// Seed catalog + zero-config fallback. Shape matches lib/db/schema.ts 1:1.
// getProducts()/getProductBySlug() below read from Postgres once
// DATABASE_URL is set; scripts/seed.ts pushes this same array into the DB.
export const products: Product[] = [
  {
    id: "1",
    slug: "nami-table-lamp",
    name: "Nami Table Lamp",
    category: "lamps",
    tagline: "A single continuous wave, cast in warm light.",
    description:
      "Nami takes its form from a single unbroken wave. Printed in one piece with no visible seams, it holds a warm 2700K bulb behind a diffused shade wall that softens every edge of the light it throws. Sits flush on any desk or console without a footprint larger than a teacup.",
    pricePaise: 289900,
    compareAtPaise: 349900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PLA+ (matte finish), oak base",
    dimensions: "14 × 12 × 22 cm",
    leadTimeDays: 5,
    inStock: true,
    isNew: true,
    images: [{ tone: ["#0e2148", "#2a63ac"], label: "Nami" }],
  },
  {
    id: "2",
    slug: "tsuki-pendant",
    name: "Tsuki Pendant Light",
    category: "lamps",
    tagline: "A quiet moon for the room above your table.",
    description:
      "Tsuki is a lattice-shell pendant, printed as a single sphere with a fine geometric weave that scatters light without a single hard shadow. Hangs from a matte-black cable, adjustable up to 1.8m, and dims smoothly on any standard dimmer.",
    pricePaise: 349900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PETG (translucent), matte-black cable",
    dimensions: "26 cm diameter",
    leadTimeDays: 7,
    inStock: true,
    isNew: true,
    images: [{ tone: ["#10131a", "#8a90a0"], label: "Tsuki" }],
  },
  {
    id: "3",
    slug: "kage-floor-lamp",
    name: "Kage Floor Lamp",
    category: "lamps",
    tagline: "Light and its shadow, printed as one.",
    description:
      "Kage stands at reading height on a weighted tripod base and casts its shade as a printed lattice — the pattern of shadow it throws is part of the design, not a side effect of it. Full-range dimmer built into the cord.",
    pricePaise: 549900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PLA+ (matte finish), weighted steel base",
    dimensions: "32 × 32 × 138 cm",
    leadTimeDays: 9,
    inStock: true,
    images: [{ tone: ["#143a6b", "#0a1730"], label: "Kage" }],
  },
  {
    id: "4",
    slug: "hikari-night-light",
    name: "Hikari Night Light",
    category: "lamps",
    tagline: "The smallest possible amount of light, done right.",
    description:
      "Hikari is a low, rounded form built for hallways and bedside tables — enough light to navigate a dark room by, never enough to wake anyone. Runs on a rechargeable cell and lasts roughly 40 nights per charge.",
    pricePaise: 129900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PLA+ (matte finish)",
    dimensions: "8 × 8 × 6 cm",
    leadTimeDays: 4,
    inStock: true,
    images: [{ tone: ["#c9364e", "#0e2148"], label: "Hikari" }],
  },
  {
    id: "5",
    slug: "mori-desk-lamp",
    name: "Mori Desk Lamp",
    category: "lamps",
    tagline: "A task lamp with the posture of a small tree.",
    description:
      "Mori's jointed arm holds its position at any angle without a single visible screw — the friction lives entirely in the printed joint geometry. Head rotates 340° and houses a flicker-free LED module rated for 25,000 hours.",
    pricePaise: 379900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PETG, brushed-aluminum joint pins",
    dimensions: "18 × 40 × 45 cm (extended)",
    leadTimeDays: 6,
    inStock: true,
    images: [{ tone: ["#2a63ac", "#f3f6fb"], label: "Mori" }],
  },
  {
    id: "6",
    slug: "en-arc-lamp",
    name: "En Arc Lamp",
    category: "lamps",
    tagline: "One continuous arc, from base to bulb.",
    description:
      "En is named for the Japanese word for a circle, or a connection — the entire body is one uninterrupted curve from the base to the shade. A statement piece for a console or reading corner, sized to be seen from across the room.",
    pricePaise: 649900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PLA+ (matte finish), weighted marble-dust base",
    dimensions: "40 × 20 × 152 cm",
    leadTimeDays: 10,
    inStock: false,
    images: [{ tone: ["#0a1730", "#b3223a"], label: "En" }],
  },
  {
    id: "7",
    slug: "sora-pendant-duo",
    name: "Sora Pendant Duo",
    category: "lamps",
    tagline: "Two lights, sky and its reflection.",
    description:
      "Sora ships as a matched pair of pendants at two sizes, meant to hang together over a dining table or kitchen island at staggered heights. Each is individually wired with its own cable length adjustment.",
    pricePaise: 599900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PETG (translucent), matte-black cable",
    dimensions: "18 cm + 24 cm diameter",
    leadTimeDays: 8,
    inStock: true,
    images: [{ tone: ["#1c4d8c", "#e7edf7"], label: "Sora" }],
  },
  {
    id: "8",
    slug: "ishi-wall-sconce",
    name: "Ishi Wall Sconce",
    category: "lamps",
    tagline: "A river stone, worn smooth, mounted to light a hallway.",
    description:
      "Ishi mounts flush to the wall and throws light both up and down its surface, softened by a stippled interior texture that reads as a single worn stone. Hardware and template included for a clean install.",
    pricePaise: 219900,
    hsnCode: "9405",
    gstRate: 18,
    material: "PLA+ (matte finish)",
    dimensions: "16 × 9 × 24 cm",
    leadTimeDays: 5,
    inStock: true,
    images: [{ tone: ["#4b5261", "#f7f8fa"], label: "Ishi" }],
  },
  {
    id: "9",
    slug: "utsuwa-desk",
    name: "Utsuwa Aesthetic Desk",
    category: "desks",
    tagline: "In development — join the list for first access.",
    description:
      "Our first desk. Full specifications, materials, and pricing are still being finalized on the workbench. Leave your details and we'll notify you the moment it's ready to order.",
    pricePaise: 0,
    hsnCode: "9403",
    gstRate: 18,
    material: "TBA",
    dimensions: "TBA",
    leadTimeDays: 0,
    inStock: false,
    images: [{ tone: ["#0e2148", "#c9364e"], label: "Utsuwa" }],
  },
];

function staticGetProducts({
  category,
  sort,
}: { category?: ProductCategoryFilter; sort?: SortKey } = {}) {
  let list = products;
  if (category && category !== "all") {
    list = list.filter((p) => p.category === category);
  }
  switch (sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.pricePaise - b.pricePaise);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.pricePaise - a.pricePaise);
      break;
    case "newest":
      list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      break;
  }
  return list;
}

function staticGetProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

function staticGetProductById(id: string) {
  return products.find((p) => p.id === id);
}

// Public data-access API. Reads from Neon Postgres once DATABASE_URL is
// set; otherwise serves the static seed array above so the site keeps
// working with zero configuration.
export async function getProducts(
  opts: { category?: ProductCategoryFilter; sort?: SortKey } = {},
) {
  if (process.env.DATABASE_URL) {
    const { dbGetProducts } = await import("@/lib/db/products");
    return dbGetProducts(opts);
  }
  return staticGetProducts(opts);
}

export async function getProductBySlug(slug: string) {
  if (process.env.DATABASE_URL) {
    const { dbGetProductBySlug } = await import("@/lib/db/products");
    return dbGetProductBySlug(slug);
  }
  return staticGetProductBySlug(slug);
}

export async function getProductById(id: string) {
  if (process.env.DATABASE_URL) {
    const { dbGetProductById } = await import("@/lib/db/products");
    return dbGetProductById(id);
  }
  return staticGetProductById(id);
}

export type { ProductCategoryFilter, SortKey } from "./product-queries.shared";
