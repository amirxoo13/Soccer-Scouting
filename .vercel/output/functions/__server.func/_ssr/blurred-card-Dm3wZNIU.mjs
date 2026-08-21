import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as Lock } from "../_libs/lucide-react.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { a as POSITIONS, u as labeled } from "./football-Bg2Gurrr.mjs";
import { n as PlayerPhoto } from "./pitch-mark-DUe--7pM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blurred-card-Dm3wZNIU.js
var import_jsx_runtime = require_jsx_runtime();
function BlurredCard({ player }) {
	const { locale, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-hidden rounded-xl border border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[3/4] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "talent-blur absolute inset-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerPhoto, {
						url: player.photoUrl,
						first: "—",
						last: "—",
						className: "h-full w-full"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-background/35" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-muted-foreground",
						children: t("paywall.sealed")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium",
						children: labeled(POSITIONS, player.primaryPosition, locale)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute start-2 top-2 grid size-8 place-items-center rounded-full border border-border bg-background/80",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" })
				})
			]
		})
	});
}
//#endregion
export { BlurredCard as t };
