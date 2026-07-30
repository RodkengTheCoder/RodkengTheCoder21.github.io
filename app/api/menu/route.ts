import { audit, db, ensureSchema, requireAdmin, serverError, readJson } from "@/lib/server";

type MenuPayload = {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string | null;
  imagePosition?: string;
  isAvailable?: boolean;
  sortOrder?: number;
};

export async function GET() {
  try {
    await ensureSchema();
    const result = await db().prepare(
      `SELECT id, name, description, price, image_url AS imageUrl,
        image_position AS imagePosition, is_available AS isAvailable, sort_order AS sortOrder
       FROM menus ORDER BY sort_order, created_at`,
    ).all();
    return Response.json({ menus: result.results });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    await ensureSchema();
    const payload = await readJson<MenuPayload>(request);
    const name = payload.name?.trim().slice(0, 80) ?? "";
    const description = payload.description?.trim().slice(0, 240) ?? "";
    const price = Number(payload.price);
    if (!name || !Number.isFinite(price) || price <= 0 || price > 10000) {
      return Response.json({ error: "กรุณาระบุชื่อและราคาให้ถูกต้อง" }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db().prepare(
      `INSERT INTO menus (id, name, description, price, image_url, image_position, is_available, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      id, name, description, price, payload.imageUrl ?? null, payload.imagePosition ?? "center",
      payload.isAvailable === false ? 0 : 1, Number(payload.sortOrder) || 99, now, now,
    ).run();
    await audit("create", "menu", id, name);
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
