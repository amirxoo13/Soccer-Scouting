import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/plans";
import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";

const FEATURES: Record<PlanId, number> = {
  youth: 4,
  player_u24: 4,
  player_senior: 4,
  desk: 5,
};

export function PricingGrid({ highlight }: { highlight?: PlanId }) {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {PLANS.map((plan) => {
        const featured = plan.id === (highlight ?? "desk");
        const count = FEATURES[plan.id];
        return (
          <article
            key={plan.id}
            className={`flex flex-col rounded-xl border bg-card p-5 ${
              featured ? "border-primary/50" : "border-border"
            }`}
          >
            <p className="text-xs tracking-[0.16em] text-muted-foreground">{t(`plans.${plan.id}.kicker`)}</p>
            <h3 className="font-display mt-3 text-2xl">{t(`plans.${plan.id}.title`)}</h3>
            <p className="mt-3 flex items-baseline gap-1">
              {plan.usd === 0 ? (
                <span className="font-display text-4xl">{t("plans.free")}</span>
              ) : (
                <>
                  <span className="font-display text-4xl tabular-nums">${plan.usd}</span>
                  <span className="text-xs text-muted-foreground">{t("plans.year")}</span>
                </>
              )}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {t(`plans.${plan.id}.body`)}
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {Array.from({ length: count }).map((_, i) => (
                <li key={i} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{t(`plans.${plan.id}.f${i + 1}`)}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full" variant={featured ? "default" : "outline"}>
              <Link
                to="/login"
                search={{
                  next: plan.id === "youth" ? "/app/profile" : `/app/wallet?plan=${plan.id}`,
                }}
              >
                {plan.usd === 0 ? t("plans.ctaYouth") : t("plans.ctaPay")}
              </Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
