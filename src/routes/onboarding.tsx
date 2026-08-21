import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimAdmin, completeOnboarding, getMe } from "@/lib/server/me";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/field";
import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [ready, setReady] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const [role, setRole] = useState<UserRole>("player");
  const [orgName, setOrgName] = useState("");
  const [orgRole, setOrgRole] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isPending || !user) return;
    getMe()
      .then((me) => {
        setHasUser(Boolean(me.user));
        setAdminCount(me.adminCount);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [isPending, user]);

  if (isPending || (user && !ready)) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg px-4 py-16">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-6 h-40 w-full" />
        </div>
      </PageShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (hasUser) return <Navigate to="/app" />;
  const displayName = user.displayName ?? undefined;

  async function submit() {
    setBusy(true);
    try {
      await completeOnboarding({
        data: {
          role,
          displayName,
          orgName: role === "scout" ? orgName : undefined,
          orgRole: role === "scout" ? orgRole : undefined,
        },
      });
      nav({ to: "/app" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="font-display text-4xl">{t("onboarding.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.subtitle")}</p>
        <div className="mt-8 grid gap-3">
          {(["player", "scout"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "rounded-xl border p-5 text-start transition-colors",
                role === r ? "border-primary bg-muted" : "border-border bg-card",
              )}
            >
              <div className="font-medium">{r === "player" ? t("onboarding.player") : t("onboarding.scout")}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {r === "player" ? t("onboarding.playerHint") : t("onboarding.scoutHint")}
              </div>
            </button>
          ))}
        </div>
        {role === "scout" && (
          <div className="mt-6 grid gap-3">
            <Field label={t("onboarding.org")}>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </Field>
            <Field label={t("onboarding.orgRole")}>
              <Input value={orgRole} onChange={(e) => setOrgRole(e.target.value)} />
            </Field>
          </div>
        )}
        <Button className="mt-8 w-full" disabled={busy} onClick={submit}>
          {t("onboarding.continue")}
        </Button>
        {adminCount === 0 && (
          <button
            type="button"
            className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={async () => {
              await claimAdmin();
              nav({ to: "/admin" });
            }}
          >
            {t("onboarding.claimAdmin")}
          </button>
        )}
      </div>
    </PageShell>
  );
}
