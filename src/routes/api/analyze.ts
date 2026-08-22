import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { auth } = await import("@/lib/auth/server");
        const { enqueueJob } = await import("@/lib/server/analysis-queue");
        const session = await auth.api.getSession({ headers: request.headers });
        const userId = session?.user?.id;
        if (!userId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        let body: { video_id?: number; video_url?: string; videoId?: number; videoUrl?: string };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const videoId = Number(body.video_id ?? body.videoId);
        const videoUrl = String(body.video_url ?? body.videoUrl ?? "").trim();
        if (!videoId || !videoUrl) {
          return Response.json({ error: "video_id and video_url are required" }, { status: 400 });
        }
        try {
          const result = await enqueueJob(userId, videoId, videoUrl);
          return Response.json(
            { accepted: true, jobId: result.jobId, status: result.status },
            { status: 202 },
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Enqueue failed";
          const code = message === "Video not found" ? 404 : 400;
          return Response.json({ error: message }, { status: code });
        }
      },
    },
  },
});
