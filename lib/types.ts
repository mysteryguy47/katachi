export type ProductCategory = "lamps" | "desks";

// `url` is a real product photo/video; when absent, ProductVisual falls
// back to the tone gradient + label so the catalog never shows a broken
// image. The first item in a product's `images` array is its cover.
export type ProductImage = {
  url?: string;
  alt?: string;
  type?: "image" | "video";
  tone: [string, string];
  label: string;
};

export type DimensionUnit = "mm" | "cm" | "in";
export type WeightUnit = "g" | "kg";

export type ProductDimensions = {
  length: number;
  breadth: number;
  height: number;
  unit: DimensionUnit;
};

export type ProductWeight = {
  value: number;
  unit: WeightUnit;
};

export type PackagingItem = {
  item: string;
  qty: number;
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
  dimensions: ProductDimensions;
  weight: ProductWeight;
  packagingIncludes: PackagingItem[];
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
