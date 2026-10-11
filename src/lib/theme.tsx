import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "kavosh-theme";

type ThemeValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

function applyTheme(t: Theme) {
  const d = document.documentElement;
  d.dataset.theme = t;
  d.classList.toggle("dark", t === "dark");
  d.classList.toggle("light", t === "light");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "light" ? "#f3efe6" : "#0b0d0c");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyTheme(stored);
        return;
      }
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const next: Theme = prefersLight ? "light" : "dark";
      setThemeState(next);
      applyTheme(next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ThemeValue>(() => {
    const setTheme = (t: Theme) => {
      setThemeState(t);
      applyTheme(t);
      try {
        window.localStorage.setItem(STORAGE_KEY, t);
      } catch {
        /* ignore */
      }
    };
    return {
      theme,
      setTheme,
      toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme outside provider");
  return ctx;
}
