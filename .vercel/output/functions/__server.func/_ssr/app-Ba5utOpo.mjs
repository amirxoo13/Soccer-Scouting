import { f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./utils-D6GH5reL.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { n as RedirectToSignIn, r as useCurrentUserState, t as PageShell } from "./page-shell-CxYFDWwf.mjs";
import { t as Skeleton } from "./skeleton-6tIUPdsb.mjs";
import { r as getMe } from "./me-DvIP4gK3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-Ba5utOpo.js
var import_jsx_runtime = require_jsx_runtime();
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-40" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const role = me.data?.user?.role;
	const links = [
		{
			to: "/app",
			label: t("nav.dashboard")
		},
		...role === "player" ? [{
			to: "/app/profile",
			label: t("nav.profile")
		}] : [],
		...role === "scout" || me.data?.user?.isAdmin ? [{
			to: "/app/shortlist",
			label: t("nav.shortlist")
		}] : [],
		{
			to: "/app/wallet",
			label: t("nav.wallet")
		},
		...me.data?.user?.isAdmin ? [{
			to: "/admin",
			label: t("nav.admin")
		}] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4",
			children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: l.to,
				className: cn("h-12 shrink-0 px-3 text-sm", pathname === l.to ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"),
				children: l.label
			}, l.to))
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: me.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	})] });
}
//#endregion
export { AppLayout as component };
