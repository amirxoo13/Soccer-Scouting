import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as optionalAuthMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { s as Lock } from "../_libs/lucide-react.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-BBLNnq-h.js
var import_jsx_runtime = require_jsx_runtime();
function Paywall({ loggedIn }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-6 text-center md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid size-12 place-items-center rounded-full border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5 text-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-4 text-2xl md:text-3xl",
				children: t("paywall.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground",
				children: t("paywall.body")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap justify-center gap-3",
				children: loggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/wallet",
						search: { plan: "desk" },
						children: t("paywall.pay")
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						search: { next: "/app/wallet?plan=desk" },
						children: t("paywall.register")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						search: { next: "/app/wallet?plan=desk" },
						children: t("nav.signIn")
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: t("paywall.price")
			})
		]
	});
}
createServerFn({ method: "GET" }).handler(createSsrRpc("49ddd62947c4bd21872b4188e5a692caee61fdc621952ee6d10d34b1c3f5cf3c"));
var searchPlayers = createServerFn({ method: "GET" }).middleware([optionalAuthMiddleware]).validator((input) => input ?? {}).handler(createSsrRpc("598d0d6d3d1184c7279e5b711df37cfcdcef75d53d264cc0c6a2e49687728e36"));
var getPublicPlayer = createServerFn({ method: "GET" }).middleware([optionalAuthMiddleware]).validator((id) => id).handler(createSsrRpc("82054a2966513d6afc863fc6d13514ca55cc41350a89dab4f65884cbe7ffc6b3"));
//#endregion
export { getPublicPlayer as n, searchPlayers as r, Paywall as t };
