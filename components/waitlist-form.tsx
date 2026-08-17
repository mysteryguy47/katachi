"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// TODO(backend): wire to an API route that stores the email once a database
// is provisioned. Currently client-only — submissions are not persisted.
export function WaitlistForm({ productName }: { productName: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-full bg-navy-50 px-5 py-3 text-sm text-ink">
        You're on the list — we'll email you when {productName} is ready.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="h-12 flex-1 rounded-full border border-line bg-paper px-5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
      />
      <Button type="submit" size="lg">
        Notify Me
      </Button>
    </form>
  );
}
