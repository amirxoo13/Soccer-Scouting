import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LOCALES, LOCALE_META, dirOf } from "@/lib/locales";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const meta = LOCALE_META[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-md border border-border px-2.5 text-xs text-muted-foreground transition-[color,background-color,opacity] duration-150 hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("lang.label")}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe className="size-3.5" />
        <span className="font-medium tracking-wide">{compact ? meta.short : meta.native}</span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t("lang.label")}
          className="absolute end-0 z-50 mt-2 max-h-80 min-w-52 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {LOCALES.map((code) => {
            const item = LOCALE_META[code];
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                dir={dirOf(code)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-start text-sm transition-colors duration-150",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
              >
                <span>
                  <span className="block font-medium text-foreground">{item.native}</span>
                  <span className="block text-xs text-muted-foreground">{item.english}</span>
                </span>
                {active && <Check className="size-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
