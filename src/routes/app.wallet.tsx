import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Field } from "@/components/field";
import { AmexMark, BtcMark, EthMark, MastercardMark, PayPalMark, PaymentStrip, UsdtMark, VisaMark } from "@/components/payment-marks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PLANS, planById, type PlanId } from "@/lib/plans";
import { useI18n } from "@/lib/i18n";
import { confirmDeposit, getWallet, subscribeFromWallet } from "@/lib/server/billing";

type WalletSearch = { plan?: PlanId };
type Channel = "card" | "paypal" | "crypto";
type CryptoAsset = "usdt" | "btc" | "eth";

export const Route = createFileRoute("/app/wallet")({
  validateSearch: (search: Record<string, unknown>): WalletSearch => {
    const plan = search.plan;
    if (plan === "player_u24" || plan === "player_senior" || plan === "desk") return { plan };
    return {};
  },
  component: WalletPage,
});

function WalletPage() {
  const { t } = useI18n();
  const { plan: wanted } = Route.useSearch();
  const qc = useQueryClient();
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: () => getWallet() });
  const spec = wanted ? planById(wanted) : undefined;
  const [amount, setAmount] = useState(String(spec?.usd || 1000));
  const [copied, setCopied] = useState(false);
  const [channel, setChannel] = useState<Channel>("card");
  const [crypto, setCrypto] = useState<CryptoAsset>("usdt");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

  const pay = useMutation({
    mutationFn: () =>
      confirmDeposit({
        data: {
          amount: Number(amount),
          plan: wanted ?? null,
          channel: channel === "crypto" ? crypto : channel,
        },
      }),
    onSuccess: () => {
      toast.success(t("pay.success"));
      void qc.invalidateQueries({ queryKey: ["wallet"] });
      void qc.invalidateQueries({ queryKey: ["access"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const subscribe = useMutation({
    mutationFn: (plan: PlanId) => subscribeFromWallet({ data: { plan } }),
    onSuccess: () => {
      toast.success(t("wallet.subscribe"));
      void qc.invalidateQueries({ queryKey: ["wallet"] });
      void qc.invalidateQueries({ queryKey: ["access"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const w = wallet.data;
  const need = spec?.usd ?? 0;
  const canOpen = w && need > 0 && w.balance >= need && wanted && wanted !== "youth";

  const addressBlocks = useMemo(() => {
    if (!w?.address) return [];
    return w.address.match(/.{1,4}/g) ?? [w.address];
  }, [w?.address]);

  const methods: { id: Channel; label: string }[] = [
    { id: "card", label: t("pay.card") },
    { id: "paypal", label: t("pay.paypal") },
    { id: "crypto", label: t("pay.crypto") },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs tracking-widest text-muted-foreground">{t("nav.wallet")}</p>
        <h1 className="font-display mt-2 text-4xl">{t("wallet.title")}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t("wallet.subtitle")}</p>
      </div>

      {w?.plan && (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          {t("wallet.active")}: {w.plan}
          {w.planEnds ? ` · ${t("wallet.until")} ${w.planEnds.slice(0, 10)}` : ""}
        </p>
      )}

      <div>
        <p className="text-xs text-muted-foreground">{t("pay.methods")}</p>
        <div className="mt-3">
          <PaymentStrip />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setChannel(m.id)}
            className={`h-10 rounded-md border px-4 text-sm ${
              channel === m.id ? "border-primary bg-card text-foreground" : "border-border text-muted-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t("pay.choose")}</CardTitle>
          </CardHeader>
          <CardContent>
            {channel === "card" && (
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <VisaMark />
                  <MastercardMark />
                  <AmexMark />
                </div>
                <Field label={t("pay.cardNumber")}>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="ACCT-000015"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t("pay.expiry")}>
                    <Input
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    />
                  </Field>
                  <Field label={t("pay.cvc")}>
                    <Input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={t("pay.cardName")}>
                  <Input
                    autoComplete="cc-name"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                  />
                </Field>
              </div>
            )}
            {channel === "paypal" && (
              <div className="grid gap-4">
                <PayPalMark className="h-8" />
                <p className="text-sm text-muted-foreground">{t("wallet.hint")}</p>
              </div>
            )}
            {channel === "crypto" && (
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["usdt", UsdtMark, t("pay.usdt")],
                      ["btc", BtcMark, t("pay.btc")],
                      ["eth", EthMark, t("pay.eth")],
                    ] as const
                  ).map(([id, Icon, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCrypto(id)}
                      className={`flex h-11 items-center gap-2 rounded-md border px-3 text-sm ${
                        crypto === id ? "border-primary" : "border-border"
                      }`}
                    >
                      <Icon />
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("wallet.network")}: {crypto === "usdt" ? "TRC20" : crypto === "btc" ? "Bitcoin" : "Ethereum"}
                </p>
                <p className="break-all font-mono text-sm leading-relaxed">{addressBlocks.join(" ")}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!w?.address) return;
                    void navigator.clipboard.writeText(w.address);
                    setCopied(true);
                    toast.success(t("wallet.copied"));
                  }}
                >
                  {copied ? t("wallet.copied") : t("wallet.copy")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t("wallet.balance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl tabular-nums">{w ? w.balance.toFixed(2) : "—"}</p>
            <p className="mt-1 text-sm text-muted-foreground">USD</p>
            <Field label={t("wallet.amount")} className="mt-6">
              <Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Field>
            <div className="mt-3 flex flex-wrap gap-2">
              {PLANS.filter((p) => p.usd > 0).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="h-9 rounded-md border border-border px-3 text-xs"
                  onClick={() => setAmount(String(p.usd))}
                >
                  ${p.usd}
                </button>
              ))}
            </div>
            <Button className="mt-5 w-full" disabled={pay.isPending} onClick={() => pay.mutate()}>
              {pay.isPending ? t("pay.processing") : t("pay.payNow")}
            </Button>
            {wanted && wanted !== "youth" && (
              <Button
                className="mt-2 w-full"
                variant="outline"
                disabled={!canOpen || subscribe.isPending}
                onClick={() => subscribe.mutate(wanted)}
              >
                {t("wallet.subscribe")} · ${need}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {(w?.txs ?? []).length === 0 && (
            <li className="px-4 py-6 text-sm text-muted-foreground">{t("wallet.empty")}</li>
          )}
          {(w?.txs ?? []).map((tx) => (
            <li key={tx.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <div>
                <p>{tx.kind === "deposit" ? t("wallet.deposit") : t("wallet.spend")}</p>
                <p className="text-xs text-muted-foreground">{tx.createdAt.slice(0, 16).replace("T", " ")}</p>
              </div>
              <p className="tabular-nums">
                {tx.amount > 0 ? "+" : ""}
                {tx.amount.toFixed(2)} USD
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
