import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as adminYouthQueue, t as adminReviewYouth } from "./billing-CF5MKqf_.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { n as RedirectToSignIn, r as useCurrentUserState, t as PageShell } from "./page-shell-CxYFDWwf.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-OytLQnPi.mjs";
import { t as Textarea } from "./textarea-BvR3MxFv.mjs";
import { t as Skeleton } from "./skeleton-6tIUPdsb.mjs";
import { t as COUNTRIES, u as labeled } from "./football-Bg2Gurrr.mjs";
import { t as PlayerCard } from "./player-card-Dx1D4GHB.mjs";
import { r as getMe } from "./me-DvIP4gK3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D_KiqL6V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var adminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d859b9f95d5a852ed70c6d34e6ed740a5fdc4ef6c92f86452aea7b323f118f67"));
var adminProfileQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f6f34981cff54733fe0ac45d71482fbcad212f25132c61c8894ee8f6c9d2c89e"));
var adminReviewProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6131b231f1b9162c8a882438ea3a28cc1f572ed6ade2ed82816d5890bba1c3f2"));
var adminScoutQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c9fa146df12c316a5842fec5c4b6ddf305519367753706b9370a7ed6fcefc9cc"));
var adminSetScout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3983b2809332459c3f1332d31d0ad7441f7a075f59a2064576bcd5938a8be150"));
var adminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f6eb1a184095a8e2f6bea353dd3ac802bc0334ce121cda8e1370d4d36b815678"));
function AdminPage() {
	const { t, locale } = useI18n();
	const { user, isPending } = useCurrentUserState();
	const qc = useQueryClient();
	const [note, setNote] = (0, import_react.useState)("");
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe(),
		enabled: Boolean(user)
	});
	const stats = useQuery({
		queryKey: ["admin-stats"],
		queryFn: () => adminStats(),
		enabled: Boolean(me.data?.user?.isAdmin)
	});
	const queue = useQuery({
		queryKey: ["admin-queue"],
		queryFn: () => adminProfileQueue(),
		enabled: Boolean(me.data?.user?.isAdmin)
	});
	const scouts = useQuery({
		queryKey: ["admin-scouts"],
		queryFn: () => adminScoutQueue(),
		enabled: Boolean(me.data?.user?.isAdmin)
	});
	const users = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => adminUsers(),
		enabled: Boolean(me.data?.user?.isAdmin)
	});
	const youthQ = useQuery({
		queryKey: ["admin-youth"],
		queryFn: () => adminYouthQueue(),
		enabled: Boolean(me.data?.user?.isAdmin)
	});
	const review = useMutation({
		mutationFn: (input) => adminReviewProfile({ data: {
			...input,
			note
		} }),
		onSuccess: () => {
			setNote("");
			qc.invalidateQueries({ queryKey: ["admin-queue"] });
			qc.invalidateQueries({ queryKey: ["admin-stats"] });
		}
	});
	const setScout = useMutation({
		mutationFn: (input) => adminSetScout({ data: input }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-scouts"] });
			qc.invalidateQueries({ queryKey: ["admin-stats"] });
		}
	});
	const youthReview = useMutation({
		mutationFn: (input) => adminReviewYouth({ data: {
			...input,
			note
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-youth"] });
		}
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me.data && !me.data.user?.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: t("admin.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					[stats.data?.players, t("stats.talents")],
					[stats.data?.approved, t("status.approved")],
					[stats.data?.pending, t("status.pending")],
					[stats.data?.scouts, t("stats.scouts")],
					[stats.data?.pending_scouts, t("admin.scouts")]
				].map(([n, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-xs text-muted-foreground",
					children: label
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tabular-nums",
					children: n ?? "—"
				}) })] }, String(label)))
			}),
			stats.data?.countries && stats.data.countries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-muted-foreground",
					children: t("discover.country")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: stats.data.countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-32",
								children: labeled(COUNTRIES, c.country, locale)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-1.5 flex-1 rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block h-1.5 rounded-full bg-primary",
									style: { width: `${Math.min(100, c.n * 20)}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-8 tabular-nums text-muted-foreground",
								children: c.n
							})
						]
					}, c.country))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-display text-2xl",
				children: t("admin.queue")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-4 max-w-xl",
				value: note,
				onChange: (e) => setNote(e.target.value),
				placeholder: t("admin.note")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [queue.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: t("admin.empty")
				}), queue.data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, { player: p }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => review.mutate({
									id: p.id,
									action: "approved"
								}),
								children: t("admin.approve")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => review.mutate({
									id: p.id,
									action: "needs_revision"
								}),
								children: t("admin.revision")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "destructive",
								onClick: () => review.mutate({
									id: p.id,
									action: "rejected"
								}),
								children: t("admin.reject")
							})
						]
					})]
				}, p.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-display text-2xl",
				children: t("admin.youth")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4",
				children: [youthQ.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: t("admin.empty")
				}), youthQ.data?.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								y.first_name,
								" ",
								y.last_name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								y.dob,
								" · ",
								y.user_id
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "underline",
									href: y.id_doc_url,
									target: "_blank",
									rel: "noreferrer",
									children: "ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "underline",
									href: y.selfie_url,
									target: "_blank",
									rel: "noreferrer",
									children: "Selfie"
								}),
								y.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "underline",
									href: y.video_url,
									target: "_blank",
									rel: "noreferrer",
									children: "Video"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => youthReview.mutate({
									userId: y.user_id,
									action: "approved"
								}),
								children: t("admin.approve")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "destructive",
								onClick: () => youthReview.mutate({
									userId: y.user_id,
									action: "rejected"
								}),
								children: t("admin.reject")
							})]
						})
					]
				}, y.user_id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-display text-2xl",
				children: t("admin.scouts")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 divide-y divide-border rounded-xl border border-border",
				children: scouts.data?.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: s.displayName || s.userId
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							s.orgName,
							" · ",
							s.scoutStatus
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => setScout.mutate({
								userId: s.userId,
								status: "approved"
							}),
							children: t("admin.approve")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setScout.mutate({
								userId: s.userId,
								status: "rejected"
							}),
							children: t("admin.reject")
						})]
					})]
				}, s.userId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-display text-2xl",
				children: t("admin.users")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
					className: "w-full text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: users.data?.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: u.displayName || u.userId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: u.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: u.scoutStatus
							})
						]
					}, u.userId)) })
				})
			})
		]
	}) });
}
//#endregion
export { AdminPage as component };
