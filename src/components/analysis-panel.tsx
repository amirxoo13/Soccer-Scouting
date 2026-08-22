import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Radar } from "lucide-react";
import { enqueueVideoAnalysis, getVideoAnalysis, markVideoPlayer } from "@/lib/server/analysis";
import {
  isPendingStatus,
  type AnalysisStatus,
  type PlayerAttributes,
  type PlayerBox,
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
  markedId,
  onPick,
}: {
  grid: number[][];
  players: PlayerBox[];
  markedId?: number | null;
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
          const marked = markedId === p.id;
          return (
            <g
              key={p.id}
              className={onPick && p.label === "player" ? "cursor-pointer" : undefined}
              onClick={() => p.label === "player" && onPick?.(p.id)}
            >
              {marked && <circle cx={cx} cy={cy} r="3.2" fill="none" stroke="#fbbf24" strokeWidth="0.7" />}
              <circle
                cx={cx}
                cy={cy}
                r={p.label === "ball" ? 0.85 : marked ? 1.8 : 1.35}
                fill={p.label === "ball" ? "#f8fafc" : marked ? "#fbbf24" : p.team === "away" ? "#ef4444" : "#38bdf8"}
                stroke="rgba(0,0,0,0.45)"
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

function MarkerFrame({
  data,
  busy,
  onPick,
}: {
  data: VideoAnalysis;
  busy: boolean;
  onPick: (id: number) => void;
}) {
  const { t } = useI18n();
  const w = data.frameWidth || 1;
  const h = data.frameHeight || 1;
  const players = (data.playerBoxes ?? []).filter((b) => b.label === "player");
  return (
    <div className="mt-4 grid gap-3">
      <div>
        <p className="font-display text-xl">{t("analysis.markTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("analysis.markHint")}</p>
      </div>
      {data.frameUrl ? (
        <div className={`relative overflow-hidden rounded-xl border border-amber-400/40 bg-black ${busy ? "opacity-70" : ""}`}>
          <img src={data.frameUrl} alt="" className="block w-full" />
          {players.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={busy}
              onClick={() => onPick(p.id)}
              className="absolute border-2 border-amber-400 bg-amber-400/10 hover:bg-amber-400/25"
              style={{
                left: `${(p.x / w) * 100}%`,
                top: `${(p.y / h) * 100}%`,
                width: `${(p.w / w) * 100}%`,
                height: `${(p.h / h) * 100}%`,
              }}
            >
              <span className="absolute -top-5 start-0 rounded-sm bg-amber-400 px-1.5 text-[11px] font-semibold text-black">
                {p.id}
              </span>
            </button>
          ))}
        </div>
      ) : data.heatmap?.length ? (
        <PitchMap grid={data.heatmap} players={data.playerBoxes ?? []} onPick={busy ? undefined : onPick} />
      ) : null}
      <div className="flex flex-wrap gap-2">
        {players.map((p) => (
          <Button key={p.id} type="button" size="sm" variant="outline" disabled={busy} onClick={() => onPick(p.id)}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
            <span className="ms-1">{t("analysis.markCta")} #{p.id}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

const RADAR_KEYS: (keyof RadarScores)[] = ["technical", "tactical", "physical", "mental", "attacking", "defending"];
const ATTR_KEYS: (keyof PlayerAttributes)[] = [
  "firstTouch",
  "weakerFoot",
  "scanning",
  "acceleration",
  "agility",
  "passing",
  "dribble",
  "finishing",
  "positioning",
  "decisionMaking",
];

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
      <polygon points={poly} fill="rgba(251,191,36,0.28)" stroke="#fbbf24" strokeWidth="0.8" />
      {RADAR_KEYS.map((k, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        const x = cx + Math.cos(ang) * 46;
        const y = cy + Math.sin(ang) * 46;
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

function AttrBars({ attrs }: { attrs: PlayerAttributes }) {
  const { t } = useI18n();
  return (
    <div className="grid gap-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("analysis.attributes")}</p>
      {ATTR_KEYS.map((k) => (
        <div key={k} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-2 text-xs">
          <span className="text-muted-foreground">{t(`analysis.${k}`)}</span>
          <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <span className="block h-full rounded-full bg-amber-400" style={{ width: `${attrs[k]}%` }} />
          </span>
          <span className="tabular-nums">{attrs[k]}</span>
        </div>
      ))}
    </div>
  );
}

function Result({ data, onRemake }: { data: VideoAnalysis; onRemake?: () => void }) {
  const { t } = useI18n();
  const rec = data.recommendation || "";
  return (
    <div className="mt-4 grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {data.position && (
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
            {t("analysis.position")}: {data.position}
          </span>
        )}
        {data.role && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
            {t("analysis.role")}: {data.role}
          </span>
        )}
        {data.level && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
            {t("analysis.level")}: {data.level}
          </span>
        )}
        {data.phase && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
            {t("analysis.phase")}: {data.phase}
          </span>
        )}
        {rec && (
          <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-sky-300">
            {t("analysis.recommendation")}: {rec}
          </span>
        )}
        {onRemake && (
          <button type="button" className="text-[11px] text-muted-foreground underline-offset-2 hover:underline" onClick={onRemake}>
            {t("analysis.remake")}
          </button>
        )}
      </div>

      {data.heatmap?.length ? (
        <PitchMap grid={data.heatmap} players={data.playerBoxes ?? []} markedId={data.markedPlayerId} />
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label={t("analysis.distance")} value={data.distanceCoveredM != null ? `${data.distanceCoveredM} m` : "—"} />
        <Stat label={t("analysis.sprints")} value={data.stats?.sprints != null ? String(data.stats.sprints) : "—"} />
        <Stat label={t("analysis.duels")} value={data.stats?.duels != null ? String(data.stats.duels) : "—"} />
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
            {data.attributes && <AttrBars attrs={data.attributes} />}
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
  const mark = useMutation({
    mutationFn: (playerId: number) => markVideoPlayer({ data: { videoId, playerId } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["analysis", videoId] });
      void qc.invalidateQueries({ queryKey: ["my-profile"] });
    },
  });

  const status = (q.data?.status ?? initialStatus ?? "idle") as AnalysisStatus;
  const analysis = q.data?.analysis ?? initialAnalysis ?? null;
  const pending = isPendingStatus(status) || run.isPending || mark.isPending;
  const awaiting = status === "awaiting_mark" && analysis;

  return (
    <div className="mt-3 rounded-xl border border-border bg-background/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("analysis.kicker")}</p>
          <p className="text-sm text-muted-foreground">{t(`analysis.status.${status}`)}</p>
        </div>
        {canRun && (
          <Button type="button" size="sm" variant="outline" disabled={pending || !videoId} onClick={() => run.mutate()}>
            {run.isPending || status === "queued" || status === "running" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Radar className="size-3.5" />
            )}
            <span className="ms-1.5">{t("analysis.run")}</span>
          </Button>
        )}
      </div>
      {(q.data?.error || mark.error) && (
        <p className="mt-2 text-xs text-destructive">
          {q.data?.error || (mark.error instanceof Error ? mark.error.message : t("analysis.status.failed"))}
        </p>
      )}
      {awaiting && <MarkerFrame data={analysis} busy={mark.isPending} onPick={(id) => mark.mutate(id)} />}
      {analysis && status === "analyzed" && (
        <Result
          data={analysis}
          onRemake={
            canRun
              ? () => {
                  const first = analysis.playerBoxes?.find((b) => b.label === "player");
                  if (first) mark.reset();
                  void qc.setQueryData(["analysis", videoId], (old: unknown) => {
                    const prev = old as { status?: string; analysis?: VideoAnalysis } | undefined;
                    return { ...(prev ?? {}), status: "awaiting_mark", analysis: { ...analysis, stage: "mark", markedPlayerId: null } };
                  });
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
