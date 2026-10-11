import { useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function BackLink({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, dir } = useI18n();
  if (pathname === "/") return null;
  const Icon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <button
      type="button"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground ${className}`}
      aria-label={t("common.back")}
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.history.back();
        } else {
          void router.navigate({ to: "/" });
        }
      }}
    >
      <Icon className="size-4" />
    </button>
  );
}
