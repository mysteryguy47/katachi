"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { lines, subtotalPaise, setQty, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-3 text-ink-soft">
          Explore the collection and find something to bring light to a room.
        </p>
        <ButtonLink href="/products?category=lamps" size="lg" className="mt-8">
          Shop Lamps
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Your Cart</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line-soft border-y border-line-soft">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-5 py-6">
              <Link href={`/products/${line.slug}`} className="shrink-0">
                <ProductVisual
                  {...line.image}
                  className="h-24 w-24"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${line.slug}`}
                      className="text-[15px] font-medium text-ink hover:underline"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-ink-faint">
                      {formatINR(line.pricePaise)}
                    </p>
                  </div>
                  <button
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeItem(line.productId)}
                    className="text-ink-faint hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center rounded-full border border-line w-fit">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQty(line.productId, line.qty - 1)}
                    className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-ink"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {line.qty}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQty(line.productId, line.qty + 1)}
                    className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-ink"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-[var(--radius-card)] bg-paper-soft p-6">
          <h2 className="text-sm font-semibold tracking-wide text-ink">
            Order Summary
          </h2>
          <div className="mt-4 flex justify-between text-sm text-ink-soft">
            <span>Subtotal</span>
            <span className="text-ink">{formatINR(subtotalPaise)}</span>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Shipping and taxes calculated at checkout.
          </p>
          <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
            Checkout
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
