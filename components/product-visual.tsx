import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders a real product photo when `url` is provided. Otherwise falls back
 * to a soft two-tone gradient with a warm glow, so the catalog reads as
 * intentional rather than broken while photography is pending.
 */
export function ProductVisual({
  url,
  alt,
  type = "image",
  tone,
  label,
  className,
}: {
  url?: string;
  alt?: string;
  type?: "image" | "video";
  tone: [string, string];
  label: string;
  className?: string;
}) {
  if (url && type === "video") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-card)] bg-paper-soft",
          className,
        )}
      >
        <video
          src={url}
          controls
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (url) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-card)] bg-paper-soft",
          className,
        )}
      >
        <Image
          src={url}
          alt={alt || label}
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[var(--radius-card)]",
        className,
      )}
      style={{
        background: `linear-gradient(155deg, ${tone[0]} 0%, ${tone[1]} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute h-2/3 w-2/3 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #fff8e8, transparent 70%)" }}
      />
      <span className="relative font-display text-sm tracking-[0.3em] text-white/80">
        {label.toUpperCase()}
      </span>
    </div>
  );
}
