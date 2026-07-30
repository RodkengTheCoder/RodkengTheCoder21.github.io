import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: { default: "ไก่เฮงเฮง", template: "%s | ไก่เฮงเฮง" },
    description: "ร้านข้าวมันไก่ต้มและไก่ทอด พร้อมระบบสั่งอาหารและติดตามคิว",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      type: "website",
      locale: "th_TH",
      title: "ไก่เฮงเฮง — ข้าวมันไก่ที่คิดถึง",
      description: "สั่งข้าวมันไก่ รับเลขคิว และติดตามสถานะได้ทุกขั้นตอน",
      images: [{ url: new URL("/og.png", base).toString(), width: 1734, height: 909, alt: "ไก่เฮงเฮง ข้าวมันไก่ต้มและไก่ทอด" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ไก่เฮงเฮง — ข้าวมันไก่ที่คิดถึง",
      description: "สั่งข้าวมันไก่ รับเลขคิว และติดตามสถานะได้ทุกขั้นตอน",
      images: [new URL("/og.png", base).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
