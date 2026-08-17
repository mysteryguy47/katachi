import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 sm:px-8">
      <p className="text-xs font-medium tracking-[0.2em] text-ink-faint">
        CONTACT
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">Get in touch</h1>
      <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
        Questions about an order, a custom piece, or a wholesale inquiry —
        reach us and we'll get back within a couple of days.
      </p>
      <p className="mt-8 text-[15px] text-ink">
        hello@katachi.blackmonkey.in
      </p>
    </div>
  );
}
