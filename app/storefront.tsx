"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Menu = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  imagePosition: string;
  isAvailable: number | boolean;
};

type Cart = Record<string, number>;
type OrderCreated = {
  id: string;
  token: string;
  queueNo: number;
  status: string;
  total: number;
  trackingUrl: string;
};

const money = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

function FoodVisual({ menu, large = false }: { menu: Menu; large?: boolean }) {
  if (menu.imageUrl) {
    return (
      <div className={`food-visual has-image ${large ? "large" : ""}`}>
        {/* Images are uploaded and controlled by the restaurant owner. */}
        <img src={menu.imageUrl} alt={menu.name} style={{ objectPosition: menu.imagePosition }} />
      </div>
    );
  }
  const fried = menu.name.includes("ทอด");
  return (
    <div className={`food-visual ${fried ? "fried" : "boiled"} ${large ? "large" : ""}`} aria-label={`ภาพจำลอง${menu.name}`}>
      <span className="plate-shadow" />
      <span className="plate">
        <span className="rice">🍚</span>
        <span className="chicken">{fried ? "🍗" : "🍗"}</span>
        <span className="cucumber">🥒</span>
      </span>
      <span className="sauce">{fried ? "ซอสหวาน" : "น้ำจิ้มสูตรเด็ด"}</span>
    </div>
  );
}

export function Storefront() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderCreated | null>(null);

  useEffect(() => {
    fetch("/api/menu")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "โหลดเมนูไม่สำเร็จ");
        setMenus(data.menus);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const availableMenus = useMemo(() => menus.filter((menu) => Boolean(menu.isAvailable)), [menus]);
  const cartRows = useMemo(
    () => availableMenus
      .filter((menu) => cart[menu.id])
      .map((menu) => ({ ...menu, quantity: cart[menu.id], lineTotal: menu.price * cart[menu.id] })),
    [availableMenus, cart],
  );
  const cartCount = cartRows.reduce((sum, row) => sum + row.quantity, 0);
  const total = cartRows.reduce((sum, row) => sum + row.lineTotal, 0);

  function changeQuantity(id: string, delta: number) {
    setCart((current) => {
      const next = Math.max(0, Math.min(20, (current[id] ?? 0) + delta));
      return { ...current, [id]: next };
    });
  }

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName: form.get("customerName"),
          phone: form.get("phone"),
          pickupType: form.get("pickupType"),
          note: form.get("note"),
          items: cartRows.map((row) => ({ menuId: row.id, quantity: row.quantity })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ส่งออเดอร์ไม่สำเร็จ");
      setOrder(data.order);
      setCart({});
      localStorage.setItem("latestChickenRiceOrder", JSON.stringify(data.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="กลับหน้าหลัก">
          <span className="brand-mark">ไก่</span>
          <span><strong>ไก่เฮงเฮง</strong><small>ข้าวมันไก่ทุกจาน ทำด้วยใจ</small></span>
        </Link>
        <nav aria-label="เมนูหลัก">
          <a href="#menu">เมนู</a>
          <a href="#queue">ระบบคิว</a>
          <Link href="/track">ติดตามออเดอร์</Link>
        </nav>
        <button className="cart-pill" onClick={() => setCartOpen(true)} aria-label={`ตะกร้ามี ${cartCount} รายการ`}>
          <span>ตะกร้า</span><b>{cartCount}</b>
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> เปิดรับออเดอร์วันนี้ · 06:30–14:00</div>
          <h1>ข้าวมันไก่<br /><em>ที่คิดถึง</em></h1>
          <p>ไก่นุ่ม ข้าวหอม น้ำจิ้มถึงใจ สั่งง่าย รับเลขคิวทันที และดูสถานะได้ทุกขั้นตอน</p>
          <div className="hero-actions">
            <a className="primary-btn" href="#menu">เลือกเมนู <span>↓</span></a>
            <a className="text-btn" href="#queue">คิวทำงานอย่างไร</a>
          </div>
          <div className="trust-row">
            <div><b>4.9</b><span>★★★★★</span><small>จากลูกค้าประจำ</small></div>
            <div className="divider" />
            <div><b>10–15 นาที</b><small>เวลาเตรียมโดยเฉลี่ย</small></div>
          </div>
        </div>
        <div className="hero-stage" aria-hidden="true">
          <div className="sun-stamp">สดใหม่<br /><strong>ทุกเช้า</strong></div>
          <div className="hero-dish">
            <span className="hero-plate" />
            <span className="hero-rice">🍚</span>
            <span className="hero-chicken">🍗</span>
            <span className="hero-greens">🥒</span>
            <span className="hero-sauce">🌶️</span>
          </div>
          <span className="scribble">สูตรลับของบ้านเรา</span>
        </div>
      </section>

      <section className="promise-strip" aria-label="จุดเด่นของร้าน">
        <div><span>◌</span><p><b>ไก่สดทุกเช้า</b><small>คัดไก่คุณภาพวันต่อวัน</small></p></div>
        <div><span>♨</span><p><b>ข้าวหอมเป็นเม็ด</b><small>หุงด้วยน้ำซุปไก่เข้มข้น</small></p></div>
        <div><span>✦</span><p><b>น้ำจิ้มตำสด</b><small>ขิง พริก กระเทียม ไม่หวงเครื่อง</small></p></div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading">
          <div><span className="eyebrow">เมนูขายดี</span><h2>วันนี้กินอะไรดี?</h2></div>
          <p>ทุกจานเสิร์ฟพร้อมแตงกวา น้ำซุปร้อน ๆ และน้ำจิ้มสูตรประจำบ้าน</p>
        </div>
        {error && !checkout && <div className="notice error">{error}</div>}
        <div className="menu-grid">
          {loading && [1, 2].map((item) => <div className="menu-card loading-card" key={item} />)}
          {!loading && availableMenus.map((menu, index) => (
            <article className="menu-card" key={menu.id}>
              <div className="menu-image-wrap">
                <FoodVisual menu={menu} />
                {index === 0 && <span className="bestseller">ขายดีอันดับ 1</span>}
              </div>
              <div className="menu-card-body">
                <div><h3>{menu.name}</h3><p>{menu.description}</p></div>
                <div className="menu-card-footer">
                  <strong>{money.format(menu.price)}</strong>
                  {cart[menu.id] ? (
                    <div className="qty">
                      <button onClick={() => changeQuantity(menu.id, -1)} aria-label={`ลดจำนวน${menu.name}`}>−</button>
                      <span>{cart[menu.id]}</span>
                      <button onClick={() => changeQuantity(menu.id, 1)} aria-label={`เพิ่มจำนวน${menu.name}`}>+</button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => changeQuantity(menu.id, 1)}>เพิ่ม <span>＋</span></button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="queue-section" id="queue">
        <div className="queue-copy">
          <span className="eyebrow light">สบายใจทุกขั้นตอน</span>
          <h2>สั่งแล้ว<br />ไม่ต้องยืนรอ</h2>
          <p>ระบบคิวเชื่อมตรงกับครัว คุณเห็นสถานะเดียวกับที่ร้านเห็น ตั้งแต่รับออเดอร์จนพร้อมรับ</p>
        </div>
        <div className="queue-steps">
          {[
            ["01", "เลือกเมนู", "เลือกจานโปรดและจำนวนที่ต้องการ"],
            ["02", "รับเลขคิว", "ระบบออกคิวให้ทันทีหลังยืนยัน"],
            ["03", "ดูสถานะสด", "ติดตาม รับออเดอร์ → กำลังทำ → พร้อมรับ"],
          ].map(([no, title, text]) => (
            <div className="queue-step" key={no}><b>{no}</b><span><strong>{title}</strong><small>{text}</small></span></div>
          ))}
        </div>
        <div className="queue-ticket-demo">
          <span>คิวของคุณ</span><strong>A12</strong><div><i /><p><b>กำลังทำ</b><small>ก่อนหน้าคุณ 2 คิว</small></p></div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">ไก่</span><span><strong>ไก่เฮงเฮง</strong><small>อิ่มอร่อย อุ่นใจทุกคิว</small></span></div>
        <p>เปิดทุกวัน 06:30–14:00 · โทร 02-000-0000</p>
        <Link href="/admin">สำหรับร้านค้า</Link>
      </footer>

      {cartCount > 0 && !cartOpen && (
        <button className="floating-cart" onClick={() => setCartOpen(true)}>
          <span><b>{cartCount} รายการ</b><small>ดูตะกร้า</small></span><strong>{money.format(total)} →</strong>
        </button>
      )}

      {(cartOpen || checkout) && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.currentTarget === event.target) { setCartOpen(false); setCheckout(false); }
        }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label={checkout ? "ยืนยันออเดอร์" : "ตะกร้า"}>
            <button className="close-btn" onClick={() => { setCartOpen(false); setCheckout(false); }} aria-label="ปิด">×</button>
            {order ? (
              <div className="order-success">
                <span className="success-check">✓</span>
                <p className="eyebrow">รับออเดอร์แล้ว</p>
                <h2>คิว A{String(order.queueNo).padStart(2, "0")}</h2>
                <p>ครัวได้รับรายการของคุณแล้ว เก็บหน้านี้ไว้เพื่อติดตามสถานะ</p>
                <Link className="primary-btn full" href={order.trackingUrl}>ดูสถานะคิวของฉัน</Link>
                <button className="text-btn" onClick={() => { setOrder(null); setCartOpen(false); setCheckout(false); }}>กลับหน้าร้าน</button>
              </div>
            ) : checkout ? (
              <form className="checkout-form" onSubmit={placeOrder}>
                <span className="eyebrow">ขั้นตอนสุดท้าย</span><h2>ข้อมูลรับอาหาร</h2>
                <label>ชื่อผู้รับอาหาร<input name="customerName" required maxLength={80} placeholder="เช่น คุณสมชาย" /></label>
                <label>เบอร์โทรศัพท์ <small>(ไม่บังคับ)</small><input name="phone" inputMode="tel" maxLength={24} placeholder="08x-xxx-xxxx" /></label>
                <fieldset><legend>รับอาหารแบบไหน</legend>
                  <label className="radio-card"><input type="radio" name="pickupType" value="pickup" defaultChecked /><span><b>รับกลับบ้าน</b><small>รับที่เคาน์เตอร์</small></span></label>
                  <label className="radio-card"><input type="radio" name="pickupType" value="dinein" /><span><b>ทานที่ร้าน</b><small>แจ้งโต๊ะเมื่อมาถึง</small></span></label>
                </fieldset>
                <label>หมายเหตุถึงครัว <small>(ไม่บังคับ)</small><textarea name="note" maxLength={300} placeholder="เช่น ไม่เอาหนัง ขอซอสเพิ่ม" /></label>
                {error && <div className="notice error">{error}</div>}
                <div className="checkout-total"><span>ยอดชำระที่ร้าน</span><strong>{money.format(total)}</strong></div>
                <button className="primary-btn full" disabled={submitting}>{submitting ? "กำลังส่งออเดอร์…" : "ยืนยันออเดอร์และรับคิว"}</button>
                <button type="button" className="text-btn" onClick={() => { setCheckout(false); setCartOpen(true); }}>← กลับไปแก้ตะกร้า</button>
              </form>
            ) : (
              <>
                <span className="eyebrow">ออเดอร์ของคุณ</span><h2>ตะกร้า</h2>
                <div className="cart-list">
                  {cartRows.map((row) => (
                    <div className="cart-row" key={row.id}>
                      <FoodVisual menu={row} />
                      <div><b>{row.name}</b><small>{money.format(row.price)} / จาน</small>
                        <div className="qty"><button onClick={() => changeQuantity(row.id, -1)}>−</button><span>{row.quantity}</span><button onClick={() => changeQuantity(row.id, 1)}>+</button></div>
                      </div>
                      <strong>{money.format(row.lineTotal)}</strong>
                    </div>
                  ))}
                </div>
                <div className="cart-summary"><span>รวมทั้งหมด</span><strong>{money.format(total)}</strong></div>
                <button className="primary-btn full" onClick={() => { setCartOpen(false); setCheckout(true); }}>ไปยืนยันออเดอร์ →</button>
                <p className="secure-note">ชำระเงินที่หน้าร้าน · ราคาและคิวจะยืนยันหลังส่งออเดอร์</p>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
