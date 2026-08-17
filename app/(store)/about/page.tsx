import type { Metadata } from "next";
import { ProductVisual } from "@/components/product-visual";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8">
      <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
        ABOUT
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
        形 — shape, form.
      </h1>
      <p className="mt-8 text-[17px] leading-relaxed text-ink-soft">
        Katachi began as two friends and a single 3D printer, learning what
        it takes to turn a digital model into something worth putting on a
        table. Our first piece shipped as order #000001, hand-packed and
        hand-noted. Every piece since has been made the same way.
      </p>
      <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
        We design lighting first — lamps, pendants, and sconces printed as
        single, continuous forms wherever the geometry allows, so there are
        fewer seams and fewer parts to fail. Each order is checked by hand
        before it leaves us. We're currently extending the studio into
        furniture, starting with a desk.
      </p>
      <ProductVisual
        tone={["#0e2148", "#c9364e"]}
        label="Katachi"
        className="mt-12 aspect-[16/9] w-full"
      />
    </div>
  );
}
