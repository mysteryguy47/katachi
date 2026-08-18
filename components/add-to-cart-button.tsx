"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <Button size="lg" disabled className="w-full">
        Sold Out
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-full border border-line">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-ink-soft hover:text-ink"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-sm font-medium">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(9, q + 1))}
          className="flex h-11 w-11 items-center justify-center text-ink-soft hover:text-ink"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        size="lg"
        className="flex-1"
        onClick={() => {
          addItem(product, qty);
          setAdded(true);
          setQty(1);
          setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Added ✓" : "Add to Cart"}
      </Button>
    </div>
  );
}
