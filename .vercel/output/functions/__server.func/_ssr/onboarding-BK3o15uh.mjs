import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Navigate, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./utils-D6GH5reL.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { n as RedirectToSignIn, r as useCurrentUserState, t as PageShell } from "./page-shell-CxYFDWwf.mjs";
import { t as Skeleton } from "./skeleton-6tIUPdsb.mjs";
import { n as completeOnboarding, r as getMe, t as claimAdmin } from "./me-DvIP4gK3.mjs";
import { t as Field } from "./field-DL4pxiur.mjs";
import { t as Input } from "./input-CTJ5Pcod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-BK3o15uh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { t } = useI18n();
	const nav = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [hasUser, setHasUser] = (0, import_react.useState)(false);
	const [adminCount, setAdminCount] = (0, import_react.useState)(0);
	const [role, setRole] = (0, import_react.useState)("player");
	const [orgName, setOrgName] = (0, import_react.useState)("");
	const [orgRole, setOrgRole] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		getMe().then((me) => {
			setHasUser(Boolean(me.user));
			setAdminCount(me.adminCount);
			setReady(true);
		}).catch(() => setReady(true));
	}, [isPending, user]);
	if (isPending || user && !ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-40 w-full" })]
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (hasUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	const displayName = user.displayName ?? void 0;
	async function submit() {
		setBusy(true);
		try {
			await completeOnboarding({ data: {
				role,
				displayName,
				orgName: role === "scout" ? orgName : void 0,
				orgRole: role === "scout" ? orgRole : void 0
			} });
			nav({ to: "/app" });
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: t("onboarding.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: t("onboarding.subtitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-3",
				children: ["player", "scout"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setRole(r),
					className: cn("rounded-xl border p-5 text-start transition-colors", role === r ? "border-primary bg-muted" : "border-border bg-card"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: r === "player" ? t("onboarding.player") : t("onboarding.scout")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm text-muted-foreground",
						children: r === "player" ? t("onboarding.playerHint") : t("onboarding.scoutHint")
					})]
				}, r))
			}),
			role === "scout" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("onboarding.org"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: orgName,
						onChange: (e) => setOrgName(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t("onboarding.orgRole"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: orgRole,
						onChange: (e) => setOrgRole(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8 w-full",
				disabled: busy,
				onClick: submit,
				children: t("onboarding.continue")
			}),
			adminCount === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 w-full text-xs text-muted-foreground hover:text-foreground",
				onClick: async () => {
					await claimAdmin();
					nav({ to: "/admin" });
				},
				children: t("onboarding.claimAdmin")
			})
		]
	}) });
}
//#endregion
export { Onboarding as component };
