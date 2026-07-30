import { bangkokDate, db, ensureSchema, requireAdmin, serverError } from "@/lib/server";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    await ensureSchema();
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope") ?? "active";
    const status = url.searchParams.get("status") ?? "";
    const date = url.searchParams.get("date") ?? "";
    const search = url.searchParams.get("search")?.trim().slice(0, 80) ?? "";
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (scope === "active") {
      conditions.push("o.queue_date = ?");
      values.push(bangkokDate());
      conditions.push("o.status NOT IN ('delivered', 'cancelled')");
    } else if (date) {
      conditions.push("o.queue_date = ?");
      values.push(date);
    }
    if (status && ["received", "cooking", "ready", "delivered", "cancelled"].includes(status)) {
      conditions.push("o.status = ?");
      values.push(status);
    }
    if (search) {
      conditions.push("(o.customer_name LIKE ? OR o.phone LIKE ? OR CAST(o.queue_no AS TEXT) = ?)");
      values.push(`%${search}%`, `%${search}%`, search);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await db().prepare(
      `SELECT o.id, o.queue_no AS queueNo, o.queue_date AS queueDate, o.customer_name AS customerName,
       o.phone, o.pickup_type AS pickupType, o.note, o.status, o.total,
       o.created_at AS createdAt, o.updated_at AS updatedAt, o.delivered_at AS deliveredAt,
       COALESCE((SELECT json_group_array(json_object(
         'menuName', oi.menu_name, 'quantity', oi.quantity, 'unitPrice', oi.unit_price
       )) FROM order_items oi WHERE oi.order_id = o.id), '[]') AS itemsJson
       FROM orders o ${where} ORDER BY o.created_at DESC LIMIT 300`,
    ).bind(...values).all<Record<string, unknown>>();
    const orders = result.results.map((row) => ({
      ...row,
      items: JSON.parse(String(row.itemsJson ?? "[]")),
      itemsJson: undefined,
    }));
    return Response.json({ orders });
  } catch (error) {
    return serverError(error);
  }
}
