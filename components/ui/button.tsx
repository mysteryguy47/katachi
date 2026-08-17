import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-navy-900",
        secondary: "bg-navy-50 text-ink hover:bg-navy-100",
        outline: "border border-line text-ink hover:border-ink",
        ghost: "text-ink hover:bg-navy-50",
        link: "text-ink underline underline-offset-4 hover:text-navy-700",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
