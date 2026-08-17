"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
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

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
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

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save Product"}
      </Button>
    </form>
  );
}
