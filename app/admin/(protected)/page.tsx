import { AlertTriangle } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { getOrders } from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";

export default async function AdminDashboard() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  const activeCount = products.filter((p) => p.category === "lamps").length;
  const outOfStock = products.filter((p) => !p.inStock).length;

  const dbConnected = Boolean(process.env.DATABASE_URL);
  const authConfigured = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentPaidOrders = orders.filter(
    (o) => o.status === "paid" && new Date(o.createdAt).getTime() >= thirtyDaysAgo,
  );
  const revenue30d = recentPaidOrders.reduce((sum, o) => sum + o.totalPaise, 0);

  const stats = [
    { label: "Live products", value: activeCount },
    { label: "Out of stock", value: outOfStock },
    { label: "Orders (30d)", value: dbConnected ? recentPaidOrders.length : "—" },
    { label: "Revenue (30d)", value: dbConnected ? formatINR(revenue30d) : "—" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink sm:text-3xl">Dashboard</h1>

      {!authConfigured && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-600/20 bg-red-600/5 px-4 py-3 text-sm text-ink-soft">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p>
            This admin area has no sign-in gate yet — anyone with the URL can
            reach it. Add Firebase credentials to require sign-in before
            deploying publicly. See project setup notes.
          </p>
        </div>
      )}
      {authConfigured && !dbConnected && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-600/20 bg-red-600/5 px-4 py-3 text-sm text-ink-soft">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p>Showing seed data, not a live database — connect DATABASE_URL to manage real inventory and orders.</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-card)] border border-line bg-paper p-6"
          >
            <p className="text-xs font-medium tracking-wide text-ink-faint">
              {s.label.toUpperCase()}
            </p>
            <p className="mt-2 font-display text-3xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
