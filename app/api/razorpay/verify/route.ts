import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_KEY_SECRET || !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 },
    );
  }

  const parsed = verifySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const { db } = await import("@/lib/db");
  const { orders, orderItems } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const [order] = await db
    .update(orders)
    .set({
      status: "paid",
      paymentReferenceId: razorpay_payment_id,
      updatedAt: new Date(),
    })
    .where(eq(orders.paymentReferenceId, razorpay_order_id))
    .returning();

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const { sendOrderConfirmationEmail } = await import(
    "@/lib/email/order-confirmation"
  );
  await sendOrderConfirmationEmail(order, items);

  return NextResponse.json({ orderNumber: order.orderNumber });
}
