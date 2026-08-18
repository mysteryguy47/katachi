"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Plus, Star, Trash2, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700";

const labelClass = "mb-1.5 block text-xs font-medium text-ink-soft";

const MAX_ITEMS = 10;
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/quicktime",
];

type MediaItem = { url: string; type: "image" | "video"; alt?: string };

export function ProductForm({ product }: { product?: Product }) {
  const action = product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction, pending] = useActionState(action, {
    ok: false,
    message: "",
  });

  const [media, setMedia] = useState<MediaItem[]>(
    product?.images
      .filter((img): img is typeof img & { url: string } => Boolean(img.url))
      .map((img) => ({ url: img.url, type: img.type ?? "image", alt: img.alt })) ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);

  const [packaging, setPackaging] = useState<{ item: string; qty: number }[]>(
    product?.packagingIncludes && product.packagingIncludes.length > 0
      ? product.packagingIncludes
      : [{ item: "", qty: 1 }],
  );

  function updatePackagingItem(i: number, item: string) {
    setPackaging((prev) => prev.map((row, idx) => (idx === i ? { ...row, item } : row)));
  }
  function updatePackagingQty(i: number, qty: number) {
    setPackaging((prev) => prev.map((row, idx) => (idx === i ? { ...row, qty } : row)));
  }
  function addPackagingRow() {
    setPackaging((prev) => [...prev, { item: "", qty: 1 }]);
  }
  function removePackagingRow(i: number) {
    setPackaging((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    if (media.length + files.length > MAX_ITEMS) {
      setUploadError(`Up to ${MAX_ITEMS} photos/videos per product.`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      const isHeic = file.type === "image/heic" || file.type === "image/heif";
      const maxBytes = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(`${file.name}: unsupported file type.`);
        continue;
      }
      if (file.size > maxBytes) {
        setUploadError(
          `${file.name} is too large (max ${isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB}MB).`,
        );
        continue;
      }

      try {
        // No browser can display HEIC/HEIF inline — convert to JPEG here so
        // it renders everywhere (this library only runs in the browser).
        let uploadBody: Blob = file;
        let uploadName = file.name;
        let contentType = file.type;

        if (isHeic) {
          const { convertHeicToJpeg } = await import("@/lib/heic");
          try {
            uploadBody = await convertHeicToJpeg(file);
          } catch {
            setUploadError(
              `${file.name}: couldn't convert this HEIC file. Try exporting it as JPEG from Photos and re-uploading.`,
            );
            continue;
          }
          uploadName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
          contentType = "image/jpeg";

          if (uploadBody.size > maxBytes) {
            setUploadError(`${file.name} is too large after conversion (max ${MAX_IMAGE_MB}MB).`);
            continue;
          }
        }

        const { upload } = await import("@vercel/blob/client");
        const path = `products/${Date.now()}-${crypto.randomUUID()}-${uploadName}`;
        const blob = await upload(path, uploadBody, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          contentType,
          clientPayload: isVideo ? "video" : "image",
          multipart: isVideo,
        });
        setMedia((prev) => [
          ...prev,
          { url: blob.url, type: isVideo ? "video" : "image", alt: file.name },
        ]);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setUploading(false);
  }

  function setCover(index: number) {
    setMedia((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  }

  function removeMedia(index: number) {
    setMedia((prev) => {
      const removed = prev[index];
      if (removed) setRemovedUrls((urls) => [...urls, removed.url]);
      return prev.filter((_, i) => i !== index);
    });
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <span className={labelClass}>
          Photos & Videos ({media.length}/{MAX_ITEMS})
        </span>
        <p className="mb-3 text-xs text-ink-faint">
          PNG, JPEG, or HEIC up to {MAX_IMAGE_MB}MB · MP4 or MOV up to {MAX_VIDEO_MB}MB.
          The starred item is the cover image.
        </p>

        {media.length > 0 && (
          <div className="mb-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {media.map((item, i) => (
              <div
                key={item.url}
                className="group relative aspect-square overflow-hidden rounded-xl bg-paper-soft"
              >
                {item.type === "video" ? (
                  <div className="flex h-full w-full items-center justify-center bg-navy-900">
                    <Video className="h-6 w-6 text-white/70" strokeWidth={1.5} />
                  </div>
                ) : (
                  <Image src={item.url} alt={item.alt ?? ""} fill className="object-cover" />
                )}
                <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1.5 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label="Set as cover"
                    onClick={() => setCover(i)}
                    className="rounded-full bg-white/90 p-1 text-ink hover:bg-white"
                  >
                    <Star className={i === 0 ? "h-3.5 w-3.5 fill-current" : "h-3.5 w-3.5"} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => removeMedia(i)}
                    className="rounded-full bg-white/90 p-1 text-ink hover:bg-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-ink">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {media.length < MAX_ITEMS && (
          <input
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFilesChange}
            disabled={uploading}
            className="text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-navy-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-navy-100"
          />
        )}
        {uploading && <p className="mt-1 text-xs text-ink-faint">Uploading…</p>}
        {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
        <input type="hidden" name="media" value={JSON.stringify(media)} />
        <input type="hidden" name="removedMedia" value={JSON.stringify(removedUrls)} />
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

      <div className="grid gap-4 sm:grid-cols-4">
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
          <span className={labelClass}>Compare-at (₹, optional)</span>
          <input
            name="compareAtPriceRupees"
            type="number"
            step="1"
            min="0"
            placeholder="Shown struck through"
            className={inputClass}
            defaultValue={product?.compareAtPaise ? product.compareAtPaise / 100 : undefined}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Material</span>
          <input name="material" className={inputClass} defaultValue={product?.material} required />
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

      <div>
        <span className={labelClass}>Dimensions</span>
        <div className="grid grid-cols-4 gap-3">
          <label>
            <span className="mb-1 block text-[11px] text-ink-faint">Length</span>
            <input
              name="dimensionsLength"
              type="number"
              step="0.1"
              min="0"
              className={inputClass}
              defaultValue={product?.dimensions?.length}
              required
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] text-ink-faint">Breadth</span>
            <input
              name="dimensionsBreadth"
              type="number"
              step="0.1"
              min="0"
              className={inputClass}
              defaultValue={product?.dimensions?.breadth}
              required
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] text-ink-faint">Height</span>
            <input
              name="dimensionsHeight"
              type="number"
              step="0.1"
              min="0"
              className={inputClass}
              defaultValue={product?.dimensions?.height}
              required
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] text-ink-faint">Unit</span>
            <select
              name="dimensionsUnit"
              className={inputClass}
              defaultValue={product?.dimensions?.unit ?? "cm"}
            >
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <span className={labelClass}>Weight</span>
        <div className="grid grid-cols-2 gap-3 sm:w-1/2 sm:pr-2">
          <label>
            <span className="mb-1 block text-[11px] text-ink-faint">Value</span>
            <input
              name="weightValue"
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              defaultValue={product?.weight?.value}
              required
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] text-ink-faint">Unit</span>
            <select
              name="weightUnit"
              className={inputClass}
              defaultValue={product?.weight?.unit ?? "g"}
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <span className={labelClass}>Packaging Includes</span>
        <div className="space-y-2">
          {packaging.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={row.qty}
                onChange={(e) => updatePackagingQty(i, Math.max(1, Number(e.target.value)))}
                className={`${inputClass} w-20 shrink-0`}
                aria-label="Quantity"
              />
              <span className="text-ink-faint">×</span>
              <input
                type="text"
                value={row.item}
                onChange={(e) => updatePackagingItem(i, e.target.value)}
                placeholder="e.g. Lamp Body"
                className={inputClass}
                aria-label="Item"
              />
              <button
                type="button"
                onClick={() => removePackagingRow(i)}
                disabled={packaging.length === 1}
                className="shrink-0 text-ink-faint hover:text-red-600 disabled:opacity-30"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPackagingRow}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
        <input
          type="hidden"
          name="packagingIncludes"
          value={JSON.stringify(packaging.filter((r) => r.item.trim().length > 0))}
        />
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
