import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";

export function Paywall({ loggedIn }: { loggedIn: boolean }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center md:p-8">
      <div className="mx-auto grid size-12 place-items-center rounded-full border border-border">
        <Lock className="size-5 text-primary" />
      </div>
      <h2 className="font-display mt-4 text-2xl md:text-3xl">{t("paywall.title")}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{t("paywall.body")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {loggedIn ? (
          <Button asChild>
            <Link to="/app/wallet" search={{ plan: "desk" }}>
              {t("paywall.pay")}
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link to="/login" search={{ next: "/app/wallet?plan=desk" }}>
                {t("paywall.register")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login" search={{ next: "/app/wallet?plan=desk" }}>
                {t("nav.signIn")}
              </Link>
            </Button>
          </>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{t("paywall.price")}</p>
    </div>
  );
}
