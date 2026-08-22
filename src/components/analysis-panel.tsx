import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Radar } from "lucide-react";
import { enqueueVideoAnalysis, getVideoAnalysis } from "@/lib/server/analysis";
import { isPendingStatus, type AnalysisStatus, type VideoAnalysis } from "@/lib/video-analysis";
import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";

function Heatmap({ grid }: { grid: number[][] }) {
  return (
    <div
      className="grid aspect-[3/2] w-full overflow-hidden rounded-md border border-border bg-[#0e1411]"
      style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 12}, minmax(0, 1fr))` }}
    >
      {grid.flatMap((row, r) =>
        row.map((v, c) => (
          <span
            key={`${r}-${c}`}
            className="block"
            style={{ background: `rgba(212, 181, 106, ${Math.min(1, v)})` }}
          />
        )),
      )}
    </div>
  );
}

function Result({ data }: { data: VideoAnalysis }) {
  const { t } = useI18n();
  return (
    <div className="mt-3 grid gap-3 text-sm">
      {data.heatmap?.length ? <Heatmap grid={data.heatmap} /> : null}
      <dl className="grid grid-cols-2 gap-2">
        <div>
          <dt className="text-xs text-muted-foreground">{t("analysis.boxes")}</dt>
          <dd className="tabular-nums">{data.playerBoxes?.length ?? 0}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t("analysis.distance")}</dt>
          <dd className="tabular-nums">{data.distanceCoveredM != null ? `${data.distanceCoveredM} m` : "—"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-muted-foreground">{t("analysis.possession")}</dt>
          <dd className="tabular-nums">
            {data.possession ? `${data.possession.home}% / ${data.possession.away}%` : "—"}
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        {data.model}
        {data.streamQuality ? ` · ${data.streamQuality}` : ""}
      </p>
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
    refetchInterval: (query) => (isPendingStatus(query.state.data?.status) ? 2000 : false),
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
    <div className="mt-3 rounded-lg border border-border bg-background/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs tracking-wide text-muted-foreground">{t(`analysis.status.${status}`)}</p>
        {canRun && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending || !videoId}
            onClick={() => run.mutate()}
          >
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
