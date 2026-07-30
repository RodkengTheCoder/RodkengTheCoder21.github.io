import { b as require_react, t as require_jsx_runtime, w as __toESM } from "../index.js";
import { t as Link } from "./link-BbQ5oRvQ.js";
import { n as useSearchParams, t as useParams } from "./navigation-5o1I4VvZ.js";
//#region app/track/[id]/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	{
		key: "received",
		label: "รับออเดอร์แล้ว",
		detail: "ร้านได้รับรายการของคุณ"
	},
	{
		key: "cooking",
		label: "กำลังทำ",
		detail: "ครัวกำลังเตรียมอาหาร"
	},
	{
		key: "ready",
		label: "พร้อมรับ",
		detail: "มารับที่เคาน์เตอร์ได้เลย"
	},
	{
		key: "delivered",
		label: "ส่งมอบแล้ว",
		detail: "ขอบคุณที่อุดหนุน"
	}
];
var money = new Intl.NumberFormat("th-TH", {
	style: "currency",
	currency: "THB",
	maximumFractionDigits: 0
});
function TrackOrderPage() {
	const params = useParams();
	const token = useSearchParams().get("token") ?? "";
	const [order, setOrder] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [justUpdated, setJustUpdated] = (0, import_react.useState)(false);
	const loadOrder = (0, import_react.useCallback)(async () => {
		if (!params.id || !token) {
			setError("ลิงก์ติดตามคิวไม่สมบูรณ์");
			return;
		}
		try {
			const response = await fetch(`/api/orders/${encodeURIComponent(params.id)}?token=${encodeURIComponent(token)}`, { cache: "no-store" });
			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "โหลดสถานะไม่สำเร็จ");
			setOrder((previous) => {
				if (previous && previous.status !== data.order.status) {
					setJustUpdated(true);
					window.setTimeout(() => setJustUpdated(false), 3e3);
				}
				return data.order;
			});
			setError("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
		}
	}, [params.id, token]);
	(0, import_react.useEffect)(() => {
		loadOrder();
		const timer = window.setInterval(loadOrder, 5e3);
		return () => window.clearInterval(timer);
	}, [loadOrder]);
	const currentIndex = order ? steps.findIndex((step) => step.key === order.status) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "tracking-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "tracking-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				href: "/",
				className: "brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "brand-mark",
					children: "ไก่"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ไก่เฮงเฮง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ติดตามคิวแบบอัตโนมัติ" })] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/",
				className: "text-btn",
				children: "กลับหน้าร้าน"
			})]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "tracking-card error-state",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "หาออเดอร์ไม่พบ" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					href: "/track",
					className: "primary-btn",
					children: "ค้นหาใหม่"
				})
			]
		}) : !order ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "tracking-card loading-state",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "กำลังตรวจสอบคิวล่าสุด…" })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: `tracking-card ${justUpdated ? "pulse-update" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ticket-top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "คิวของคุณ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["A", String(order.queueNo).padStart(2, "0")] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `live-status ${order.status}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), steps.find((step) => step.key === order.status)?.label || "ยกเลิก"]
					})]
				}),
				order.status === "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cancelled-message",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ออเดอร์นี้ถูกยกเลิก" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "หากมีข้อสงสัย กรุณาติดต่อร้าน" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "queue-ahead",
					children: order.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "อาหารพร้อมแล้ว!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "เชิญรับที่เคาน์เตอร์ได้เลย" })] }) : order.status === "delivered" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ส่งมอบเรียบร้อย" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ขอบคุณที่อุดหนุนครับ" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
						"ก่อนหน้าคุณ ",
						order.ahead,
						" คิว"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "หน้านี้จะอัปเดตเองทุก 5 วินาที" })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "status-timeline",
					children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${index <= currentIndex ? "done" : ""} ${index === currentIndex ? "current" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: index < currentIndex ? "✓" : index + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: step.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: step.detail })] })]
					}, step.key))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "order-receipt",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "receipt-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "รายการอาหาร" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [new Date(order.createdAt).toLocaleTimeString("th-TH", {
								hour: "2-digit",
								minute: "2-digit"
							}), " น."] })]
						}),
						order.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "receipt-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								item.quantity,
								"× ",
								item.menuName
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money.format(item.lineTotal) })]
						}, `${item.menuName}-${index}`)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "receipt-total",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "รวม" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money.format(order.total) })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "auto-refresh",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						" เชื่อมต่อกับระบบครัวแล้ว · อัปเดตล่าสุด ",
						new Date(order.updatedAt).toLocaleTimeString("th-TH", {
							hour: "2-digit",
							minute: "2-digit"
						}),
						" น."
					]
				})
			]
		})]
	});
}
//#endregion
export { TrackOrderPage as default };
