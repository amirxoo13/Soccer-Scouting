import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { detectLocale, dirOf, isLocale, LOCALE_META, type Locale } from "./locales";
import { messages } from "./messages";

const STORAGE_KEY = "kavosh-locale";

function lookup(obj: unknown, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  return typeof cur === "string" ? cur : path;
}

type I18nValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) {
        setLocaleState(stored);
        return;
      }
      const nav = window.navigator.language || window.navigator.languages?.[0] || "fa";
      setLocaleState(detectLocale(nav));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].html;
    document.documentElement.dir = dirOf(locale);
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const value = useMemo<I18nValue>(() => {
    const setLocale = (l: Locale) => {
      setLocaleState(l);
      try {
        window.localStorage.setItem(STORAGE_KEY, l);
      } catch {
        /* ignore */
      }
    };
    return {
      locale,
      setLocale,
      t: (key: string) => lookup(messages[locale], key),
      dir: dirOf(locale),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}
