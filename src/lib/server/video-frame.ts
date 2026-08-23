export type VideoFrame = { bytes: Buffer; mime: string; source: string; width: number; height: number };

const UA = "Mozilla/5.0 (compatible; SoccerScouting/1.0; +https://soccer-scouting.vercel.app)";

export function youtubeId(raw: string) {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.split("/").filter(Boolean)[0] || null;
    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const m = u.pathname.match(/\/(embed|shorts|live)\/([^/?#]+)/);
      return m?.[2] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

function aparatHash(raw: string) {
  try {
    const u = new URL(raw);
    if (!u.hostname.includes("aparat.com")) return null;
    const m = u.pathname.match(/\/(?:v|video)\/([^/?#]+)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function vimeoId(raw: string) {
  try {
    const u = new URL(raw);
    if (!u.hostname.includes("vimeo.com")) return null;
    const m = u.pathname.match(/\/(?:video\/)?(\d+)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

async function oembedThumb(endpoint: string) {
  const res = await fetch(endpoint, { headers: { "user-agent": UA }, redirect: "follow" });
  if (!res.ok) return null;
  const json = (await res.json()) as { thumbnail_url?: string };
  return json.thumbnail_url || null;
}

async function ogImage(pageUrl: string) {
  const res = await fetch(pageUrl, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow" });
  if (!res.ok) return null;
  const html = (await res.text()).slice(0, 80_000);
  const m =
    html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  return m?.[1] ?? null;
}

function imageSize(buf: Buffer, mime: string): { width: number; height: number } {
  try {
    if (mime.includes("png") && buf.length > 24) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (mime.includes("jpeg") || mime.includes("jpg")) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) {
          i += 1;
          continue;
        }
        const marker = buf[i + 1];
        if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        const len = buf.readUInt16BE(i + 2);
        i += 2 + len;
      }
    }
  } catch {
    /* ignore */
  }
  return { width: 1280, height: 720 };
}

export async function collectFrameUrls(pageUrl: string): Promise<string[]> {
  const out: string[] = [];
  const yt = youtubeId(pageUrl);
  if (yt) {
    out.push(
      `https://i.ytimg.com/vi/${yt}/1.jpg`,
      `https://i.ytimg.com/vi/${yt}/2.jpg`,
      `https://i.ytimg.com/vi/${yt}/3.jpg`,
      `https://i.ytimg.com/vi/${yt}/0.jpg`,
      `https://i.ytimg.com/vi/${yt}/mqdefault.jpg`,
      `https://i.ytimg.com/vi/${yt}/sddefault.jpg`,
      `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`,
    );
  }
  const aparat = aparatHash(pageUrl);
  if (aparat) {
    try {
      const thumb = await oembedThumb(
        `https://www.aparat.com/oembed?url=${encodeURIComponent(`https://www.aparat.com/v/${aparat}`)}&format=json`,
      );
      if (thumb) out.unshift(thumb);
    } catch {
      /* ignore */
    }
  }
  const vimeo = vimeoId(pageUrl);
  if (vimeo) {
    out.push(`https://vumbnail.com/${vimeo}.jpg`);
    try {
      const thumb = await oembedThumb(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(pageUrl)}`);
      if (thumb) out.unshift(thumb);
    } catch {
      /* ignore */
    }
  }
  try {
    if (/dailymotion|dai\.ly/i.test(pageUrl)) {
      const thumb = await oembedThumb(`https://www.dailymotion.com/services/oembed?url=${encodeURIComponent(pageUrl)}`);
      if (thumb) out.unshift(thumb);
    }
  } catch {
    /* ignore */
  }
  try {
    const og = await ogImage(pageUrl);
    if (og) out.push(og);
  } catch {
    /* ignore */
  }
  return [...new Set(out.filter((u) => /^https?:\/\//i.test(u) && !u.includes("oembed")))];
}

async function loadFrame(url: string): Promise<VideoFrame | null> {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "image/*" }, redirect: "follow" });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) return null;
  let mime = "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50) mime = "image/png";
  else if (buf[0] === 0x47 && buf[1] === 0x49) mime = "image/gif";
  else if (!(buf[0] === 0xff && buf[1] === 0xd8)) return null;
  const size = imageSize(buf, mime);
  return { bytes: buf, mime, source: url, ...size };
}

export async function fetchVideoFrames(pageUrl: string, limit = 3): Promise<VideoFrame[]> {
  const urls = await collectFrameUrls(pageUrl);
  const frames: VideoFrame[] = [];
  const seen = new Set<string>();
  for (const url of urls) {
    if (frames.length >= limit) break;
    try {
      const frame = await loadFrame(url);
      if (!frame) continue;
      const key = `${frame.width}x${frame.height}:${frame.bytes.length}`;
      if (seen.has(key)) continue;
      seen.add(key);
      frames.push(frame);
    } catch {
      /* next */
    }
  }
  if (!frames.length) throw new Error("Could not fetch a still from this video");
  return frames;
}

export async function fetchVideoFrame(pageUrl: string): Promise<VideoFrame> {
  const [first] = await fetchVideoFrames(pageUrl, 1);
  return first;
}
