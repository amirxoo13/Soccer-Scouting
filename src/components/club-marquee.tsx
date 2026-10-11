import { CLUB_CRESTS } from "@/lib/club-crests";
import { useI18n } from "@/lib/i18n";
import { ClubCrest } from "./club-crest";

function Row({ clubs, track }: { clubs: typeof CLUB_CRESTS; track: 1 | 2 | 3 }) {
  const loop = [...clubs, ...clubs];
  return (
    <div className="overflow-hidden">
      <div className={`marquee-track marquee-track-${track} flex w-max items-center gap-10 px-6 py-3`}>
        {loop.map((club, i) => (
          <div key={`${club.slug}-${i}`} className="flex items-center gap-3">
            <ClubCrest club={club} size={44} />
            <span className="whitespace-nowrap text-sm font-medium text-foreground/90">{club.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClubMarquee() {
  const { t } = useI18n();
  const rows = [0, 1, 2].map((r) => CLUB_CRESTS.filter((_, i) => i % 3 === r));
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <p className="text-xs tracking-widest text-muted-foreground">{t("clubs.kicker")}</p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("clubs.trusted")}</p>
      </div>
      <div className="mt-4 space-y-0 pb-6">
        <Row clubs={rows[0]} track={1} />
        <Row clubs={rows[1]} track={2} />
        <Row clubs={rows[2]} track={3} />
      </div>
    </section>
  );
}
