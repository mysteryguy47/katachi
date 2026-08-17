import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProductById } from "@/lib/data/products";
import { getSessionUser, isAuthConfigured } from "@/lib/auth/session";

export const checkoutInputSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.email(),
  addressLine1: z.string().min(4),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  lines: z
    .array(z.object({ productId: z.string(), qty: z.number().int().min(1).max(9) }))
    .min(1),
});

export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 },
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }

  const parsed = checkoutInputSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const input = parsed.data;

  const sessionUser = isAuthConfigured ? await getSessionUser() : null;
  if (isAuthConfigured && !sessionUser) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  // Recompute pricing server-side — never trust client-sent amounts.
  let subtotalPaise = 0;
  const resolvedItems: {
    productId: string;
    productName: string;
    unitPricePaise: number;
    qty: number;
    hsnCode: string;
    gstRate: number;
  }[] = [];

  for (const line of input.lines) {
    const product = await getProductById(line.productId);
    if (!product || !product.inStock) {
      return NextResponse.json(
        { error: `A product in your cart is no longer available.` },
        { status: 400 },
      );
    }
    subtotalPaise += product.pricePaise * line.qty;
    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      unitPricePaise: product.pricePaise,
      qty: line.qty,
      hsnCode: product.hsnCode,
      gstRate: product.gstRate,
    });
  }

  const shippingPaise = 0;
  const gstPaise = 0; // product prices are GST-inclusive; shown as a breakup only
  const totalPaise = subtotalPaise + shippingPaise;
  const orderNumber = `KTC${Date.now().toString(36).toUpperCase()}`;

  const { db } = await import("@/lib/db");
  const { orders, orderItems } = await import("@/lib/db/schema");

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: sessionUser?.id ?? null,
      status: "pending_payment",
      contactName: input.fullName,
      contactPhone: input.phone,
      contactEmail: input.email,
      shippingAddressLine1: input.addressLine1,
      shippingAddressLine2: input.addressLine2 || null,
      shippingCity: input.city,
      shippingState: input.state,
      shippingPincode: input.pincode,
      subtotalPaise,
      gstPaise,
      shippingPaise,
      totalPaise,
      paymentProvider: "razorpay",
    })
    .returning();

  await db.insert(orderItems).values(
    resolvedItems.map((item) => ({ ...item, orderId: order.id })),
  );

  const { default: Razorpay } = await import("razorpay");
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: totalPaise,
    currency: "INR",
    receipt: orderNumber,
  });

  const { eq } = await import("drizzle-orm");
  await db
    .update(orders)
    .set({ paymentReferenceId: razorpayOrder.id })
    .where(eq(orders.id, order.id));

  return NextResponse.json({
    orderNumber,
    razorpayOrderId: razorpayOrder.id,
    amount: totalPaise,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
