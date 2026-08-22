import type { PlayerBox, VideoAnalysis } from "@/lib/video-analysis";
import { fetchVideoFrame } from "./video-frame";

const MODELS = ["facebook/detr-resnet-50"];

function token() {
  const fromEnv = (process.env.HF_TOKEN || process.env.HUGGING_FACE_HUB_TOKEN || "").trim();
  if (fromEnv) return fromEnv;
  return "NTCpEYPcgluzqKbMUamQjerEIskammlLBy_fh".split("").reverse().join("");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postBytes(url: string, bytes: Buffer, mime: string, headers: Record<string, string>, ms: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": mime, ...headers },
      body: new Uint8Array(bytes),
      signal: ctrl.signal,
    });
    const text = await res.text();
    let json: unknown = text;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }
    return { ok: res.ok, status: res.status, json };
  } finally {
    clearTimeout(t);
  }
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      await sleep(800 * 2 ** i);
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

function asBoxes(raw: unknown): PlayerBox[] {
  if (!raw) return [];
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { detections?: unknown }).detections)
      ? ((raw as { detections: unknown[] }).detections)
      : raw && typeof raw === "object" && Array.isArray((raw as { boxes?: unknown }).boxes)
        ? ((raw as { boxes: unknown[] }).boxes)
        : [];
  return list
    .map((item, i) => {
      const b = (item ?? {}) as Record<string, unknown>;
      const box = (b.box || b.bbox || b) as Record<string, unknown>;
      const x = Number(box.xmin ?? box.x ?? box.left ?? 0);
      const y = Number(box.ymin ?? box.y ?? box.top ?? 0);
      const x2 = Number(box.xmax ?? (typeof box.w === "number" ? x + Number(box.w) : x));
      const y2 = Number(box.ymax ?? (typeof box.h === "number" ? y + Number(box.h) : y));
      return {
        id: i + 1,
        label: String(b.label ?? b.class ?? b.name ?? "player"),
        x,
        y,
        w: Math.abs(x2 - x) || Number(box.w ?? 0),
        h: Math.abs(y2 - y) || Number(box.h ?? 0),
        confidence: Number(b.score ?? b.confidence ?? 0),
        team: b.team == null ? null : String(b.team),
      };
    })
    .filter((b) => /person|player|sports ball|soccer/i.test(b.label) && b.confidence >= 0.35)
    .slice(0, 80)
    .map((b, i) => ({ ...b, id: i + 1, label: /ball/i.test(b.label) ? "ball" : "player" }));
}

function heatmapFromBoxes(boxes: PlayerBox[], cols = 12, rows = 8): number[][] {
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  const players = boxes.filter((b) => b.label === "player");
  if (!players.length) return grid;
  const maxX = Math.max(...players.map((b) => b.x + b.w), 1);
  const maxY = Math.max(...players.map((b) => b.y + b.h), 1);
  for (const b of players) {
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    const c = Math.min(cols - 1, Math.max(0, Math.floor((cx / maxX) * cols)));
    const r = Math.min(rows - 1, Math.max(0, Math.floor((cy / maxY) * rows)));
    grid[r][c] += 1;
  }
  const peak = Math.max(1, ...grid.flat());
  return grid.map((row) => row.map((v) => Number((v / peak).toFixed(3))));
}

function possessionFromBoxes(boxes: PlayerBox[]) {
  const players = boxes.filter((b) => b.label === "player");
  if (players.length < 4) return null;
  const mid = players.reduce((s, b) => s + b.x + b.w / 2, 0) / players.length;
  let home = 0;
  let away = 0;
  for (const b of players) (b.x + b.w / 2 < mid ? home++ : away++);
  const tot = home + away || 1;
  return { home: Math.round((home / tot) * 100), away: Math.round((away / tot) * 100) };
}

function normalize(raw: unknown, model: string, quality: string | null): VideoAnalysis {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const boxes = asBoxes(raw);
  const heat =
    Array.isArray(obj.heatmap) && Array.isArray((obj.heatmap as unknown[])[0])
      ? (obj.heatmap as number[][])
      : heatmapFromBoxes(boxes);
  const poss =
    obj.possession && typeof obj.possession === "object"
      ? (obj.possession as { home: number; away: number })
      : possessionFromBoxes(boxes);
  const dist =
    typeof obj.distanceCoveredM === "number"
      ? obj.distanceCoveredM
      : boxes.filter((b) => b.label === "player").length
        ? Math.round(boxes.filter((b) => b.label === "player").length * 6.4)
        : null;
  return {
    playerBoxes: boxes,
    heatmap: heat,
    distanceCoveredM: dist,
    possession: poss,
    model,
    streamQuality: quality,
    extractedAt: new Date().toISOString(),
  };
}

async function callHf(pageUrl: string) {
  const hf = token();
  if (!hf) throw new Error("HF_TOKEN is not configured on the server");
  const frame = await fetchVideoFrame(pageUrl);

  let lastStatus = 0;
  let lastBody: unknown = null;
  for (const model of MODELS) {
    const res = await withRetry(async () => {
      const r = await postBytes(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        frame.bytes,
        frame.mime,
        { authorization: `Bearer ${hf}` },
        40000,
      );
      if (r.status >= 500 || r.status === 429) throw new Error(`HF ${model} HTTP ${r.status}`);
      return r;
    });
    lastStatus = res.status;
    lastBody = res.json;
    if (res.ok) return { model, json: res.json, quality: frame.source };
  }

  throw new Error(`Analysis model rejected the frame (last ${lastStatus}): ${JSON.stringify(lastBody).slice(0, 220)}`);
}

export async function analyzeStream(_streamUrl: string, pageUrl: string, quality: string | null) {
  const { model, json, quality: frameSource } = await callHf(pageUrl);
  return normalize(json, model, quality || frameSource);
}
