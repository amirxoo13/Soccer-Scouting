import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Radar } from "lucide-react";
import { enqueueVideoAnalysis, getVideoAnalysis } from "@/lib/server/analysis";
import {
  isBlockedAnalysis,
  isPendingStatus,
  isUselessIssue,
  type AnalysisStatus,
  type PlayerBox,
  type PlayerDossier,
  type RadarScores,
  type VideoAnalysis,
} from "@/lib/video-analysis";
import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";

function heatColor(v: number) {
  const t = Math.max(0, Math.min(1, v));
  if (t < 0.08) return "transparent";
  if (t < 0.35) return `rgba(32, 92, 210, ${0.18 + t})`;
  if (t < 0.6) return `rgba(16, 185, 129, ${0.28 + t * 0.4})`;
  if (t < 0.82) return `rgba(250, 204, 21, ${0.4 + t * 0.35})`;
  return `rgba(239, 68, 68, ${0.5 + t * 0.35})`;
}

function PitchMap({
  grid,
  players,
  selectedId,
  onPick,
}: {
  grid: number[][];
  players: PlayerBox[];
  selectedId?: number | null;
  onPick?: (id: number) => void;
}) {
  const cols = grid[0]?.length ?? 48;
  const rows = grid.length || 30;
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#147a3a] shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]">
      <div
        className="absolute inset-0 grid opacity-90 blur-[7px] mix-blend-screen"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
      >
        {grid.flatMap((row, r) =>
          row.map((v, c) => <span key={`${r}-${c}`} style={{ background: heatColor(v) }} />),
        )}
      </div>
      <svg viewBox="0 0 105 68" className="relative z-[1] block aspect-[105/68] w-full">
        <rect x="0" y="0" width="105" height="68" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="0.6" />
        <line x1="52.5" y1="0" x2="52.5" y2="68" stroke="rgba(255,255,255,0.75)" strokeWidth="0.35" />
        <circle cx="52.5" cy="34" r="9.15" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.35" />
        <circle cx="52.5" cy="34" r="0.55" fill="white" />
        <rect x="0" y="13.84" width="16.5" height="40.32" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.35" />
        <rect x="88.5" y="13.84" width="16.5" height="40.32" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.35" />
        <rect x="0" y="24.84" width="5.5" height="18.32" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.35" />
        <rect x="99.5" y="24.84" width="5.5" height="18.32" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.35" />
        {players.map((p) => {
          const cx = ((p.pitchX ?? 50) / 100) * 105;
          const cy = ((p.pitchY ?? 50) / 100) * 68;
          const selected = selectedId === p.id;
          return (
            <g
              key={p.id}
              className={p.label === "player" ? "cursor-pointer" : undefined}
              onClick={() => p.label === "player" && onPick?.(p.id)}
            >
              {selected && <circle cx={cx} cy={cy} r="3.2" fill="none" stroke="#fbbf24" strokeWidth="0.7" />}
              <circle
                cx={cx}
                cy={cy}
                r={p.label === "ball" ? 0.9 : p.label === "referee" ? 1.2 : selected ? 1.8 : 1.35}
                fill={
                  p.label === "ball"
                    ? "#f8fafc"
                    : p.label === "referee"
                      ? "#111111"
                      : selected
                        ? "#fbbf24"
                        : p.kit || (p.team === "away" ? "#ef4444" : "#38bdf8")
                }
                stroke={p.label === "referee" ? "#fbbf24" : "rgba(0,0,0,0.45)"}
                strokeWidth="0.25"
              />
              {p.label === "player" && (
                <text x={cx} y={cy - 2.4} textAnchor="middle" fill="#fff" fontSize="2.4" fontWeight="700">
                  {p.id}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const RADAR_KEYS: (keyof RadarScores)[] = ["technical", "tactical", "physical", "mental", "attacking", "defending"];

function RadarChart({ radar, labels }: { radar: RadarScores; labels: string[] }) {
  const cx = 50;
  const cy = 50;
  const r = 36;
  const pts = RADAR_KEYS.map((k, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
    const v = Math.max(0, Math.min(100, radar[k])) / 100;
    return [cx + Math.cos(ang) * r * v, cy + Math.sin(ang) * r * v];
  });
  const poly = pts.map((p) => p.join(",")).join(" ");
  return (
    <svg viewBox="0 0 100 108" className="h-full w-full">
      {[0.33, 0.66, 1].map((s) => (
        <polygon
          key={s}
          points={RADAR_KEYS.map((_, i) => {
            const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
            return `${cx + Math.cos(ang) * r * s},${cy + Math.sin(ang) * r * s}`;
          }).join(" ")}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="0.4"
        />
      ))}
      <polygon points={poly} fill="rgba(251,191,36,0.28)" stroke="#fbbf24" strokeWidth="0.8" />
      {RADAR_KEYS.map((k, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        return (
          <text key={k} x={cx + Math.cos(ang) * 46} y={cy + Math.sin(ang) * 46} textAnchor="middle" className="fill-muted-foreground" fontSize="4.2">
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/70 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-lg tabular-nums leading-none">{value}</p>
    </div>
  );
}

function PlayerReport({ player }: { player: PlayerDossier }) {
  const { t } = useI18n();
  const s = player.stats;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-amber-300">
          #{player.id} {player.position}
        </span>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px]">{player.role}</span>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase">
          {player.team === "away" ? t("analysis.away") : t("analysis.home")}
        </span>
        <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] uppercase text-sky-300">{player.recommendation}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label={t("analysis.running")} value={`${s.distanceM} m`} />
        <Stat label={t("analysis.sprints")} value={String(s.sprints)} />
        <Stat label={t("analysis.maxSpeed")} value={`${s.maxSpeedKmh} km/h`} />
        <Stat label={t("analysis.passing")} value={`${s.passesCompleted}/${s.passesAttempted}`} />
        <Stat label={t("analysis.passAccuracy")} value={`${s.passAccuracy}%`} />
        <Stat label={t("analysis.keyPasses")} value={String(s.keyPasses)} />
        <Stat label={t("analysis.positioning")} value={String(s.positioning)} />
        <Stat label={t("analysis.tackles")} value={`${s.tacklesWon}–${s.tacklesLost}`} />
        <Stat label={t("analysis.shots")} value={`${s.shots} (${s.shotsOnTarget})`} />
        <Stat label={t("analysis.xg")} value={String(s.xg)} />
        <Stat label={t("analysis.defending")} value={String(s.defending)} />
        <Stat label={t("analysis.interceptions")} value={String(s.interceptions)} />
        <Stat label={t("analysis.chancesCreated")} value={String(s.chancesCreated)} />
        <Stat label={t("analysis.chancesWasted")} value={String(s.chancesWasted)} />
        <Stat label={t("analysis.duels")} value={String(s.duels)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-xl border border-border bg-card p-2">
          <p className="px-2 pt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.radar")}</p>
          <RadarChart
            radar={player.radar}
            labels={[
              t("analysis.technical"),
              t("analysis.tactical"),
              t("analysis.physical"),
              t("analysis.mental"),
              t("analysis.attacking"),
              t("analysis.defending"),
            ]}
          />
        </div>
        <div className="grid gap-3">
          <p className="text-sm leading-relaxed">{player.notes}</p>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.strengths")}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {player.strengths.map((s) => (
                <span key={s} className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.weaknesses")}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {player.weaknesses.map((s) => (
                <span key={s} className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs text-amber-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Result({ data }: { data: VideoAnalysis }) {
  const { t } = useI18n();
  const dossiers = data.dossiers ?? [];
  const issues = (data.teamIssues ?? []).filter((issue) => !isUselessIssue(issue.problem, issue.zone));
  const [selectedId, setSelectedId] = useState<number>(dossiers[0]?.id ?? data.playerBoxes.find((b) => b.label === "player")?.id ?? 1);
  const selected = useMemo(() => dossiers.find((d) => d.id === selectedId) ?? dossiers[0], [dossiers, selectedId]);
  return (
    <div className="mt-4 grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {data.kickoffDetected && (
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] uppercase text-emerald-300">
            {t("analysis.kickoff")}
          </span>
        )}
        {data.pitchDetected && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase">{t("analysis.pitch")}</span>
        )}
        {data.refereeId != null && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase">
            {t("analysis.referee")} #{data.refereeId}
          </span>
        )}
        {data.formation && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase">
            {t("analysis.home")}: {data.formation}
          </span>
        )}
        {data.formationAway && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase">
            {t("analysis.away")}: {data.formationAway}
          </span>
        )}
        {data.possession && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase">
            {t("analysis.possession")}: {data.possession.home}–{data.possession.away}
          </span>
        )}
      </div>

      {dossiers.length > 0 && dossiers.length < 6 && (
        <p className="rounded-lg border border-border bg-card/60 px-3 py-2 text-sm text-muted-foreground">{t("analysis.tightHint")}</p>
      )}

      {data.heatmap?.length ? (
        <PitchMap grid={data.heatmap} players={data.playerBoxes ?? []} selectedId={selectedId} onPick={setSelectedId} />
      ) : null}

      {!!issues.length && (
        <div className="grid gap-2">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.teamIssues")}</p>
          {issues.map((issue, i) => (
            <div key={`${issue.zone}-${i}`} className="rounded-lg border border-border bg-card/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-amber-300">
                {issue.team} · {issue.zone} · {issue.severity}
              </p>
              <p className="mt-1 text-sm">{issue.problem}</p>
            </div>
          ))}
        </div>
      )}

      {dossiers.length >= 1 ? (
        <>
          <div className="flex flex-wrap gap-1.5">
            {dossiers.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedId(d.id)}
                className={`rounded-full border px-2.5 py-1 text-xs ${
                  d.id === selectedId ? "border-amber-400 bg-amber-400/15 text-amber-200" : "border-border text-muted-foreground"
                }`}
              >
                #{d.id} {d.position}
              </button>
            ))}
          </div>
          {selected ? <PlayerReport player={selected} /> : null}
        </>
      ) : null}
      <p className="text-[11px] text-muted-foreground">{t("analysis.disclaimer")}</p>
    </div>
  );
}

export function AnalysisPanel({
  videoId,
  videoUrl,
  initialStatus,
  initialAnalysis,
  canRun,
}: {
  videoId: number;
  videoUrl: string;
  initialStatus?: AnalysisStatus | null;
  initialAnalysis?: VideoAnalysis | null;
  canRun: boolean;
}) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["analysis", videoId],
    queryFn: () => getVideoAnalysis({ data: { videoId } }),
    enabled: canRun && videoId > 0,
    refetchInterval: (query) => (isPendingStatus(query.state.data?.status) ? 2500 : false),
  });
  const run = useMutation({
    mutationFn: () => enqueueVideoAnalysis({ data: { videoId, videoUrl } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["analysis", videoId] });
      void qc.invalidateQueries({ queryKey: ["my-profile"] });
    },
  });

  const status = (q.data?.status ?? initialStatus ?? "idle") as AnalysisStatus;
  const analysis = q.data?.analysis ?? initialAnalysis ?? null;
  const blocked = isBlockedAnalysis(analysis);
  const pending = isPendingStatus(status) || run.isPending;
  const ready = !blocked && analysis && (status === "analyzed" || (status === "awaiting_mark" && analysis.dossiers?.length));

  useEffect(() => {
    if (!canRun || !videoId || pending || !blocked) return;
    if (status === "failed" || status === "extraction_failed") return;
    run.mutate();
  }, [blocked, canRun, pending, status, videoId]);

  return (
    <div className="mt-3 rounded-xl border border-border bg-background/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("analysis.kicker")}</p>
          <p className="text-sm text-muted-foreground">{t(`analysis.status.${status}`)}</p>
        </div>
        {canRun && (
          <Button type="button" size="sm" variant="outline" disabled={pending || !videoId} onClick={() => run.mutate()}>
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Radar className="size-3.5" />}
            <span className="ms-1.5">{t("analysis.run")}</span>
          </Button>
        )}
      </div>
      {q.data?.error && <p className="mt-2 text-xs text-destructive">{q.data.error}</p>}
      {ready && analysis ? <Result data={analysis} /> : null}
    </div>
  );
}
