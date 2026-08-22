import { Link } from "@tanstack/react-router";
import { LOCALES, LOCALE_META, dirOf } from "@/lib/locales";
import { useI18n } from "@/lib/i18n";
import { BrandMark } from "./brand-mark";
import { PaymentStrip } from "./payment-marks";

export function SiteFooter() {
  const { t, setLocale, locale } = useI18n();
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5">
            <BrandMark size={32} />
            <span className="font-display text-lg tracking-wide">{t("brand")}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t("tagline")}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("footer.note")}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="pay-chip grid h-12 place-items-center rounded-md px-3">
              <img src="/partners/afc.png" alt="AFC" className="h-8 w-auto object-contain" />
            </span>
            <div>
              <p className="text-xs font-medium">{t("footer.afc")}</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{t("footer.afcNote")}</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs tracking-widest text-muted-foreground">{t("footer.platform")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/discover" className="text-foreground/90 hover:text-foreground">
              {t("nav.discover")}
            </Link>
            <a href="/#method" className="text-foreground/90 hover:text-foreground">
              {t("nav.method")}
            </a>
            <a href="/#plans" className="text-foreground/90 hover:text-foreground">
              {t("nav.pricing")}
            </a>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs tracking-widest text-muted-foreground">{t("footer.players")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/login" className="text-foreground/90 hover:text-foreground">
              {t("hero.ctaPlayer")}
            </Link>
            <Link to="/discover" className="text-foreground/90 hover:text-foreground">
              {t("hero.ctaDiscover")}
            </Link>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs tracking-widest text-muted-foreground">{t("footer.clubs")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/login" className="text-foreground/90 hover:text-foreground">
              {t("hero.ctaScout")}
            </Link>
            <a href="/#positions" className="text-foreground/90 hover:text-foreground">
              {t("positions.hint")}
            </a>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs tracking-widest text-muted-foreground">{t("footer.languages")}</p>
          <div className="mt-3 flex flex-col gap-1.5">
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                dir={dirOf(code)}
                onClick={() => setLocale(code)}
                className={`text-start text-sm ${code === locale ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {LOCALE_META[code].native}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <p className="text-xs tracking-widest text-muted-foreground">{t("footer.payments")}</p>
          <div className="mt-3">
            <PaymentStrip />
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{t("footer.rights")}</span>
          <div className="flex gap-4">
            <a href="/#faq" className="hover:text-foreground">
              {t("footer.privacy")}
            </a>
            <a href="/#faq" className="hover:text-foreground">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
