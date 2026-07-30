import { b as require_react, t as require_jsx_runtime, w as __toESM } from "../index.js";
import { t as Link } from "./link-BbQ5oRvQ.js";
//#region app/storefront.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var money = new Intl.NumberFormat("th-TH", {
	style: "currency",
	currency: "THB",
	maximumFractionDigits: 0
});
function FoodVisual({ menu, large = false }) {
	if (menu.imageUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `food-visual has-image ${large ? "large" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: menu.imageUrl,
			alt: menu.name,
			style: { objectPosition: menu.imagePosition }
		})
	});
	const fried = menu.name.includes("ทอด");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `food-visual ${fried ? "fried" : "boiled"} ${large ? "large" : ""}`,
		"aria-label": `ภาพจำลอง${menu.name}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "plate-shadow" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "plate",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rice",
						children: "🍚"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chicken",
						children: fried ? "🍗" : "🍗"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cucumber",
						children: "🥒"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sauce",
				children: fried ? "ซอสหวาน" : "น้ำจิ้มสูตรเด็ด"
			})
		]
	});
}
function Storefront() {
	const [menus, setMenus] = (0, import_react.useState)([]);
	const [cart, setCart] = (0, import_react.useState)({});
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const [checkout, setCheckout] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [order, setOrder] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetch("/api/menu").then(async (response) => {
			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "โหลดเมนูไม่สำเร็จ");
			setMenus(data.menus);
		}).catch((err) => setError(err.message)).finally(() => setLoading(false));
	}, []);
	const availableMenus = (0, import_react.useMemo)(() => menus.filter((menu) => Boolean(menu.isAvailable)), [menus]);
	const cartRows = (0, import_react.useMemo)(() => availableMenus.filter((menu) => cart[menu.id]).map((menu) => ({
		...menu,
		quantity: cart[menu.id],
		lineTotal: menu.price * cart[menu.id]
	})), [availableMenus, cart]);
	const cartCount = cartRows.reduce((sum, row) => sum + row.quantity, 0);
	const total = cartRows.reduce((sum, row) => sum + row.lineTotal, 0);
	function changeQuantity(id, delta) {
		setCart((current) => {
			const next = Math.max(0, Math.min(20, (current[id] ?? 0) + delta));
			return {
				...current,
				[id]: next
			};
		});
	}
	async function placeOrder(event) {
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
					items: cartRows.map((row) => ({
						menuId: row.id,
						quantity: row.quantity
					}))
				})
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "site-header",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					href: "/",
					className: "brand",
					"aria-label": "กลับหน้าหลัก",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brand-mark",
						children: "ไก่"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ไก่เฮงเฮง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ข้าวมันไก่ทุกจาน ทำด้วยใจ" })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "เมนูหลัก",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#menu",
							children: "เมนู"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#queue",
							children: "ระบบคิว"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/track",
							children: "ติดตามออเดอร์"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "cart-pill",
					onClick: () => setCartOpen(true),
					"aria-label": `ตะกร้ามี ${cartCount} รายการ`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ตะกร้า" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: cartCount })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hero",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " เปิดรับออเดอร์วันนี้ · 06:30–14:00"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"ข้าวมันไก่",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ที่คิดถึง" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ไก่นุ่ม ข้าวหอม น้ำจิ้มถึงใจ สั่งง่าย รับเลขคิวทันที และดูสถานะได้ทุกขั้นตอน" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "primary-btn",
							href: "#menu",
							children: ["เลือกเมนู ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↓" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "text-btn",
							href: "#queue",
							children: "คิวทำงานอย่างไร"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "trust-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "4.9" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "★★★★★" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "จากลูกค้าประจำ" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "divider" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "10–15 นาที" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "เวลาเตรียมโดยเฉลี่ย" })] })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-stage",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sun-stamp",
						children: [
							"สดใหม่",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ทุกเช้า" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-dish",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hero-plate" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hero-rice",
								children: "🍚"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hero-chicken",
								children: "🍗"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hero-greens",
								children: "🥒"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hero-sauce",
								children: "🌶️"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "scribble",
						children: "สูตรลับของบ้านเรา"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "promise-strip",
			"aria-label": "จุดเด่นของร้าน",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◌" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ไก่สดทุกเช้า" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "คัดไก่คุณภาพวันต่อวัน" })] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "♨" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ข้าวหอมเป็นเม็ด" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "หุงด้วยน้ำซุปไก่เข้มข้น" })] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "น้ำจิ้มตำสด" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ขิง พริก กระเทียม ไม่หวงเครื่อง" })] })] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "menu-section",
			id: "menu",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "เมนูขายดี"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "วันนี้กินอะไรดี?" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ทุกจานเสิร์ฟพร้อมแตงกวา น้ำซุปร้อน ๆ และน้ำจิ้มสูตรประจำบ้าน" })]
				}),
				error && !checkout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "notice error",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "menu-grid",
					children: [loading && [1, 2].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "menu-card loading-card" }, item)), !loading && availableMenus.map((menu, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "menu-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "menu-image-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodVisual, { menu }), index === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bestseller",
								children: "ขายดีอันดับ 1"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "menu-card-body",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: menu.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: menu.description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "menu-card-footer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(menu.price) }), cart[menu.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "qty",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => changeQuantity(menu.id, -1),
											"aria-label": `ลดจำนวน${menu.name}`,
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cart[menu.id] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => changeQuantity(menu.id, 1),
											"aria-label": `เพิ่มจำนวน${menu.name}`,
											children: "+"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "add-btn",
									onClick: () => changeQuantity(menu.id, 1),
									children: ["เพิ่ม ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "＋" })]
								})]
							})]
						})]
					}, menu.id))]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "queue-section",
			id: "queue",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "queue-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow light",
							children: "สบายใจทุกขั้นตอน"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
							"สั่งแล้ว",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"ไม่ต้องยืนรอ"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ระบบคิวเชื่อมตรงกับครัว คุณเห็นสถานะเดียวกับที่ร้านเห็น ตั้งแต่รับออเดอร์จนพร้อมรับ" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "queue-steps",
					children: [
						[
							"01",
							"เลือกเมนู",
							"เลือกจานโปรดและจำนวนที่ต้องการ"
						],
						[
							"02",
							"รับเลขคิว",
							"ระบบออกคิวให้ทันทีหลังยืนยัน"
						],
						[
							"03",
							"ดูสถานะสด",
							"ติดตาม รับออเดอร์ → กำลังทำ → พร้อมรับ"
						]
					].map(([no, title, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "queue-step",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: no }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: text })] })]
					}, no))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "queue-ticket-demo",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "คิวของคุณ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "A12" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "กำลังทำ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ก่อนหน้าคุณ 2 คิว" })] })] })
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "brand footer-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "brand-mark",
					children: "ไก่"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ไก่เฮงเฮง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "อิ่มอร่อย อุ่นใจทุกคิว" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "เปิดทุกวัน 06:30–14:00 · โทร 02-000-0000" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/admin",
				children: "สำหรับร้านค้า"
			})
		] }),
		cartCount > 0 && !cartOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "floating-cart",
			onClick: () => setCartOpen(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [cartCount, " รายการ"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ดูตะกร้า" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [money.format(total), " →"] })]
		}),
		(cartOpen || checkout) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onMouseDown: (event) => {
				if (event.currentTarget === event.target) {
					setCartOpen(false);
					setCheckout(false);
				}
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "cart-drawer",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": checkout ? "ยืนยันออเดอร์" : "ตะกร้า",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "close-btn",
					onClick: () => {
						setCartOpen(false);
						setCheckout(false);
					},
					"aria-label": "ปิด",
					children: "×"
				}), order ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "order-success",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "success-check",
							children: "✓"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "รับออเดอร์แล้ว"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["คิว A", String(order.queueNo).padStart(2, "0")] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ครัวได้รับรายการของคุณแล้ว เก็บหน้านี้ไว้เพื่อติดตามสถานะ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "primary-btn full",
							href: order.trackingUrl,
							children: "ดูสถานะคิวของฉัน"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-btn",
							onClick: () => {
								setOrder(null);
								setCartOpen(false);
								setCheckout(false);
							},
							children: "กลับหน้าร้าน"
						})
					]
				}) : checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "checkout-form",
					onSubmit: placeOrder,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow",
							children: "ขั้นตอนสุดท้าย"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "ข้อมูลรับอาหาร" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["ชื่อผู้รับอาหาร", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "customerName",
							required: true,
							maxLength: 80,
							placeholder: "เช่น คุณสมชาย"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
							"เบอร์โทรศัพท์ ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "(ไม่บังคับ)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "phone",
								inputMode: "tel",
								maxLength: 24,
								placeholder: "08x-xxx-xxxx"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "รับอาหารแบบไหน" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "radio-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "pickupType",
									value: "pickup",
									defaultChecked: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "รับกลับบ้าน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "รับที่เคาน์เตอร์" })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "radio-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "pickupType",
									value: "dinein"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ทานที่ร้าน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "แจ้งโต๊ะเมื่อมาถึง" })] })]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
							"หมายเหตุถึงครัว ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "(ไม่บังคับ)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "note",
								maxLength: 300,
								placeholder: "เช่น ไม่เอาหนัง ขอซอสเพิ่ม"
							})
						] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "notice error",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "checkout-total",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ยอดชำระที่ร้าน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(total) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary-btn full",
							disabled: submitting,
							children: submitting ? "กำลังส่งออเดอร์…" : "ยืนยันออเดอร์และรับคิว"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-btn",
							onClick: () => {
								setCheckout(false);
								setCartOpen(true);
							},
							children: "← กลับไปแก้ตะกร้า"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "ออเดอร์ของคุณ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "ตะกร้า" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cart-list",
						children: cartRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cart-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodVisual, { menu: row }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: row.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [money.format(row.price), " / จาน"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "qty",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => changeQuantity(row.id, -1),
												children: "−"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.quantity }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => changeQuantity(row.id, 1),
												children: "+"
											})
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(row.lineTotal) })
							]
						}, row.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cart-summary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "รวมทั้งหมด" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money.format(total) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-btn full",
						onClick: () => {
							setCartOpen(false);
							setCheckout(true);
						},
						children: "ไปยืนยันออเดอร์ →"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "secure-note",
						children: "ชำระเงินที่หน้าร้าน · ราคาและคิวจะยืนยันหลังส่งออเดอร์"
					})
				] })]
			})
		})
	] });
}
//#endregion
export { Storefront };
