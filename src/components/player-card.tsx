import { Link } from "@tanstack/react-router";
import { COUNTRIES, FEET, LEVELS, POSITIONS, labeled } from "@/lib/football";
import { useI18n } from "@/lib/i18n";
import type { PlayerCard as PlayerCardType } from "@/lib/types";
import { ageFromDob } from "@/lib/utils";
import { PlayerPhoto } from "./player-photo";
import { PitchMark } from "./pitch-mark";

export function PlayerCard({ player }: { player: PlayerCardType }) {
  const { locale, t } = useI18n();
  const age = ageFromDob(player.dob);
  return (
    <Link
      to="/players/$id"
      params={{ id: String(player.id) }}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/30"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <PlayerPhoto
          url={player.photoUrl}
          first={player.firstName}
          last={player.lastName}
          className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="absolute start-2 top-2 flex flex-col items-start gap-1">
          {player.country && (
            <span className="rounded-md border border-border bg-background/80 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {player.country}
            </span>
          )}
          {player.featured && (
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {t("featured.badge")}
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-background/85 p-3">
          <p className="font-display text-xl leading-none text-foreground">
            {player.firstName} {player.lastName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {labeled(POSITIONS, player.primaryPosition, locale)}
            {player.country ? ` · ${labeled(COUNTRIES, player.country, locale)}` : ""}
          </p>
        </div>
        <div className="absolute end-2 top-2 w-10 opacity-90">
          <PitchMark position={player.primaryPosition} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3 text-center text-xs text-muted-foreground">
        <div>
          <div className="tabular-nums text-sm text-foreground">{age ?? "—"}</div>
          <div>{t("player.age")}</div>
        </div>
        <div>
          <div className="tabular-nums text-sm text-foreground">
            {player.heightCm ? `${player.heightCm}` : "—"}
          </div>
          <div>{t("common.cm")}</div>
        </div>
        <div>
          <div className="text-sm text-foreground">
            {labeled(FEET, player.preferredFoot, locale)}
          </div>
          <div>{t("player.foot")}</div>
        </div>
      </div>
      {(player.playingLevel || player.currentClub) && (
        <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          {player.playingLevel ? labeled(LEVELS, player.playingLevel, locale) : ""}
          {player.currentClub ? ` · ${player.currentClub}` : ""}
        </div>
      )}
    </Link>
  );
}
