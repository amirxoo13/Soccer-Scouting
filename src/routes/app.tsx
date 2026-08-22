import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { getMe } from "@/lib/server/me";
import { rememberNext } from "@/lib/nav-next";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({ component: AppLayout });

function SignedOutGate() {
  const location = useRouterState({ select: (s) => s.location });
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const rawSearch = location.search as Record<string, unknown>;
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(rawSearch)) {
      if (typeof v === "string" && v) qs.set(k, v);
    }
    const next = `${location.pathname}${qs.size ? `?${qs.toString()}` : ""}`;
    rememberNext(next);
    window.location.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [location.pathname, location.search]);
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Skeleton className="h-10 w-40" />
      </div>
    </PageShell>
  );
}

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    enabled: Boolean(user),
  });

  if (isPending) {
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Skeleton className="h-10 w-40" />
        </div>
      </PageShell>
    );
  }
  if (!user) return <SignedOutGate />;

  const role = me.data?.user?.role;
  const links = [
    { to: "/app", label: t("nav.dashboard") },
    ...(role === "player" ? [{ to: "/app/profile", label: t("nav.profile") }] : []),
    ...(role === "scout" || me.data?.user?.isAdmin ? [{ to: "/app/shortlist", label: t("nav.shortlist") }] : []),
    { to: "/app/wallet", label: t("nav.wallet") },
    ...(me.data?.user?.isAdmin ? [{ to: "/admin", label: t("nav.admin") }] : []),
  ];

  return (
    <PageShell>
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "h-12 shrink-0 px-3 text-sm",
                pathname === l.to ? "border-b-2 border-primary text-foreground" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {me.isPending ? <Skeleton className="h-40 w-full" /> : <Outlet />}
      </div>
    </PageShell>
  );
}
