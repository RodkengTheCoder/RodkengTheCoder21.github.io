import { env } from "cloudflare:workers";

export type OrderStatus = "received" | "cooking" | "ready" | "delivered" | "cancelled";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "รับออเดอร์แล้ว",
  cooking: "กำลังทำ",
  ready: "พร้อมรับ",
  delivered: "ส่งมอบแล้ว",
  cancelled: "ยกเลิก",
};

type RuntimeEnv = {
  DB?: D1Database;
  MENU_IMAGES?: R2Bucket;
  ADMIN_PIN?: string;
  SESSION_SECRET?: string;
};

export function runtimeEnv() {
  return env as unknown as RuntimeEnv;
}

export function db() {
  const binding = runtimeEnv().DB;
  if (!binding) throw new Error("Database binding is unavailable");
  return binding;
}

let schemaReady: Promise<void> | null = null;

export async function ensureSchema() {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    const d1 = db();
    await d1.batch([
      d1.prepare(`CREATE TABLE IF NOT EXISTS menus (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        price REAL NOT NULL,
        image_url TEXT,
        image_position TEXT NOT NULL DEFAULT 'center',
        is_available INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
      d1.prepare(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        public_token TEXT NOT NULL UNIQUE,
        queue_date TEXT NOT NULL,
        queue_no INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL DEFAULT '',
        pickup_type TEXT NOT NULL DEFAULT 'pickup',
        note TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'received',
        subtotal REAL NOT NULL,
        total REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        delivered_at TEXT
      )`),
      d1.prepare(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        menu_id TEXT NOT NULL,
        menu_name TEXT NOT NULL,
        unit_price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        line_total REAL NOT NULL
      )`),
      d1.prepare(`CREATE TABLE IF NOT EXISTS queue_counters (
        queue_date TEXT PRIMARY KEY,
        last_queue_no INTEGER NOT NULL DEFAULT 0
      )`),
      d1.prepare(`CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        detail TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL
      )`),
      d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS orders_queue_idx ON orders(queue_date, queue_no)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status, created_at)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id)"),
    ]);

    const now = new Date().toISOString();
    await d1.batch([
      d1.prepare(`INSERT OR IGNORE INTO menus
        (id, name, description, price, image_url, image_position, is_available, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, NULL, 'left center', 1, 1, ?, ?)`)
        .bind("boiled-chicken", "ข้าวมันไก่ต้ม", "ไก่นุ่มฉ่ำ ข้าวหอม น้ำจิ้มเต้าเจี้ยวสูตรบ้านเรา", 55, now, now),
      d1.prepare(`INSERT OR IGNORE INTO menus
        (id, name, description, price, image_url, image_position, is_available, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, NULL, 'right center', 1, 2, ?, ?)`)
        .bind("fried-chicken", "ข้าวมันไก่ทอด", "ไก่ทอดกรอบนอกนุ่มใน เสิร์ฟคู่ซอสหวานเผ็ด", 60, now, now),
    ]);
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });
  return schemaReady;
}

export function bangkokDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function readJson<T>(request: Request): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
  return (await request.json()) as T;
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  const part = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : "";
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export function authConfig(request: Request) {
  const settings = runtimeEnv();
  const hostname = new URL(request.url).hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  return {
    pin: settings.ADMIN_PIN || (isLocal ? "2468" : ""),
    secret: settings.SESSION_SECRET || (isLocal ? "local-development-only-secret" : ""),
    isLocal,
  };
}

export async function makeAdminSession(request: Request) {
  const { secret } = authConfig(request);
  if (!secret) throw new Error("ยังไม่ได้ตั้งค่าความปลอดภัยของแอดมิน");
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 12;
  const value = `${expires}.admin`;
  const signature = await hmac(value, secret);
  return `${value}.${signature}`;
}

export async function isAdmin(request: Request) {
  const { secret } = authConfig(request);
  if (!secret) return false;
  const token = cookieValue(request, "admin_session");
  const [expiresText, role, signature] = token.split(".");
  const expires = Number(expiresText);
  if (!expires || role !== "admin" || expires < Date.now() / 1000 || !signature) return false;
  const expected = await hmac(`${expiresText}.${role}`, secret);
  return safeEqual(signature, expected);
}

export async function requireAdmin(request: Request) {
  if (!(await isAdmin(request))) throw new AdminAuthError();
}

export class AdminAuthError extends Error {
  constructor() {
    super("กรุณาเข้าสู่ระบบแอดมิน");
  }
}

export function serverError(error: unknown) {
  if (error instanceof AdminAuthError) return jsonError(error.message, 401);
  const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาด";
  console.error(error);
  return jsonError(message, 500);
}

export async function audit(action: string, entityType: string, entityId: string, detail = "") {
  await db().prepare(
    "INSERT INTO audit_logs (action, entity_type, entity_id, detail, created_at) VALUES (?, ?, ?, ?, ?)",
  ).bind(action, entityType, entityId, detail, new Date().toISOString()).run();
}
