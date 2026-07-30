"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Status = "received" | "cooking" | "ready" | "delivered" | "cancelled";
type Order = {
  id: string;
  queueNo: number;
  queueDate: string;
  customerName: string;
  phone: string;
  pickupType: string;
  note: string;
  status: Status;
  total: number;
  createdAt: string;
  items: Array<{ menuName: string; quantity: number; unitPrice: number }>;
};
type Menu = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  imagePosition: string;
  isAvailable: number | boolean;
  sortOrder: number;
};
type Summary = {
  today: { orders: number; sales: number };
  month: { orders: number; sales: number };
  statuses: Array<{ status: Status; count: number }>;
  daily: Array<{ date: string; orders: number; sales: number }>;
  topMenus: Array<{ name: string; quantity: number; sales: number }>;
};

const statusText: Record<Status, string> = {
  received: "รับออเดอร์",
  cooking: "กำลังทำ",
  ready: "พร้อมรับ",
  delivered: "ส่งมอบแล้ว",
  cancelled: "ยกเลิก",
};
const money = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
  return data;
}

export function AdminApp() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [localDemo, setLocalDemo] = useState(false);
  const [tab, setTab] = useState<"overview" | "orders" | "menus" | "history">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const result = await api<{ authenticated: boolean; localDemo: boolean }>("/api/admin/session");
      setAuthenticated(result.authenticated);
      setLocalDemo(result.localDemo);
    } finally {
      setChecking(false);
    }
  }, []);

  const loadDashboard = useCallback(async (quiet = false) => {
    if (!authenticated) return;
    if (!quiet) setBusy("loading");
    try {
      const [orderData, menuData, summaryData] = await Promise.all([
        api<{ orders: Order[] }>("/api/admin/orders?scope=active"),
        api<{ menus: Menu[] }>("/api/menu"),
        api<Summary>("/api/admin/summary"),
      ]);
      setOrders(orderData.orders);
      setMenus(menuData.menus);
      setSummary(summaryData);
      setLastSync(new Date());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setBusy("");
    }
  }, [authenticated]);

  useEffect(() => { checkSession(); }, [checkSession]);
  useEffect(() => {
    if (!authenticated) return;
    loadDashboard();
    const timer = window.setInterval(() => loadDashboard(true), 5000);
    return () => window.clearInterval(timer);
  }, [authenticated, loadDashboard]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("login");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin: form.get("pin") }),
      });
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setBusy("");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  }

  async function changeStatus(id: string, status: Status) {
    setBusy(id);
    try {
      await api(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order).filter((order) => !["delivered", "cancelled"].includes(order.status)));
      await loadDashboard(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เปลี่ยนสถานะไม่สำเร็จ");
    } finally {
      setBusy("");
    }
  }

  if (checking) return <main className="admin-login"><div className="spinner" /></main>;
  if (!authenticated) return (
    <main className="admin-login">
      <Link href="/" className="brand"><span className="brand-mark">ไก่</span><span><strong>ไก่เฮงเฮง</strong><small>Restaurant OS</small></span></Link>
      <form onSubmit={login}>
        <div className="admin-lock">⌁</div>
        <span className="eyebrow">พื้นที่สำหรับร้านค้า</span>
        <h1>เข้าสู่ระบบหลังบ้าน</h1>
        <p>จัดการออเดอร์ คิว เมนู และยอดขายอย่างปลอดภัย</p>
        <label>รหัส PIN แอดมิน<input name="pin" type="password" inputMode="numeric" autoComplete="current-password" required maxLength={20} placeholder="••••" autoFocus /></label>
        {localDemo && <div className="demo-hint">โหมดทดลองบนเครื่องนี้: PIN <b>2468</b></div>}
        {error && <div className="notice error">{error}</div>}
        <button className="primary-btn full" disabled={busy === "login"}>{busy === "login" ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}</button>
        <Link href="/" className="text-btn">← กลับหน้าร้าน</Link>
      </form>
    </main>
  );

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand admin-brand"><span className="brand-mark">ไก่</span><span><strong>ไก่เฮงเฮง</strong><small>Restaurant OS</small></span></div>
        <nav>
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}><span>⌂</span> ภาพรวม</button>
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}><span>▤</span> ออเดอร์สด <b>{orders.length}</b></button>
          <button className={tab === "menus" ? "active" : ""} onClick={() => setTab("menus")}><span>◫</span> จัดการเมนู</button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}><span>◷</span> ประวัติการขาย</button>
        </nav>
        <div className="sidebar-bottom">
          <Link href="/" target="_blank">↗ ดูหน้าร้าน</Link>
          <button onClick={logout}>ออกจากระบบ</button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div><h1>{tab === "overview" ? "สวัสดีตอนเช้า" : tab === "orders" ? "ออเดอร์สด" : tab === "menus" ? "จัดการเมนู" : "ประวัติการขาย"}</h1><p>{tab === "overview" ? "นี่คือภาพรวมร้านของคุณวันนี้" : "ข้อมูลจากฐานข้อมูลกลางของร้าน"}</p></div>
          <div className="sync-status"><i /> สด {lastSync && `· ${lastSync.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`}</div>
        </header>
        {error && <div className="admin-alert"><span>{error}</span><button onClick={() => setError("")}>×</button></div>}
        {busy === "loading" ? <div className="admin-loading"><div className="spinner" /></div> :
          tab === "overview" ? <Overview summary={summary} orders={orders} onOpenOrders={() => setTab("orders")} /> :
          tab === "orders" ? <LiveOrders orders={orders} busy={busy} onStatus={changeStatus} /> :
          tab === "menus" ? <MenuManager menus={menus} setMenus={setMenus} setError={setError} /> :
          <OrderHistory setError={setError} />}
      </div>
    </main>
  );
}

function Overview({ summary, orders, onOpenOrders }: { summary: Summary | null; orders: Order[]; onOpenOrders: () => void }) {
  if (!summary) return null;
  const count = (status: Status) => Number(summary.statuses.find((item) => item.status === status)?.count ?? 0);
  const maxSales = Math.max(1, ...summary.daily.map((item) => Number(item.sales)));
  return (
    <div className="admin-content">
      <section className="metric-grid">
        <article className="metric-card featured"><span>ยอดขายวันนี้</span><strong>{money.format(summary.today.sales)}</strong><small>{summary.today.orders} ออเดอร์ที่ไม่ถูกยกเลิก</small><i>฿</i></article>
        <article className="metric-card"><span>ยอดขายเดือนนี้</span><strong>{money.format(summary.month.sales)}</strong><small>{summary.month.orders} ออเดอร์</small><i>↗</i></article>
        <article className="metric-card"><span>กำลังรอดำเนินการ</span><strong>{count("received") + count("cooking")}</strong><small>รับแล้ว {count("received")} · กำลังทำ {count("cooking")}</small><i>◷</i></article>
        <article className="metric-card"><span>พร้อมรับ</span><strong>{count("ready")}</strong><small>รอลูกค้ามารับอาหาร</small><i>✓</i></article>
      </section>
      <section className="dashboard-grid">
        <article className="chart-panel">
          <div className="panel-heading"><div><span>ยอดขาย 7 วัน</span><h2>แนวโน้มรายวัน</h2></div><small>บาท</small></div>
          <div className="bar-chart">
            {summary.daily.length ? summary.daily.map((day) => (
              <div className="bar-slot" key={day.date}>
                <span className="bar-value">{money.format(day.sales)}</span>
                <i style={{ height: `${Math.max(8, Number(day.sales) / maxSales * 100)}%` }} />
                <small>{new Date(`${day.date}T00:00:00`).toLocaleDateString("th-TH", { weekday: "short" })}</small>
              </div>
            )) : <div className="empty-mini">เมื่อมีออเดอร์ กราฟยอดขายจะปรากฏที่นี่</div>}
          </div>
        </article>
        <article className="top-menu-panel">
          <div className="panel-heading"><div><span>เดือนนี้</span><h2>เมนูขายดี</h2></div></div>
          <div className="ranking-list">
            {summary.topMenus.length ? summary.topMenus.map((menu, index) => (
              <div key={menu.name}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{menu.name}</strong><small>{menu.quantity} จาน</small></span><em>{money.format(menu.sales)}</em></div>
            )) : <div className="empty-mini">ยังไม่มีข้อมูลยอดขาย</div>}
          </div>
        </article>
      </section>
      <section className="recent-panel">
        <div className="panel-heading"><div><span>กำลังดำเนินการ</span><h2>ออเดอร์ล่าสุด</h2></div><button onClick={onOpenOrders}>ดูทั้งหมด →</button></div>
        <div className="compact-orders">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id}><b>A{String(order.queueNo).padStart(2, "0")}</b><span><strong>{order.customerName}</strong><small>{order.items.map((item) => `${item.quantity}× ${item.menuName}`).join(", ")}</small></span><em className={`status-chip ${order.status}`}>{statusText[order.status]}</em><strong>{money.format(order.total)}</strong></div>
          ))}
          {!orders.length && <div className="empty-mini">ยังไม่มีออเดอร์ที่กำลังดำเนินการ</div>}
        </div>
      </section>
    </div>
  );
}

function LiveOrders({ orders, busy, onStatus }: { orders: Order[]; busy: string; onStatus: (id: string, status: Status) => void }) {
  const columns: Array<{ status: Status; label: string; hint: string }> = [
    { status: "received", label: "รับออเดอร์", hint: "รอครัวรับไปทำ" },
    { status: "cooking", label: "กำลังทำ", hint: "อยู่ในครัว" },
    { status: "ready", label: "พร้อมรับ", hint: "รอลูกค้ามารับ" },
  ];
  return (
    <div className="admin-content">
      <div className="orders-toolbar"><div className="live-badge"><i /> อัปเดตอัตโนมัติทุก 5 วินาที</div><span>ออเดอร์วันนี้ที่ยังไม่เสร็จ {orders.length} รายการ</span></div>
      <div className="kanban">
        {columns.map((column) => {
          const rows = orders.filter((order) => order.status === column.status).sort((a, b) => a.queueNo - b.queueNo);
          return (
            <section className={`order-column ${column.status}`} key={column.status}>
              <header><div><i /><span><b>{column.label}</b><small>{column.hint}</small></span></div><strong>{rows.length}</strong></header>
              <div className="order-column-body">
                {rows.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-top"><b>A{String(order.queueNo).padStart(2, "0")}</b><span>{new Date(order.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.</span></div>
                    <h3>{order.customerName}</h3><p>{order.phone || (order.pickupType === "dinein" ? "ทานที่ร้าน" : "รับกลับบ้าน")}</p>
                    <div className="order-items">{order.items.map((item, index) => <div key={`${item.menuName}-${index}`}><span>{item.quantity}×</span><b>{item.menuName}</b></div>)}</div>
                    {order.note && <div className="order-note">หมายเหตุ: {order.note}</div>}
                    <div className="order-card-total"><span>รวม</span><b>{money.format(order.total)}</b></div>
                    <div className="order-actions">
                      {order.status === "received" && <button disabled={busy === order.id} onClick={() => onStatus(order.id, "cooking")}>รับออเดอร์ · เริ่มทำ →</button>}
                      {order.status === "cooking" && <button disabled={busy === order.id} onClick={() => onStatus(order.id, "ready")}>ทำเสร็จ · พร้อมรับ →</button>}
                      {order.status === "ready" && <button disabled={busy === order.id} onClick={() => onStatus(order.id, "delivered")}>✓ ส่งมอบแล้ว</button>}
                      <button className="cancel-order" disabled={busy === order.id} onClick={() => {
                        if (window.confirm(`ยืนยันยกเลิกคิว A${String(order.queueNo).padStart(2, "0")}?`)) onStatus(order.id, "cancelled");
                      }}>ยกเลิก</button>
                    </div>
                  </article>
                ))}
                {!rows.length && <div className="empty-column"><span>✓</span><p>ไม่มีออเดอร์ในขั้นตอนนี้</p></div>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MenuManager({ menus, setMenus, setError }: { menus: Menu[]; setMenus: React.Dispatch<React.SetStateAction<Menu[]>>; setError: (value: string) => void }) {
  const [editing, setEditing] = useState<Menu | null>(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState("");

  async function refresh() {
    const data = await api<{ menus: Menu[] }>("/api/menu");
    setMenus(data.menus);
  }
  async function toggle(menu: Menu) {
    setBusy(menu.id);
    try {
      await api(`/api/menu/${menu.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ isAvailable: !Boolean(menu.isAvailable) }) });
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ"); } finally { setBusy(""); }
  }
  async function remove(menu: Menu) {
    if (!window.confirm(`ลบเมนู “${menu.name}” ออกจากระบบ?`)) return;
    setBusy(menu.id);
    try { await api(`/api/menu/${menu.id}`, { method: "DELETE" }); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : "ลบไม่สำเร็จ"); } finally { setBusy(""); }
  }
  return (
    <div className="admin-content">
      <div className="menu-toolbar"><div><h2>เมนูทั้งหมด</h2><p>แก้ชื่อ ราคา รายละเอียด รูปภาพ และเปิด–ปิดการขายได้เอง</p></div><button className="primary-btn" onClick={() => setAdding(true)}>＋ เพิ่มเมนูใหม่</button></div>
      <div className="admin-menu-grid">
        {menus.map((menu) => (
          <article className={`admin-menu-card ${!Boolean(menu.isAvailable) ? "unavailable" : ""}`} key={menu.id}>
            <div className="admin-menu-image">
              {menu.imageUrl ? <img src={menu.imageUrl} alt={menu.name} /> : <span>{menu.name.includes("ทอด") ? "🍗" : "🍚"}</span>}
              <em>{Boolean(menu.isAvailable) ? "เปิดขาย" : "ปิดขาย"}</em>
            </div>
            <div className="admin-menu-body"><h3>{menu.name}</h3><p>{menu.description || "ยังไม่มีคำอธิบาย"}</p><strong>{money.format(menu.price)}</strong></div>
            <div className="admin-menu-actions"><button onClick={() => setEditing(menu)}>แก้ไข</button><button disabled={busy === menu.id} onClick={() => toggle(menu)}>{Boolean(menu.isAvailable) ? "ปิดขาย" : "เปิดขาย"}</button><button className="danger-link" onClick={() => remove(menu)}>ลบ</button></div>
          </article>
        ))}
      </div>
      {(editing || adding) && <MenuEditor menu={editing} onClose={() => { setEditing(null); setAdding(false); }} onSaved={async () => { await refresh(); setEditing(null); setAdding(false); }} setError={setError} />}
    </div>
  );
}

function MenuEditor({ menu, onClose, onSaved, setError }: { menu: Menu | null; onClose: () => void; onSaved: () => Promise<void>; setError: (value: string) => void }) {
  const [imageUrl, setImageUrl] = useState(menu?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData(); form.append("file", file);
      const result = await api<{ url: string }>("/api/admin/upload", { method: "POST", body: form });
      setImageUrl(result.url);
    } catch (err) { setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ"); } finally { setUploading(false); }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"), description: form.get("description"),
      price: Number(form.get("price")), imageUrl: imageUrl || null,
      sortOrder: Number(form.get("sortOrder")) || 0, isAvailable: true,
    };
    try {
      await api(menu ? `/api/menu/${menu.id}` : "/api/menu", {
        method: menu ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
      });
      await onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ"); } finally { setSaving(false); }
  }
  return (
    <div className="modal-backdrop editor-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="menu-editor" onSubmit={save}>
        <button type="button" className="close-btn" onClick={onClose}>×</button>
        <span className="eyebrow">{menu ? "แก้ไขเมนู" : "เมนูใหม่"}</span><h2>{menu ? menu.name : "เพิ่มเมนูอาหาร"}</h2>
        <label className="image-upload">
          {imageUrl ? <img src={imageUrl} alt="ตัวอย่างรูปเมนู" /> : <span><b>＋</b> เพิ่มรูปเมนู<small>JPG, PNG, WebP · ไม่เกิน 5 MB</small></span>}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file); }} />
          {uploading && <i>กำลังอัปโหลด…</i>}
        </label>
        <div className="editor-fields">
          <label>ชื่อเมนู<input name="name" defaultValue={menu?.name} required maxLength={80} /></label>
          <label>ราคา (บาท)<input name="price" type="number" min="1" max="10000" step="1" defaultValue={menu?.price} required /></label>
          <label className="wide">คำอธิบาย<textarea name="description" defaultValue={menu?.description} maxLength={240} /></label>
          <label>ลำดับการแสดง<input name="sortOrder" type="number" min="0" max="999" defaultValue={menu?.sortOrder ?? 99} /></label>
        </div>
        <div className="editor-buttons"><button type="button" className="text-btn" onClick={onClose}>ยกเลิก</button><button className="primary-btn" disabled={saving || uploading}>{saving ? "กำลังบันทึก…" : "บันทึกเมนู"}</button></div>
      </form>
    </div>
  );
}

function OrderHistory({ setError }: { setError: (value: string) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ scope: "history" });
      if (date) query.set("date", date); if (status) query.set("status", status); if (search) query.set("search", search);
      const data = await api<{ orders: Order[] }>(`/api/admin/orders?${query}`);
      setOrders(data.orders);
    } catch (err) { setError(err instanceof Error ? err.message : "โหลดประวัติไม่สำเร็จ"); } finally { setLoading(false); }
  }, [date, search, setError, status]);
  useEffect(() => { load(); }, [load]);
  const total = useMemo(() => orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + Number(order.total), 0), [orders]);
  return (
    <div className="admin-content">
      <div className="history-filters">
        <label>วันที่<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label>สถานะ<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">ทุกสถานะ</option>{Object.entries(statusText).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label className="search-field">ค้นหา<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ชื่อ เบอร์โทร หรือเลขคิว" /></label>
        <button onClick={load}>ค้นหา</button>
      </div>
      <div className="history-summary"><span>พบ {orders.length} ออเดอร์</span><b>ยอดรวม {money.format(total)}</b></div>
      <div className="history-table-wrap">
        <table><thead><tr><th>วันที่ / เวลา</th><th>คิว</th><th>ลูกค้า</th><th>รายการ</th><th>สถานะ</th><th>ยอดรวม</th></tr></thead>
          <tbody>{orders.map((order) => <tr key={order.id}><td>{new Date(order.createdAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}</td><td><b>A{String(order.queueNo).padStart(2, "0")}</b></td><td>{order.customerName}<small>{order.phone}</small></td><td>{order.items.map((item) => `${item.quantity}× ${item.menuName}`).join(", ")}</td><td><em className={`status-chip ${order.status}`}>{statusText[order.status]}</em></td><td><strong>{money.format(order.total)}</strong></td></tr>)}</tbody>
        </table>
        {!loading && !orders.length && <div className="empty-history">ไม่พบออเดอร์ตามเงื่อนไขที่เลือก</div>}
        {loading && <div className="admin-loading"><div className="spinner" /></div>}
      </div>
    </div>
  );
}
