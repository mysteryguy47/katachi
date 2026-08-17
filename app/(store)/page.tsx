import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { getProducts } from "@/lib/data/products";

export default async function Home() {
  const [lamps, desks] = await Promise.all([
    getProducts({ category: "lamps" }),
    getProducts({ category: "desks" }),
  ]);
  const featured = lamps.slice(0, 4);
  const desk = desks[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(42,99,172,0.45), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-28 text-center sm:pb-32 sm:pt-40">
          <p className="text-xs font-medium tracking-[0.3em] text-navy-100/70">
            KATACHI — 形
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] text-paper sm:text-6xl">
            Light, given form.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-navy-100/80 sm:text-lg">
            Precision 3D-printed lamps, pendants, and sconces — designed in-house
            and finished by hand, one order at a time.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/products?category=lamps" size="lg" className="bg-paper text-ink hover:bg-navy-100">
              Shop Lamps
            </ButtonLink>
            <ButtonLink
              href="/about"
              size="lg"
              variant="ghost"
              className="text-paper hover:bg-white/10"
            >
              Our Story
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
              THE LAMP COLLECTION
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Made to be lived with.
            </h2>
          </div>
          <ButtonLink href="/products?category=lamps" variant="link" className="hidden sm:inline-flex">
            View all
          </ButtonLink>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10 sm:hidden">
          <ButtonLink href="/products?category=lamps" variant="outline" className="w-full">
            View all lamps
          </ButtonLink>
        </div>
      </section>

      {/* Craft strip */}
      <section className="border-y border-line bg-paper-soft">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
              THE CRAFT
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Every piece is printed,
              <br />
              not assembled.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              We design each form to be printed as a single, continuous piece
              wherever possible — fewer seams, fewer parts to fail, a cleaner
              silhouette. What ships is checked by hand before it's packed.
            </p>
          </div>
          <ProductVisual
            tone={["#143a6b", "#0a1730"]}
            label="Katachi"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* Desk teaser */}
      {desk && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="grid gap-10 rounded-[var(--radius-card)] bg-ink px-8 py-14 text-center sm:px-16">
            <div className="mx-auto max-w-lg">
              <p className="text-xs font-medium tracking-[0.2em] text-navy-100/60">
                NEXT UP
              </p>
              <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
                An aesthetic desk, in the works.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-navy-100/70">
                We're extending Katachi beyond lighting. Leave your email and
                we'll let you know the moment it's ready to order.
              </p>
              <ButtonLink
                href="/products/utsuwa-desk"
                size="lg"
                className="mt-8 bg-paper text-ink hover:bg-navy-100"
              >
                Learn more
              </ButtonLink>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
