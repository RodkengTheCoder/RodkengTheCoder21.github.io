import { authConfig, makeAdminSession, readJson, serverError } from "@/lib/server";

export async function POST(request: Request) {
  try {
    const payload = await readJson<{ pin?: string }>(request);
    const config = authConfig(request);
    if (!config.pin || !config.secret) {
      return Response.json({ error: "กรุณาตั้งค่า ADMIN_PIN และ SESSION_SECRET ก่อนเปิดใช้หลังบ้าน" }, { status: 503 });
    }
    if ((payload.pin ?? "") !== config.pin) {
      return Response.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }
    const token = await makeAdminSession(request);
    return Response.json(
      { ok: true, demoPin: config.isLocal ? "2468" : undefined },
      {
        headers: {
          "Set-Cookie": `admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200${config.isLocal ? "" : "; Secure"}`,
        },
      },
    );
  } catch (error) {
    return serverError(error);
  }
}
