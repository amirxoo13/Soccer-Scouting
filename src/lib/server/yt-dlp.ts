import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36";

/** Muxed H.264 in the 360–720 band — best for noisy phone footage without a download. */
const FORMAT_PREFERRED =
  "best[height>=360][height<=720][ext=mp4][vcodec^=avc][acodec!=none]/best[height>=360][height<=720][ext=mp4][acodec!=none]/best[height>=360][height<=720][vcodec!=none]/best[height<=720][vcodec!=none]";

const FORMAT_FALLBACK =
  "best[height<=720][vcodec!=none]/best[height<=1080][vcodec!=none]/best[vcodec!=none]/best";

export class ExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExtractionError";
  }
}

type YtFormat = {
  url?: string;
  manifest_url?: string;
  protocol?: string;
  ext?: string;
  height?: number;
  fps?: number;
  vcodec?: string;
  acodec?: string;
  format_id?: string;
  tbr?: number;
};

type YtInfo = {
  url?: string;
  webpage_url?: string;
  formats?: YtFormat[];
  requested_formats?: YtFormat[];
  http_headers?: Record<string, string>;
};

export type ExtractedStream = {
  url: string;
  quality: string;
  height: number | null;
  ext: string | null;
  vcodec: string | null;
  protocol: string | null;
};

function hostOf(pageUrl: string) {
  try {
    return new URL(pageUrl).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function originOf(pageUrl: string) {
  try {
    return new URL(pageUrl).origin;
  } catch {
    return "";
  }
}

function geoCountry(host: string): string | null {
  if (/(aparat|namasha|filimo)\./.test(host)) return "IR";
  if (/(vk\.com|ok\.ru|okcdn)/.test(host)) return "RU";
  if (/(bilibili|youku|iqiyi|mgtv)\./.test(host)) return "JP";
  if (/(naver|kakao)\./.test(host)) return "KR";
  if (/(nicovideo|niconico)\./.test(host)) return "JP";
  if (/(dailymotion|dai\.ly)/.test(host)) return "TR";
  return null;
}

function youtubeExtractorArgs(host: string) {
  if (!/youtu\.?be/.test(host)) return [];
  return ["--extractor-args", "youtube:player_client=android,ios,mweb;player_skip=webpage,configs"];
}

function isDirectMedia(pageUrl: string) {
  try {
    const path = new URL(pageUrl).pathname;
    return /\.(mp4|m4v|webm|ogg|m3u8)(\?|#|$)/i.test(path);
  } catch {
    return false;
  }
}

function formatUrl(f: YtFormat): string | null {
  const u = f.url || f.manifest_url;
  return u && /^https?:\/\//i.test(u) ? u : null;
}

function scoreFormat(f: YtFormat): number {
  if (!formatUrl(f)) return Number.NEGATIVE_INFINITY;
  const vcodec = (f.vcodec || "").toLowerCase();
  const acodec = (f.acodec || "").toLowerCase();
  if (vcodec === "none") return Number.NEGATIVE_INFINITY;
  const height = f.height || 0;
  let s = 0;
  if (height >= 640 && height <= 800) s += 100;
  else if (height >= 480 && height < 640) s += 82;
  else if (height > 800 && height <= 1080) s += 50;
  else if (height >= 360 && height < 480) s += 55;
  else if (height > 1080) s += 15;
  else s += 8;
  if (/avc|h264/.test(vcodec)) s += 28;
  else if (/vp9|vp09/.test(vcodec)) s += 8;
  else if (/av01|av1/.test(vcodec)) s += 4;
  const ext = (f.ext || "").toLowerCase();
  if (ext === "mp4") s += 18;
  else if (ext === "webm") s += 4;
  const proto = (f.protocol || "").toLowerCase();
  if (proto.includes("https") && !proto.includes("m3u8") && !proto.includes("dash")) s += 22;
  else if (proto.includes("m3u8")) s += 10;
  if (acodec && acodec !== "none") s += 8;
  const fps = f.fps || 30;
  if (fps >= 23 && fps <= 31) s += 8;
  else if (fps > 50) s -= 10;
  const tbr = f.tbr || 0;
  if (tbr >= 700 && tbr <= 3500) s += 6;
  return s;
}

function describe(f: YtFormat): string {
  const h = f.height ? `${f.height}p` : "unknown";
  const codec = (f.vcodec || "vid").split(".")[0];
  const ext = f.ext || "mp4";
  const proto = (f.protocol || "https").split(":")[0];
  return `${h}-${codec}-${ext}-${proto}`;
}

function pickFormat(info: YtInfo): ExtractedStream | null {
  const pool = [...(info.formats ?? []), ...(info.requested_formats ?? [])];
  const ranked = pool
    .map((f) => ({ f, s: scoreFormat(f) }))
    .filter((x) => x.s > Number.NEGATIVE_INFINITY)
    .sort((a, b) => b.s - a.s);
  const best = ranked[0]?.f;
  const url = best ? formatUrl(best) : info.url && /^https?:\/\//i.test(info.url) ? info.url : null;
  if (!url) return null;
  return {
    url,
    quality: best ? describe(best) : "source",
    height: best?.height ?? null,
    ext: best?.ext ?? null,
    vcodec: best?.vcodec ?? null,
    protocol: best?.protocol ?? null,
  };
}

function baseArgs(pageUrl: string, format?: string): string[] {
  const host = hostOf(pageUrl);
  const origin = originOf(pageUrl);
  const country = geoCountry(host);
  const args = [
    "-m",
    "yt_dlp",
    "--no-download",
    "--no-playlist",
    "--no-warnings",
    "--no-progress",
    "--geo-bypass",
    "--force-ipv4",
    "--no-check-certificates",
    "--socket-timeout",
    "20",
    "--retries",
    "5",
    "--retry-sleep",
    "1",
    "--user-agent",
    ANDROID_UA,
    "-S",
    "res:720,codec:h264,ext:mp4,proto:https,fps:30",
    ...youtubeExtractorArgs(host),
  ];
  if (format) args.push("-f", format);
  if (country) args.push("--geo-bypass-country", country);
  if (origin) {
    args.push("--referer", `${origin}/`);
    args.push("--add-header", `Origin:${origin}`);
    args.push("--add-header", `Referer:${origin}/`);
  }
  if (process.execPath) args.push("--js-runtimes", `node:${process.execPath}`);
  return args;
}

async function runYtDlp(args: string[], timeout: number) {
  return execFileAsync(process.env.YT_DLP_BIN || "python3", args, {
    timeout,
    maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONUNBUFFERED: "1" },
  });
}

function urlsFromGetUrl(stdout: string) {
  return stdout
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^https?:\/\//i.test(l));
}

export async function extractStreamUrl(pageUrl: string): Promise<ExtractedStream> {
  const trimmed = pageUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) throw new ExtractionError("Not an http(s) video URL");
  if (isDirectMedia(trimmed)) {
    return { url: trimmed, quality: "direct", height: null, ext: null, vcodec: null, protocol: "https" };
  }

  const attempts: { extra: string[]; format?: string; dump: boolean }[] = [
    { extra: [], dump: true },
    { extra: ["--extractor-args", "youtube:player_client=android,ios"], format: FORMAT_PREFERRED, dump: false },
    { extra: [], format: FORMAT_FALLBACK, dump: false },
  ];

  const errors: string[] = [];
  for (const attempt of attempts) {
    try {
      const args = [...baseArgs(trimmed, attempt.format), ...attempt.extra];
      if (attempt.dump) {
        args.push("-J", trimmed);
        const { stdout } = await runYtDlp(args, 60000);
        const start = stdout.indexOf("{");
        if (start < 0) throw new Error("yt-dlp returned no JSON");
        const info = JSON.parse(stdout.slice(start)) as YtInfo;
        const picked = pickFormat(info);
        if (!picked) throw new Error("no playable video format under 1080p");
        return picked;
      }
      args.push("-g", trimmed);
      const { stdout } = await runYtDlp(args, 45000);
      const lines = urlsFromGetUrl(stdout);
      const url = lines[0];
      if (!url) throw new Error("yt-dlp -g returned no stream URL");
      return { url, quality: "fallback-stream", height: null, ext: null, vcodec: null, protocol: null };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg.replace(/\s+/g, " ").slice(0, 220));
    }
  }

  throw new ExtractionError(`yt-dlp could not extract an Asian-stable stream: ${errors.at(-1) ?? "unknown"}`);
}
