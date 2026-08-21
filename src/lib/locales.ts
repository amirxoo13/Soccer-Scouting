export const LOCALES = ["fa", "en", "ar", "tr", "az", "ur", "ku"] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES = new Set<Locale>(["fa", "ar", "ur", "ku"]);
export const LATIN_LOCALES = new Set<Locale>(["en", "tr", "az"]);

export const LOCALE_META: Record<
  Locale,
  { native: string; short: string; html: string; english: string }
> = {
  fa: { native: "فارسی", short: "فا", html: "fa", english: "Persian" },
  en: { native: "English", short: "EN", html: "en", english: "English" },
  ar: { native: "العربية", short: "ع", html: "ar", english: "Arabic" },
  tr: { native: "Türkçe", short: "TR", html: "tr", english: "Turkish" },
  az: { native: "Azərbaycan", short: "AZ", html: "az", english: "Azerbaijani" },
  ur: { native: "اردو", short: "UR", html: "ur", english: "Urdu" },
  ku: { native: "کوردی", short: "کورد", html: "ckb", english: "Kurdish" },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export function detectLocale(lang: string): Locale {
  const l = lang.toLowerCase();
  if (l.startsWith("fa") || l.startsWith("ps") || l.startsWith("tg")) return "fa";
  if (l.startsWith("ar")) return "ar";
  if (l.startsWith("tr")) return "tr";
  if (l.startsWith("az")) return "az";
  if (l.startsWith("ur")) return "ur";
  if (l.startsWith("ku") || l.startsWith("ckb") || l.startsWith("kmr")) return "ku";
  if (l.startsWith("en")) return "en";
  return "fa";
}
