import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as planById, t as PLANS } from "./plans-C5YhbBM0.mjs";
import { c as subscribeFromWallet, i as confirmDeposit, o as getWallet } from "./billing-CF5MKqf_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$2, s as useI18n } from "./router-CrbPo6WY.mjs";
import { a as PayPalMark, c as VisaMark, i as MastercardMark, n as BtcMark, o as PaymentStrip, r as EthMark, s as UsdtMark, t as AmexMark } from "./payment-marks-EIVr9biO.mjs";
import { t as Button } from "./button-CHi-Qs4Q.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-OytLQnPi.mjs";
import { t as Field } from "./field-DL4pxiur.mjs";
import { t as Input } from "./input-CTJ5Pcod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.wallet-BP7LPMv6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WalletPage() {
	const { t } = useI18n();
	const { plan: wanted } = Route$2.useSearch();
	const qc = useQueryClient();
	const wallet = useQuery({
		queryKey: ["wallet"],
		queryFn: () => getWallet()
	});
	const spec = wanted ? planById(wanted) : void 0;
	const [amount, setAmount] = (0, import_react.useState)(String(spec?.usd || 1e3));
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [channel, setChannel] = (0, import_react.useState)("card");
	const [crypto, setCrypto] = (0, import_react.useState)("usdt");
	const [card, setCard] = (0, import_react.useState)({
		number: "",
		expiry: "",
		cvc: "",
		name: ""
	});
	const pay = useMutation({
		mutationFn: () => confirmDeposit({ data: {
			amount: Number(amount),
			plan: wanted ?? null,
			channel: channel === "crypto" ? crypto : channel
		} }),
		onSuccess: () => {
			toast.success(t("pay.success"));
			qc.invalidateQueries({ queryKey: ["wallet"] });
			qc.invalidateQueries({ queryKey: ["access"] });
			qc.invalidateQueries({ queryKey: ["me"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const subscribe = useMutation({
		mutationFn: (plan) => subscribeFromWallet({ data: { plan } }),
		onSuccess: () => {
			toast.success(t("wallet.subscribe"));
			qc.invalidateQueries({ queryKey: ["wallet"] });
			qc.invalidateQueries({ queryKey: ["access"] });
			qc.invalidateQueries({ queryKey: ["me"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const w = wallet.data;
	const need = spec?.usd ?? 0;
	const canOpen = w && need > 0 && w.balance >= need && wanted && wanted !== "youth";
	const addressBlocks = (0, import_react.useMemo)(() => {
		if (!w?.address) return [];
		return w.address.match(/.{1,4}/g) ?? [w.address];
	}, [w?.address]);
	const methods = [
		{
			id: "card",
			label: t("pay.card")
		},
		{
			id: "paypal",
			label: t("pay.paypal")
		},
		{
			id: "crypto",
			label: t("pay.crypto")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-muted-foreground",
					children: t("nav.wallet")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-4xl",
					children: t("wallet.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted-foreground",
					children: t("wallet.subtitle")
				})
			] }),
			w?.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-lg border border-border bg-card px-4 py-3 text-sm",
				children: [
					t("wallet.active"),
					": ",
					w.plan,
					w.planEnds ? ` · ${t("wallet.until")} ${w.planEnds.slice(0, 10)}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: t("pay.methods")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentStrip, {})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: methods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setChannel(m.id),
					className: `h-10 rounded-md border px-4 text-sm ${channel === m.id ? "border-primary bg-card text-foreground" : "border-border text-muted-foreground"}`,
					children: m.label
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-sm text-muted-foreground",
					children: t("pay.choose")
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					channel === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisaMark, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MastercardMark, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmexMark, {})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("pay.cardNumber"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									autoComplete: "cc-number",
									placeholder: "ACCT-000015",
									value: card.number,
									onChange: (e) => setCard({
										...card,
										number: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("pay.expiry"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "MM/YY",
										autoComplete: "cc-exp",
										value: card.expiry,
										onChange: (e) => setCard({
											...card,
											expiry: e.target.value
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: t("pay.cvc"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "numeric",
										autoComplete: "cc-csc",
										placeholder: "123",
										value: card.cvc,
										onChange: (e) => setCard({
											...card,
											cvc: e.target.value
										})
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t("pay.cardName"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									autoComplete: "cc-name",
									value: card.name,
									onChange: (e) => setCard({
										...card,
										name: e.target.value
									})
								})
							})
						]
					}),
					channel === "paypal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayPalMark, { className: "h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: t("wallet.hint")
						})]
					}),
					channel === "crypto" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									[
										"usdt",
										UsdtMark,
										t("pay.usdt")
									],
									[
										"btc",
										BtcMark,
										t("pay.btc")
									],
									[
										"eth",
										EthMark,
										t("pay.eth")
									]
								].map(([id, Icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setCrypto(id),
									className: `flex h-11 items-center gap-2 rounded-md border px-3 text-sm ${crypto === id ? "border-primary" : "border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {}), label]
								}, id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									t("wallet.network"),
									": ",
									crypto === "usdt" ? "TRC20" : crypto === "btc" ? "Bitcoin" : "Ethereum"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "break-all font-mono text-sm leading-relaxed",
								children: addressBlocks.join(" ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									if (!w?.address) return;
									navigator.clipboard.writeText(w.address);
									setCopied(true);
									toast.success(t("wallet.copied"));
								},
								children: copied ? t("wallet.copied") : t("wallet.copy")
							})
						]
					})
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-sm text-muted-foreground",
					children: t("wallet.balance")
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-5xl tabular-nums",
						children: w ? w.balance.toFixed(2) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "USD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("wallet.amount"),
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: amount,
							onChange: (e) => setAmount(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: PLANS.filter((p) => p.usd > 0).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "h-9 rounded-md border border-border px-3 text-xs",
							onClick: () => setAmount(String(p.usd)),
							children: ["$", p.usd]
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-5 w-full",
						disabled: pay.isPending,
						onClick: () => pay.mutate(),
						children: pay.isPending ? t("pay.processing") : t("pay.payNow")
					}),
					wanted && wanted !== "youth" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-2 w-full",
						variant: "outline",
						disabled: !canOpen || subscribe.isPending,
						onClick: () => subscribe.mutate(wanted),
						children: [
							t("wallet.subscribe"),
							" · $",
							need
						]
					})
				] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "divide-y divide-border rounded-xl border border-border bg-card",
				children: [(w?.txs ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted-foreground",
					children: t("wallet.empty")
				}), (w?.txs ?? []).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-4 px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tx.kind === "deposit" ? t("wallet.deposit") : t("wallet.spend") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: tx.createdAt.slice(0, 16).replace("T", " ")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "tabular-nums",
						children: [
							tx.amount > 0 ? "+" : "",
							tx.amount.toFixed(2),
							" USD"
						]
					})]
				}, tx.id))]
			}) })
		]
	});
}
//#endregion
export { WalletPage as component };
