import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/lib/data/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink sm:text-3xl">
        Edit {product.name}
      </h1>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
