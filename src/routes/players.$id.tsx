import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { Paywall } from "@/components/paywall";
import { PitchMark } from "@/components/pitch-mark";
import { PlayerPhoto } from "@/components/player-photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { dossierFor, enrichHistory, formatDate, formatEur, formatHeightM } from "@/lib/dossier";
import { COUNTRIES, FEET, LEVELS, POSITIONS, VIDEO_CATEGORIES, labeled } from "@/lib/football";
import { useI18n } from "@/lib/i18n";
import { getAccess } from "@/lib/server/billing";
import { getPublicPlayer, searchPlayers } from "@/lib/server/public";
import { sendContact, toggleWatchlist, watchlistIds } from "@/lib/server/scout";
import { ageFromDob } from "@/lib/utils";
import type { AnalysisStatus } from "@/lib/video-analysis";
import { VideoEmbed } from "@/components/video-embed";
import { AnalysisPanel } from "@/components/analysis-panel";
import { videoThumb } from "@/lib/video-embed";

export const Route = createFileRoute("/players/$id")({ component: PlayerPage });

function Flag({ code }: { code: string | null }) {
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt=""
      className="inline-block h-3.5 w-5 rounded-sm object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

function PlayerPage() {
  const { id } = Route.useParams();
  const profileId = Number(id);
  const { t, locale } = useI18n();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { user, isPending } = useCurrentUserState();
  const [message, setMessage] = useState("");
  const [activeVideo, setActiveVideo] = useState(0);
  const [tab, setTab] = useState<"overview" | "stats" | "transfers" | "videos">("overview");

  const result = useQuery({
    queryKey: ["player", profileId],
    queryFn: () => getPublicPlayer({ data: profileId }),
  });
  const access = useQuery({ queryKey: ["access"], queryFn: () => getAccess() });
  const watched = useQuery({
    queryKey: ["watch-ids"],
    queryFn: () => watchlistIds(),
    enabled: Boolean(user),
  });

  const toggle = useMutation({
    mutationFn: () => toggleWatchlist({ data: profileId }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["watch-ids"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const contact = useMutation({
    mutationFn: () => sendContact({ data: { profileId, message } }),
    onSuccess: () => {
      toast.success(t("scout.sent"));
      setMessage("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const similar = useQuery({
    queryKey: ["similar", result.data && "player" in result.data ? result.data.player?.primaryPosition : null],
    queryFn: () =>
      searchPlayers({
        data: { position: result.data && "access" in result.data && result.data.access ? result.data.player.primaryPosition ?? undefined : undefined },
      }),
    enabled: Boolean(result.data && "access" in result.data && result.data.access),
  });

  if (result.isPending) {
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Skeleton className="h-[70vh] w-full rounded-xl" />
        </div>
      </PageShell>
    );
  }

  if (!result.data?.player) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-muted-foreground">{t("discover.empty")}</p>
          <Button asChild className="mt-6">
            <Link to="/discover">{t("nav.discover")}</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  if (!result.data.access) {
    const sealed = result.data.player;
    return (
      <PageShell>
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl border border-border">
            <div className="talent-blur">
              <PlayerPhoto url={sealed.photoUrl} first="—" last="—" className="aspect-[3/4] w-full" />
            </div>
            <div className="absolute inset-0 bg-background/40" />
          </div>
          <div>
            <Badge>{labeled(POSITIONS, sealed.primaryPosition, locale)}</Badge>
            <h1 className="font-display mt-4 text-4xl">{t("paywall.sealed")}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{t("positions.locked")}</p>
            <div className="mt-8">
              <Paywall loggedIn={Boolean(access.data?.loggedIn)} />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const p = result.data.player;
  const age = ageFromDob(p.dob);
  const onWatch = watched.data?.includes(p.id);
  const video = p.videos[activeVideo];
  const d = dossierFor(p.firstName, p.lastName);
  const seasons = enrichHistory(p);
  const similarPlayers =
    similar.data && similar.data.access
      ? similar.data.players.filter((x) => x.id !== p.id).slice(0, 6)
      : [];

  const facts: [string, ReactNode][] = [
    [
      t("player.dateOfBirth"),
      p.dob ? (
        <span>
          {formatDate(p.dob, locale)}
          {age != null ? ` (${age})` : ""}
        </span>
      ) : (
        "—"
      ),
    ],
    [t("player.placeOfBirth"), d?.placeOfBirth ?? p.city ?? "—"],
    [
      t("player.citizenship"),
      <span className="inline-flex items-center gap-2">
        <Flag code={p.nationality ?? p.country} />
        {labeled(COUNTRIES, p.nationality ?? p.country, locale)}
      </span>,
    ],
    [t("player.height"), p.heightCm ? formatHeightM(p.heightCm) : "—"],
    [t("player.weight"), p.weightKg ? `${p.weightKg} ${t("common.kg")}` : "—"],
    [t("player.position"), labeled(POSITIONS, p.primaryPosition, locale)],
    [t("player.foot"), labeled(FEET, p.preferredFoot, locale)],
    [t("player.shirt"), p.jerseyNumber != null ? `#${p.jerseyNumber}` : "—"],
    [t("player.club"), p.currentClub ?? "—"],
    [t("player.joined"), d?.joinedOn ? formatDate(d.joinedOn, locale) : "—"],
    [t("player.contract"), d?.contractUntil ? formatDate(d.contractUntil, locale) : "—"],
    [t("player.agent"), d?.agentName ?? t("player.none")],
    [t("player.outfitter"), d?.outfitter ?? "—"],
    [
      t("player.nationalTeam"),
      d?.nationalTeam ? (
        <span>
          {d.nationalTeam}
          {d.nationalCaps ? ` · ${d.nationalCaps}/${d.nationalGoals}` : ""}
        </span>
      ) : (
        "—"
      ),
    ],
    [t("player.languages"), p.languages ?? "—"],
  ];

  const tabs = [
    ["overview", t("player.overview")],
    ["stats", t("player.stats")],
    ["transfers", t("player.transfers")],
    ["videos", t("player.videos")],
  ] as const;

  return (
    <PageShell>
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl items-stretch gap-0 lg:grid-cols-[200px_minmax(0,1fr)_240px]">
          <div className="overflow-hidden border-b border-border lg:border-b-0 lg:border-e">
            <PlayerPhoto url={p.photoUrl} first={p.firstName} last={p.lastName} className="aspect-[3/4] w-full" />
          </div>
          <div className="px-4 py-6 md:px-8">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flag code={p.country} />
              {labeled(COUNTRIES, p.country, locale)}
              {p.city ? ` · ${p.city}` : ""}
            </p>
            <h1 className="font-display mt-2 text-3xl md:text-5xl">
              {p.firstName} <span className="uppercase">{p.lastName}</span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <PitchMark position={p.primaryPosition} className="h-14 w-9 shrink-0" />
              <Badge>{labeled(POSITIONS, p.primaryPosition, locale)}</Badge>
              {p.playingLevel && <Badge variant="muted">{labeled(LEVELS, p.playingLevel, locale)}</Badge>}
              {p.jerseyNumber != null && <Badge variant="muted">#{p.jerseyNumber}</Badge>}
              {age != null && age < 18 && <Badge variant="warn">{t("player.youth")}</Badge>}
            </div>
            {p.currentClub && <p className="mt-3 text-sm">{p.currentClub}</p>}
            <dl className="mt-6 grid grid-cols-1 gap-x-8 text-sm sm:grid-cols-2">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border py-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-end font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="flex flex-col justify-between border-t border-border p-6 lg:border-s lg:border-t-0">
            <div>
              <p className="text-xs text-muted-foreground">{t("player.currentValue")}</p>
              <p className="font-display mt-2 text-4xl text-primary">{d ? formatEur(d.marketValueEur) : "—"}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("player.lastUpdate")} · {t("player.views")} {p.views}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <Button
                variant={onWatch ? "secondary" : "default"}
                onClick={() => {
                  if (!user && !isPending) nav({ to: "/login" });
                  else toggle.mutate();
                }}
              >
                {onWatch ? t("player.shortlisted") : t("player.shortlist")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  void navigator.clipboard.writeText(window.location.href);
                  toast.success(t("player.share"));
                }}
              >
                {t("player.share")}
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm ${
                tab === id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {tab === "overview" && (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
            <div>
              <h2 className="text-sm font-medium">{t("player.about")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
              {p.achievements && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium">{t("player.achievements")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.achievements}</p>
                </div>
              )}
              {p.injuryStatus && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium">{t("player.injury")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.injuryStatus}</p>
                </div>
              )}
              <CareerTable seasons={seasons} t={t} />
            </div>
            <div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-medium">{t("player.contact")}</p>
                <Textarea
                  className="mt-2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("scout.message")}
                />
                <Button
                  className="mt-3"
                  disabled={contact.isPending || !message.trim()}
                  onClick={() => {
                    if (!user) nav({ to: "/login" });
                    else contact.mutate();
                  }}
                >
                  {t("scout.send")}
                </Button>
              </div>
              {similarPlayers.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium">{t("player.similar")}</h3>
                  <ul className="mt-3 space-y-2">
                    {similarPlayers.map((s) => (
                      <li key={s.id}>
                        <Link
                          to="/players/$id"
                          params={{ id: String(s.id) }}
                          className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
                        >
                          <span>
                            {s.firstName} {s.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">{labeled(POSITIONS, s.primaryPosition, locale)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "stats" && <CareerTable seasons={seasons} t={t} />}

        {tab === "transfers" && (
          <div>
            <h2 className="text-sm font-medium">{t("player.transfers")}</h2>
            <table className="mt-4 w-full text-sm">
              <thead className="text-start text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-2 pe-3 font-medium">{t("player.season")}</th>
                  <th className="py-2 pe-3 font-medium">{t("player.club")}</th>
                  <th className="py-2 font-medium">{t("player.competition")}</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((c, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3 pe-3 tabular-nums">
                      {c.from}–{c.to ?? t("player.present")}
                    </td>
                    <td className="py-3 pe-3">{c.club}</td>
                    <td className="py-3 text-muted-foreground">{c.competition ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "videos" && (
          <div>
            <h2 className="font-display text-3xl">{t("player.videos")}</h2>
            {p.videos.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{t("player.noVideos")}</p>
            ) : (
              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  {video ? <VideoEmbed url={video.youtubeUrl} title={video.title ?? undefined} /> : null}
                  <div className="p-4">
                    <div className="font-medium">{video?.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{labeled(VIDEO_CATEGORIES, video?.category ?? null, locale)}</div>
                    {video && (
                      <AnalysisPanel
                        videoId={video.id}
                        videoUrl={video.youtubeUrl}
                        canRun={Boolean(user) && p.userId === user?.id}
                        initialStatus={(video.analysisStatus as AnalysisStatus) ?? "idle"}
                        initialAnalysis={video.analysis}
                      />
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  {p.videos.map((v, i) => {
                    const thumb = videoThumb(v.youtubeUrl);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setActiveVideo(i)}
                        className="flex gap-3 rounded-lg border border-border bg-card p-2 text-start"
                      >
                        {thumb && (
                          <img
                            src={thumb}
                            alt=""
                            className="h-16 w-28 rounded-md object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium">{v.title}</div>
                          <div className="text-xs text-muted-foreground">{labeled(VIDEO_CATEGORIES, v.category, locale)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}

function CareerTable({
  seasons,
  t,
}: {
  seasons: ReturnType<typeof enrichHistory>;
  t: (k: string) => string;
}) {
  const totals = seasons.reduce(
    (acc, c) => ({
      appearances: acc.appearances + (c.appearances ?? 0),
      goals: acc.goals + (c.goals ?? 0),
      assists: acc.assists + (c.assists ?? 0),
      minutes: acc.minutes + (c.minutes ?? 0),
    }),
    { appearances: 0, goals: 0, assists: 0, minutes: 0 },
  );
  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-sm font-medium">{t("player.stats")}</h2>
      <table className="mt-4 w-full text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 pe-3 text-start font-medium">{t("player.season")}</th>
            <th className="py-2 pe-3 text-start font-medium">{t("player.club")}</th>
            <th className="py-2 pe-3 text-start font-medium">{t("player.competition")}</th>
            <th className="py-2 pe-3 text-end font-medium">{t("player.appearances")}</th>
            <th className="py-2 pe-3 text-end font-medium">{t("player.goals")}</th>
            <th className="py-2 pe-3 text-end font-medium">{t("player.assists")}</th>
            <th className="py-2 text-end font-medium">{t("player.minutes")}</th>
          </tr>
        </thead>
        <tbody>
          {seasons.map((c, i) => (
            <tr key={i} className="border-b border-border">
              <td className="py-3 pe-3 tabular-nums">
                {c.from}–{c.to ?? t("player.present")}
              </td>
              <td className="py-3 pe-3">{c.club}</td>
              <td className="py-3 pe-3 text-muted-foreground">{c.competition ?? "—"}</td>
              <td className="py-3 pe-3 text-end tabular-nums">{c.appearances ?? "—"}</td>
              <td className="py-3 pe-3 text-end tabular-nums">{c.goals ?? "—"}</td>
              <td className="py-3 pe-3 text-end tabular-nums">{c.assists ?? "—"}</td>
              <td className="py-3 text-end tabular-nums">{c.minutes ?? "—"}</td>
            </tr>
          ))}
          <tr className="font-medium">
            <td className="py-3 pe-3" colSpan={3}>
              {t("player.career")}
            </td>
            <td className="py-3 pe-3 text-end tabular-nums">{totals.appearances}</td>
            <td className="py-3 pe-3 text-end tabular-nums">{totals.goals}</td>
            <td className="py-3 pe-3 text-end tabular-nums">{totals.assists}</td>
            <td className="py-3 text-end tabular-nums">{totals.minutes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
