import { getOrders } from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-navy-50 text-navy-800",
  pending_payment: "bg-amber-100 text-amber-800",
  processing: "bg-navy-50 text-navy-800",
  shipped: "bg-navy-50 text-navy-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-600/10 text-red-600",
  refunded: "bg-red-600/10 text-red-600",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink sm:text-3xl">Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-line bg-paper px-6 py-16 text-center">
          <p className="text-ink-soft">
            No orders yet — this will populate once checkout and payments are
            connected.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-paper">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-ink-faint">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Placed</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-line-soft last:border-none">
                  <td className="px-5 py-3.5 font-medium text-ink">{order.orderNumber}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{order.contactName}</td>
                  <td className="px-5 py-3.5 text-ink-soft">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">
                    {formatINR(order.totalPaise)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                        STATUS_STYLES[order.status] ?? "bg-navy-50 text-navy-800"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
