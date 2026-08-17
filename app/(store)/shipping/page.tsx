import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping & Returns" };

const SECTIONS = [
  {
    title: "Made to order",
    body: "Every piece is printed after you order — lead times are listed on each product page, typically 4–10 days before dispatch.",
  },
  {
    title: "Shipping",
    body: "We ship pan-India via tracked courier. Shipping cost is calculated at checkout based on weight and destination.",
  },
  {
    title: "Returns",
    body: "Because each piece is made to order, we accept returns only for manufacturing defects or transit damage — reach out within 48 hours of delivery with photos.",
  },
];

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 sm:px-8">
      <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
        POLICIES
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">Shipping & Returns</h1>
      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="text-[15px] font-semibold text-ink">{s.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
