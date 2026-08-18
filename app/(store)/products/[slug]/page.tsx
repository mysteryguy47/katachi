import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WaitlistForm } from "@/components/waitlist-form";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { formatDimensions, formatINR, formatWeight } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isUpcoming = product.category === "desks" && product.pricePaise === 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
      <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="min-w-0">
          <ProductGallery images={product.images} />
        </div>

        <div className="min-w-0 lg:pt-4">
          <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
            {product.category === "lamps" ? "LAMPS" : "DESKS"}
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-[15px] text-ink-soft">{product.tagline}</p>

          {!isUpcoming && (
            <p className="mt-6 flex items-baseline gap-3 text-2xl font-medium text-ink">
              {formatINR(product.pricePaise)}
              {product.compareAtPaise && (
                <span className="text-base font-normal text-ink-faint line-through">
                  {formatINR(product.compareAtPaise)}
                </span>
              )}
            </p>
          )}

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-8">
            {isUpcoming ? (
              <WaitlistForm productName={product.name} />
            ) : (
              <AddToCartButton product={product} />
            )}
          </div>

          {!isUpcoming && (
            <>
              <dl className="mt-10 grid grid-cols-2 gap-y-4 border-t border-line pt-8 text-sm">
                <dt className="text-ink-faint">Material</dt>
                <dd className="text-ink">{product.material}</dd>
                <dt className="text-ink-faint">Dimensions</dt>
                <dd className="text-ink">{formatDimensions(product.dimensions)}</dd>
                <dt className="text-ink-faint">Weight</dt>
                <dd className="text-ink">{formatWeight(product.weight)}</dd>
                <dt className="text-ink-faint">HSN code</dt>
                <dd className="text-ink">{product.hsnCode}</dd>
                <dt className="text-ink-faint">GST</dt>
                <dd className="text-ink">{product.gstRate}% (included in price)</dd>
              </dl>

              {product.packagingIncludes.length > 0 && (
                <div className="mt-8 border-t border-line pt-8 text-sm">
                  <p className="font-medium text-ink">Packaging Includes:</p>
                  <ul className="mt-3 space-y-1.5 text-ink-soft">
                    {product.packagingIncludes.map((row, i) => (
                      <li key={i}>
                        {row.qty} x {row.item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const all = await getProducts();
  return all.map((p) => ({ slug: p.slug }));
}
