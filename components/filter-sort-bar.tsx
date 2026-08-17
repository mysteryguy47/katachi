"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lamps", label: "Lamps" },
  { value: "desks", label: "Desks" },
];

const SORTS: { value: string; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function FilterSortBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "featured";

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "featured") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => update("category", c.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === c.value
                ? "bg-ink text-paper"
                : "bg-navy-50 text-ink-soft hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        Sort
        <select
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
          className="rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
