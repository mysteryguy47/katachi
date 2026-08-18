"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ZOOM_LEVEL = 2.5;

/**
 * Desktop-only (hidden on touch/small screens via the `hidden sm:block`
 * overlay below): on hover, a second full-size layer of the same image is
 * shown with its background-position panned to match the cursor, creating
 * an in-place magnifier. Uses the original file directly, not the
 * next/image-optimized version, so the zoomed detail stays sharp.
 */
export function ProductZoom({
  url,
  alt,
  className,
}: {
  url: string;
  alt: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] bg-paper-soft sm:cursor-zoom-in",
        className,
      )}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMouseMove}
    >
      <Image src={url} alt={alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 hidden bg-no-repeat opacity-0 transition-opacity duration-100 sm:block",
          active && "opacity-100",
        )}
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: `${ZOOM_LEVEL * 100}%`,
          backgroundPosition: `${position.x}% ${position.y}%`,
        }}
      />
    </div>
  );
}
