import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { products as seedProducts } from "@/lib/data/products";

async function main() {
  const rows = seedProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    pricePaise: p.pricePaise,
    compareAtPaise: p.compareAtPaise ?? null,
    hsnCode: p.hsnCode,
    gstRate: p.gstRate,
    material: p.material,
    dimensions: p.dimensions,
    weight: p.weight,
    packagingIncludes: p.packagingIncludes,
    leadTimeDays: p.leadTimeDays,
    stockQty: p.inStock ? 10 : 0,
    isNew: p.isNew ?? false,
    images: p.images,
  }));

  await db
    .insert(products)
    .values(rows)
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        name: sql`excluded.name`,
        category: sql`excluded.category`,
        tagline: sql`excluded.tagline`,
        description: sql`excluded.description`,
        pricePaise: sql`excluded.price_paise`,
        compareAtPaise: sql`excluded.compare_at_paise`,
        hsnCode: sql`excluded.hsn_code`,
        gstRate: sql`excluded.gst_rate`,
        material: sql`excluded.material`,
        dimensions: sql`excluded.dimensions`,
        weight: sql`excluded.weight`,
        packagingIncludes: sql`excluded.packaging_includes`,
        leadTimeDays: sql`excluded.lead_time_days`,
        stockQty: sql`excluded.stock_qty`,
        isNew: sql`excluded.is_new`,
        images: sql`excluded.images`,
        updatedAt: sql`now()`,
      },
    });

  console.log(`Seeded ${rows.length} products.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
