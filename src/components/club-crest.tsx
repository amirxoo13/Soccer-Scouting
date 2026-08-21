import { useState } from "react";
import { clubCrestSrc } from "@/lib/club-crests";
import { cn } from "@/lib/utils";
import type { ClubPublic } from "@/lib/clubs";

type CrestInput = {
  slug: string;
  name: string;
  short?: string;
  colorA?: string;
  colorB?: string;
};

export function ClubCrest({
  club,
  size = 40,
  className,
}: {
  club: CrestInput | ClubPublic;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = clubCrestSrc(club.slug);
  if (!failed) {
    return (
      <img
        src={src}
        alt={club.name}
        width={size}
        height={size}
        className={cn("shrink-0 object-contain", className)}
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    );
  }
  const short = "short" in club && club.short ? club.short : club.name.slice(0, 3).toUpperCase();
  const a = "colorA" in club && club.colorA ? club.colorA : "#1c3d32";
  const b = "colorB" in club && club.colorB ? club.colorB : "#c5d0c8";
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={cn("shrink-0", className)} aria-hidden>
      <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill={a} />
      <polygon points="20,7 32,14 32,26 20,33 8,26 8,14" fill={b} opacity="0.28" />
      <text x="20" y="23.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
        {short}
      </text>
    </svg>
  );
}
