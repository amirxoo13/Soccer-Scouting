import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { POSITIONS, labeled } from "@/lib/football";
import { useI18n } from "@/lib/i18n";
import type { RedactedCard } from "@/lib/types";
import { PlayerPhoto } from "./player-photo";

export function BlurredCard({ player }: { player: RedactedCard }) {
  const { locale, t } = useI18n();
  return (
    <Link
      to="/players/$id"
      params={{ id: String(player.id) }}
      className="relative block overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="talent-blur absolute inset-0">
          <PlayerPhoto url={player.photoUrl} first="—" last="—" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-background/35" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-xs tracking-widest text-muted-foreground">{t("paywall.sealed")}</p>
          <p className="mt-1 text-sm font-medium">{labeled(POSITIONS, player.primaryPosition, locale)}</p>
        </div>
        <div className="absolute start-2 top-2 grid size-8 place-items-center rounded-full border border-border bg-background/80">
          <Lock className="size-3.5" />
        </div>
      </div>
    </Link>
  );
}
