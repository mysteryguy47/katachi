import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Products</h1>
        <ButtonLink href="/admin/products/new" size="sm">
          <Plus className="h-4 w-4" />
          New Product
        </ButtonLink>
      </div>

      <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-ink-faint">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">HSN</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line-soft last:border-none">
                <td className="px-5 py-3.5 font-medium text-ink">{p.name}</td>
                <td className="px-5 py-3.5 text-ink-soft capitalize">{p.category}</td>
                <td className="px-5 py-3.5 text-ink-soft">
                  {p.pricePaise > 0 ? formatINR(p.pricePaise) : "—"}
                </td>
                <td className="px-5 py-3.5 text-ink-soft">{p.hsnCode}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={
                      p.inStock
                        ? "rounded-full bg-navy-50 px-2.5 py-1 text-xs text-navy-800"
                        : "rounded-full bg-red-600/10 px-2.5 py-1 text-xs text-red-600"
                    }
                  >
                    {p.inStock ? "In stock" : "Out of stock"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm font-medium text-ink-soft hover:text-ink"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
