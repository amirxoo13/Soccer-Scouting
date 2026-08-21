import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMe, listNotifications, markNotificationsRead } from "@/lib/server/me";
import { listMyInbox } from "@/lib/server/player";
import { listSentRequests } from "@/lib/server/scout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/app/")({ component: AppHome });

function AppHome() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const notes = useQuery({ queryKey: ["notes"], queryFn: () => listNotifications() });
  const inbox = useQuery({
    queryKey: ["inbox"],
    queryFn: () => listMyInbox(),
    enabled: me.data?.user?.role === "player",
  });
  const sent = useQuery({
    queryKey: ["sent"],
    queryFn: () => listSentRequests(),
    enabled: me.data?.user?.role === "scout" || me.data?.user?.isAdmin,
  });
  const mark = useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notes"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  if (me.data && !me.data.user) return <Navigate to="/onboarding" />;
  const user = me.data?.user;
  const profile = me.data?.profile;

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-muted-foreground">{t("dash.welcome")}</p>
        <h1 className="font-display text-4xl">
          {user?.role === "scout" ? t("dash.scoutTitle") : t("dash.playerTitle")}
        </h1>
      </div>

      {me.data?.access?.plan && (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          {t("wallet.active")}: {me.data.access.plan}
          {me.data.access.planEnds ? ` · ${me.data.access.planEnds.slice(0, 10)}` : ""}
          {` · ${me.data.access.walletBalance.toFixed(2)} USDT`}
        </p>
      )}
      {user?.role === "scout" && !me.data?.access?.canViewTalent && (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          {t("paywall.body")}
        </p>
      )}
      {user?.role === "scout" && user.scoutStatus === "pending" && (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm">{t("dash.pendingScout")}</p>
      )}
      {user?.role === "scout" && user.scoutStatus === "rejected" && (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-destructive">
          {t("dash.rejectedScout")}
        </p>
      )}

      {user?.role === "player" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{t("dash.status")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{t(`status.${profile?.status ?? "draft"}`)}</Badge>
              {profile?.reviewNote && (
                <p className="mt-3 text-sm text-muted-foreground">{profile.reviewNote}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{t("dash.views")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl tabular-nums">{profile?.views ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{t("dash.requests")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl tabular-nums">{inbox.data?.length ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {user?.role === "player" && (
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/app/profile">{t("dash.complete")}</Link>
          </Button>
          {profile?.status === "approved" && (
            <Button asChild variant="outline">
              <Link to="/players/$id" params={{ id: String(profile.id) }}>
                {t("featured.all")}
              </Link>
            </Button>
          )}
        </div>
      )}

      {user?.role === "scout" && (
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/discover">{t("nav.discover")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/shortlist">{t("nav.shortlist")}</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t("dash.notifications")}</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => mark.mutate()}>
              {t("dash.markRead")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(notes.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">{t("dash.emptyInbox")}</p>
            )}
            {(notes.data ?? []).slice(0, 8).map((n) => (
              <div key={n.id} className="border-b border-border pb-3 last:border-0">
                <div className="text-sm font-medium">{n.title}</div>
                {n.body && <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dash.requests")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(user?.role === "player" ? inbox.data : sent.data)?.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("dash.emptyInbox")}</p>
            )}
            {(user?.role === "player" ? inbox.data : sent.data)?.map((r) => (
              <div key={r.id} className="border-b border-border pb-3 last:border-0">
                <div className="text-sm font-medium">
                  {user?.role === "player" ? r.fromName || r.fromOrg || "Scout" : r.playerName}
                </div>
                {r.message && <p className="mt-1 text-xs text-muted-foreground">{r.message}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
