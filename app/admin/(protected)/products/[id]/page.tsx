import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
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
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">
          Edit {product.name}
        </h1>
        <DeleteProductButton
          id={product.id}
          name={product.name}
          redirectAfter="/admin/products"
        />
      </div>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
