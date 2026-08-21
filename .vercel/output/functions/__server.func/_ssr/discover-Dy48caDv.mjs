import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as getAccess } from "./billing-CF5MKqf_.mjs";
import { a as Route$8, s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as PageShell } from "./page-shell-CxYFDWwf.mjs";
import { t as Skeleton } from "./skeleton-6tIUPdsb.mjs";
import { a as POSITIONS, n as FEET, r as LEVELS, t as COUNTRIES } from "./football-Bg2Gurrr.mjs";
import { t as PlayerCard } from "./player-card-Dx1D4GHB.mjs";
import { t as Field } from "./field-DL4pxiur.mjs";
import { t as Input } from "./input-CTJ5Pcod.mjs";
import { t as Select } from "./select-Clmy6nRx.mjs";
import { t as BlurredCard } from "./blurred-card-Dm3wZNIU.mjs";
import { r as searchPlayers, t as Paywall } from "./public-BBLNnq-h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-Dy48caDv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Discover() {
	const { t, locale } = useI18n();
	const initial = Route$8.useSearch();
	const [q, setQ] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)(initial.country ?? "");
	const [position, setPosition] = (0, import_react.useState)(initial.position ?? "");
	const [foot, setFoot] = (0, import_react.useState)("");
	const [level, setLevel] = (0, import_react.useState)("");
	const [ageMin, setAgeMin] = (0, import_react.useState)("");
	const [ageMax, setAgeMax] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const access = useQuery({
		queryKey: ["access"],
		queryFn: () => getAccess()
	});
	const filters = (0, import_react.useMemo)(() => ({
		q: q || void 0,
		country: country || void 0,
		position: position || void 0,
		foot: foot || void 0,
		level: level || void 0,
		ageMin: ageMin ? Number(ageMin) : void 0,
		ageMax: ageMax ? Number(ageMax) : void 0,
		sort
	}), [
		q,
		country,
		position,
		foot,
		level,
		ageMin,
		ageMax,
		sort
	]);
	const results = useQuery({
		queryKey: ["search", filters],
		queryFn: () => searchPlayers({ data: filters })
	});
	const allowed = results.data?.access === true;
	const filterForm = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("discover.search"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: t("discover.search"),
					disabled: !allowed
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("discover.country"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: country,
					onChange: (e) => setCountry(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("discover.any")
					}), COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c[locale]
					}, c.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("discover.position"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: position,
					onChange: (e) => setPosition(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("discover.any")
					}), POSITIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c[locale]
					}, c.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("discover.foot"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: foot,
					onChange: (e) => setFoot(e.target.value),
					disabled: !allowed,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("discover.any")
					}), FEET.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c[locale]
					}, c.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("discover.level"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: level,
					onChange: (e) => setLevel(e.target.value),
					disabled: !allowed,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("discover.any")
					}), LEVELS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c[locale]
					}, c.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: `${t("discover.age")} min`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: ageMin,
						onChange: (e) => setAgeMin(e.target.value),
						disabled: !allowed
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: `${t("discover.age")} max`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: ageMax,
						onChange: (e) => setAgeMax(e.target.value),
						disabled: !allowed
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("discover.sort"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: sort,
					onChange: (e) => setSort(e.target.value),
					disabled: !allowed,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "newest",
						children: t("discover.newest")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "views",
						children: t("discover.views")
					})]
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl md:text-5xl",
				children: t("discover.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: t("discover.subtitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-6 h-11 rounded-md border border-border px-4 text-sm md:hidden",
				onClick: () => setFiltersOpen((v) => !v),
				children: t("discover.filters")
			}),
			filtersOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 md:hidden",
				children: filterForm
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-8 md:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden md:block",
					children: filterForm
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					!allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paywall, { loggedIn: Boolean(access.data?.loggedIn) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 text-sm text-muted-foreground",
						children: [
							results.data?.players.length ?? 0,
							" ",
							t("discover.results")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
						children: [
							results.isPending && Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[3/4] rounded-xl" }, i)),
							results.data?.access === true && results.data.players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, { player: p }, p.id)),
							results.data?.access === false && results.data.players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlurredCard, { player: p }, p.id))
						]
					}),
					results.data && results.data.players.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-16 text-center text-sm text-muted-foreground",
						children: t("discover.empty")
					})
				] })]
			})
		]
	}) });
}
//#endregion
export { Discover as component };
