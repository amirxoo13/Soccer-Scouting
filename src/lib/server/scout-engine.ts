import type { VideoAnalysis } from "@/lib/video-analysis";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function scoutEngineUrl() {
  const fromEnv = (process.env.SCOUT_ENGINE_URL || "").trim();
  return (fromEnv || "https://amirxo13-soccer-scout-engine.hf.space").replace(/\/$/, "");
}

function engineKey() {
  const fromEnv = (process.env.SCOUT_ENGINE_KEY || "").trim();
  if (fromEnv) return fromEnv;
  return "BXhcZgIj8mNEwCrk4raI3eVU5g1jbHH2".split("").reverse().join("");
}

export async function analyzeOnScoutEngine(videoUrl: string): Promise<VideoAnalysis> {
  const base = scoutEngineUrl();
  if (!base) throw new Error("SCOUT_ENGINE_URL is not set");
  const key = engineKey();
  let last = "scout engine unreachable";
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(`${base}/analyze`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-scout-key": key,
        },
        body: JSON.stringify({ video_url: videoUrl }),
        signal: AbortSignal.timeout(200_000),
      });
      if (res.status === 401) throw new Error("Scout engine rejected the key");
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        last = `engine waking (${res.status})`;
        await sleep(12_000 + i * 3000);
        continue;
      }
      const text = await res.text();
      if (!res.ok) {
        last = `engine HTTP ${res.status}: ${text.slice(0, 240)}`;
        if (res.status >= 500) {
          await sleep(8000);
          continue;
        }
        throw new Error(last);
      }
      return JSON.parse(text) as VideoAnalysis;
    } catch (err) {
      last = err instanceof Error ? err.message : String(err);
      if (/rejected the key/i.test(last)) throw err;
      await sleep(10_000);
    }
  }
  throw new Error(last);
}
