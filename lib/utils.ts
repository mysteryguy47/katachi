import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProductDimensions, ProductWeight } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function formatDimensions(d: ProductDimensions) {
  return `${d.length} × ${d.breadth} × ${d.height} ${d.unit}`;
}

export function formatWeight(w: ProductWeight) {
  return `${w.value}${w.unit}`;
}
