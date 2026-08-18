"use client";

import { useState } from "react";
import Image from "next/image";
import { Video } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { ProductZoom } from "@/components/product-zoom";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      {current.url && current.type !== "video" ? (
        <ProductZoom
          url={current.url}
          alt={current.alt || current.label}
          className="aspect-square w-full"
        />
      ) : (
        <ProductVisual {...current} className="aspect-square w-full" />
      )}

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.url ?? i}
              type="button"
              aria-label={`View ${img.alt || img.label} ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-paper-soft ring-2 transition",
                i === active ? "ring-navy-700" : "ring-transparent hover:ring-line",
              )}
            >
              {img.url && img.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-navy-900">
                  <Video className="h-4 w-4 text-white/70" strokeWidth={1.5} />
                </div>
              ) : img.url ? (
                <Image src={img.url} alt={img.alt || img.label} fill className="object-cover" />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(155deg, ${img.tone[0]} 0%, ${img.tone[1]} 100%)`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
