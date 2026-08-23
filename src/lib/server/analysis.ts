import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { AnalysisStatus, VideoAnalysis } from "@/lib/video-analysis";
import { sanitizeAnalysis } from "@/lib/video-analysis";

export const enqueueVideoAnalysis = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { videoId: number; videoUrl: string }) => input)
  .handler(async ({ context, data }) => {
    const url = data.videoUrl?.trim();
    if (!data.videoId || !url) throw new Error("video_id and video_url are required");
    const { enqueueJob } = await import("./analysis-queue");
    const result = await enqueueJob(context.userId, data.videoId, url);
    return { accepted: true, httpStatus: 202 as const, jobId: result.jobId, status: result.status };
  });

export const getVideoAnalysis = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { videoId: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [row] = await sql<{
      id: number;
      analysis_status: string;
      analysis_json: unknown;
      analysis_error: string | null;
      analyzed_at: string | null;
      youtube_url: string;
    }>`
      select v.id, v.analysis_status, v.analysis_json, v.analysis_error, v.analyzed_at::text as analyzed_at, v.youtube_url
      from player_videos v
      join player_profiles p on p.id = v.profile_id
      where v.id = ${data.videoId} and p.user_id = ${context.userId}
    `;
    if (!row) throw new Error("Video not found");
    const analysis = sanitizeAnalysis(row.analysis_json);
    const hasReport = !!analysis?.dossiers?.length;
    return {
      videoId: row.id,
      videoUrl: row.youtube_url,
      status: (hasReport ? row.analysis_status : "idle") as AnalysisStatus,
      error: row.analysis_error,
      analyzedAt: row.analyzed_at,
      analysis: hasReport ? analysis : null,
    };
  });
