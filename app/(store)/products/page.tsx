import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { FilterSortBar } from "@/components/filter-sort-bar";
import { getProducts } from "@/lib/data/products";
import type { ProductCategoryFilter, SortKey } from "@/lib/data/products";

export const metadata: Metadata = { title: "Shop" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const category = (params.category ?? "all") as ProductCategoryFilter;
  const sort = (params.sort ?? "featured") as SortKey;
  const productList = await getProducts({ category, sort });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
      <div className="mb-10">
        <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
          SHOP
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink">
          {category === "desks" ? "Desks" : category === "lamps" ? "Lamps" : "All Products"}
        </h1>
      </div>

      <Suspense>
        <FilterSortBar />
      </Suspense>

      {productList.length === 0 ? (
        <p className="py-24 text-center text-ink-faint">
          No products match this filter yet.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
