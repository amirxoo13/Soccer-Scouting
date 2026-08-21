import { b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { s as useI18n } from "./router-CrbPo6WY.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-OytLQnPi.mjs";
import { a as markNotificationsRead, i as listNotifications, r as getMe } from "./me-DvIP4gK3.mjs";
import { t as Badge } from "./badge-C3cEAyiX.mjs";
import { n as listMyInbox } from "./player-BTTs285P.mjs";
import { t as listSentRequests } from "./scout-BJTjTagO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.index-CVL9LCs6.js
var import_jsx_runtime = require_jsx_runtime();
function AppHome() {
	const { t } = useI18n();
	const qc = useQueryClient();
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
	const notes = useQuery({
		queryKey: ["notes"],
		queryFn: () => listNotifications()
	});
	const inbox = useQuery({
		queryKey: ["inbox"],
		queryFn: () => listMyInbox(),
		enabled: me.data?.user?.role === "player"
	});
	const sent = useQuery({
		queryKey: ["sent"],
		queryFn: () => listSentRequests(),
		enabled: me.data?.user?.role === "scout" || me.data?.user?.isAdmin
	});
	const mark = useMutation({
		mutationFn: () => markNotificationsRead(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notes"] });
			qc.invalidateQueries({ queryKey: ["me"] });
		}
	});
	if (me.data && !me.data.user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	const user = me.data?.user;
	const profile = me.data?.profile;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("dash.welcome")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: user?.role === "scout" ? t("dash.scoutTitle") : t("dash.playerTitle")
			})] }),
			me.data?.access?.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-lg border border-border bg-card px-4 py-3 text-sm",
				children: [
					t("wallet.active"),
					": ",
					me.data.access.plan,
					me.data.access.planEnds ? ` · ${me.data.access.planEnds.slice(0, 10)}` : "",
					` · ${me.data.access.walletBalance.toFixed(2)} USDT`
				]
			}),
			user?.role === "scout" && !me.data?.access?.canViewTalent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-border bg-card px-4 py-3 text-sm",
				children: t("paywall.body")
			}),
			user?.role === "scout" && user.scoutStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-border bg-card px-4 py-3 text-sm",
				children: t("dash.pendingScout")
			}),
			user?.role === "scout" && user.scoutStatus === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-border bg-card px-4 py-3 text-sm text-destructive",
				children: t("dash.rejectedScout")
			}),
			user?.role === "player" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm text-muted-foreground",
						children: t("dash.status")
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t(`status.${profile?.status ?? "draft"}`) }), profile?.reviewNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: profile.reviewNote
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm text-muted-foreground",
						children: t("dash.views")
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums",
						children: profile?.views ?? 0
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm text-muted-foreground",
						children: t("dash.requests")
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums",
						children: inbox.data?.length ?? 0
					}) })] })
				]
			}),
			user?.role === "player" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/profile",
						children: t("dash.complete")
					})
				}), profile?.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/players/$id",
						params: { id: String(profile.id) },
						children: t("featured.all")
					})
				})]
			}),
			user?.role === "scout" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/discover",
						children: t("nav.discover")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/shortlist",
						children: t("nav.shortlist")
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("dash.notifications") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => mark.mutate(),
						children: t("dash.markRead")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [(notes.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t("dash.emptyInbox")
					}), (notes.data ?? []).slice(0, 8).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border pb-3 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: n.title
						}), n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: n.body
						})]
					}, n.id))]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: t("dash.requests") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [(user?.role === "player" ? inbox.data : sent.data)?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t("dash.emptyInbox")
					}), (user?.role === "player" ? inbox.data : sent.data)?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border pb-3 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: user?.role === "player" ? r.fromName || r.fromOrg || "Scout" : r.playerName
						}), r.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: r.message
						})]
					}, r.id))]
				})] })]
			})
		]
	});
}
//#endregion
export { AppHome as component };
