export type ProductCategory = "lamps" | "desks";

// `url` is a real product photo; when absent, ProductVisual falls back to
// the tone gradient + label so the catalog never shows a broken image.
export type ProductImage = {
  url?: string;
  alt?: string;
  tone: [string, string];
  label: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  pricePaise: number;
  compareAtPaise?: number;
  hsnCode: string;
  gstRate: number;
  material: string;
  dimensions: string;
  leadTimeDays: number;
  inStock: boolean;
  isNew?: boolean;
  images: ProductImage[];
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  pricePaise: number;
  image: ProductImage;
  qty: number;
};
