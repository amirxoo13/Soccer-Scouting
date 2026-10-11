export type ParsedVideo =
  | { kind: "iframe"; src: string; provider: string }
  | { kind: "video"; src: string; provider: "file" };

function firstMatch(url: string, re: RegExp): string | null {
  const m = url.match(re);
  return m?.[1] ?? null;
}

export function parseVideoUrl(raw: string): ParsedVideo | null {
  const url = raw.trim();
  if (!url) return null;
  let href: URL;
  try {
    href = new URL(url);
  } catch {
    return null;
  }
  if (href.protocol !== "http:" && href.protocol !== "https:") return null;

  const host = href.hostname.replace(/^www\./, "");
  const path = href.pathname;
  const full = href.href;

  const yt = firstMatch(
    full,
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt}`, provider: "youtube" };

  const aparat = firstMatch(full, /aparat\.com\/v\/([\w-]+)/);
  if (aparat) {
    return {
      kind: "iframe",
      src: `https://www.aparat.com/video/video/embed/videohash/${aparat}/vt/frame`,
      provider: "aparat",
    };
  }

  const vimeo = firstMatch(full, /vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo}`, provider: "vimeo" };

  const dm = firstMatch(full, /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/);
  if (dm) return { kind: "iframe", src: `https://www.dailymotion.com/embed/video/${dm}`, provider: "dailymotion" };

  const twitchV = firstMatch(full, /twitch\.tv\/videos\/(\d+)/);
  if (twitchV) {
    const parent = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return { kind: "iframe", src: `https://player.twitch.tv/?video=${twitchV}&parent=${parent}`, provider: "twitch" };
  }

  const streamable = firstMatch(full, /streamable\.com\/(?:e\/)?([\w]+)/);
  if (streamable) return { kind: "iframe", src: `https://streamable.com/e/${streamable}`, provider: "streamable" };

  if (host.includes("facebook.com") || host.includes("fb.watch")) {
    return {
      kind: "iframe",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(full)}&show_text=false`,
      provider: "facebook",
    };
  }

  const tiktok = firstMatch(full, /tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tiktok) {
    return { kind: "iframe", src: `https://www.tiktok.com/embed/v2/${tiktok}`, provider: "tiktok" };
  }

  if (host.includes("rumble.com")) {
    const id = firstMatch(path, /\/embed\/([\w-]+)/) ?? firstMatch(path, /\/v[\w-]+-([\w]+)/);
    if (id) return { kind: "iframe", src: `https://rumble.com/embed/${id}/`, provider: "rumble" };
  }

  if (/\.(mp4|webm|ogg|m3u8)(\?|#|$)/i.test(path)) {
    return { kind: "video", src: full, provider: "file" };
  }

  if (host.includes("ok.ru") && /\/video\//.test(path)) {
    return { kind: "iframe", src: full.replace("/video/", "/videoembed/"), provider: "ok" };
  }

  return { kind: "iframe", src: full, provider: host };
}

export function videoThumb(raw: string): string | null {
  const yt = firstMatch(raw, /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  return null;
}
