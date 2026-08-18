"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";
import { loadRazorpayScript } from "@/lib/razorpay/client";

const razorpayConfigured = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.email("Enter a valid email"),
  addressLine1: z.string().min(4, "Enter your address"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotalPaise, clear } = useCart();
  const { user, configured: authConfigured, loading: authLoading } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) });

  const gst = Math.round(subtotalPaise * 0.18);
  const total = subtotalPaise; // prices are GST-inclusive; gst shown as breakup only
  const signInRequired = authConfigured && !authLoading && !user;

  async function placeOrder(data: CheckoutForm) {
    if (!razorpayConfigured) return;
    setPlacing(true);
    setPlaceError(null);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          lines: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
        }),
      });
      const payload = await res.json();

      if (!res.ok) {
        setPlaceError(
          res.status === 401
            ? "Please sign in above to place your order."
            : payload.error || "Something went wrong. Please try again.",
        );
        setPlacing(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setPlaceError("Couldn't load the payment gateway. Check your connection.");
        setPlacing(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: payload.keyId,
        amount: payload.amount,
        currency: "INR",
        name: "Katachi",
        description: "Order " + payload.orderNumber,
        order_id: payload.razorpayOrderId,
        prefill: { name: data.fullName, email: data.email, contact: data.phone },
        theme: { color: "#0e2148" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyPayload = await verifyRes.json();
          if (!verifyRes.ok) {
            setPlaceError("Payment could not be verified. Contact us with your payment ID.");
            setPlacing(false);
            return;
          }
          clear();
          router.push(`/order/${verifyPayload.orderNumber}`);
        },
        modal: { ondismiss: () => setPlacing(false) },
      });
      razorpay.open();
    } catch {
      setPlaceError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-ink">Nothing to check out</h1>
        <p className="mt-3 text-ink-soft">
          Your cart is empty.{" "}
          <Link href="/products?category=lamps" className="underline">
            Continue shopping
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Checkout</h1>

      {authConfigured && (
        <div className="mt-10">
          {user ? (
            <p className="rounded-full bg-navy-50 px-5 py-3 text-sm text-ink">
              Signed in as {user.displayName || user.phoneNumber || user.email}
            </p>
          ) : (
            <SignInPanel title="Sign in to place your order" />
          )}
        </div>
      )}

      <form
        className="mt-10 grid min-w-0 gap-12 lg:grid-cols-[1fr_320px]"
        onSubmit={handleSubmit(placeOrder)}
      >
        <div className="min-w-0 space-y-10">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold tracking-wide text-ink">
              Contact
            </legend>
            <Field label="Full name" error={errors.fullName?.message}>
              <input {...register("fullName")} className={inputClass} />
            </Field>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field label="Mobile number" error={errors.phone?.message}>
                <input {...register("phone")} className={inputClass} placeholder="98765 43210" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email")} className={inputClass} />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold tracking-wide text-ink">
              Shipping Address
            </legend>
            <Field label="Address line 1" error={errors.addressLine1?.message}>
              <input {...register("addressLine1")} className={inputClass} />
            </Field>
            <Field label="Address line 2 (optional)">
              <input {...register("addressLine2")} className={inputClass} />
            </Field>
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              <Field label="City" error={errors.city?.message}>
                <input {...register("city")} className={inputClass} />
              </Field>
              <Field label="State" error={errors.state?.message}>
                <input {...register("state")} className={inputClass} />
              </Field>
              <Field label="PIN code" error={errors.pincode?.message}>
                <input {...register("pincode")} className={inputClass} />
              </Field>
            </div>
          </fieldset>

          {!razorpayConfigured && (
            <p className="rounded-[var(--radius-card)] bg-navy-50 px-5 py-4 text-sm text-ink-soft">
              Payment (Razorpay) isn't connected yet — see project setup notes.
            </p>
          )}
        </div>

        <div className="h-fit min-w-0 space-y-4 rounded-[var(--radius-card)] bg-paper-soft p-6">
          <h2 className="text-sm font-semibold tracking-wide text-ink">
            Order Summary
          </h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            {lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {line.name} × {line.qty}
                </span>
                <span className="shrink-0 text-ink">
                  {formatINR(line.pricePaise * line.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal (GST incl.)</span>
              <span className="text-ink">{formatINR(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between text-ink-faint">
              <span>Includes GST</span>
              <span>{formatINR(gst)}</span>
            </div>
            <div className="flex justify-between text-base font-medium text-ink">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
          {placeError && <p className="text-sm text-red-600">{placeError}</p>}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!razorpayConfigured || placing || signInRequired}
          >
            {!razorpayConfigured
              ? "Payment Coming Soon"
              : placing
                ? "Processing…"
                : `Pay ${formatINR(total)}`}
          </Button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
