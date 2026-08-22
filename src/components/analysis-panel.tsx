import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Radar } from "lucide-react";
import { enqueueVideoAnalysis, getVideoAnalysis } from "@/lib/server/analysis";
import { isPendingStatus, type AnalysisStatus, type PlayerBox, type RadarScores, type VideoAnalysis } from "@/lib/video-analysis";
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

function PitchMap({ grid, players }: { grid: number[][]; players: PlayerBox[] }) {
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
        <circle cx="11" cy="34" r="0.45" fill="white" />
        <circle cx="94" cy="34" r="0.45" fill="white" />
        {players.map((p) => (
          <g key={p.id}>
            <circle
              cx={((p.pitchX ?? 50) / 100) * 105}
              cy={((p.pitchY ?? 50) / 100) * 68}
              r={p.label === "ball" ? 0.85 : 1.35}
              fill={p.label === "ball" ? "#f8fafc" : p.team === "away" ? "#ef4444" : "#38bdf8"}
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="0.25"
            />
          </g>
        ))}
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
  const rings = [0.33, 0.66, 1];
  return (
    <svg viewBox="0 0 100 108" className="h-full w-full">
      {rings.map((s) => (
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
      {RADAR_KEYS.map((_, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(ang) * r}
            y2={cy + Math.sin(ang) * r}
            stroke="currentColor"
            className="text-border"
            strokeWidth="0.35"
          />
        );
      })}
      <polygon points={poly} fill="rgba(56,189,248,0.28)" stroke="#38bdf8" strokeWidth="0.8" />
      {RADAR_KEYS.map((k, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        const x = cx + Math.cos(ang) * 46;
        const y = cy + Math.sin(ang) * 46 + (ang > 1 && ang < 2.2 ? 4 : 0);
        return (
          <text key={k} x={x} y={y} textAnchor="middle" className="fill-muted-foreground" fontSize="4.2">
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

function Result({ data }: { data: VideoAnalysis }) {
  const { t } = useI18n();
  const rec = data.recommendation || "";
  return (
    <div className="mt-4 grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {data.phase && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
            {t("analysis.phase")}: {data.phase}
          </span>
        )}
        {data.formation && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
            {t("analysis.formation")}: {data.formation}
          </span>
        )}
        {rec && (
          <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-sky-300">
            {t("analysis.recommendation")}: {rec}
          </span>
        )}
      </div>

      {data.heatmap?.length ? <PitchMap grid={data.heatmap} players={data.playerBoxes ?? []} /> : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label={t("analysis.players")} value={String(data.playersOnPitch ?? data.playerBoxes?.filter((b) => b.label !== "ball").length ?? 0)} />
        <Stat
          label={t("analysis.possession")}
          value={data.possession ? `${data.possession.home}–${data.possession.away}` : "—"}
        />
        <Stat label={t("analysis.distance")} value={data.distanceCoveredM != null ? `${data.distanceCoveredM} m` : "—"} />
        <Stat label={t("analysis.sprints")} value={data.stats?.sprints != null ? String(data.stats.sprints) : "—"} />
        <Stat label={t("analysis.duels")} value={data.stats?.duels != null ? String(data.stats.duels) : "—"} />
        <Stat label={t("analysis.compactness")} value={data.compactness != null ? String(data.compactness) : "—"} />
        <Stat label={t("analysis.width")} value={data.width != null ? String(data.width) : "—"} />
        <Stat label={t("analysis.intensity")} value={data.intensity != null ? String(data.intensity) : "—"} />
      </div>

      {data.radar && (
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="rounded-xl border border-border bg-card p-2">
            <p className="px-2 pt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.radar")}</p>
            <RadarChart
              radar={data.radar}
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
            {data.notes && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.notes")}</p>
                <p className="mt-1 text-sm leading-relaxed">{data.notes}</p>
              </div>
            )}
            {!!data.strengths?.length && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.strengths")}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {data.strengths.map((s) => (
                    <span key={s} className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {!!data.weaknesses?.length && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.weaknesses")}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {data.weaknesses.map((s) => (
                    <span key={s} className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs text-amber-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
  const pending = isPendingStatus(status) || run.isPending;

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
      {analysis && status === "analyzed" && <Result data={analysis} />}
    </div>
  );
}
