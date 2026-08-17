import type { Metadata } from "next";

export const metadata: Metadata = { title: "Product Care" };

const TIPS = [
  "Dust with a dry, soft cloth — avoid solvents or abrasive cleaners on printed surfaces.",
  "Keep away from direct, prolonged sunlight to prevent long-term fading.",
  "Use the bulb wattage listed on the product page — overdriving the fitting can warp the shade.",
  "Indoor use only unless the listing specifically states otherwise.",
];

export default function CarePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 sm:px-8">
      <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
        GUIDE
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">Product Care</h1>
      <ul className="mt-10 space-y-4">
        {TIPS.map((tip) => (
          <li key={tip} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
