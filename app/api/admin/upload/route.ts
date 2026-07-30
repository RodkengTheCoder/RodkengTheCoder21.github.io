import { requireAdmin, runtimeEnv, serverError } from "@/lib/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const bucket = runtimeEnv().MENU_IMAGES;
    if (!bucket) return Response.json({ error: "พื้นที่เก็บรูปยังไม่พร้อมใช้งาน" }, { status: 503 });
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "กรุณาเลือกรูปภาพ" }, { status: 400 });
    if (!allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "รองรับ JPG, PNG, WebP หรือ AVIF ขนาดไม่เกิน 5 MB" }, { status: 400 });
    }
    const extension = file.type.split("/")[1].replace("jpeg", "jpg");
    const key = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    await bucket.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
    });
    return Response.json({ url: `/api/images/${encodeURIComponent(key)}` });
  } catch (error) {
    return serverError(error);
  }
}
