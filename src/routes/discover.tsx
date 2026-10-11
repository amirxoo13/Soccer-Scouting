import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BlurredCard } from "@/components/blurred-card";
import { Field } from "@/components/field";
import { PageShell } from "@/components/page-shell";
import { Paywall } from "@/components/paywall";
import { PlayerCard } from "@/components/player-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { COUNTRIES, FEET, LEVELS, POSITIONS } from "@/lib/football";
import { useI18n } from "@/lib/i18n";
import { getAccess } from "@/lib/server/billing";
import { searchPlayers, type SearchInput } from "@/lib/server/public";

type DiscoverSearch = {
  position?: string;
  country?: string;
};

export const Route = createFileRoute("/discover")({
  validateSearch: (search: Record<string, unknown>): DiscoverSearch => {
    const next: DiscoverSearch = {};
    if (typeof search.position === "string" && search.position) next.position = search.position;
    if (typeof search.country === "string" && search.country) next.country = search.country;
    return next;
  },
  component: Discover,
});

function Discover() {
  const { t, locale } = useI18n();
  const initial = Route.useSearch();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState(initial.country ?? "");
  const [position, setPosition] = useState(initial.position ?? "");
  const [foot, setFoot] = useState("");
  const [level, setLevel] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [sort, setSort] = useState<"newest" | "views">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const access = useQuery({ queryKey: ["access"], queryFn: () => getAccess() });

  const filters: SearchInput = useMemo(
    () => ({
      q: q || undefined,
      country: country || undefined,
      position: position || undefined,
      foot: foot || undefined,
      level: level || undefined,
      ageMin: ageMin ? Number(ageMin) : undefined,
      ageMax: ageMax ? Number(ageMax) : undefined,
      sort,
    }),
    [q, country, position, foot, level, ageMin, ageMax, sort],
  );

  const results = useQuery({
    queryKey: ["search", filters],
    queryFn: () => searchPlayers({ data: filters }),
  });

  const allowed = results.data?.access === true;

  const filterForm = (
    <div className="grid gap-3">
      <Field label={t("discover.search")}>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("discover.search")}
          disabled={!allowed}
        />
      </Field>
      <Field label={t("discover.country")}>
        <Select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">{t("discover.any")}</option>
          {COUNTRIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c[locale]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={t("discover.position")}>
        <Select value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">{t("discover.any")}</option>
          {POSITIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c[locale]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={t("discover.foot")}>
        <Select value={foot} onChange={(e) => setFoot(e.target.value)} disabled={!allowed}>
          <option value="">{t("discover.any")}</option>
          {FEET.map((c) => (
            <option key={c.id} value={c.id}>
              {c[locale]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={t("discover.level")}>
        <Select value={level} onChange={(e) => setLevel(e.target.value)} disabled={!allowed}>
          <option value="">{t("discover.any")}</option>
          {LEVELS.map((c) => (
            <option key={c.id} value={c.id}>
              {c[locale]}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label={`${t("discover.age")} min`}>
          <Input inputMode="numeric" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} disabled={!allowed} />
        </Field>
        <Field label={`${t("discover.age")} max`}>
          <Input inputMode="numeric" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} disabled={!allowed} />
        </Field>
      </div>
      <Field label={t("discover.sort")}>
        <Select value={sort} onChange={(e) => setSort(e.target.value as "newest" | "views")} disabled={!allowed}>
          <option value="newest">{t("discover.newest")}</option>
          <option value="views">{t("discover.views")}</option>
        </Select>
      </Field>
    </div>
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl">{t("discover.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("discover.subtitle")}</p>

        <button
          type="button"
          className="mt-6 h-11 rounded-md border border-border px-4 text-sm md:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          {t("discover.filters")}
        </button>
        {filtersOpen && <div className="mt-4 md:hidden">{filterForm}</div>}

        <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">{filterForm}</aside>
          <div>
            {!allowed && (
              <div className="mb-6">
                <Paywall loggedIn={Boolean(access.data?.loggedIn)} />
              </div>
            )}
            <p className="mb-4 text-sm text-muted-foreground">
              {results.data?.players.length ?? 0} {t("discover.results")}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.isPending &&
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)}
              {results.data?.access === true &&
                results.data.players.map((p) => <PlayerCard key={p.id} player={p} />)}
              {results.data?.access === false &&
                results.data.players.map((p) => <BlurredCard key={p.id} player={p} />)}
            </div>
            {results.data && results.data.players.length === 0 && (
              <p className="py-16 text-center text-sm text-muted-foreground">{t("discover.empty")}</p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
