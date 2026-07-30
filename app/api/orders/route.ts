import { bangkokDate, db, ensureSchema, jsonError, readJson, serverError } from "@/lib/server";

type OrderPayload = {
  customerName?: string;
  phone?: string;
  pickupType?: "pickup" | "dinein";
  note?: string;
  items?: Array<{ menuId?: string; quantity?: number }>;
};

type MenuRow = {
  id: string;
  name: string;
  price: number;
  is_available: number;
};

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const payload = await readJson<OrderPayload>(request);
    const customerName = payload.customerName?.trim().slice(0, 80) ?? "";
    const phone = payload.phone?.replace(/[^\d+ -]/g, "").trim().slice(0, 24) ?? "";
    const note = payload.note?.trim().slice(0, 300) ?? "";
    const pickupType = payload.pickupType === "dinein" ? "dinein" : "pickup";
    const rawItems = Array.isArray(payload.items) ? payload.items.slice(0, 20) : [];
    if (!customerName) return jsonError("กรุณาระบุชื่อลูกค้า");
    if (!rawItems.length) return jsonError("กรุณาเลือกเมนูอย่างน้อย 1 รายการ");

    const quantities = new Map<string, number>();
    for (const item of rawItems) {
      if (!item.menuId) continue;
      const quantity = Math.floor(Number(item.quantity));
      if (!Number.isFinite(quantity) || quantity < 1 || quantity > 20) return jsonError("จำนวนสินค้าไม่ถูกต้อง");
      quantities.set(item.menuId, Math.min(20, (quantities.get(item.menuId) ?? 0) + quantity));
    }
    if (!quantities.size) return jsonError("ไม่พบรายการอาหาร");

    const placeholders = Array.from(quantities.keys()).map(() => "?").join(",");
    const menuResult = await db().prepare(
      `SELECT id, name, price, is_available FROM menus WHERE id IN (${placeholders})`,
    ).bind(...Array.from(quantities.keys())).all<MenuRow>();
    if (menuResult.results.length !== quantities.size || menuResult.results.some((menu) => !menu.is_available)) {
      return jsonError("มีเมนูที่ปิดขายหรือไม่พบ กรุณาโหลดหน้าใหม่");
    }

    const items = menuResult.results.map((menu) => {
      const quantity = quantities.get(menu.id) ?? 0;
      return {
        menuId: menu.id,
        menuName: menu.name,
        unitPrice: Number(menu.price),
        quantity,
        lineTotal: Number(menu.price) * quantity,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const total = subtotal;
    const queueDate = bangkokDate();
    const counter = await db().prepare(
      `INSERT INTO queue_counters (queue_date, last_queue_no) VALUES (?, 1)
       ON CONFLICT(queue_date) DO UPDATE SET last_queue_no = last_queue_no + 1
       RETURNING last_queue_no AS queueNo`,
    ).bind(queueDate).first<{ queueNo: number }>();
    if (!counter) throw new Error("ไม่สามารถสร้างหมายเลขคิวได้");

    const id = crypto.randomUUID();
    const publicToken = crypto.randomUUID().replaceAll("-", "");
    const now = new Date().toISOString();
    await db().prepare(
      `INSERT INTO orders
       (id, public_token, queue_date, queue_no, customer_name, phone, pickup_type, note, status, subtotal, total, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?, ?, ?)`,
    ).bind(id, publicToken, queueDate, counter.queueNo, customerName, phone, pickupType, note, subtotal, total, now, now).run();

    await db().batch(items.map((item) => db().prepare(
      `INSERT INTO order_items (order_id, menu_id, menu_name, unit_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(id, item.menuId, item.menuName, item.unitPrice, item.quantity, item.lineTotal)));

    return Response.json({
      order: {
        id,
        token: publicToken,
        queueNo: counter.queueNo,
        status: "received",
        total,
        createdAt: now,
        trackingUrl: `/track/${id}?token=${publicToken}`,
      },
    }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
