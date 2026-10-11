import { parseVideoUrl } from "@/lib/video-embed";

export function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const parsed = parseVideoUrl(url);
  if (!parsed) {
    return (
      <div className="grid aspect-video place-items-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
        {title || "—"}
      </div>
    );
  }
  if (parsed.kind === "video") {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        <video className="aspect-video w-full" src={parsed.src} controls playsInline />
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <iframe
        title={title ?? parsed.provider}
        src={parsed.src}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
