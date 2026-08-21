import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Textarea } from "./textarea-BvR3MxFv.mjs";
import { s as SHORTLIST_STATUSES } from "./football-Bg2Gurrr.mjs";
import { t as PlayerCard } from "./player-card-Dx1D4GHB.mjs";
import { a as updateWatchItem, n as listWatchlist } from "./scout-BJTjTagO.mjs";
import { t as Field } from "./field-DL4pxiur.mjs";
import { t as Select } from "./select-Clmy6nRx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.shortlist-C5fxCcbs.js
var import_jsx_runtime = require_jsx_runtime();
function ShortlistPage() {
	const { t, locale } = useI18n();
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["watch"],
		queryFn: () => listWatchlist()
	});
	const update = useMutation({
		mutationFn: (input) => updateWatchItem({ data: input }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["watch"] })
	});
	if (list.data && list.data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("scout.emptyList")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/discover",
			className: "mt-4 inline-block text-sm text-primary",
			children: t("nav.discover")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: t("nav.shortlist")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6",
			children: list.data?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-[220px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, { player: item.player }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("dash.status"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: item.status,
							onChange: (e) => update.mutate({
								id: item.id,
								status: e.target.value
							}),
							children: SHORTLIST_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: s[locale]
							}, s.id))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("scout.notes"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							defaultValue: item.notes ?? "",
							onBlur: (e) => update.mutate({
								id: item.id,
								notes: e.target.value
							})
						})
					})]
				})]
			}, item.id))
		})]
	});
}
//#endregion
export { ShortlistPage as component };
