"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type TrackedOrder = {
  id: string;
  queueNo: number;
  customerName: string;
  pickupType: string;
  note: string;
  status: "received" | "cooking" | "ready" | "delivered" | "cancelled";
  total: number;
  ahead: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{ menuName: string; quantity: number; unitPrice: number; lineTotal: number }>;
};

const steps = [
  { key: "received", label: "รับออเดอร์แล้ว", detail: "ร้านได้รับรายการของคุณ" },
  { key: "cooking", label: "กำลังทำ", detail: "ครัวกำลังเตรียมอาหาร" },
  { key: "ready", label: "พร้อมรับ", detail: "มารับที่เคาน์เตอร์ได้เลย" },
  { key: "delivered", label: "ส่งมอบแล้ว", detail: "ขอบคุณที่อุดหนุน" },
];
const money = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

export default function TrackOrderPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [justUpdated, setJustUpdated] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!params.id || !token) { setError("ลิงก์ติดตามคิวไม่สมบูรณ์"); return; }
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(params.id)}?token=${encodeURIComponent(token)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "โหลดสถานะไม่สำเร็จ");
      setOrder((previous) => {
        if (previous && previous.status !== data.order.status) {
          setJustUpdated(true);
          window.setTimeout(() => setJustUpdated(false), 3000);
        }
        return data.order;
      });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  }, [params.id, token]);

  useEffect(() => {
    loadOrder();
    const timer = window.setInterval(loadOrder, 5000);
    return () => window.clearInterval(timer);
  }, [loadOrder]);

  const currentIndex = order ? steps.findIndex((step) => step.key === order.status) : 0;

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <Link href="/" className="brand"><span className="brand-mark">ไก่</span><span><strong>ไก่เฮงเฮง</strong><small>ติดตามคิวแบบอัตโนมัติ</small></span></Link>
        <Link href="/" className="text-btn">กลับหน้าร้าน</Link>
      </header>
      {error ? (
        <section className="tracking-card error-state"><h1>หาออเดอร์ไม่พบ</h1><p>{error}</p><Link href="/track" className="primary-btn">ค้นหาใหม่</Link></section>
      ) : !order ? (
        <section className="tracking-card loading-state"><div className="spinner" /><p>กำลังตรวจสอบคิวล่าสุด…</p></section>
      ) : (
        <section className={`tracking-card ${justUpdated ? "pulse-update" : ""}`}>
          <div className="ticket-top">
            <div><span className="eyebrow">คิวของคุณ</span><h1>A{String(order.queueNo).padStart(2, "0")}</h1></div>
            <div className={`live-status ${order.status}`}><i />{steps.find((step) => step.key === order.status)?.label || "ยกเลิก"}</div>
          </div>
          {order.status === "cancelled" ? (
            <div className="cancelled-message"><b>ออเดอร์นี้ถูกยกเลิก</b><span>หากมีข้อสงสัย กรุณาติดต่อร้าน</span></div>
          ) : (
            <>
              <div className="queue-ahead">
                {order.status === "ready" ? <><b>อาหารพร้อมแล้ว!</b><span>เชิญรับที่เคาน์เตอร์ได้เลย</span></> :
                 order.status === "delivered" ? <><b>ส่งมอบเรียบร้อย</b><span>ขอบคุณที่อุดหนุนครับ</span></> :
                 <><b>ก่อนหน้าคุณ {order.ahead} คิว</b><span>หน้านี้จะอัปเดตเองทุก 5 วินาที</span></>}
              </div>
              <div className="status-timeline">
                {steps.map((step, index) => (
                  <div className={`${index <= currentIndex ? "done" : ""} ${index === currentIndex ? "current" : ""}`} key={step.key}>
                    <i>{index < currentIndex ? "✓" : index + 1}</i><span><b>{step.label}</b><small>{step.detail}</small></span>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="order-receipt">
            <div className="receipt-heading"><b>รายการอาหาร</b><span>{new Date(order.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.</span></div>
            {order.items.map((item, index) => <div className="receipt-row" key={`${item.menuName}-${index}`}><span>{item.quantity}× {item.menuName}</span><b>{money.format(item.lineTotal)}</b></div>)}
            <div className="receipt-total"><span>รวม</span><b>{money.format(order.total)}</b></div>
          </div>
          <p className="auto-refresh"><i /> เชื่อมต่อกับระบบครัวแล้ว · อัปเดตล่าสุด {new Date(order.updatedAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.</p>
        </section>
      )}
    </main>
  );
}
