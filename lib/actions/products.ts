"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { products } from "@/lib/db/schema";
import { getBlobToken } from "@/lib/blob/token";

export type ProductActionState = { ok: boolean; message: string };

const DEFAULT_TONE: [string, string] = ["#143a6b", "#0a1730"];

const mediaItemSchema = z.object({
  url: z.string(),
  type: z.enum(["image", "video"]),
  alt: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(2, "Enter a product name"),
  category: z.enum(["lamps", "desks"]),
  tagline: z.string().min(2, "Enter a tagline"),
  description: z.string().min(2, "Enter a description"),
  priceRupees: z.coerce.number().min(0, "Enter a valid price"),
  compareAtPriceRupees: z.coerce.number().min(0).optional(),
  hsnCode: z.string().min(1, "Enter an HSN code"),
  gstRate: z.coerce.number().min(0).max(100),
  material: z.string().min(1, "Enter a material"),
  dimensions: z.string().min(1, "Enter dimensions"),
  stockQty: z.coerce.number().int().min(0),
  media: z.array(mediaItemSchema).max(10, "Up to 10 photos/videos").optional(),
});

async function deleteBlobUrls(urls: string[]) {
  const token = getBlobToken();
  const blobUrls = urls.filter((u) => u && u.includes(".blob.vercel-storage.com"));
  if (blobUrls.length === 0 || !token) return;

  const { del } = await import("@vercel/blob");
  await Promise.allSettled(blobUrls.map((u) => del(u, { token })));
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseForm(formData: FormData) {
  const mediaRaw = formData.get("media");
  let media: unknown;
  try {
    media = mediaRaw ? JSON.parse(String(mediaRaw)) : undefined;
  } catch {
    media = undefined;
  }

  const compareAtRaw = formData.get("compareAtPriceRupees");

  return productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    priceRupees: formData.get("priceRupees"),
    compareAtPriceRupees: compareAtRaw ? compareAtRaw : undefined,
    hsnCode: formData.get("hsnCode"),
    gstRate: formData.get("gstRate"),
    material: formData.get("material"),
    dimensions: formData.get("dimensions"),
    stockQty: formData.get("stockQty"),
    media,
  });
}

function parseRemovedMedia(formData: FormData): string[] {
  const raw = formData.get("removedMedia");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === "string") : [];
  } catch {
    return [];
  }
}

function toImagesField(
  media: { url: string; type: "image" | "video"; alt?: string }[] | undefined,
  fallbackLabel: string,
) {
  if (media && media.length > 0) {
    return media.map((m) => ({
      url: m.url,
      alt: m.alt || fallbackLabel,
      type: m.type,
      tone: DEFAULT_TONE,
      label: fallbackLabel.slice(0, 12),
    }));
  }
  return [{ tone: DEFAULT_TONE, label: fallbackLabel.slice(0, 12) }];
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
    compareAtPaise: data.compareAtPriceRupees
      ? Math.round(data.compareAtPriceRupees * 100)
      : null,
    hsnCode: data.hsnCode,
    gstRate: data.gstRate,
    material: data.material,
    dimensions: data.dimensions,
    stockQty: data.stockQty,
    images: toImagesField(data.media, data.name),
  });

  await deleteBlobUrls(parseRemovedMedia(formData));

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
      compareAtPaise: data.compareAtPriceRupees
        ? Math.round(data.compareAtPriceRupees * 100)
        : null,
      hsnCode: data.hsnCode,
      gstRate: data.gstRate,
      material: data.material,
      dimensions: data.dimensions,
      stockQty: data.stockQty,
      images: toImagesField(data.media, data.name),
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  await deleteBlobUrls(parseRemovedMedia(formData));

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");

  return { ok: true, message: "Product saved." };
}

export async function deleteProduct(id: string): Promise<ProductActionState> {
  if (!process.env.DATABASE_URL) {
    return { ok: false, message: "DATABASE_URL is not set." };
  }

  const { db } = await import("@/lib/db");

  const [existing] = await db
    .select({ images: products.images })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  await db.delete(products).where(eq(products.id, id));

  if (existing) {
    await deleteBlobUrls(existing.images.map((img) => img.url ?? "").filter(Boolean));
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");

  return { ok: true, message: "Product deleted." };
}
