const UA = "Mozilla/5.0 (compatible; SoccerScouting/1.0; +https://soccer-scouting.vercel.app)";

function youtubeId(raw: string) {
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

export async function collectFrameUrls(pageUrl: string): Promise<string[]> {
  const out: string[] = [];
  const yt = youtubeId(pageUrl);
  if (yt) {
    out.push(
      `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${yt}/sddefault.jpg`,
      `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
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

export async function fetchVideoFrame(pageUrl: string): Promise<{ bytes: Buffer; mime: string; source: string }> {
  const urls = await collectFrameUrls(pageUrl);
  let last = urls.length ? "no usable image" : "no thumbnail for this host";
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, accept: "image/*" }, redirect: "follow" });
      if (!res.ok) {
        last = `${url} HTTP ${res.status}`;
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1500) {
        last = "tiny payload";
        continue;
      }
      if (buf[0] === 0xff && buf[1] === 0xd8) return { bytes: buf, mime: "image/jpeg", source: url };
      if (buf[0] === 0x89 && buf[1] === 0x50) return { bytes: buf, mime: "image/png", source: url };
      if (buf[0] === 0x47 && buf[1] === 0x49) return { bytes: buf, mime: "image/gif", source: url };
      last = "not an image";
    } catch (err) {
      last = err instanceof Error ? err.message : String(err);
    }
  }
  throw new Error(`Could not fetch a still from this video (${last})`);
}
