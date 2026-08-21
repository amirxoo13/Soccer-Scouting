import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { POSITIONS, WIDE_PITCH_COORDS, labeled } from "@/lib/football";
import { useI18n } from "@/lib/i18n";
import { searchPlayers } from "@/lib/server/public";
import { BlurredCard } from "./blurred-card";
import { Paywall } from "./paywall";
import { PlayerCard } from "./player-card";
import { Skeleton } from "./ui/skeleton";
import { getAccess } from "@/lib/server/billing";

export function PitchExplorer() {
  const { locale, t } = useI18n();
  const [position, setPosition] = useState<string | null>(null);
  const access = useQuery({ queryKey: ["access"], queryFn: () => getAccess() });
  const results = useQuery({
    queryKey: ["pitch-search", position],
    queryFn: () => searchPlayers({ data: { position: position ?? undefined } }),
    enabled: Boolean(position),
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-3 md:p-5">
          <div className="relative">
            <svg viewBox="0 0 100 68" className="pointer-events-none w-full text-pitch" aria-hidden>
              <rect x="1.5" y="1.5" width="97" height="65" rx="2" fill="#0e1411" stroke="currentColor" strokeWidth="0.6" />
              <line x1="50" y1="1.5" x2="50" y2="66.5" stroke="currentColor" strokeWidth="0.35" />
              <circle cx="50" cy="34" r="9" fill="none" stroke="currentColor" strokeWidth="0.35" />
              <circle cx="50" cy="34" r="0.7" fill="currentColor" />
              <rect x="1.5" y="20" width="14" height="28" fill="none" stroke="currentColor" strokeWidth="0.35" />
              <rect x="1.5" y="26" width="6" height="16" fill="none" stroke="currentColor" strokeWidth="0.35" />
              <rect x="84.5" y="20" width="14" height="28" fill="none" stroke="currentColor" strokeWidth="0.35" />
              <rect x="92.5" y="26" width="6" height="16" fill="none" stroke="currentColor" strokeWidth="0.35" />
            </svg>
            {POSITIONS.map((p) => {
              const c = WIDE_PITCH_COORDS[p.id];
              if (!c) return null;
              const active = position === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  title={labeled(POSITIONS, p.id, locale)}
                  onClick={() => setPosition(p.id)}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full border font-mono text-xs font-medium shadow-sm transition-[transform,background-color] duration-150 md:size-8 ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/40 bg-background text-foreground group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    {p.id}
                  </span>
                  <span className="pointer-events-none absolute top-full z-10 mt-1 hidden whitespace-nowrap rounded-md bg-background/90 px-1.5 py-0.5 text-xs text-muted-foreground group-hover:md:block">
                    {labeled(POSITIONS, p.id, locale)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-widest text-primary">{t("positions.hint")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {POSITIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPosition(p.id)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors duration-150 ${
                  position === p.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span className="font-mono text-xs text-primary">{p.id}</span>
                {labeled(POSITIONS, p.id, locale)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {position && (
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            {labeled(POSITIONS, position, locale)}
            <span className="mx-2 text-border">·</span>
            {t("positions.locked")}
          </p>
          {results.data && results.data.access === false && (
            <Paywall loggedIn={Boolean(access.data?.loggedIn)} />
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {results.isPending &&
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)}
            {results.data?.access === true &&
              results.data.players.slice(0, 8).map((p) => <PlayerCard key={p.id} player={p} />)}
            {results.data?.access === false &&
              results.data.players.slice(0, 8).map((p) => <BlurredCard key={p.id} player={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
