import { audit, db, ensureSchema, requireAdmin, serverError, readJson } from "@/lib/server";

type MenuPayload = {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string | null;
  imagePosition?: string;
  isAvailable?: boolean;
  sortOrder?: number;
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await ensureSchema();
    const { id } = await context.params;
    const payload = await readJson<MenuPayload>(request);
    const current = await db().prepare("SELECT * FROM menus WHERE id = ?").bind(id).first<Record<string, unknown>>();
    if (!current) return Response.json({ error: "ไม่พบเมนู" }, { status: 404 });

    const name = payload.name?.trim().slice(0, 80) || String(current.name);
    const description = payload.description === undefined
      ? String(current.description)
      : payload.description.trim().slice(0, 240);
    const price = payload.price === undefined ? Number(current.price) : Number(payload.price);
    if (!name || !Number.isFinite(price) || price <= 0 || price > 10000) {
      return Response.json({ error: "ข้อมูลเมนูไม่ถูกต้อง" }, { status: 400 });
    }
    await db().prepare(
      `UPDATE menus SET name = ?, description = ?, price = ?, image_url = ?, image_position = ?,
       is_available = ?, sort_order = ?, updated_at = ? WHERE id = ?`,
    ).bind(
      name,
      description,
      price,
      payload.imageUrl === undefined ? current.image_url : payload.imageUrl,
      payload.imagePosition ?? String(current.image_position),
      payload.isAvailable === undefined ? Number(current.is_available) : payload.isAvailable ? 1 : 0,
      payload.sortOrder === undefined ? Number(current.sort_order) : Number(payload.sortOrder) || 0,
      new Date().toISOString(),
      id,
    ).run();
    await audit("update", "menu", id, name);
    return Response.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await ensureSchema();
    const { id } = await context.params;
    await db().prepare("DELETE FROM menus WHERE id = ?").bind(id).run();
    await audit("delete", "menu", id);
    return Response.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
