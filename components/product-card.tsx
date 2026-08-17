import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const comingSoon = product.category === "desks" && !product.inStock;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5]">
        <ProductVisual
          {...product.images[0]}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        {product.isNew && !comingSoon && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium tracking-wide text-ink backdrop-blur">
            New
          </span>
        )}
        {comingSoon && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium tracking-wide text-ink backdrop-blur">
            Coming soon
          </span>
        )}
        {!product.inStock && !comingSoon && (
          <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-medium tracking-wide text-paper backdrop-blur">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-medium text-ink">{product.name}</h3>
          <p className="mt-1 text-sm text-ink-faint">{product.tagline}</p>
        </div>
        {!comingSoon && (
          <p className="whitespace-nowrap text-[15px] font-medium text-ink">
            {formatINR(product.pricePaise)}
          </p>
        )}
      </div>
    </Link>
  );
}
