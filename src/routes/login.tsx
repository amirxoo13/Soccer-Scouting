import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/field";
import { PageShell } from "@/components/page-shell";

type LoginSearch = { next?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const next = typeof search.next === "string" && search.next.startsWith("/") && !search.next.startsWith("//")
      ? search.next
      : undefined;
    return next ? { next } : {};
  },
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const { next } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const afterAuth = next?.startsWith("/app/wallet") ? "/app/wallet" : next?.startsWith("/discover") ? "/discover" : "/onboarding";

  if (!isPending && user) {
    if (afterAuth === "/app/wallet") return <Navigate to="/app/wallet" search={{ plan: "desk" }} />;
    if (afterAuth === "/discover") return <Navigate to="/discover" />;
    return <Navigate to="/onboarding" />;
  }
  if (done) {
    if (afterAuth === "/app/wallet") return <Navigate to="/app/wallet" search={{ plan: "desk" }} />;
    if (afterAuth === "/discover") return <Navigate to="/discover" />;
    return <Navigate to="/onboarding" />;
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message);
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center gap-8 px-4 py-12 lg:grid-cols-2">
        <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
          <img src="/editorial/tunnel.jpg" alt="" className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="w-full rounded-xl border border-border bg-card p-6">
          <p className="text-xs tracking-wide text-muted-foreground">{t("tagline")}</p>
          <h1 className="font-display mt-2 text-3xl">{t("auth.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.subtitle")}</p>

          <form className="mt-6 grid gap-3" onSubmit={onEmail}>
            {mode === "up" && (
              <Field label={t("auth.name")}>
                <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
            )}
            <Field label={t("auth.email")}>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label={t("auth.password")}>
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
              />
            </Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy}>
              {mode === "up" ? t("auth.signUp") : t("auth.signIn")}
            </Button>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMode(mode === "up" ? "in" : "up")}
            >
              {mode === "up" ? t("auth.have") : t("auth.need")}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("auth.or")}
            <span className="h-px flex-1 bg-border" />
          </div>

          {authEnabled ? (
            <div className="grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  onClick={() => signIn(p.providerId, { callbackURL: afterAuth })}
                >
                  {p.providerId === "x" ? t("auth.x") : t("auth.google")}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
