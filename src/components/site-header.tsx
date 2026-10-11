import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { BackLink } from "./back-link";
import { BrandMark } from "./brand-mark";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function SiteHeader() {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const home = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          {!home && <BackLink />}
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <BrandMark size={32} className="rounded-lg ring-1 ring-border" />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-base tracking-wide md:text-lg">{t("brand")}</span>
              <span className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">{t("tagline")}</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          <a href="/#method" className="transition-colors duration-150 hover:text-foreground">
            {t("nav.method")}
          </a>
          <a href="/#positions" className="transition-colors duration-150 hover:text-foreground">
            {t("positions.hint")}
          </a>
          <a href="/#plans" className="transition-colors duration-150 hover:text-foreground">
            {t("nav.pricing")}
          </a>
          <Link to="/discover" className="transition-colors duration-150 hover:text-foreground">
            {t("nav.discover")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher compact />
          {isPending ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/app">{t("nav.dashboard")}</Link>
              </Button>
              <UserButton />
            </div>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">{t("nav.signIn")}</Link>
            </Button>
          )}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1 text-sm">
            <a href="/#method" onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 hover:bg-muted">
              {t("nav.method")}
            </a>
            <a href="/#plans" onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 hover:bg-muted">
              {t("nav.pricing")}
            </a>
            <Link to="/discover" onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 hover:bg-muted">
              {t("nav.discover")}
            </Link>
            {user && (
              <>
                <Link to="/app" onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 hover:bg-muted">
                  {t("nav.dashboard")}
                </Link>
                <Link to="/app/wallet" onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 hover:bg-muted">
                  {t("nav.wallet")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
