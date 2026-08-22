import { getSql } from "@/lib/db";
import { extractStreamUrl, ExtractionError } from "./yt-dlp";
import { analyzeStream } from "./hf-football";
import type { AnalysisStatus, VideoAnalysis } from "@/lib/video-analysis";

let looping = false;
let timer: ReturnType<typeof setInterval> | null = null;

export function ensureAnalysisWorker() {
  if (timer) return;
  timer = setInterval(() => {
    void tick();
  }, 1500);
  void tick();
}

async function tick() {
  if (looping) return;
  looping = true;
  try {
    const sql = await getSql();
    const [job] = await sql<{
      id: number;
      video_id: number;
      user_id: string;
      video_url: string;
      attempts: number;
    }>`
      select id, video_id, user_id, video_url, attempts
      from video_analysis_jobs
      where status = 'queued'
      order by id
      limit 1
    `;
    if (!job) return;
    await processJob(job);
  } catch (err) {
    console.error("[analysis-worker]", err);
  } finally {
    looping = false;
  }
}

async function setVideoStatus(
  videoId: number,
  status: AnalysisStatus,
  extra: { json?: VideoAnalysis | null; error?: string | null } = {},
) {
  const sql = await getSql();
  if (status === "analyzed" && extra.json) {
    await sql`
      update player_videos set
        analysis_status = ${status},
        analysis_json = ${JSON.stringify(extra.json)}::jsonb,
        analysis_error = null,
        analyzed_at = now()
      where id = ${videoId}
    `;
    return;
  }
  await sql`
    update player_videos set
      analysis_status = ${status},
      analysis_error = ${extra.error ?? null}
    where id = ${videoId}
  `;
}

async function processJob(job: {
  id: number;
  video_id: number;
  user_id: string;
  video_url: string;
  attempts: number;
}) {
  const sql = await getSql();
  await sql`
    update video_analysis_jobs
    set status = 'running', attempts = ${job.attempts + 1}, updated_at = now()
    where id = ${job.id} and status = 'queued'
  `;
  await setVideoStatus(job.video_id, "running");

  let streamUrl = "";
  let quality: string | null = null;
  try {
    const extracted = await extractStreamUrl(job.video_url);
    streamUrl = extracted.url;
    quality = extracted.quality;
    await sql`
      update video_analysis_jobs set stream_url = ${streamUrl}, updated_at = now() where id = ${job.id}
    `;
  } catch (err) {
    const message = err instanceof ExtractionError ? err.message : `extraction: ${String(err)}`;
    console.error("[analysis] extraction fallback to page URL", job.id, message);
    streamUrl = job.video_url;
    quality = "source-url";
    await sql`
      update video_analysis_jobs set stream_url = ${streamUrl}, last_error = ${message}, updated_at = now()
      where id = ${job.id}
    `;
  }

  try {
    const analysis = await analyzeStream(streamUrl, job.video_url, quality);
    await sql`
      update video_analysis_jobs
      set status = 'analyzed', last_error = null, updated_at = now()
      where id = ${job.id}
    `;
    await setVideoStatus(job.video_id, "analyzed", { json: analysis, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[analysis] failed", job.id, message);
    await sql`
      update video_analysis_jobs
      set status = 'failed', last_error = ${message}, updated_at = now()
      where id = ${job.id}
    `;
    await setVideoStatus(job.video_id, "failed", { error: message });
  }
}

export async function enqueueJob(userId: string, videoId: number, videoUrl: string) {
  ensureAnalysisWorker();
  const sql = await getSql();
  const [owned] = await sql<{ id: number; analysis_status: string }>`
    select v.id, v.analysis_status
    from player_videos v
    join player_profiles p on p.id = v.profile_id
    where v.id = ${videoId} and p.user_id = ${userId}
  `;
  if (!owned) throw new Error("Video not found");
  if (owned.analysis_status === "queued" || owned.analysis_status === "running") {
    const [existing] = await sql<{ id: number }>`
      select id from video_analysis_jobs
      where video_id = ${videoId} and status in ('queued','running')
      order by id desc limit 1
    `;
    return { jobId: existing?.id ?? 0, status: owned.analysis_status as AnalysisStatus };
  }
  const [job] = await sql<{ id: number }>`
    insert into video_analysis_jobs (video_id, user_id, video_url, status)
    values (${videoId}, ${userId}, ${videoUrl}, 'queued')
    returning id
  `;
  await setVideoStatus(videoId, "queued", { json: null, error: null });
  if (process.env.VERCEL) {
    await processJob({
      id: job.id,
      video_id: videoId,
      user_id: userId,
      video_url: videoUrl,
      attempts: 0,
    });
  } else {
    void tick();
  }
  const [fresh] = await sql<{ status: string }>`
    select analysis_status as status from player_videos where id = ${videoId}
  `;
  return { jobId: job.id, status: (fresh?.status ?? "queued") as AnalysisStatus };
}
