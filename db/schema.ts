import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const menus = sqliteTable("menus", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: real("price").notNull(),
  imageUrl: text("image_url"),
  imagePosition: text("image_position").notNull().default("center"),
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  publicToken: text("public_token").notNull().unique(),
  queueDate: text("queue_date").notNull(),
  queueNo: integer("queue_no").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull().default(""),
  pickupType: text("pickup_type").notNull().default("pickup"),
  note: text("note").notNull().default(""),
  status: text("status").notNull().default("received"),
  subtotal: real("subtotal").notNull(),
  total: real("total").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  deliveredAt: text("delivered_at"),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id").notNull(),
  menuId: text("menu_id").notNull(),
  menuName: text("menu_name").notNull(),
  unitPrice: real("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: real("line_total").notNull(),
});

export const queueCounters = sqliteTable("queue_counters", {
  queueDate: text("queue_date").primaryKey(),
  lastQueueNo: integer("last_queue_no").notNull().default(0),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  detail: text("detail").notNull().default(""),
  createdAt: text("created_at").notNull(),
});
