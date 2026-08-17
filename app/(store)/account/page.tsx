import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getSessionUser, isAuthConfigured } from "@/lib/auth/session";
import { getOrdersByUserId } from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = { title: "Your Account" };

export default async function AccountPage() {
  if (!isAuthConfigured) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Accounts</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Sign-in isn't configured yet — accounts and order history will
          appear here once it is.
        </p>
      </div>
    );
  }

  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <h1 className="mb-8 text-center font-display text-3xl text-ink">
          Your Account
        </h1>
        <SignInPanel title="Sign in to view your orders" redirectTo="/account" />
      </div>
    );
  }

  const orders = user.id ? await getOrdersByUserId(user.id) : [];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Your Account</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Signed in as {user.email || user.phone}
          </p>
        </div>
        <SignOutButton redirectTo="/" />
      </div>

      {user.isAdmin && (
        <Link
          href="/admin"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-navy-900"
        >
          <ShieldCheck className="h-4 w-4" />
          Go to Admin Console
        </Link>
      )}

      <h2 className="mt-12 text-sm font-semibold tracking-wide text-ink">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-[var(--radius-card)] border border-dashed border-line px-6 py-16 text-center">
          <p className="text-ink-soft">No orders yet.</p>
          <Link
            href="/products?category=lamps"
            className="mt-3 inline-block text-sm underline"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line-soft border-y border-line-soft">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/order/${order.orderNumber}`}
                className="flex items-center justify-between py-4 text-sm hover:bg-navy-50"
              >
                <div>
                  <p className="font-medium text-ink">{order.orderNumber}</p>
                  <p className="mt-0.5 text-ink-faint">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · <span className="capitalize">{order.status.replace("_", " ")}</span>
                  </p>
                </div>
                <span className="text-ink">{formatINR(order.totalPaise)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
