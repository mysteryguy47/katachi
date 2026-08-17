import "server-only";
import { resend, isEmailConfigured } from "@/lib/email/resend";
import { formatINR } from "@/lib/utils";
import type { orders, orderItems } from "@/lib/db/schema";

type Order = typeof orders.$inferSelect;
type OrderItem = typeof orderItems.$inferSelect;

export async function sendOrderConfirmationEmail(order: Order, items: OrderItem[]) {
  if (!isEmailConfigured || !resend) return;

  const from = process.env.EMAIL_FROM || "Katachi <onboarding@resend.dev>";
  const itemRows = items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;color:#4b5261">${item.productName} × ${item.qty}</td><td style="padding:8px 0;text-align:right;color:#10131a">${formatINR(item.unitPricePaise * item.qty)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#10131a">
      <p style="letter-spacing:0.2em;font-size:11px;color:#8a90a0">KATACHI — 形</p>
      <h1 style="font-size:22px;margin:8px 0 4px">Order confirmed</h1>
      <p style="color:#8a90a0;font-size:13px;margin:0 0 24px">Order ${order.orderNumber}</p>
      <table style="width:100%;border-collapse:collapse">${itemRows}</table>
      <table style="width:100%;border-top:1px solid #e6e8ee;margin-top:8px">
        <tr><td style="padding-top:12px;font-weight:600">Total</td><td style="padding-top:12px;text-align:right;font-weight:600">${formatINR(order.totalPaise)}</td></tr>
      </table>
      <p style="margin-top:32px;font-size:13px;color:#4b5261">
        Shipping to<br/>
        ${order.contactName}<br/>
        ${order.shippingAddressLine1}${order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ""}<br/>
        ${order.shippingCity}, ${order.shippingState} ${order.shippingPincode}
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: order.contactEmail,
      subject: `Order confirmed — ${order.orderNumber}`,
      html,
    });
  } catch (err) {
    // Payment already succeeded — an email failure shouldn't fail the order.
    console.error("Order confirmation email failed:", err);
  }
}
