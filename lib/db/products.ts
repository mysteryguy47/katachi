import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products as productsTable } from "@/lib/db/schema";
import type { Product, ProductCategory } from "@/lib/types";
import type {
  ProductCategoryFilter,
  SortKey,
} from "@/lib/data/product-queries.shared";

type ProductRow = typeof productsTable.$inferSelect;

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    tagline: row.tagline,
    description: row.description,
    pricePaise: row.pricePaise,
    compareAtPaise: row.compareAtPaise ?? undefined,
    hsnCode: row.hsnCode,
    gstRate: row.gstRate,
    material: row.material,
    dimensions: row.dimensions,
    leadTimeDays: row.leadTimeDays,
    inStock: row.stockQty > 0,
    isNew: row.isNew,
    images: row.images,
  };
}

export async function dbGetProducts({
  category,
  sort,
}: { category?: ProductCategoryFilter; sort?: SortKey } = {}): Promise<Product[]> {
  const conditions = [eq(productsTable.isActive, true)];
  if (category && category !== "all") {
    conditions.push(eq(productsTable.category, category));
  }

  const orderBy =
    sort === "price-asc"
      ? asc(productsTable.pricePaise)
      : sort === "price-desc"
        ? desc(productsTable.pricePaise)
        : sort === "newest"
          ? desc(productsTable.createdAt)
          : desc(productsTable.isNew);

  const rows = await db
    .select()
    .from(productsTable)
    .where(and(...conditions))
    .orderBy(orderBy);

  return rows.map(rowToProduct);
}

export async function dbGetProductBySlug(slug: string): Promise<Product | undefined> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.slug, slug), eq(productsTable.isActive, true)))
    .limit(1);

  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function dbGetProductById(id: string): Promise<Product | undefined> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);

  return rows[0] ? rowToProduct(rows[0]) : undefined;
}
