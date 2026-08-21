import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ageFromDob } from "./utils-D6GH5reL.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { a as POSITIONS, n as FEET, r as LEVELS, t as COUNTRIES, u as labeled } from "./football-Bg2Gurrr.mjs";
import { n as PlayerPhoto, t as PitchMark } from "./pitch-mark-DUe--7pM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/player-card-Dx1D4GHB.js
var import_jsx_runtime = require_jsx_runtime();
function PlayerCard({ player }) {
	const { locale, t } = useI18n();
	const age = ageFromDob(player.dob);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/players/$id",
		params: { id: String(player.id) },
		className: "group block overflow-hidden rounded-xl border border-border bg-card transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[3/4] overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerPhoto, {
						url: player.photoUrl,
						first: player.firstName,
						last: player.lastName,
						className: "h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute start-2 top-2 flex flex-col items-start gap-1",
						children: [player.country && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md border border-border bg-background/80 px-1.5 py-0.5 font-mono text-xs text-muted-foreground",
							children: player.country
						}), player.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-primary px-1.5 py-0.5 text-xs text-primary-foreground",
							children: t("featured.badge")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 bg-background/85 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-xl leading-none text-foreground",
							children: [
								player.firstName,
								" ",
								player.lastName
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [labeled(POSITIONS, player.primaryPosition, locale), player.country ? ` · ${labeled(COUNTRIES, player.country, locale)}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute end-2 top-2 w-10 opacity-90",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchMark, { position: player.primaryPosition })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2 p-3 text-center text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tabular-nums text-sm text-foreground",
						children: age ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("player.age") })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tabular-nums text-sm text-foreground",
						children: player.heightCm ? `${player.heightCm}` : "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("common.cm") })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-foreground",
						children: labeled(FEET, player.preferredFoot, locale)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("player.foot") })] })
				]
			}),
			(player.playingLevel || player.currentClub) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-3 py-2 text-xs text-muted-foreground",
				children: [player.playingLevel ? labeled(LEVELS, player.playingLevel, locale) : "", player.currentClub ? ` · ${player.currentClub}` : ""]
			})
		]
	});
}
//#endregion
export { PlayerCard as t };
