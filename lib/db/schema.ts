import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const productCategoryEnum = pgEnum("product_category", [
  "lamps",
  "desks",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: productCategoryEnum("category").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  pricePaise: integer("price_paise").notNull(),
  compareAtPaise: integer("compare_at_paise"),
  hsnCode: text("hsn_code").notNull(),
  gstRate: integer("gst_rate").notNull().default(18),
  material: text("material").notNull(),
  dimensions: text("dimensions").notNull(),
  leadTimeDays: integer("lead_time_days").notNull().default(5),
  stockQty: integer("stock_qty").notNull().default(0),
  isNew: boolean("is_new").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  // `url` is populated once real photography exists; `tone`/`label` drive
  // the placeholder gradient shown until then (see components/product-visual).
  images: jsonb("images")
    .notNull()
    .$type<{ url?: string; alt?: string; tone: [string, string]; label: string }[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  phone: text("phone"),
  email: text("email"),
  displayName: text("display_name"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  status: orderStatusEnum("status").notNull().default("pending_payment"),

  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email").notNull(),

  shippingAddressLine1: text("shipping_address_line1").notNull(),
  shippingAddressLine2: text("shipping_address_line2"),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingPincode: text("shipping_pincode").notNull(),

  subtotalPaise: integer("subtotal_paise").notNull(),
  gstPaise: integer("gst_paise").notNull(),
  shippingPaise: integer("shipping_paise").notNull().default(0),
  totalPaise: integer("total_paise").notNull(),

  paymentProvider: text("payment_provider"),
  paymentReferenceId: text("payment_reference_id"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  unitPricePaise: integer("unit_price_paise").notNull(),
  qty: integer("qty").notNull(),
  hsnCode: text("hsn_code").notNull(),
  gstRate: integer("gst_rate").notNull(),
});
