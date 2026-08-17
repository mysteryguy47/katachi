"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { products } from "@/lib/db/schema";

export type ProductActionState = { ok: boolean; message: string };

const productSchema = z.object({
  name: z.string().min(2, "Enter a product name"),
  category: z.enum(["lamps", "desks"]),
  tagline: z.string().min(2, "Enter a tagline"),
  description: z.string().min(2, "Enter a description"),
  priceRupees: z.coerce.number().min(0, "Enter a valid price"),
  hsnCode: z.string().min(1, "Enter an HSN code"),
  gstRate: z.coerce.number().min(0).max(100),
  material: z.string().min(1, "Enter a material"),
  dimensions: z.string().min(1, "Enter dimensions"),
  stockQty: z.coerce.number().int().min(0),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    priceRupees: formData.get("priceRupees"),
    hsnCode: formData.get("hsnCode"),
    gstRate: formData.get("gstRate"),
    material: formData.get("material"),
    dimensions: formData.get("dimensions"),
    stockQty: formData.get("stockQty"),
  });
}

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!process.env.DATABASE_URL) {
    return { ok: false, message: "DATABASE_URL is not set — see .env.example." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { db } = await import("@/lib/db");
  const data = parsed.data;

  await db.insert(products).values({
    slug: slugify(data.name),
    name: data.name,
    category: data.category,
    tagline: data.tagline,
    description: data.description,
    pricePaise: Math.round(data.priceRupees * 100),
    hsnCode: data.hsnCode,
    gstRate: data.gstRate,
    material: data.material,
    dimensions: data.dimensions,
    stockQty: data.stockQty,
    images: [{ tone: ["#143a6b", "#0a1730"], label: data.name.slice(0, 12) }],
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");

  return { ok: true, message: "Product created." };
}

export async function updateProduct(
  id: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!process.env.DATABASE_URL) {
    return { ok: false, message: "DATABASE_URL is not set — see .env.example." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { db } = await import("@/lib/db");
  const data = parsed.data;

  await db
    .update(products)
    .set({
      name: data.name,
      category: data.category,
      tagline: data.tagline,
      description: data.description,
      pricePaise: Math.round(data.priceRupees * 100),
      hsnCode: data.hsnCode,
      gstRate: data.gstRate,
      material: data.material,
      dimensions: data.dimensions,
      stockQty: data.stockQty,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");

  return { ok: true, message: "Product saved." };
}
