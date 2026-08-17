import { cn } from "@/lib/utils";

export function Logo({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  const color = tone === "ink" ? "text-ink" : "text-paper";

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 select-none",
        color,
        className,
      )}
    >
      <span
        aria-hidden
        className="font-display text-[1.35em] leading-none"
      >
        形
      </span>
      <span className="font-display text-[1em] tracking-[0.22em] leading-none">
        KATACHI
      </span>
    </span>
  );
}
