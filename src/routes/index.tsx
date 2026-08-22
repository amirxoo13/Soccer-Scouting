import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { ClubMarquee } from "@/components/club-marquee";
import { PageShell } from "@/components/page-shell";
import { PitchExplorer } from "@/components/pitch-explorer";
import { PricingGrid } from "@/components/pricing-grid";
import { Button } from "@/components/ui/button";
import { COUNTRIES, REGIONS, labeled } from "@/lib/football";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t, locale } = useI18n();

  return (
    <PageShell>
      <section className="relative min-h-svh overflow-hidden">
        <img src="/editorial/aerial.jpg" alt="" className="hero-image absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/20 to-transparent rtl:bg-gradient-to-l" />
        <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-4 pb-24 pt-28">
          <p className="text-sm tracking-wide text-primary">{t("hero.slogan")}</p>
          <div className="mt-4 inline-flex max-w-full items-center gap-2 self-start rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="truncate">
              {t("hero.live")}
              <span className="mx-1.5 text-border">·</span>
              {t("hero.kicker")}
            </span>
          </div>
          <h1 className="font-display mt-5 max-w-4xl text-4xl leading-none text-foreground md:text-6xl lg:text-7xl">{t("hero.title")}</h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">{t("hero.body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/login">{t("hero.ctaPlayer")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/login" search={{ next: "/app/wallet?plan=desk" }}>
                {t("hero.ctaScout")}
              </Link>
            </Button>
          </div>
          <p className="mt-5 max-w-lg text-xs leading-relaxed text-muted-foreground">{t("hero.trust")}</p>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {(
              [
                ["fact1k", "fact1v"],
                ["fact2k", "fact2v"],
                ["fact3k", "fact3v"],
                ["fact4k", "fact4v"],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="bg-background/85 px-4 py-4 backdrop-blur-sm">
                <dt className="font-display text-2xl md:text-3xl">{t(`hero.${k}`)}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{t(`hero.${v}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ClubMarquee />

      <section id="method" className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl">
            <img src="/editorial/training.jpg" alt="" className="aspect-[4/5] w-full object-cover md:aspect-[5/4]" />
          </div>
          <div>
            <p className="text-xs tracking-widest text-primary">{t("method.kicker")}</p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">{t("method.title")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{t("method.subtitle")}</p>
            <ol className="mt-8 space-y-5">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="font-display text-sm tracking-widest text-primary">0{n}</span>
                  <div>
                    <h3 className="text-base font-medium">{t(`method.s${n}t`)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(`method.s${n}b`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs tracking-widest text-primary">{t("player.sample")}</p>
              <h2 className="font-display mt-3 text-3xl md:text-5xl">{t("player.facts")}</h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">{t("method.s1b")}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/login">
                {t("hero.ctaScout")}
                <ArrowRight className="ms-2 size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid items-stretch lg:grid-cols-[220px_1fr_220px]">
              <div className="relative">
                <img src="/editorial/tunnel.jpg" alt="" className="h-full min-h-64 w-full object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-background/40">
                  <Lock className="size-8 text-primary" />
                </div>
              </div>
              <div className="border-border p-6 md:p-8 lg:border-s">
                <p className="text-xs text-muted-foreground">{t("paywall.sealed")}</p>
                <p className="font-display mt-2 text-3xl md:text-4xl">— —</p>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {(
                    [
                      ["player.dateOfBirth", "—"],
                      ["player.placeOfBirth", "—"],
                      ["player.citizenship", "—"],
                      ["player.height", "1,84 m"],
                      ["player.position", "ST"],
                      ["player.foot", "—"],
                      ["player.club", "—"],
                      ["player.marketValue", "€ —"],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-b border-border py-1.5">
                      <dt className="text-muted-foreground">{t(k)}</dt>
                      <dd className="font-medium tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex flex-col justify-between border-t border-border p-6 lg:border-s lg:border-t-0">
                <div>
                  <p className="text-xs text-muted-foreground">{t("player.currentValue")}</p>
                  <p className="font-display mt-2 text-4xl text-primary">€ —</p>
                </div>
                <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  {t("positions.locked")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="positions" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl">{t("positions.title")}</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">{t("positions.subtitle")}</p>
          </div>
          <div className="mt-10">
            <PitchExplorer />
          </div>
        </div>
      </section>

      <section id="coverage" className="mx-auto max-w-6xl px-4 py-20">
        <div className="max-w-2xl">
          <p className="text-xs tracking-widest text-primary">{t("nav.coverage")}</p>
          <h2 className="font-display mt-3 text-3xl md:text-5xl">{t("coverage.title")}</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">{t("coverage.subtitle")}</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((region) => (
            <div key={region.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl">{t(`coverage.${region.id}`)}</h3>
                <span className="tabular-nums text-xs text-muted-foreground">{region.countries.length}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {region.countries.map((code) => (
                  <span key={code} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                    {labeled(COUNTRIES, code, locale)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="plans" className="border-t border-border">
        <div className="relative overflow-hidden">
          <img src="/editorial/aerial.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
          <div className="relative mx-auto max-w-6xl px-4 py-20">
            <p className="text-xs tracking-widest text-primary">{t("plans.kicker")}</p>
            <h2 className="font-display mt-3 max-w-3xl text-3xl md:text-5xl">{t("plans.title")}</h2>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{t("plans.subtitle")}</p>
            <div className="mt-10">
              <PricingGrid />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl md:grid-cols-3">
          <div className="flex flex-col p-8 md:p-10">
            <h3 className="font-display text-3xl">{t("split.playerTitle")}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t("split.playerBody")}</p>
            <Button asChild className="mt-8 w-fit">
              <Link to="/login">{t("hero.ctaPlayer")}</Link>
            </Button>
          </div>
          <div className="flex flex-col border-t border-border p-8 md:border-t-0 md:border-s md:p-10">
            <h3 className="font-display text-3xl">{t("split.scoutTitle")}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t("split.scoutBody")}</p>
            <Button asChild variant="outline" className="mt-8 w-fit">
              <Link to="/login" search={{ next: "/app/wallet?plan=desk" }}>
                {t("hero.ctaScout")}
              </Link>
            </Button>
          </div>
          <div className="flex flex-col border-t border-border p-8 md:border-t-0 md:border-s md:p-10">
            <h3 className="font-display text-3xl">{t("split.clubTitle")}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t("split.clubBody")}</p>
            <Button asChild variant="outline" className="mt-8 w-fit">
              <a href="#plans">{t("nav.pricing")}</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="font-display text-3xl md:text-5xl">{t("faq.title")}</h2>
          <div className="mt-10">
            {[1, 2, 3, 4, 5].map((n) => (
              <details key={n} className="group border-b border-border py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  {t(`faq.q${n}`)}
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-transform duration-150 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">{t(`faq.a${n}`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl md:text-6xl">{t("ctaBand.title")}</h2>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">{t("ctaBand.body")}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/login">{t("hero.ctaPlayer")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/login" search={{ next: "/app/wallet?plan=desk" }}>
                {t("hero.ctaScout")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
