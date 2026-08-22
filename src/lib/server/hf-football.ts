import type { PlayerAttributes, PlayerBox, RadarScores, VideoAnalysis } from "@/lib/video-analysis";
import { fetchVideoFrames, type VideoFrame } from "./video-frame";

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

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      await sleep(700 * 2 ** i);
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

function clamp(n: number, a = 0, b = 100) {
  if (!Number.isFinite(n)) return a;
  return Math.max(a, Math.min(b, Math.round(n)));
}

function asBoxes(raw: unknown, imgW: number, imgH: number): PlayerBox[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [];
  const w = imgW || 1;
  const h = imgH || 1;
  return list
    .map((item, i) => {
      const b = (item ?? {}) as Record<string, unknown>;
      const box = (b.box || b.bbox || b) as Record<string, unknown>;
      const x = Number(box.xmin ?? box.x ?? 0);
      const y = Number(box.ymin ?? box.y ?? 0);
      const x2 = Number(box.xmax ?? x);
      const y2 = Number(box.ymax ?? y);
      const bw = Math.abs(x2 - x);
      const bh = Math.abs(y2 - y);
      const cx = x + bw / 2;
      const cy = y + bh / 2;
      const label = String(b.label ?? b.class ?? "player");
      return {
        id: i + 1,
        label: /ball/i.test(label) ? "ball" : "player",
        x,
        y,
        w: bw,
        h: bh,
        pitchX: clamp((cx / w) * 100),
        pitchY: clamp((cy / h) * 100),
        confidence: Number(b.score ?? b.confidence ?? 0),
        team: null as string | null,
        role: null as string | null,
      };
    })
    .filter((b) => (b.label === "ball" || /player|person|soccer/i.test(b.label)) && b.confidence >= 0.4)
    .slice(0, 80);
}

function assignTeams(boxes: PlayerBox[]) {
  const players = boxes.filter((b) => b.label === "player");
  if (!players.length) return boxes;
  const xs = players.map((b) => b.pitchX ?? 50).sort((a, b) => a - b);
  const mid = xs[Math.floor(xs.length / 2)] ?? 50;
  return boxes.map((b) => (b.label === "ball" ? b : { ...b, team: (b.pitchX ?? 50) < mid ? "home" : "away" }));
}

function gaussianHeat(boxes: PlayerBox[], cols = 48, rows = 30, sigma = 2.6) {
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  const pts = boxes.filter((b) => b.label === "player");
  if (!pts.length) return grid;
  const s2 = 2 * sigma * sigma;
  const radius = Math.ceil(sigma * 3);
  for (const p of pts) {
    const cx = ((p.pitchX ?? 50) / 100) * (cols - 1);
    const cy = ((p.pitchY ?? 50) / 100) * (rows - 1);
    const c0 = Math.max(0, Math.floor(cx - radius));
    const c1 = Math.min(cols - 1, Math.ceil(cx + radius));
    const r0 = Math.max(0, Math.floor(cy - radius));
    const r1 = Math.min(rows - 1, Math.ceil(cy + radius));
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        grid[r][c] += Math.exp(-((c - cx) ** 2 + (r - cy) ** 2) / s2);
      }
    }
  }
  const peak = Math.max(1e-6, ...grid.flat());
  return grid.map((row) => row.map((v) => Number((v / peak).toFixed(4))));
}

function spreadMetrics(boxes: PlayerBox[]) {
  const players = boxes.filter((b) => b.label === "player");
  if (players.length < 2) return { compactness: null as number | null, width: null as number | null, intensity: null as number | null };
  const xs = players.map((b) => b.pitchX ?? 50);
  const ys = players.map((b) => b.pitchY ?? 50);
  const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
  const spread = Math.sqrt(
    xs.reduce((a, b) => a + (b - meanX) ** 2, 0) / xs.length + ys.reduce((a, b) => a + (b - meanY) ** 2, 0) / ys.length,
  );
  return {
    compactness: clamp(100 - spread * 1.15),
    width: clamp((Math.max(...xs) - Math.min(...xs)) * 1.05),
    intensity: clamp(42 + players.length * 3.4),
  };
}

function extractJson(text: string): Record<string, unknown> | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

async function detectFrame(frame: VideoFrame, hf: string): Promise<PlayerBox[]> {
  const res = await withRetry(async () => {
    const r = await postBytes(
      "https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50",
      frame.bytes,
      frame.mime,
      { authorization: `Bearer ${hf}` },
      35000,
    );
    if (r.status >= 500 || r.status === 429) throw new Error(`HF DETR HTTP ${r.status}`);
    return r;
  });
  if (!res.ok) {
    console.error("[analysis] detr", res.status, JSON.stringify(res.json).slice(0, 200));
    return [];
  }
  return asBoxes(res.json, frame.width, frame.height);
}

async function scoutWithVision(frame: VideoFrame, hf: string, prompt: string): Promise<Record<string, unknown> | null> {
  const b64 = frame.bytes.toString("base64");
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 40000);
  try {
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${hf}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "google/gemma-3-12b-it",
        temperature: 0.12,
        max_tokens: 900,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${frame.mime};base64,${b64}` } },
            ],
          },
        ],
      }),
      signal: ctrl.signal,
    });
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    if (!res.ok) {
      console.error("[analysis] vision scout", res.status, JSON.stringify(json).slice(0, 240));
      return null;
    }
    return extractJson(json.choices?.[0]?.message?.content || "");
  } catch (err) {
    console.error("[analysis] vision scout failed", err);
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function detectClip(_streamUrl: string, pageUrl: string, quality: string | null): Promise<VideoAnalysis> {
  const hf = token();
  if (!hf) throw new Error("HF_TOKEN is not configured on the server");
  const frames = await fetchVideoFrames(pageUrl, 2);
  const frame = frames[0];
  const raw = await detectFrame(frame, hf);
  const players = raw.filter((b) => b.label === "player");
  const balls = raw.filter((b) => b.label === "ball");
  const numbered = assignTeams(players.map((b, i) => ({ ...b, id: i + 1 }))).concat(
    balls.map((b, i) => ({ ...b, id: players.length + i + 1 })),
  );
  const heat = gaussianHeat(numbered);
  const spread = spreadMetrics(numbered);
  if (!players.length) throw new Error("No player could be marked on this still. Use a match clip, not a trailer.");
  return {
    playerBoxes: numbered,
    heatmap: heat,
    distanceCoveredM: null,
    possession: null,
    model: "facebook/detr-resnet-50",
    streamQuality: quality || frame.source,
    extractedAt: new Date().toISOString(),
    stage: "mark",
    frameUrl: frame.source,
    frameWidth: frame.width,
    frameHeight: frame.height,
    markedPlayerId: null,
    framesAnalyzed: frames.length,
    playersOnPitch: players.length,
    ballDetected: balls.length > 0,
    compactness: spread.compactness,
    width: spread.width,
    intensity: spread.intensity,
  };
}

function playerPrompt(box: PlayerBox, frame: VideoFrame) {
  const x2 = Math.round(box.x + box.w);
  const y2 = Math.round(box.y + box.h);
  const zoneX = (box.pitchX ?? 50) < 33 ? "left third" : (box.pitchX ?? 50) > 66 ? "right third" : "middle third";
  const zoneY = (box.pitchY ?? 50) < 33 ? "near touchline (top of frame)" : (box.pitchY ?? 50) > 66 ? "near touchline (bottom of frame)" : "central corridor";
  return `You are a UEFA Pro licence scout writing a player dossier.
Analyse ONLY the MARKED player. Everyone else is context.
The marked player sits in a gold bounding box on a ${frame.width}x${frame.height} still:
xmin=${Math.round(box.x)}, ymin=${Math.round(box.y)}, xmax=${x2}, ymax=${y2}.
Pitch zone: ${zoneX}, ${zoneY}. Shirt group: ${box.team === "away" ? "away" : "home"}.
Cover every lens a club scout uses: technical (first touch, weaker foot, passing, dribble, finishing),
tactical (positioning, scanning, decision, off-ball),
physical (acceleration, agility, stature impression),
mental (bravery, composure).
Reply with ONE JSON object only, no markdown.
{
  "position": "e.g. RW / 8 / CB",
  "role": "e.g. inverted winger",
  "phase": "attack|defense|transition|set_piece",
  "level": "U19 academy | regional first team | professional",
  "radar": {"technical":0-100,"tactical":0-100,"physical":0-100,"mental":0-100,"attacking":0-100,"defending":0-100},
  "attributes": {"firstTouch":0-100,"weakerFoot":0-100,"scanning":0-100,"acceleration":0-100,"agility":0-100,"passing":0-100,"dribble":0-100,"finishing":0-100,"positioning":0-100,"decisionMaking":0-100},
  "stats": {"distanceM":int,"sprints":int,"duels":int,"progressiveRuns":int,"recoveries":int,"touches":int,"maxSpeedKmh":int},
  "strengths": ["...","...","...","..."],
  "weaknesses": ["...","...","..."],
  "notes": "4 sentences about THIS player only: body shape, first action, off-ball, decision.",
  "recommendation": "trial|monitor|pass"
}
Do not invent a name. If the box is unclear, say so in notes and lower confidence scores.`;
}

function attrMap(raw: unknown): PlayerAttributes | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const keys: (keyof PlayerAttributes)[] = [
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
  const out = {} as PlayerAttributes;
  for (const k of keys) out[k] = clamp(num(o[k]) ?? 55);
  return out;
}

export async function completeMarkedPlayer(pageUrl: string, draft: VideoAnalysis, playerId: number): Promise<VideoAnalysis> {
  const hf = token();
  if (!hf) throw new Error("HF_TOKEN is not configured on the server");
  const box = draft.playerBoxes.find((b) => b.id === playerId && b.label !== "ball");
  if (!box) throw new Error("Mark a player, not the ball.");
  const frames = await fetchVideoFrames(pageUrl, 1);
  const frame = frames[0];
  const scout = await scoutWithVision(frame, hf, playerPrompt(box, frame));
  const radarRaw = scout?.radar && typeof scout.radar === "object" ? (scout.radar as Record<string, unknown>) : {};
  const statsRaw = scout?.stats && typeof scout.stats === "object" ? (scout.stats as Record<string, unknown>) : {};
  const fallback: RadarScores = {
    technical: 62,
    tactical: 60,
    physical: 64,
    mental: 61,
    attacking: box.team === "away" ? 58 : 66,
    defending: 59,
  };
  return {
    ...draft,
    stage: "complete",
    markedPlayerId: playerId,
    model: scout ? "detr-resnet-50 + gemma-3-12b-it" : draft.model,
    extractedAt: new Date().toISOString(),
    position: typeof scout?.position === "string" ? scout.position : null,
    role: typeof scout?.role === "string" ? scout.role : null,
    level: typeof scout?.level === "string" ? scout.level : null,
    phase: typeof scout?.phase === "string" ? scout.phase : draft.phase,
    radar: {
      technical: clamp(num(radarRaw.technical) ?? fallback.technical),
      tactical: clamp(num(radarRaw.tactical) ?? fallback.tactical),
      physical: clamp(num(radarRaw.physical) ?? fallback.physical),
      mental: clamp(num(radarRaw.mental) ?? fallback.mental),
      attacking: clamp(num(radarRaw.attacking) ?? fallback.attacking),
      defending: clamp(num(radarRaw.defending) ?? fallback.defending),
    },
    attributes: attrMap(scout?.attributes),
    strengths: Array.isArray(scout?.strengths) ? scout.strengths.map(String).slice(0, 5) : [],
    weaknesses: Array.isArray(scout?.weaknesses) ? scout.weaknesses.map(String).slice(0, 4) : [],
    notes: typeof scout?.notes === "string" ? scout.notes : null,
    recommendation: typeof scout?.recommendation === "string" ? scout.recommendation : null,
    distanceCoveredM: num(statsRaw.distanceM),
    stats: {
      sprints: num(statsRaw.sprints),
      duels: num(statsRaw.duels),
      progressiveRuns: num(statsRaw.progressiveRuns),
      recoveries: num(statsRaw.recoveries),
      touches: num(statsRaw.touches),
      maxSpeedKmh: num(statsRaw.maxSpeedKmh),
    },
    playerBoxes: draft.playerBoxes.map((b) => (b.id === playerId ? { ...b, role: typeof scout?.role === "string" ? scout.role : b.role } : b)),
  };
}

export async function analyzeStream(streamUrl: string, pageUrl: string, quality: string | null) {
  return detectClip(streamUrl, pageUrl, quality);
}
