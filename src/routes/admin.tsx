import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerCard } from "@/components/player-card";
import { VideoEmbed } from "@/components/video-embed";
import { getMe } from "@/lib/server/me";
import {
  adminProfileQueue,
  adminReviewProfile,
  adminScoutQueue,
  adminSetScout,
  adminStats,
  adminUsers,
} from "@/lib/server/admin";
import { adminReviewYouth, adminYouthQueue } from "@/lib/server/billing";
import { useI18n } from "@/lib/i18n";
import { COUNTRIES, labeled } from "@/lib/football";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { t, locale } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe(), enabled: Boolean(user) });
  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: () => adminStats(), enabled: Boolean(me.data?.user?.isAdmin) });
  const queue = useQuery({ queryKey: ["admin-queue"], queryFn: () => adminProfileQueue(), enabled: Boolean(me.data?.user?.isAdmin) });
  const scouts = useQuery({ queryKey: ["admin-scouts"], queryFn: () => adminScoutQueue(), enabled: Boolean(me.data?.user?.isAdmin) });
  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => adminUsers(), enabled: Boolean(me.data?.user?.isAdmin) });
  const youthQ = useQuery({ queryKey: ["admin-youth"], queryFn: () => adminYouthQueue(), enabled: Boolean(me.data?.user?.isAdmin) });

  const review = useMutation({
    mutationFn: (input: { id: number; action: "approved" | "rejected" | "needs_revision" }) =>
      adminReviewProfile({ data: { ...input, note } }),
    onSuccess: () => {
      setNote("");
      void qc.invalidateQueries({ queryKey: ["admin-queue"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
  const setScout = useMutation({
    mutationFn: (input: { userId: string; status: "approved" | "rejected" }) => adminSetScout({ data: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-scouts"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
  const youthReview = useMutation({
    mutationFn: (input: { userId: string; action: "approved" | "rejected" }) =>
      adminReviewYouth({ data: { ...input, note } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-youth"] });
    },
  });

  if (isPending) {
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Skeleton className="h-24 w-full" />
        </div>
      </PageShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (me.data && !me.data.user?.isAdmin) return <Navigate to="/app" />;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl">{t("admin.title")}</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [stats.data?.players, t("stats.talents")],
            [stats.data?.approved, t("status.approved")],
            [stats.data?.pending, t("status.pending")],
            [stats.data?.scouts, t("stats.scouts")],
            [stats.data?.pending_scouts, t("admin.scouts")],
          ].map(([n, label]) => (
            <Card key={String(label)}>
              <CardHeader>
                <CardTitle className="text-xs text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl tabular-nums">{n ?? "—"}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {stats.data?.countries && stats.data.countries.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-medium text-muted-foreground">{t("discover.country")}</h2>
            <ul className="mt-3 space-y-2">
              {stats.data.countries.map((c) => (
                <li key={c.country} className="flex items-center gap-3 text-sm">
                  <span className="w-32">{labeled(COUNTRIES, c.country, locale)}</span>
                  <span className="h-1.5 flex-1 rounded-full bg-muted">
                    <span
                      className="block h-1.5 rounded-full bg-primary"
                      style={{ width: `${Math.min(100, c.n * 20)}%` }}
                    />
                  </span>
                  <span className="w-8 tabular-nums text-muted-foreground">{c.n}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="mt-12 font-display text-2xl">{t("admin.queue")}</h2>
        <Textarea className="mt-4 max-w-xl" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("admin.note")} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {queue.data?.length === 0 && <p className="text-sm text-muted-foreground">{t("admin.empty")}</p>}
          {queue.data?.map((p) => (
            <div key={p.id} className="grid gap-2">
              <PlayerCard player={p} />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => review.mutate({ id: p.id, action: "approved" })}>
                  {t("admin.approve")}
                </Button>
                <Button size="sm" variant="outline" onClick={() => review.mutate({ id: p.id, action: "needs_revision" })}>
                  {t("admin.revision")}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => review.mutate({ id: p.id, action: "rejected" })}>
                  {t("admin.reject")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl">{t("admin.youth")}</h2>
        <div className="mt-4 grid gap-4">
          {youthQ.data?.length === 0 && <p className="text-sm text-muted-foreground">{t("admin.empty")}</p>}
          {youthQ.data?.map((y) => (
            <div key={y.user_id} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium">
                {y.first_name} {y.last_name}
              </p>
              <p className="text-xs text-muted-foreground">{y.dob} · {y.user_id}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <a className="underline" href={y.id_doc_url} target="_blank" rel="noreferrer">
                  ID
                </a>
                <a className="underline" href={y.selfie_url} target="_blank" rel="noreferrer">
                  Selfie
                </a>
                {y.video_url && (
                  <div className="w-full max-w-md">
                    <VideoEmbed url={y.video_url} title="Youth clip" />
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => youthReview.mutate({ userId: y.user_id, action: "approved" })}>
                  {t("admin.approve")}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => youthReview.mutate({ userId: y.user_id, action: "rejected" })}>
                  {t("admin.reject")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl">{t("admin.scouts")}</h2>
        <div className="mt-4 divide-y divide-border rounded-xl border border-border">
          {scouts.data?.map((s) => (
            <div key={s.userId} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="text-sm font-medium">{s.displayName || s.userId}</div>
                <div className="text-xs text-muted-foreground">
                  {s.orgName} · {s.scoutStatus}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setScout.mutate({ userId: s.userId, status: "approved" })}>
                  {t("admin.approve")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setScout.mutate({ userId: s.userId, status: "rejected" })}
                >
                  {t("admin.reject")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl">{t("admin.users")}</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <tbody>
              {users.data?.map((u) => (
                <tr key={u.userId} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{u.displayName || u.userId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.scoutStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
