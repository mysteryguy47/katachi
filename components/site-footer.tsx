import Link from "next/link";
import { Logo } from "@/components/logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/products?category=lamps", label: "Lamps" },
      { href: "/products?category=desks", label: "Desks" },
      { href: "/products", label: "All products" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Katachi" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/shipping", label: "Shipping & returns" },
      { href: "/care", label: "Product care" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line/80 bg-paper-soft">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Precision 3D-printed lighting, designed and finished by hand.
              Every piece is made to order.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold tracking-[0.15em] text-ink-faint">
                {col.title.toUpperCase()}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Katachi. All rights reserved.</p>
          <p>形 — form, shape.</p>
        </div>
      </div>
    </footer>
  );
}
