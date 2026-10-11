import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimAdmin, completeOnboarding, getMe } from "@/lib/server/me";
import { consumeNext, destinationFromNext } from "@/lib/nav-next";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/field";
import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import type { AppDestination } from "@/lib/nav-next";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function go(nav: ReturnType<typeof useNavigate>, dest: AppDestination) {
  if (dest.to === "/app/wallet") void nav({ to: "/app/wallet", search: dest.search });
  else if (dest.to === "/discover") void nav({ to: "/discover" });
  else if (dest.to === "/app/profile") void nav({ to: "/app/profile" });
  else if (dest.to === "/players/$id") void nav({ to: "/players/$id", params: dest.params });
  else void nav({ to: "/app" });
}

function DestNavigate({ dest }: { dest: AppDestination }) {
  if (dest.to === "/app/wallet") return <Navigate to="/app/wallet" search={dest.search} />;
  if (dest.to === "/discover") return <Navigate to="/discover" />;
  if (dest.to === "/app/profile") return <Navigate to="/app/profile" />;
  if (dest.to === "/players/$id") return <Navigate to="/players/$id" params={dest.params} />;
  return <Navigate to="/app" />;
}

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
  const [existingDest, setExistingDest] = useState<AppDestination | null>(null);

  useEffect(() => {
    if (isPending || !user) return;
    getMe()
      .then((me) => {
        setHasUser(Boolean(me.user));
        setAdminCount(me.adminCount);
        if (me.user) setExistingDest(destinationFromNext(consumeNext()));
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
  if (hasUser && existingDest) return <DestNavigate dest={existingDest} />;
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
      const dest = destinationFromNext(consumeNext());
      if (role === "player" && dest.to === "/app") go(nav, { to: "/app/profile" });
      else go(nav, dest);
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
        <Button className="mt-8 w-full" disabled={busy} onClick={() => void submit()}>
          {t("onboarding.continue")}
        </Button>
        {adminCount === 0 && (
          <button
            type="button"
            className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => void claimAdmin().then(() => nav({ to: "/admin" }))}
          >
            {t("onboarding.claimAdmin")}
          </button>
        )}
      </div>
    </PageShell>
  );
}
