"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/product-visual";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700";

const labelClass = "mb-1.5 block text-xs font-medium text-ink-soft";

export function ProductForm({ product }: { product?: Product }) {
  const action = product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction, pending] = useActionState(action, {
    ok: false,
    message: "",
  });

  const [imageUrl, setImageUrl] = useState(product?.images[0]?.url);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Upload failed");
      setImageUrl(payload.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <span className={labelClass}>Photo</span>
        <div className="flex items-center gap-4">
          <ProductVisual
            url={imageUrl}
            tone={product?.images[0]?.tone ?? ["#143a6b", "#0a1730"]}
            label={product?.name?.slice(0, 12) ?? "New"}
            className="h-24 w-24 shrink-0"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-navy-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-navy-100"
            />
            {uploading && <p className="mt-1 text-xs text-ink-faint">Uploading…</p>}
            {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
          </div>
        </div>
        <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Name</span>
          <input name="name" className={inputClass} defaultValue={product?.name} required />
        </label>
        <label>
          <span className={labelClass}>Category</span>
          <select
            name="category"
            className={inputClass}
            defaultValue={product?.category ?? "lamps"}
          >
            <option value="lamps">Lamps</option>
            <option value="desks">Desks</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Tagline</span>
        <input name="tagline" className={inputClass} defaultValue={product?.tagline} required />
      </label>

      <label className="block">
        <span className={labelClass}>Description</span>
        <textarea
          name="description"
          className={`${inputClass} h-28 py-3`}
          defaultValue={product?.description}
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          <span className={labelClass}>Price (₹)</span>
          <input
            name="priceRupees"
            type="number"
            step="1"
            min="0"
            className={inputClass}
            defaultValue={product ? product.pricePaise / 100 : undefined}
            required
          />
        </label>
        <label>
          <span className={labelClass}>HSN code</span>
          <input
            name="hsnCode"
            className={inputClass}
            defaultValue={product?.hsnCode ?? "9405"}
            required
          />
        </label>
        <label>
          <span className={labelClass}>GST rate (%)</span>
          <input
            name="gstRate"
            type="number"
            className={inputClass}
            defaultValue={product?.gstRate ?? 18}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          <span className={labelClass}>Material</span>
          <input name="material" className={inputClass} defaultValue={product?.material} required />
        </label>
        <label>
          <span className={labelClass}>Dimensions</span>
          <input
            name="dimensions"
            className={inputClass}
            defaultValue={product?.dimensions}
            required
          />
        </label>
        <label>
          <span className={labelClass}>Stock quantity</span>
          <input
            name="stockQty"
            type="number"
            min="0"
            className={inputClass}
            defaultValue={product?.inStock ? 10 : 0}
            required
          />
        </label>
      </div>

      {state.message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            state.ok ? "bg-navy-50 text-ink" : "bg-red-600/10 text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending || uploading}>
        {pending ? "Saving…" : "Save Product"}
      </Button>
    </form>
  );
}
