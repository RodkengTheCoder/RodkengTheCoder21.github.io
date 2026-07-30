import { b as require_react, t as require_jsx_runtime, w as __toESM } from "../index.js";
import { t as Link } from "./link-BbQ5oRvQ.js";
//#region app/admin/admin-app.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var statusText = {
	received: "รับออเดอร์",
	cooking: "กำลังทำ",
	ready: "พร้อมรับ",
	delivered: "ส่งมอบแล้ว",
	cancelled: "ยกเลิก"
};
var money = new Intl.NumberFormat("th-TH", {
	style: "currency",
	currency: "THB",
	maximumFractionDigits: 0
});
async function api(url, options) {
	const response = await fetch(url, options);
	const data = await response.json();
	if (!response.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
	return data;
}
function AdminApp() {
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [authenticated, setAuthenticated] = (0, import_react.useState)(false);
	const [localDemo, setLocalDemo] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [menus, setMenus] = (0, import_react.useState)([]);
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)("");
	const [lastSync, setLastSync] = (0, import_react.useState)(null);
	const checkSession = (0, import_react.useCallback)(async () => {
		try {
			const result = await api("/api/admin/session");
			setAuthenticated(result.authenticated);
			setLocalDemo(result.localDemo);
		} finally {
			setChecking(false);
		}
	}, []);
	const loadDashboard = (0, import_react.useCallback)(async (quiet = false) => {
		if (!authenticated) return;
		if (!quiet) setBusy("loading");
		try {
			const [orderData, menuData, summaryData] = await Promise.all([
				api("/api/admin/orders?scope=active"),
				api("/api/menu"),
				api("/api/admin/summary")
			]);
			setOrders(orderData.orders);
			setMenus(menuData.menus);
			setSummary(summaryData);
			setLastSync(/* @__PURE__ */ new Date());
			setError("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
		} finally {
			setBusy("");
		}
	}, [authenticated]);
	(0, import_react.useEffect)(() => {
		checkSession();
	}, [checkSession]);
	(0, import_react.useEffect)(() => {
		if (!authenticated) return;
		loadDashboard();
		const timer = window.setInterval(() => loadDashboard(true), 5e3);
		return () => window.clearInterval(timer);
	}, [authenticated, loadDashboard]);
	async function login(event) {
		event.preventDefault();
		setBusy("login");
		setError("");
		const form = new FormData(event.currentTarget);
		try {
			await api("/api/admin/login", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pin: form.get("pin") })
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
	async function changeStatus(id, status) {
		setBusy(id);
		try {
			await api(`/api/admin/orders/${id}`, {
				method: "PATCH",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ status })
			});
			setOrders((current) => current.map((order) => order.id === id ? {
				...order,
				status
			} : order).filter((order) => !["delivered", "cancelled"].includes(order.status)));
			await loadDashboard(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "เปลี่ยนสถานะไม่สำเร็จ");
		} finally {
			setBusy("");
		}
	}
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-login",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner" })
	});
	if (!authenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-login",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			href: "/",
			className: "brand",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "brand-mark",
				children: "ไก่"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ไก่เฮงเฮง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Restaurant OS" })] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: login,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-lock",
					children: "⌁"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: "พื้นที่สำหรับร้านค้า"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "เข้าสู่ระบบหลังบ้าน" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "จัดการออเดอร์ คิว เมนู และยอดขายอย่างปลอดภัย" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["รหัส PIN แอดมิน", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "pin",
					type: "password",
					inputMode: "numeric",
					autoComplete: "current-password",
					required: true,
					maxLength: 20,
					placeholder: "••••",
					autoFocus: true
				})] }),
				localDemo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "demo-hint",
					children: ["โหมดทดลองบนเครื่องนี้: PIN ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "2468" })]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "notice error",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "primary-btn full",
					disabled: busy === "login",
					children: busy === "login" ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					href: "/",
					className: "text-btn",
					children: "← กลับหน้าร้าน"
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-shell",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "admin-sidebar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand admin-brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brand-mark",
						children: "ไก่"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ไก่เฮงเฮง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Restaurant OS" })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: tab === "overview" ? "active" : "",
						onClick: () => setTab("overview"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⌂" }), " ภาพรวม"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: tab === "orders" ? "active" : "",
						onClick: () => setTab("orders"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "▤" }),
							" ออเดอร์สด ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: orders.length })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: tab === "menus" ? "active" : "",
						onClick: () => setTab("menus"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◫" }), " จัดการเมนู"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: tab === "history" ? "active" : "",
						onClick: () => setTab("history"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◷" }), " ประวัติการขาย"]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sidebar-bottom",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/",
						target: "_blank",
						children: "↗ ดูหน้าร้าน"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: logout,
						children: "ออกจากระบบ"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-main",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "admin-topbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tab === "overview" ? "สวัสดีตอนเช้า" : tab === "orders" ? "ออเดอร์สด" : tab === "menus" ? "จัดการเมนู" : "ประวัติการขาย" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tab === "overview" ? "นี่คือภาพรวมร้านของคุณวันนี้" : "ข้อมูลจากฐานข้อมูลกลางของร้าน" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sync-status",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							" สด ",
							lastSync && `· ${lastSync.toLocaleTimeString("th-TH", {
								hour: "2-digit",
								minute: "2-digit"
							})}`
						]
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setError(""),
						children: "×"
					})]
				}),
				busy === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-loading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner" })
				}) : tab === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {
					summary,
					orders,
					onOpenOrders: () => setTab("orders")
				}) : tab === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveOrders, {
					orders,
					busy,
					onStatus: changeStatus
				}) : tab === "menus" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuManager, {
					menus,
					setMenus,
					setError
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderHistory, { setError })
			]
		})]
	});
}
function Overview({ summary, orders, onOpenOrders }) {
	if (!summary) return null;
	const count = (status) => Number(summary.statuses.find((item) => item.status === status)?.count ?? 0);
	const maxSales = Math.max(1, ...summary.daily.map((item) => Number(item.sales)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "metric-card featured",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ยอดขายวันนี้" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(summary.today.sales) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [summary.today.orders, " ออเดอร์ที่ไม่ถูกยกเลิก"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "฿" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "metric-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ยอดขายเดือนนี้" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(summary.month.sales) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [summary.month.orders, " ออเดอร์"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "↗" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "metric-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "กำลังรอดำเนินการ" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: count("received") + count("cooking") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								"รับแล้ว ",
								count("received"),
								" · กำลังทำ ",
								count("cooking")
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "◷" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "metric-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "พร้อมรับ" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: count("ready") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "รอลูกค้ามารับอาหาร" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "✓" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "dashboard-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "chart-panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ยอดขาย 7 วัน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "แนวโน้มรายวัน" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "บาท" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bar-chart",
						children: summary.daily.length ? summary.daily.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bar-slot",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bar-value",
									children: money.format(day.sales)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { height: `${Math.max(8, Number(day.sales) / maxSales * 100)}%` } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: (/* @__PURE__ */ new Date(`${day.date}T00:00:00`)).toLocaleDateString("th-TH", { weekday: "short" }) })
							]
						}, day.date)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "empty-mini",
							children: "เมื่อมีออเดอร์ กราฟยอดขายจะปรากฏที่นี่"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "top-menu-panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "panel-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "เดือนนี้" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "เมนูขายดี" })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ranking-list",
						children: summary.topMenus.length ? summary.topMenus.map((menu, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: menu.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [menu.quantity, " จาน"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: money.format(menu.sales) })
						] }, menu.name)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "empty-mini",
							children: "ยังไม่มีข้อมูลยอดขาย"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "recent-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "กำลังดำเนินการ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "ออเดอร์ล่าสุด" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onOpenOrders,
						children: "ดูทั้งหมด →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "compact-orders",
					children: [orders.slice(0, 5).map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["A", String(order.queueNo).padStart(2, "0")] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: order.customerName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: order.items.map((item) => `${item.quantity}× ${item.menuName}`).join(", ") })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: `status-chip ${order.status}`,
							children: statusText[order.status]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(order.total) })
					] }, order.id)), !orders.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "empty-mini",
						children: "ยังไม่มีออเดอร์ที่กำลังดำเนินการ"
					})]
				})]
			})
		]
	});
}
function LiveOrders({ orders, busy, onStatus }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-content",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "orders-toolbar",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "live-badge",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " อัปเดตอัตโนมัติทุก 5 วินาที"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"ออเดอร์วันนี้ที่ยังไม่เสร็จ ",
				orders.length,
				" รายการ"
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "kanban",
			children: [
				{
					status: "received",
					label: "รับออเดอร์",
					hint: "รอครัวรับไปทำ"
				},
				{
					status: "cooking",
					label: "กำลังทำ",
					hint: "อยู่ในครัว"
				},
				{
					status: "ready",
					label: "พร้อมรับ",
					hint: "รอลูกค้ามารับ"
				}
			].map((column) => {
				const rows = orders.filter((order) => order.status === column.status).sort((a, b) => a.queueNo - b.queueNo);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: `order-column ${column.status}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: column.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: column.hint })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rows.length })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "order-column-body",
						children: [rows.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "order-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "order-card-top",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["A", String(order.queueNo).padStart(2, "0")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [new Date(order.createdAt).toLocaleTimeString("th-TH", {
										hour: "2-digit",
										minute: "2-digit"
									}), " น."] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: order.customerName }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.phone || (order.pickupType === "dinein" ? "ทานที่ร้าน" : "รับกลับบ้าน") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "order-items",
									children: order.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.quantity, "×"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.menuName })] }, `${item.menuName}-${index}`))
								}),
								order.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "order-note",
									children: ["หมายเหตุ: ", order.note]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "order-card-total",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "รวม" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money.format(order.total) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "order-actions",
									children: [
										order.status === "received" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: busy === order.id,
											onClick: () => onStatus(order.id, "cooking"),
											children: "รับออเดอร์ · เริ่มทำ →"
										}),
										order.status === "cooking" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: busy === order.id,
											onClick: () => onStatus(order.id, "ready"),
											children: "ทำเสร็จ · พร้อมรับ →"
										}),
										order.status === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: busy === order.id,
											onClick: () => onStatus(order.id, "delivered"),
											children: "✓ ส่งมอบแล้ว"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "cancel-order",
											disabled: busy === order.id,
											onClick: () => {
												if (window.confirm(`ยืนยันยกเลิกคิว A${String(order.queueNo).padStart(2, "0")}?`)) onStatus(order.id, "cancelled");
											},
											children: "ยกเลิก"
										})
									]
								})
							]
						}, order.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "empty-column",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ไม่มีออเดอร์ในขั้นตอนนี้" })]
						})]
					})]
				}, column.status);
			})
		})]
	});
}
function MenuManager({ menus, setMenus, setError }) {
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)("");
	async function refresh() {
		setMenus((await api("/api/menu")).menus);
	}
	async function toggle(menu) {
		setBusy(menu.id);
		try {
			await api(`/api/menu/${menu.id}`, {
				method: "PATCH",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ isAvailable: !Boolean(menu.isAvailable) })
			});
			await refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
		} finally {
			setBusy("");
		}
	}
	async function remove(menu) {
		if (!window.confirm(`ลบเมนู “${menu.name}” ออกจากระบบ?`)) return;
		setBusy(menu.id);
		try {
			await api(`/api/menu/${menu.id}`, { method: "DELETE" });
			await refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
		} finally {
			setBusy("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "menu-toolbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "เมนูทั้งหมด" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "แก้ชื่อ ราคา รายละเอียด รูปภาพ และเปิด–ปิดการขายได้เอง" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "primary-btn",
					onClick: () => setAdding(true),
					children: "＋ เพิ่มเมนูใหม่"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "admin-menu-grid",
				children: menus.map((menu) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `admin-menu-card ${!Boolean(menu.isAvailable) ? "unavailable" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-menu-image",
							children: [menu.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: menu.imageUrl,
								alt: menu.name
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: menu.name.includes("ทอด") ? "🍗" : "🍚" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: Boolean(menu.isAvailable) ? "เปิดขาย" : "ปิดขาย" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-menu-body",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: menu.name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: menu.description || "ยังไม่มีคำอธิบาย" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(menu.price) })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-menu-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditing(menu),
									children: "แก้ไข"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: busy === menu.id,
									onClick: () => toggle(menu),
									children: Boolean(menu.isAvailable) ? "ปิดขาย" : "เปิดขาย"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "danger-link",
									onClick: () => remove(menu),
									children: "ลบ"
								})
							]
						})
					]
				}, menu.id))
			}),
			(editing || adding) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuEditor, {
				menu: editing,
				onClose: () => {
					setEditing(null);
					setAdding(false);
				},
				onSaved: async () => {
					await refresh();
					setEditing(null);
					setAdding(false);
				},
				setError
			})
		]
	});
}
function MenuEditor({ menu, onClose, onSaved, setError }) {
	const [imageUrl, setImageUrl] = (0, import_react.useState)(menu?.imageUrl ?? "");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function upload(file) {
		setUploading(true);
		try {
			const form = new FormData();
			form.append("file", file);
			setImageUrl((await api("/api/admin/upload", {
				method: "POST",
				body: form
			})).url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
		} finally {
			setUploading(false);
		}
	}
	async function save(event) {
		event.preventDefault();
		setSaving(true);
		const form = new FormData(event.currentTarget);
		const payload = {
			name: form.get("name"),
			description: form.get("description"),
			price: Number(form.get("price")),
			imageUrl: imageUrl || null,
			sortOrder: Number(form.get("sortOrder")) || 0,
			isAvailable: true
		};
		try {
			await api(menu ? `/api/menu/${menu.id}` : "/api/menu", {
				method: menu ? "PATCH" : "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload)
			});
			await onSaved();
		} catch (err) {
			setError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "modal-backdrop editor-backdrop",
		onMouseDown: (event) => {
			if (event.target === event.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "menu-editor",
			onSubmit: save,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "close-btn",
					onClick: onClose,
					children: "×"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: menu ? "แก้ไขเมนู" : "เมนูใหม่"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: menu ? menu.name : "เพิ่มเมนูอาหาร" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "image-upload",
					children: [
						imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: imageUrl,
							alt: "ตัวอย่างรูปเมนู"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "＋" }),
							" เพิ่มรูปเมนู",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "JPG, PNG, WebP · ไม่เกิน 5 MB" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/jpeg,image/png,image/webp,image/avif",
							onChange: (event) => {
								const file = event.target.files?.[0];
								if (file) upload(file);
							}
						}),
						uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "กำลังอัปโหลด…" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "editor-fields",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["ชื่อเมนู", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "name",
							defaultValue: menu?.name,
							required: true,
							maxLength: 80
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["ราคา (บาท)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "price",
							type: "number",
							min: "1",
							max: "10000",
							step: "1",
							defaultValue: menu?.price,
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "wide",
							children: ["คำอธิบาย", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "description",
								defaultValue: menu?.description,
								maxLength: 240
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["ลำดับการแสดง", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "sortOrder",
							type: "number",
							min: "0",
							max: "999",
							defaultValue: menu?.sortOrder ?? 99
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "editor-buttons",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-btn",
						onClick: onClose,
						children: "ยกเลิก"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-btn",
						disabled: saving || uploading,
						children: saving ? "กำลังบันทึก…" : "บันทึกเมนู"
					})]
				})
			]
		})
	});
}
function OrderHistory({ setError }) {
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [date, setDate] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const query = new URLSearchParams({ scope: "history" });
			if (date) query.set("date", date);
			if (status) query.set("status", status);
			if (search) query.set("search", search);
			setOrders((await api(`/api/admin/orders?${query}`)).orders);
		} catch (err) {
			setError(err instanceof Error ? err.message : "โหลดประวัติไม่สำเร็จ");
		} finally {
			setLoading(false);
		}
	}, [
		date,
		search,
		setError,
		status
	]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const total = (0, import_react.useMemo)(() => orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + Number(order.total), 0), [orders]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "history-filters",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["วันที่", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: date,
						onChange: (event) => setDate(event.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["สถานะ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: status,
						onChange: (event) => setStatus(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "ทุกสถานะ"
						}), Object.entries(statusText).map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value,
							children: label
						}, value))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "search-field",
						children: ["ค้นหา", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (event) => setSearch(event.target.value),
							placeholder: "ชื่อ เบอร์โทร หรือเลขคิว"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: load,
						children: "ค้นหา"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "history-summary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"พบ ",
					orders.length,
					" ออเดอร์"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["ยอดรวม ", money.format(total)] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "history-table-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "วันที่ / เวลา" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "คิว" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ลูกค้า" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "รายการ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "สถานะ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ยอดรวม" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(order.createdAt).toLocaleString("th-TH", {
							dateStyle: "short",
							timeStyle: "short"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["A", String(order.queueNo).padStart(2, "0")] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [order.customerName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: order.phone })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: order.items.map((item) => `${item.quantity}× ${item.menuName}`).join(", ") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: `status-chip ${order.status}`,
							children: statusText[order.status]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(order.total) }) })
					] }, order.id)) })] }),
					!loading && !orders.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "empty-history",
						children: "ไม่พบออเดอร์ตามเงื่อนไขที่เลือก"
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "admin-loading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner" })
					})
				]
			})
		]
	});
}
//#endregion
export { AdminApp };
