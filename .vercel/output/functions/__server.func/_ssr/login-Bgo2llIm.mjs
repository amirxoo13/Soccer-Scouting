import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as GROK_PROVIDERS } from "./server-g1L-zjb2.mjs";
import { i as Route$7, s as useI18n } from "./router-CrbPo6WY.mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { r as useCurrentUserState, t as PageShell } from "./page-shell-CxYFDWwf.mjs";
import { t as Field } from "./field-DL4pxiur.mjs";
import { t as Input } from "./input-CTJ5Pcod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Bgo2llIm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { t } = useI18n();
	const { next } = Route$7.useSearch();
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const afterAuth = next?.startsWith("/app/wallet") ? "/app/wallet" : next?.startsWith("/discover") ? "/discover" : "/onboarding";
	if (!isPending && user) {
		if (afterAuth === "/app/wallet") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: "/app/wallet",
			search: { plan: "desk" }
		});
		if (afterAuth === "/discover") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/discover" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	}
	if (done) {
		if (afterAuth === "/app/wallet") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: "/app/wallet",
			search: { plan: "desk" }
		});
		if (afterAuth === "/discover") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/discover" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	}
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0]
				});
				if (err) throw new Error(err.message);
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password
				});
				if (err) throw new Error(err.message);
			}
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : t("auth.error"));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid min-h-[70vh] max-w-5xl place-items-center gap-8 px-4 py-12 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden overflow-hidden rounded-xl border border-border lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/editorial/tunnel.jpg",
				alt: "",
				className: "aspect-[4/5] w-full object-cover"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-xl border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground",
					children: t("tagline")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-3xl",
					children: t("auth.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("auth.subtitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 grid gap-3",
					onSubmit: onEmail,
					children: [
						mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("auth.name"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								autoComplete: "name"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("auth.email"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								autoComplete: "email"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("auth.password"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								required: true,
								minLength: 8,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								autoComplete: mode === "up" ? "new-password" : "current-password"
							})
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: mode === "up" ? t("auth.signUp") : t("auth.signIn")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted-foreground hover:text-foreground",
							onClick: () => setMode(mode === "up" ? "in" : "up"),
							children: mode === "up" ? t("auth.have") : t("auth.need")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
						t("auth.or"),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => signIn(p.providerId, { callbackURL: afterAuth }),
						children: p.providerId === "x" ? t("auth.x") : t("auth.google")
					}, p.providerId))
				})
			]
		})]
	}) });
}
//#endregion
export { Login as component };
