import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumber } from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const result = await getOrderByNumber(orderNumber);
  if (!result) notFound();

  const { order, items } = result;

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 sm:px-8">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-10 w-10 text-navy-700" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
          {order.status === "paid" ? "Order confirmed" : "Order received"}
        </h1>
        <p className="mt-2 text-sm text-ink-faint">Order {order.orderNumber}</p>
      </div>

      <div className="mt-12 rounded-[var(--radius-card)] border border-line p-6">
        <ul className="divide-y divide-line-soft">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-ink-soft">
                {item.productName} × {item.qty}
              </span>
              <span className="text-ink">
                {formatINR(item.unitPricePaise * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-medium text-ink">
          <span>Total</span>
          <span>{formatINR(order.totalPaise)}</span>
        </div>
      </div>

      <div className="mt-8 rounded-[var(--radius-card)] bg-paper-soft p-6 text-sm">
        <h2 className="font-semibold text-ink">Shipping to</h2>
        <p className="mt-2 text-ink-soft">
          {order.contactName}
          <br />
          {order.shippingAddressLine1}
          {order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ""}
          <br />
          {order.shippingCity}, {order.shippingState} {order.shippingPincode}
          <br />
          {order.contactPhone}
        </p>
      </div>

      <div className="mt-10 text-center">
        <ButtonLink href="/products?category=lamps" size="lg">
          Continue Shopping
        </ButtonLink>
        <p className="mt-4 text-xs text-ink-faint">
          Questions about your order? <Link href="/contact" className="underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}
