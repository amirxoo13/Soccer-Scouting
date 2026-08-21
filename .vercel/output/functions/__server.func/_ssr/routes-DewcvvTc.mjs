import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./utils-D6GH5reL.mjs";
import { t as PLANS } from "./plans-C5YhbBM0.mjs";
import { a as getAccess } from "./billing-CF5MKqf_.mjs";
import { i as ShieldCheck, l as Check, s as Lock, u as ArrowRight } from "../_libs/lucide-react.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { t as PageShell } from "./page-shell-CxYFDWwf.mjs";
import { t as Skeleton } from "./skeleton-6tIUPdsb.mjs";
import { a as POSITIONS, l as WIDE_PITCH_COORDS, o as REGIONS, t as COUNTRIES, u as labeled } from "./football-Bg2Gurrr.mjs";
import { t as PlayerCard } from "./player-card-Dx1D4GHB.mjs";
import { t as BlurredCard } from "./blurred-card-Dm3wZNIU.mjs";
import { r as searchPlayers, t as Paywall } from "./public-BBLNnq-h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DewcvvTc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CLUB_CRESTS = [
	{
		slug: "al-hilal",
		name: "Al Hilal",
		country: "SA"
	},
	{
		slug: "al-nassr",
		name: "Al Nassr",
		country: "SA"
	},
	{
		slug: "al-ahli-jeddah",
		name: "Al Ahli",
		country: "SA"
	},
	{
		slug: "al-sadd",
		name: "Al Sadd",
		country: "QA"
	},
	{
		slug: "al-duhail",
		name: "Al Duhail",
		country: "QA"
	},
	{
		slug: "al-rayyan",
		name: "Al Rayyan",
		country: "QA"
	},
	{
		slug: "al-wasl",
		name: "Al Wasl",
		country: "AE"
	},
	{
		slug: "al-ain",
		name: "Al Ain",
		country: "AE"
	},
	{
		slug: "shabab-al-ahli",
		name: "Shabab Al Ahli",
		country: "AE"
	},
	{
		slug: "persepolis",
		name: "Persepolis",
		country: "IR"
	},
	{
		slug: "esteghlal",
		name: "Esteghlal",
		country: "IR"
	},
	{
		slug: "sepahan",
		name: "Sepahan",
		country: "IR"
	},
	{
		slug: "foolad",
		name: "Foolad",
		country: "IR"
	},
	{
		slug: "urawa-reds",
		name: "Urawa Reds",
		country: "JP"
	},
	{
		slug: "kashima",
		name: "Kashima Antlers",
		country: "JP"
	},
	{
		slug: "kawasaki",
		name: "Kawasaki Frontale",
		country: "JP"
	},
	{
		slug: "gamba-osaka",
		name: "Gamba Osaka",
		country: "JP"
	},
	{
		slug: "vissel-kobe",
		name: "Vissel Kobe",
		country: "JP"
	},
	{
		slug: "yokohama",
		name: "Yokohama F. Marinos",
		country: "JP"
	},
	{
		slug: "jeonbuk",
		name: "Jeonbuk Hyundai",
		country: "KR"
	},
	{
		slug: "ulsan",
		name: "Ulsan HD",
		country: "KR"
	},
	{
		slug: "fc-seoul",
		name: "FC Seoul",
		country: "KR"
	},
	{
		slug: "pohang",
		name: "Pohang Steelers",
		country: "KR"
	},
	{
		slug: "shanghai-port",
		name: "Shanghai Port",
		country: "CN"
	},
	{
		slug: "shandong",
		name: "Shandong Taishan",
		country: "CN"
	},
	{
		slug: "beijing-guoan",
		name: "Beijing Guoan",
		country: "CN"
	},
	{
		slug: "pakhtakor",
		name: "Pakhtakor",
		country: "UZ"
	},
	{
		slug: "nasaf",
		name: "Nasaf",
		country: "UZ"
	},
	{
		slug: "buriram-united",
		name: "Buriram United",
		country: "TH"
	},
	{
		slug: "bg-pathum",
		name: "BG Pathum United",
		country: "TH"
	},
	{
		slug: "johor-dt",
		name: "Johor DT",
		country: "MY"
	},
	{
		slug: "lion-city",
		name: "Lion City Sailors",
		country: "SG"
	},
	{
		slug: "melbourne-victory",
		name: "Melbourne Victory",
		country: "AU"
	},
	{
		slug: "sydney-fc",
		name: "Sydney FC",
		country: "AU"
	},
	{
		slug: "mumbai-city",
		name: "Mumbai City",
		country: "IN"
	},
	{
		slug: "persija",
		name: "Persija Jakarta",
		country: "ID"
	},
	{
		slug: "kuwait-sc",
		name: "Kuwait SC",
		country: "KW"
	}
];
function clubCrestSrc(slug) {
	return `/clubs/${slug}.png`;
}
function ClubCrest({ club, size = 40, className }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const src = clubCrestSrc(club.slug);
	if (!failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: club.name,
		width: size,
		height: size,
		className: cn("shrink-0 object-contain", className),
		style: {
			width: size,
			height: size
		},
		onError: () => setFailed(true)
	});
	const short = "short" in club && club.short ? club.short : club.name.slice(0, 3).toUpperCase();
	const a = "colorA" in club && club.colorA ? club.colorA : "#1c3d32";
	const b = "colorB" in club && club.colorB ? club.colorB : "#c5d0c8";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 40 40",
		width: size,
		height: size,
		className: cn("shrink-0", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "20,2 37,11 37,29 20,38 3,29 3,11",
				fill: a
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "20,7 32,14 32,26 20,33 8,26 8,14",
				fill: b,
				opacity: "0.28"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "20",
				y: "23.5",
				textAnchor: "middle",
				fill: "#ffffff",
				fontSize: "8",
				fontWeight: "700",
				fontFamily: "ui-sans-serif, system-ui, sans-serif",
				children: short
			})
		]
	});
}
function Row({ clubs, track }) {
	const loop = [...clubs, ...clubs];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `marquee-track marquee-track-${track} flex w-max items-center gap-10 px-6 py-3`,
			children: loop.map((club, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClubCrest, {
					club,
					size: 44
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "whitespace-nowrap text-sm font-medium text-foreground/90",
					children: club.name
				})]
			}, `${club.slug}-${i}`))
		})
	});
}
function ClubMarquee() {
	const { t } = useI18n();
	const rows = [
		0,
		1,
		2
	].map((r) => CLUB_CRESTS.filter((_, i) => i % 3 === r));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border bg-card/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 pt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-muted-foreground",
				children: t("clubs.kicker")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: t("clubs.trusted")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-0 pb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					clubs: rows[0],
					track: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					clubs: rows[1],
					track: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					clubs: rows[2],
					track: 3
				})
			]
		})]
	});
}
function PitchExplorer() {
	const { locale, t } = useI18n();
	const [position, setPosition] = (0, import_react.useState)(null);
	const access = useQuery({
		queryKey: ["access"],
		queryFn: () => getAccess()
	});
	const results = useQuery({
		queryKey: ["pitch-search", position],
		queryFn: () => searchPlayers({ data: { position: position ?? void 0 } }),
		enabled: Boolean(position)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-xl border border-border bg-card p-3 md:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 100 68",
						className: "pointer-events-none w-full text-pitch",
						"aria-hidden": true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "1.5",
								y: "1.5",
								width: "97",
								height: "65",
								rx: "2",
								fill: "#0e1411",
								stroke: "currentColor",
								strokeWidth: "0.6"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: "50",
								y1: "1.5",
								x2: "50",
								y2: "66.5",
								stroke: "currentColor",
								strokeWidth: "0.35"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "50",
								cy: "34",
								r: "9",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "0.35"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "50",
								cy: "34",
								r: "0.7",
								fill: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "1.5",
								y: "20",
								width: "14",
								height: "28",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "0.35"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "1.5",
								y: "26",
								width: "6",
								height: "16",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "0.35"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "84.5",
								y: "20",
								width: "14",
								height: "28",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "0.35"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "92.5",
								y: "26",
								width: "6",
								height: "16",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "0.35"
							})
						]
					}), POSITIONS.map((p) => {
						const c = WIDE_PITCH_COORDS[p.id];
						if (!c) return null;
						const active = position === p.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
							style: {
								left: `${c.x}%`,
								top: `${c.y}%`
							},
							title: labeled(POSITIONS, p.id, locale),
							onClick: () => setPosition(p.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid size-7 place-items-center rounded-full border font-mono text-xs font-medium shadow-sm transition-[transform,background-color] duration-150 md:size-8 ${active ? "border-primary bg-primary text-primary-foreground" : "border-primary/40 bg-background text-foreground group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"}`,
								children: p.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute top-full z-10 mt-1 hidden whitespace-nowrap rounded-md bg-background/90 px-1.5 py-0.5 text-xs text-muted-foreground group-hover:md:block",
								children: labeled(POSITIONS, p.id, locale)
							})]
						}, p.id);
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-primary",
				children: t("positions.hint")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: POSITIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPosition(p.id),
					className: `inline-flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors duration-150 ${position === p.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-primary",
						children: p.id
					}), labeled(POSITIONS, p.id, locale)]
				}, p.id))
			})] })]
		}), position && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						labeled(POSITIONS, position, locale),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-border",
							children: "·"
						}),
						t("positions.locked")
					]
				}),
				results.data && results.data.access === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paywall, { loggedIn: Boolean(access.data?.loggedIn) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
					children: [
						results.isPending && Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[3/4] rounded-xl" }, i)),
						results.data?.access === true && results.data.players.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, { player: p }, p.id)),
						results.data?.access === false && results.data.players.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlurredCard, { player: p }, p.id))
					]
				})
			]
		})]
	});
}
var FEATURES = {
	youth: 4,
	player_u24: 4,
	player_senior: 4,
	desk: 5
};
function PricingGrid({ highlight }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
		children: PLANS.map((plan) => {
			const featured = plan.id === (highlight ?? "desk");
			const count = FEATURES[plan.id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: `flex flex-col rounded-xl border bg-card p-5 ${featured ? "border-primary/50" : "border-border"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.16em] text-muted-foreground",
						children: t(`plans.${plan.id}.kicker`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display mt-3 text-2xl",
						children: t(`plans.${plan.id}.title`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 flex items-baseline gap-1",
						children: plan.usd === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-4xl",
							children: t("plans.free")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-4xl tabular-nums",
							children: ["$", plan.usd]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: t("plans.year")
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
						children: t(`plans.${plan.id}.body`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 space-y-2 text-sm",
						children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(`plans.${plan.id}.f${i + 1}`) })]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6 w-full",
						variant: featured ? "default" : "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: plan.id === "youth" ? "/login" : "/app/wallet",
							search: plan.id === "youth" ? { next: "/app/profile" } : { plan: plan.id },
							children: plan.usd === 0 ? t("plans.ctaYouth") : t("plans.ctaPay")
						})
					})
				]
			}, plan.id);
		})
	});
}
function Home() {
	const { t, locale } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-h-svh overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/hero.jpg",
					alt: "",
					className: "hero-image absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background/75 via-background/20 to-transparent rtl:bg-gradient-to-l" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-4 pb-24 pt-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tracking-wide text-primary",
							children: t("hero.slogan")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 inline-flex max-w-full items-center gap-2 self-start rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex size-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-primary" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate",
								children: [
									t("hero.live"),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-1.5 text-border",
										children: "·"
									}),
									t("hero.kicker")
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display mt-5 max-w-4xl text-4xl leading-none text-foreground md:text-6xl lg:text-7xl",
							children: t("hero.title")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base",
							children: t("hero.body")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: t("hero.ctaPlayer")
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "lg",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									search: { next: "/app/wallet?plan=desk" },
									children: t("hero.ctaScout")
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-lg text-xs leading-relaxed text-muted-foreground",
							children: t("hero.trust")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4",
							children: [
								["fact1k", "fact1v"],
								["fact2k", "fact2v"],
								["fact3k", "fact3v"],
								["fact4k", "fact4v"]
							].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-background/85 px-4 py-4 backdrop-blur-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "font-display text-2xl md:text-3xl",
									children: t(`hero.${k}`)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 text-xs text-muted-foreground",
									children: t(`hero.${v}`)
								})]
							}, k))
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClubMarquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "method",
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/editorial/training.jpg",
						alt: "",
						className: "aspect-[4/5] w-full object-cover md:aspect-[5/4]"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-primary",
						children: t("method.kicker")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-3xl md:text-5xl",
						children: t("method.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground md:text-base",
						children: t("method.subtitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-8 space-y-5",
						children: [
							1,
							2,
							3,
							4
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid grid-cols-[auto_1fr] gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-sm tracking-widest text-primary",
								children: ["0", n]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-medium",
								children: t(`method.s${n}t`)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted-foreground",
								children: t(`method.s${n}b`)
							})] })]
						}, n))
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-primary",
								children: t("player.sample")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display mt-3 text-3xl md:text-5xl",
								children: t("player.facts")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground md:text-base",
								children: t("method.s1b")
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							children: [t("hero.ctaScout"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ms-2 size-4" })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 overflow-hidden rounded-xl border border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-stretch lg:grid-cols-[220px_1fr_220px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/editorial/tunnel.jpg",
									alt: "",
									className: "h-full min-h-64 w-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 grid place-items-center bg-background/40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-8 text-primary" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-border p-6 md:p-8 lg:border-s",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: t("paywall.sealed")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display mt-2 text-3xl md:text-4xl",
										children: "— —"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
										className: "mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm",
										children: [
											["player.dateOfBirth", "—"],
											["player.placeOfBirth", "—"],
											["player.citizenship", "—"],
											["player.height", "1,84 m"],
											["player.position", "ST"],
											["player.foot", "—"],
											["player.club", "—"],
											["player.marketValue", "€ —"]
										].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between gap-3 border-b border-border py-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: t(k)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-medium tabular-nums",
												children: v
											})]
										}, k))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between border-t border-border p-6 lg:border-s lg:border-t-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: t("player.currentValue")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display mt-2 text-4xl text-primary",
									children: "€ —"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-4 shrink-0" }), t("positions.locked")]
								})]
							})
						]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "positions",
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl md:text-5xl",
						children: t("positions.title")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground md:text-base",
						children: t("positions.subtitle")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchExplorer, {})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "coverage",
			className: "mx-auto max-w-6xl px-4 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-primary",
						children: t("nav.coverage")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-3xl md:text-5xl",
						children: t("coverage.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground md:text-base",
						children: t("coverage.subtitle")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: REGIONS.map((region) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl",
							children: t(`coverage.${region.id}`)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-xs text-muted-foreground",
							children: region.countries.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: region.countries.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md border border-border px-2 py-1 text-xs text-muted-foreground",
							children: labeled(COUNTRIES, code, locale)
						}, code))
					})]
				}, region.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "plans",
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/editorial/aerial.jpg",
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover opacity-30"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-6xl px-4 py-20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-primary",
								children: t("plans.kicker")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display mt-3 max-w-3xl text-3xl md:text-5xl",
								children: t("plans.title")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-2xl text-sm text-muted-foreground md:text-base",
								children: t("plans.subtitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingGrid, {})
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col p-8 md:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-3xl",
								children: t("split.playerTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
								children: t("split.playerBody")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "mt-8 w-fit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: t("hero.ctaPlayer")
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col border-t border-border p-8 md:border-t-0 md:border-s md:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-3xl",
								children: t("split.scoutTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
								children: t("split.scoutBody")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "mt-8 w-fit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									search: { next: "/app/wallet?plan=desk" },
									children: t("hero.ctaScout")
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col border-t border-border p-8 md:border-t-0 md:border-s md:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-3xl",
								children: t("split.clubTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
								children: t("split.clubBody")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "mt-8 w-fit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#plans",
									children: t("nav.pricing")
								})
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl px-4 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl md:text-5xl",
					children: t("faq.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: [
						1,
						2,
						3,
						4,
						5
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "group border-b border-border py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium marker:content-none [&::-webkit-details-marker]:hidden",
							children: [t(`faq.q${n}`), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-transform duration-150 group-open:rotate-45",
								children: "+"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground",
							children: t(`faq.a${n}`)
						})]
					}, n))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl md:text-6xl",
						children: t("ctaBand.title")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground md:text-base",
						children: t("ctaBand.body")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full flex-col gap-3 sm:w-auto sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "w-full sm:w-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: t("hero.ctaPlayer")
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "lg",
						className: "w-full sm:w-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							search: { next: "/app/wallet?plan=desk" },
							children: t("hero.ctaScout")
						})
					})]
				})]
			})
		})
	] });
}
//#endregion
export { Home as component };
