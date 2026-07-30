import { audit, db, ensureSchema, readJson, requireAdmin, serverError, type OrderStatus } from "@/lib/server";

const allowed: OrderStatus[] = ["received", "cooking", "ready", "delivered", "cancelled"];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await ensureSchema();
    const { id } = await context.params;
    const payload = await readJson<{ status?: OrderStatus }>(request);
    if (!payload.status || !allowed.includes(payload.status)) {
      return Response.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const result = await db().prepare(
      "UPDATE orders SET status = ?, updated_at = ?, delivered_at = ? WHERE id = ?",
    ).bind(payload.status, now, payload.status === "delivered" ? now : null, id).run();
    if (!result.meta.changes) return Response.json({ error: "ไม่พบออเดอร์" }, { status: 404 });
    await audit("status", "order", id, payload.status);
    return Response.json({ ok: true, updatedAt: now });
  } catch (error) {
    return serverError(error);
  }
}
