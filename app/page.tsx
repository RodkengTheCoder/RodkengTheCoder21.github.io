import type { Metadata } from "next";
import { Storefront } from "./storefront";

export const metadata: Metadata = {
  title: "ไก่เฮงเฮง — ข้าวมันไก่ต้ม & ไก่ทอด",
  description: "สั่งข้าวมันไก่สดใหม่ รับเลขคิว และติดตามสถานะได้แบบเรียลไทม์",
};

export default function Home() {
  return <Storefront />;
}
