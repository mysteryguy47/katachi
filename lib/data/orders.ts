export async function getOrders() {
  if (!process.env.DATABASE_URL) return [];

  const { db } = await import("@/lib/db");
  const { orders } = await import("@/lib/db/schema");
  const { desc } = await import("drizzle-orm");

  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrdersByUserId(userId: string) {
  if (!process.env.DATABASE_URL) return [];

  const { db } = await import("@/lib/db");
  const { orders } = await import("@/lib/db/schema");
  const { eq, desc } = await import("drizzle-orm");

  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderByNumber(orderNumber: string) {
  if (!process.env.DATABASE_URL) return undefined;

  const { db } = await import("@/lib/db");
  const { orders, orderItems } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  if (!order) return undefined;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return { order, items };
}
