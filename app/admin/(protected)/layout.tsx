import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, ShieldAlert } from "lucide-react";
import { getSessionUser, isAuthConfigured } from "@/lib/auth/session";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = isAuthConfigured ? await getSessionUser() : null;

  if (isAuthConfigured && !user) {
    redirect("/admin/login");
  }

  const accessDenied = isAuthConfigured && user && !user.isAdmin;

  return (
    <div className="min-h-screen bg-paper-soft">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-paper px-6 py-8 md:flex">
          <Link href="/">
            <Logo />
          </Link>
          <p className="mt-1 text-[11px] font-medium tracking-[0.2em] text-ink-faint">
            ADMIN
          </p>
          {!accessDenied && (
            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-navy-50 hover:text-ink"
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          <div className="mt-auto space-y-3">
            {user && (
              <p className="truncate text-xs text-ink-faint">
                {user.email || user.phone}
              </p>
            )}
            {isAuthConfigured ? (
              <SignOutButton />
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-ink-faint hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to store
              </Link>
            )}
          </div>
        </aside>
        <main className="flex-1 px-6 py-8 sm:px-10">
          {accessDenied ? (
            <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-line bg-paper px-6 py-16 text-center">
              <ShieldAlert className="h-8 w-8 text-red-600" strokeWidth={1.5} />
              <h1 className="mt-4 font-display text-2xl text-ink">Access denied</h1>
              <p className="mt-2 max-w-sm text-sm text-ink-soft">
                Your account isn't marked as an admin yet. Ask an existing
                admin to set <code className="text-xs">is_admin = true</code>{" "}
                for your user row.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
