import { authConfig, isAdmin } from "@/lib/server";

export async function GET(request: Request) {
  const config = authConfig(request);
  return Response.json({ authenticated: await isAdmin(request), localDemo: config.isLocal });
}
