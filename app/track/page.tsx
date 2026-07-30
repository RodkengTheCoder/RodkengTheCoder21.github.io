"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type SavedOrder = { id: string; token: string; trackingUrl?: string };

export default function TrackLookupPage() {
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState<SavedOrder | null>(null);
  const [orderId, setOrderId] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("latestChickenRiceOrder");
    if (raw) {
      try { setSaved(JSON.parse(raw)); } catch { /* ignore damaged local shortcut */ }
    }
    setOrderId(searchParams.get("order") ?? "");
    setToken(searchParams.get("token") ?? "");
  }, [searchParams]);

  return (
    <main className="track-page">
      <Link href="/" className="brand">
        <span className="brand-mark">ไก่</span><span><strong>ไก่เฮงเฮง</strong><small>ระบบติดตามคิว</small></span>
      </Link>
      <section className="track-lookup-card">
        <span className="eyebrow">ติดตามออเดอร์</span>
        <h1>คิวถึงไหนแล้ว?</h1>
        <p>เปิดลิงก์ที่ได้รับหลังสั่งอาหาร หรือกรอกเลขออเดอร์และรหัสติดตามของคุณ</p>
        {saved && (
          <Link className="latest-order-link" href={saved.trackingUrl || `/track/${saved.id}?token=${saved.token}`}>
            <span>ออเดอร์ล่าสุดบนเครื่องนี้</span><b>ดูสถานะ →</b>
          </Link>
        )}
        <form action={orderId && token ? `/track/${orderId}` : undefined}>
          <label>เลขออเดอร์<input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="เช่น 8b44..." required /></label>
          <label>รหัสติดตาม<input value={token} onChange={(event) => setToken(event.target.value)} name="token" placeholder="รหัสจากลิงก์ออเดอร์" required /></label>
          <button className="primary-btn full">ค้นหาออเดอร์</button>
        </form>
        <Link href="/" className="text-btn">← กลับไปหน้าร้าน</Link>
      </section>
    </main>
  );
}
