import type { Metadata } from "next";
import { AdminApp } from "./admin-app";

export const metadata: Metadata = {
  title: "หลังบ้านร้านค้า",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
