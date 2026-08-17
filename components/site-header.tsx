"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/products?category=lamps", label: "Lamps" },
  { href: "/products?category=desks", label: "Desks" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" aria-label="Katachi home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-navy-50"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-navy-50 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t border-line/80 transition-[grid-template-rows] duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line-soft py-3 text-sm font-medium text-ink-soft last:border-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
