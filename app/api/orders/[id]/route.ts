import { bangkokDate, db, ensureSchema, jsonError, serverError } from "@/lib/server";

type OrderRow = {
  id: string;
  queueNo: number;
  customerName: string;
  pickupType: string;
  note: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureSchema();
    const { id } = await context.params;
    const token = new URL(request.url).searchParams.get("token") ?? "";
    if (!token || token.length > 80) return jsonError("ลิงก์ติดตามคิวไม่ถูกต้อง", 401);
    const order = await db().prepare(
      `SELECT id, queue_no AS queueNo, customer_name AS customerName, pickup_type AS pickupType,
       note, status, total, created_at AS createdAt, updated_at AS updatedAt
       FROM orders WHERE id = ? AND public_token = ?`,
    ).bind(id, token).first<OrderRow>();
    if (!order) return jsonError("ไม่พบออเดอร์", 404);

    const ahead = order.status === "delivered" || order.status === "cancelled"
      ? 0
      : await db().prepare(
        `SELECT COUNT(*) AS count FROM orders
         WHERE queue_date = ? AND queue_no < ? AND status NOT IN ('delivered', 'cancelled')`,
      ).bind(bangkokDate(new Date(order.createdAt)), order.queueNo).first<{ count: number }>();
    const itemResult = await db().prepare(
      `SELECT menu_name AS menuName, unit_price AS unitPrice, quantity, line_total AS lineTotal
       FROM order_items WHERE order_id = ? ORDER BY id`,
    ).bind(id).all();
    return Response.json({ order: { ...order, ahead: Number(ahead && "count" in ahead ? ahead.count : 0), items: itemResult.results } });
  } catch (error) {
    return serverError(error);
  }
}
