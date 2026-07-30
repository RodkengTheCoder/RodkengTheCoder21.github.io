import { b as require_react, t as require_jsx_runtime, w as __toESM } from "../index.js";
import { t as Link } from "./link-BbQ5oRvQ.js";
import { n as useSearchParams } from "./navigation-5o1I4VvZ.js";
//#region app/track/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function TrackLookupPage() {
	const searchParams = useSearchParams();
	const [saved, setSaved] = (0, import_react.useState)(null);
	const [orderId, setOrderId] = (0, import_react.useState)("");
	const [token, setToken] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const raw = localStorage.getItem("latestChickenRiceOrder");
		if (raw) try {
			setSaved(JSON.parse(raw));
		} catch {}
		setOrderId(searchParams.get("order") ?? "");
		setToken(searchParams.get("token") ?? "");
	}, [searchParams]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "track-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			href: "/",
			className: "brand",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "brand-mark",
				children: "ไก่"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ไก่เฮงเฮง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ระบบติดตามคิว" })] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "track-lookup-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: "ติดตามออเดอร์"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "คิวถึงไหนแล้ว?" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "เปิดลิงก์ที่ได้รับหลังสั่งอาหาร หรือกรอกเลขออเดอร์และรหัสติดตามของคุณ" }),
				saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "latest-order-link",
					href: saved.trackingUrl || `/track/${saved.id}?token=${saved.token}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ออเดอร์ล่าสุดบนเครื่องนี้" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ดูสถานะ →" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					action: orderId && token ? `/track/${orderId}` : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["เลขออเดอร์", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: orderId,
							onChange: (event) => setOrderId(event.target.value),
							placeholder: "เช่น 8b44...",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["รหัสติดตาม", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: token,
							onChange: (event) => setToken(event.target.value),
							name: "token",
							placeholder: "รหัสจากลิงก์ออเดอร์",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary-btn full",
							children: "ค้นหาออเดอร์"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					href: "/",
					className: "text-btn",
					children: "← กลับไปหน้าร้าน"
				})
			]
		})]
	});
}
//#endregion
export { TrackLookupPage as default };
