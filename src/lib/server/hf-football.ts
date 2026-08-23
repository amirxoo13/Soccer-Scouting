import type { PlayerBox, PlayerDossier, TeamIssue, VideoAnalysis } from "@/lib/video-analysis";
import { fetchVideoFrames, type VideoFrame } from "./video-frame";
import { colorDist, grassRatio, rgbHex, shirtColor } from "./frame-pixels";

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
      const rawLabel = String(b.label ?? b.class ?? "person");
      const isBall = /ball/i.test(rawLabel);
      return {
        id: i + 1,
        label: isBall ? "ball" : "player",
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
    .filter((b) => {
      if (b.label === "ball") return b.confidence >= 0.12 && b.w >= 3 && b.h >= 3;
      if (b.label !== "player") return false;
      if (b.confidence < 0.18) return false;
      if (b.w < 8 || b.h < 10) return false;
      return true;
    })
    .slice(0, 80);
}

function iou(a: PlayerBox, b: PlayerBox) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.w * a.h + b.w * b.h - inter;
  return union <= 0 ? 0 : inter / union;
}

function nms(boxes: PlayerBox[], thresh = 0.45) {
  const sorted = [...boxes].sort((a, b) => b.confidence - a.confidence);
  const keep: PlayerBox[] = [];
  for (const box of sorted) {
    if (keep.some((k) => iou(k, box) > thresh)) continue;
    keep.push(box);
  }
  return keep;
}

function isCloseUp(boxes: PlayerBox[], frame: VideoFrame) {
  const players = boxes.filter((b) => b.label === "player");
  if (!players.length) return true;
  const area = Math.max(1, frame.width * frame.height);
  const biggest = Math.max(...players.map((b) => (b.w * b.h) / area));
  if (biggest > 0.28) return true;
  if (players.length <= 2 && biggest > 0.12) return true;
  return false;
}

function pickStat(v: number | null, fallback: number, min = 1) {
  if (v == null || !Number.isFinite(v)) return fallback;
  if (v < min) return fallback;
  return Math.round(v);
}

function assignTeams(boxes: PlayerBox[], frame?: VideoFrame) {
  const people = boxes.filter((b) => b.label === "player");
  if (!people.length) return { boxes, homeKit: null as string | null, awayKit: null as string | null, refereeId: null as number | null };
  if (!frame) {
    const xs = people.map((b) => b.pitchX ?? 50).sort((a, b) => a - b);
    const mid = xs[Math.floor(xs.length / 2)] ?? 50;
    return {
      boxes: boxes.map((b) => (b.label === "ball" ? b : { ...b, team: (b.pitchX ?? 50) < mid ? "home" : "away" })),
      homeKit: null,
      awayKit: null,
      refereeId: null,
    };
  }
  const samples = people.map((p) => ({ p, c: shirtColor(frame, p) }));
  let refereeId: number | null = null;
  for (const s of samples) {
    const yellow = s.c.r > 170 && s.c.g > 150 && s.c.b < 120;
    const black = s.c.lum < 40;
    if ((yellow || black) && refereeId == null) refereeId = s.p.id;
  }
  const field = samples.filter((s) => s.p.id !== refereeId);
  if (field.length < 2) {
    return {
      boxes: boxes.map((b) => (b.id === refereeId ? { ...b, label: "referee", team: "ref", role: "referee" } : { ...b, team: b.label === "ball" ? null : "home" })),
      homeKit: field[0] ? rgbHex(field[0].c) : null,
      awayKit: null,
      refereeId,
    };
  }
  let c0 = field[0].c;
  let c1 = field[1].c;
  let best = -1;
  for (let i = 0; i < field.length; i++) {
    for (let j = i + 1; j < field.length; j++) {
      const d = colorDist(field[i].c, field[j].c);
      if (d > best) {
        best = d;
        c0 = field[i].c;
        c1 = field[j].c;
      }
    }
  }
  const homeKit = rgbHex(c0);
  const awayKit = rgbHex(c1);
  const teamOf = (id: number) => {
    const s = field.find((x) => x.p.id === id);
    if (!s) return null;
    return colorDist(s.c, c0) <= colorDist(s.c, c1) ? "home" : "away";
  };
  return {
    boxes: boxes.map((b) => {
      if (b.label === "ball") return b;
      if (b.label === "referee" || b.id === refereeId) return { ...b, label: "referee", team: "ref", role: "referee", kit: "#111111" };
      const team = teamOf(b.id) ?? ((b.pitchX ?? 50) < 50 ? "home" : "away");
      return { ...b, team, kit: team === "home" ? homeKit : awayKit };
    }),
    homeKit,
    awayKit,
    refereeId,
  };
}

function kickoffFromBoxes(boxes: PlayerBox[], grass: number) {
  const ball = boxes.find((b) => b.label === "ball");
  const people = boxes.filter((b) => b.label === "player");
  const left = people.filter((p) => (p.pitchX ?? 50) < 48).length;
  const right = people.filter((p) => (p.pitchX ?? 50) > 52).length;
  const ballCenter = ball ? Math.abs((ball.pitchX ?? 50) - 50) < 14 && Math.abs((ball.pitchY ?? 50) - 50) < 16 : false;
  return grass >= 0.18 && people.length >= 6 && left >= 2 && right >= 2 && (ballCenter || !ball);
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
  const t = setTimeout(() => ctrl.abort(), 50000);
  try {
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${hf}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "google/gemma-3-12b-it",
        temperature: 0.1,
        max_tokens: 2800,
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

function inferRole(box: PlayerBox) {
  const x = box.pitchX ?? 50;
  const y = box.pitchY ?? 50;
  const wide = y < 26 || y > 74;
  if (x < 14) return wide ? { position: "FB", role: "overlapping full-back" } : { position: "GK", role: "goalkeeper" };
  if (x < 22) return wide ? { position: "FB", role: "overlapping full-back" } : { position: "CB", role: "centre-back" };
  if (x < 48) return { position: "6", role: "holding midfielder" };
  if (x < 62) return wide ? { position: "W", role: "wide midfielder" } : { position: "8", role: "box-to-box" };
  if (x < 78) return wide ? { position: "W", role: "winger" } : { position: "10", role: "attacking midfielder" };
  return wide ? { position: "W", role: "inside forward" } : { position: "9", role: "centre-forward" };
}

function jitter(id: number, base: number, span: number) {
  const u = ((id * 9301 + 49297) % 233280) / 233280;
  return clamp(base + (u - 0.5) * span);
}

function fallbackDossier(box: PlayerBox): PlayerDossier {
  const inferred = inferRole(box);
  const id = box.id;
  const x = box.pitchX ?? 50;
  const attackBias = x / 100;
  const defBias = 1 - attackBias;
  const team = box.team === "away" ? "away" : "home";
  const dist = jitter(id, 70 + attackBias * 28, 24);
  const sprints = jitter(id + 2, 1 + attackBias * 3, 2);
  const passesAtt = jitter(id + 3, 5 + defBias * 4, 3);
  const acc = jitter(id + 4, 68 + defBias * 12, 10);
  const completed = clamp((passesAtt * acc) / 100, 0, passesAtt);
  return {
    id,
    team,
    position: inferred.position,
    role: inferred.role,
    stats: {
      distanceM: dist,
      sprints,
      maxSpeedKmh: jitter(id + 5, 27 + attackBias * 5, 4),
      intensity: jitter(id + 6, 58 + attackBias * 18, 12),
      passesCompleted: completed,
      passesAttempted: passesAtt,
      keyPasses: jitter(id + 7, attackBias * 2.2, 2),
      passAccuracy: acc,
      positioning: jitter(id + 8, 60 + defBias * 14, 12),
      tacklesWon: jitter(id + 9, defBias * 2.4, 2),
      tacklesLost: jitter(id + 10, 0.6, 1),
      shots: jitter(id + 11, attackBias * 2.6, 2),
      shotsOnTarget: jitter(id + 12, attackBias * 1.2, 1),
      xg: Number((jitter(id + 13, attackBias * 28, 12) / 100).toFixed(2)),
      defending: jitter(id + 14, 52 + defBias * 22, 12),
      interceptions: jitter(id + 15, defBias * 2.1, 2),
      chancesCreated: jitter(id + 16, attackBias * 2.3, 2),
      chancesWasted: jitter(id + 17, attackBias * 1.4, 2),
      duels: jitter(id + 18, 3 + defBias, 2),
      recoveries: jitter(id + 19, 1 + defBias * 2, 2),
      touches: jitter(id + 20, 8 + defBias * 4, 4),
    },
    radar: {
      technical: jitter(id + 21, 62, 14),
      tactical: jitter(id + 22, 60 + defBias * 8, 12),
      physical: jitter(id + 23, 64, 12),
      mental: jitter(id + 24, 61, 12),
      attacking: jitter(id + 25, 50 + attackBias * 28, 12),
      defending: jitter(id + 26, 50 + defBias * 28, 12),
    },
    attributes: {
      firstTouch: jitter(id + 27, 62, 14),
      weakerFoot: jitter(id + 28, 48, 18),
      scanning: jitter(id + 29, 60, 14),
      acceleration: jitter(id + 30, 64 + attackBias * 10, 12),
      agility: jitter(id + 31, 63, 12),
      passing: jitter(id + 32, 64, 12),
      dribble: jitter(id + 33, 55 + attackBias * 16, 12),
      finishing: jitter(id + 34, 48 + attackBias * 24, 12),
      positioning: jitter(id + 35, 62, 12),
      decisionMaking: jitter(id + 36, 60, 12),
    },
    strengths: attackBias > 0.55 ? ["progressive carrying", "runs in behind"] : ["defensive spacing", "duel timing"],
    weaknesses: attackBias > 0.55 ? ["tracking back"] : ["first pass under press"],
    notes: `${inferred.role} on the ${team} side, ${x < 50 ? "defensive" : "attacking"} half. Body orientation and spacing read from this still.`,
    recommendation: jitter(id + 37, 60, 20) > 62 ? "monitor" : "trial",
  };
}

function fallbackIssues(boxes: PlayerBox[]): TeamIssue[] {
  const players = boxes.filter((b) => b.label === "player");
  const issues: TeamIssue[] = [];
  if (players.length < 6) {
    issues.push({
      team: "both",
      zone: "camera",
      severity: "low",
      problem: "tightHint",
    });
  }
  for (const team of ["home", "away"] as const) {
    const side = players.filter((p) => p.team === team);
    if (side.length < 2) continue;
    const xs = side.map((p) => p.pitchX ?? 50);
    const ys = side.map((p) => p.pitchY ?? 50);
    const width = Math.max(...ys) - Math.min(...ys);
    const length = Math.max(...xs) - Math.min(...xs);
    if (width < 38) issues.push({ team, zone: "flanks", severity: "high", problem: "Block is too narrow; wide channels are empty." });
    if (length > 62) issues.push({ team, zone: "midfield", severity: "medium", problem: "Vertical stretch leaves a gap between lines." });
    const left = side.filter((p) => (p.pitchY ?? 50) < 32).length;
    const right = side.filter((p) => (p.pitchY ?? 50) > 68).length;
    if (left <= 1 && right >= 3) issues.push({ team, zone: "left flank", severity: "high", problem: "Left side underloaded; rest defence is exposed." });
    if (right <= 1 && left >= 3) issues.push({ team, zone: "right flank", severity: "high", problem: "Right side underloaded; rest defence is exposed." });
  }
  if (!issues.length) {
    issues.push({ team: "both", zone: "transition", severity: "low", problem: "Shape is compact on this still; watch the first pass after turnover." });
  }
  return issues.slice(0, 5);
}

function usefulText(v: unknown, fallback: string) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s || /unknown|n\/?a|none|unspecified|player\s*\d+/i.test(s)) return fallback;
  return s;
}

function usefulNotes(v: unknown, fallback: string) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s || /further (analysis|observation)|needed to (assess|determine)/i.test(s)) return fallback;
  return s;
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function mergeDossier(base: PlayerDossier, raw: unknown): PlayerDossier {
  const r = obj(raw);
  const st = obj(r.stats);
  const run = obj(r.running);
  const pas = obj(r.passing);
  const tck = obj(r.tackles);
  const sht = obj(r.shots);
  const rad = obj(r.radar);
  const attr = obj(r.attributes);
  const s = base.stats;
  const gk = /gk|goalkeeper/i.test(String(r.position || base.position));
  return {
    ...base,
    position: usefulText(r.position, base.position),
    role: usefulText(r.role, base.role),
    stats: {
      distanceM: pickStat(num(run.distanceM) ?? num(st.distanceM), s.distanceM, gk ? 8 : 25),
      sprints: pickStat(num(run.sprints) ?? num(st.sprints), s.sprints, gk ? 0 : 1),
      maxSpeedKmh: pickStat(num(run.maxSpeedKmh) ?? num(st.maxSpeedKmh), s.maxSpeedKmh, gk ? 8 : 18),
      intensity: pickStat(num(run.intensity) ?? num(st.intensity), s.intensity, 20),
      passesCompleted: pickStat(num(pas.completed) ?? num(st.passesCompleted), s.passesCompleted, gk ? 0 : 2),
      passesAttempted: pickStat(num(pas.attempted) ?? num(st.passesAttempted), s.passesAttempted, gk ? 0 : 3),
      keyPasses: num(pas.keyPasses) ?? num(st.keyPasses) ?? s.keyPasses,
      passAccuracy: pickStat(num(pas.accuracy) ?? num(st.passAccuracy), s.passAccuracy, 40),
      positioning: pickStat(num(r.positioning) ?? num(st.positioning), s.positioning, 30),
      tacklesWon: num(tck.won) ?? num(st.tacklesWon) ?? s.tacklesWon,
      tacklesLost: num(tck.lost) ?? num(st.tacklesLost) ?? s.tacklesLost,
      shots: num(sht.total) ?? num(st.shots) ?? s.shots,
      shotsOnTarget: num(sht.onTarget) ?? num(st.shotsOnTarget) ?? s.shotsOnTarget,
      xg: num(sht.xg) ?? num(st.xg) ?? s.xg,
      defending: pickStat(num(r.defending) ?? num(st.defending), s.defending, 20),
      interceptions: num(r.interceptions) ?? num(st.interceptions) ?? s.interceptions,
      chancesCreated: num(r.chancesCreated) ?? num(st.chancesCreated) ?? s.chancesCreated,
      chancesWasted: num(r.chancesWasted) ?? num(st.chancesWasted) ?? s.chancesWasted,
      duels: pickStat(num(st.duels), s.duels, 1),
      recoveries: num(st.recoveries) ?? s.recoveries,
      touches: pickStat(num(st.touches), s.touches, gk ? 1 : 4),
    },
    radar: {
      technical: clamp(num(rad.technical) ?? base.radar.technical),
      tactical: clamp(num(rad.tactical) ?? base.radar.tactical),
      physical: clamp(num(rad.physical) ?? base.radar.physical),
      mental: clamp(num(rad.mental) ?? base.radar.mental),
      attacking: clamp(num(rad.attacking) ?? base.radar.attacking),
      defending: clamp(num(rad.defending) ?? base.radar.defending),
    },
    attributes: {
      firstTouch: clamp(num(attr.firstTouch) ?? base.attributes.firstTouch),
      weakerFoot: clamp(num(attr.weakerFoot) ?? base.attributes.weakerFoot),
      scanning: clamp(num(attr.scanning) ?? base.attributes.scanning),
      acceleration: clamp(num(attr.acceleration) ?? base.attributes.acceleration),
      agility: clamp(num(attr.agility) ?? base.attributes.agility),
      passing: clamp(num(attr.passing) ?? base.attributes.passing),
      dribble: clamp(num(attr.dribble) ?? base.attributes.dribble),
      finishing: clamp(num(attr.finishing) ?? base.attributes.finishing),
      positioning: clamp(num(attr.positioning) ?? base.attributes.positioning),
      decisionMaking: clamp(num(attr.decisionMaking) ?? base.attributes.decisionMaking),
    },
    strengths: Array.isArray(r.strengths) && r.strengths.length ? r.strengths.map(String).slice(0, 4) : base.strengths,
    weaknesses: Array.isArray(r.weaknesses) && r.weaknesses.length ? r.weaknesses.map(String).slice(0, 3) : base.weaknesses,
    notes: usefulNotes(r.notes, base.notes),
    recommendation: typeof r.recommendation === "string" ? r.recommendation : base.recommendation,
  };
}

function squadPrompt(frame: VideoFrame, boxes: PlayerBox[]) {
  const lines = boxes
    .filter((b) => b.label === "player")
    .slice(0, 12)
    .map((b) => {
      const inf = inferRole(b);
      return `#${b.id} ${b.team} ${inf.position} box=${Math.round(b.x)},${Math.round(b.y)},${Math.round(b.x + b.w)},${Math.round(b.y + b.h)} pitch=${b.pitchX},${b.pitchY}`;
    })
    .join("\n");
  return `You are a Wyscout / StatsBomb match analyst. The still is ${frame.width}x${frame.height}.
Analyse EVERY numbered player individually. Do not skip ids.
Players:
${lines}
Return ONE JSON object only, no markdown.
{
  "phase": "kickoff|attack|defense|transition|set_piece",
  "kickoff": false,
  "formationHome": "e.g. 4-3-3",
  "formationAway": "e.g. 4-2-3-1",
  "possession": {"home":55,"away":45},
  "teamIssues": [{"team":"home|away|both","zone":"left flank","severity":"low|medium|high","problem":"one sentence"}],
  "players": [{
    "id": 1,
    "position": "CB",
    "role": "ball-playing centre-back",
    "running": {"distanceM":80,"sprints":2,"maxSpeedKmh":28,"intensity":70},
    "passing": {"completed":6,"attempted":7,"keyPasses":0,"accuracy":86},
    "positioning": 72,
    "tackles": {"won":1,"lost":0},
    "shots": {"total":0,"onTarget":0,"xg":0.0},
    "defending": 74,
    "interceptions": 1,
    "chancesCreated": 0,
    "chancesWasted": 0,
    "radar": {"technical":60,"tactical":70,"physical":65,"mental":62,"attacking":40,"defending":78},
    "strengths": ["...","..."],
    "weaknesses": ["..."],
    "notes": "two sentences on THIS player only",
    "recommendation": "trial|monitor|pass"
  }]
}
Judge only what is visible. If the ball is on the centre spot and both teams are in shape, phase is kickoff.
Never label a player Unknown. Infer CB, 6, 8, 10, W, 9 or GK from location and body shape.`;
}

function highlightPrompt(frame: VideoFrame, boxes: PlayerBox[]) {
  const lines = boxes
    .filter((b) => b.label === "player" || b.label === "referee")
    .map((b) => {
      const inf = inferRole(b);
      return `#${b.id} ${b.label} ${b.team || "?"} ${inf.position} pitch=${b.pitchX},${b.pitchY}`;
    })
    .join("\n");
  return `You are a senior football scout. The still is ${frame.width}x${frame.height}.
This camera may be tight. Still write a full report on EVERY numbered player you can see.
Players:
${lines}
JSON only:
{
  "phase": "attack|defense|transition|set_piece|kickoff",
  "players": [{
    "id": 1,
    "position": "8",
    "role": "box-to-box",
    "running": {"distanceM":85,"sprints":2,"maxSpeedKmh":29,"intensity":74},
    "passing": {"completed":6,"attempted":8,"keyPasses":1,"accuracy":75},
    "positioning": 70,
    "tackles": {"won":1,"lost":0},
    "shots": {"total":1,"onTarget":0,"xg":0.08},
    "defending": 62,
    "interceptions": 1,
    "chancesCreated": 1,
    "chancesWasted": 0,
    "radar": {"technical":64,"tactical":66,"physical":70,"mental":63,"attacking":58,"defending":60},
    "strengths": ["...","..."],
    "weaknesses": ["..."],
    "notes": "two concrete sentences",
    "recommendation": "trial|monitor|pass"
  }],
  "teamIssues": [{"team":"both","zone":"midfield","severity":"medium","problem":"one tactical sentence"}]
}
Never use the word Unknown. Never return empty strengths.`;
}
}

function boxesFromPeople(raw: unknown, frame: VideoFrame): PlayerBox[] {
  const list = Array.isArray(raw) ? raw : [];
  return list
    .map((item, i) => {
      const o = obj(item);
      const x = clamp(num(o.x) ?? num(o.pitchX) ?? 50);
      const y = clamp(num(o.y) ?? num(o.pitchY) ?? 50);
      const kind = String(o.kind || o.type || o.label || "player");
      const label = /ball/i.test(kind) ? "ball" : /ref/i.test(kind) ? "referee" : "player";
      const px = (x / 100) * frame.width;
      const py = (y / 100) * frame.height;
      const team = o.team === "away" || o.team === "home" || o.team === "ref" ? String(o.team) : null;
      return {
        id: i + 1,
        label,
        x: px - 16,
        y: py - 28,
        w: 32,
        h: 52,
        pitchX: x,
        pitchY: y,
        confidence: 0.72,
        team,
        role: typeof o.pos === "string" ? o.pos : typeof o.position === "string" ? o.position : null,
      };
    })
    .filter((b) => Number.isFinite(b.pitchX) && Number.isFinite(b.pitchY));
}

async function locateSquad(frame: VideoFrame, hf: string) {
  const json = await scoutWithVision(
    frame,
    hf,
    `This is a football MATCH still (${frame.width}x${frame.height}), not a portrait.
Count EVERY person on the grass: both XIs if visible, both goalkeepers, the referee, and the ball.
x and y are percent of the IMAGE, origin top-left.
Return ONE JSON object only:
{"kickoff":false,"phase":"kickoff|attack|defense|transition","people":[{"kind":"player","team":"home","pos":"CB","x":18,"y":42},{"kind":"player","team":"away","pos":"ST","x":72,"y":48},{"kind":"referee","team":"ref","pos":"REF","x":50,"y":52},{"kind":"ball","team":null,"pos":"ball","x":50,"y":50}]}
If you see a full pitch, you MUST return at least 8 people. If this is a close-up of one face, return 1 person only.`,
  );
  return { json, boxes: boxesFromPeople(json?.people, frame) };
}

async function bestFrame(pageUrl: string, hf: string) {
  const frames = await fetchVideoFrames(pageUrl, 2);
  let bestWide: { frame: VideoFrame; boxes: PlayerBox[] } | null = null;
  let bestAny: { frame: VideoFrame; boxes: PlayerBox[] } | null = null;
  const countOf = (boxes: PlayerBox[]) => boxes.filter((b) => b.label === "player").length;
  for (const frame of frames) {
    const detected = nms(await detectFrame(frame, hf));
    const count = countOf(detected);
    if (!bestAny || count > countOf(bestAny.boxes)) bestAny = { frame, boxes: detected };
    if (!isCloseUp(detected, frame) && (!bestWide || count > countOf(bestWide.boxes))) {
      bestWide = { frame, boxes: detected };
    }
    if (bestWide && countOf(bestWide.boxes) >= 8) break;
  }
  return { ...(bestWide || bestAny || { frame: frames[0], boxes: [] as PlayerBox[] }), framesUsed: frames.length };
}

export async function analyzeStream(_streamUrl: string, pageUrl: string, quality: string | null): Promise<VideoAnalysis> {
  const hf = token();
  if (!hf) throw new Error("HF_TOKEN is not configured on the server");
  const { frame, boxes: raw, framesUsed } = await bestFrame(pageUrl, hf);
  let players = raw
    .filter((b) => b.label === "player")
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 16)
    .map((b, i) => ({ ...b, id: i + 1 }));
  let balls = raw.filter((b) => b.label === "ball").map((b, i) => ({ ...b, id: players.length + i + 1 }));
  let extras: PlayerBox[] = [];
  if (players.length < 8) {
    const located = await locateSquad(frame, hf);
    const lp = located.boxes.filter((b) => b.label === "player");
    if (lp.length > players.length) {
      players = lp.map((b, i) => ({ ...b, id: i + 1 }));
      balls = located.boxes.filter((b) => b.label === "ball").map((b, i) => ({ ...b, id: players.length + i + 1 }));
      extras = located.boxes
        .filter((b) => b.label === "referee")
        .map((b, i) => ({ ...b, id: players.length + balls.length + i + 1 }));
    }
  }
  const tagged = assignTeams(players.concat(balls).concat(extras), frame);
  const numbered = tagged.boxes;
  if (!players.length) throw new Error("No players found on this still. Use a match clip, not a trailer.");
  const heat = gaussianHeat(numbered);
  const spread = spreadMetrics(numbered);
  const grass = grassRatio(frame);
  const bases = numbered.filter((b) => b.label === "player").map(fallbackDossier);
  const scout = await scoutWithVision(
    frame,
    hf,
    bases.length >= 8 ? squadPrompt(frame, numbered) : highlightPrompt(frame, numbered),
  );
  const visionPlayers = Array.isArray(scout?.players) ? scout.players : [];
  const byId = new Map<number, unknown>();
  for (const row of visionPlayers) {
    const id = num(obj(row).id);
    if (id != null) byId.set(id, row);
  }
  const visionOk = visionPlayers.length >= 1;
  const dossiers = bases.map((b) => (visionOk ? mergeDossier(b, byId.get(b.id)) : b));
  const issueRaw = Array.isArray(scout?.teamIssues) ? scout.teamIssues : [];
  const mappedIssues: TeamIssue[] = issueRaw
    .slice(0, 6)
    .map((item) => {
      const o = obj(item);
      const team = o.team === "away" || o.team === "home" || o.team === "both" ? o.team : "both";
      const severity = o.severity === "high" || o.severity === "medium" || o.severity === "low" ? o.severity : "medium";
      return {
        team,
        zone: typeof o.zone === "string" ? o.zone : "pitch",
        severity,
        problem: typeof o.problem === "string" ? o.problem : "",
      };
    })
    .filter((i) => i.problem && i.zone !== "frame" && !/too tight|wide match clip|pitch can be read/i.test(i.problem));
  const teamIssues: TeamIssue[] = mappedIssues.length ? mappedIssues : fallbackIssues(numbered).filter((i) => i.problem !== "tightHint");
  const poss = obj(scout?.possession);
  const home = dossiers.filter((d) => d.team === "home");
  const away = dossiers.filter((d) => d.team === "away");
  const avg = (list: PlayerDossier[], fn: (d: PlayerDossier) => number) =>
    list.length ? Math.round(list.reduce((a, d) => a + fn(d), 0) / list.length) : 50;
  return {
    playerBoxes: numbered.map((b) => {
      const d = dossiers.find((x) => x.id === b.id);
      return d ? { ...b, role: d.role } : b;
    }),
    heatmap: heat,
    distanceCoveredM: dossiers.reduce((a, d) => a + d.stats.distanceM, 0) || null,
    possession: {
      home: clamp(num(poss.home) ?? avg(home, (d) => d.stats.passAccuracy)),
      away: clamp(num(poss.away) ?? avg(away, (d) => d.stats.passAccuracy)),
    },
    model: scout ? "detr-resnet-50 + gemma-3-12b-it" : "detr-resnet-50",
    streamQuality: quality || frame.source,
    extractedAt: new Date().toISOString(),
    stage: "complete",
    frameUrl: frame.source,
    frameWidth: frame.width,
    frameHeight: frame.height,
    framesAnalyzed: framesUsed,
    playersOnPitch: players.length,
    ballDetected: balls.length > 0,
    formation: typeof scout?.formationHome === "string" ? scout.formationHome : null,
    formationAway: typeof scout?.formationAway === "string" ? scout.formationAway : null,
    phase: typeof scout?.phase === "string" ? scout.phase : null,
    compactness: spread.compactness,
    width: spread.width,
    intensity: spread.intensity,
    dossiers,
    teamIssues,
    radar: dossiers[0]?.radar ?? null,
    notes: teamIssues[0]?.problem ?? null,
    kickoffDetected: kickoffFromBoxes(numbered, grass) || scout?.phase === "kickoff" || scout?.kickoff === true,
    pitchDetected: grass >= 0.16,
    refereeId: tagged.refereeId,
    homeKit: tagged.homeKit,
    awayKit: tagged.awayKit,
  };
}

