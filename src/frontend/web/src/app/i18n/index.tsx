import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { setFormatLocale } from "../format";
import { en } from "./en";
import type { Messages } from "./en";
import { es } from "./es";

export type Locale = "en" | "es";

const STORAGE_KEY = "sa_locale";
const catalogs: Record<Locale, Messages> = { en, es };

/** Saved choice first; otherwise Spanish when the browser prefers any Spanish variant. */
function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
  } catch (error) {
    // Storage can be blocked (private mode, policies); browser preference still applies.
    console.warn("Unable to read saved language.", error);
  }
  const preferred = typeof navigator !== "undefined" ? (navigator.languages ?? [navigator.language]) : [];
  return preferred.some((tag) => tag?.toLowerCase().startsWith("es")) ? "es" : "en";
}

/** BCP 47 tag for Intl: keep the browser's regional variant when it matches the chosen language. */
export function formattingLocale(locale: Locale): string {
  const browser = typeof navigator !== "undefined" ? navigator.language : "";
  if (browser.toLowerCase().startsWith(locale)) return browser;
  return locale === "es" ? "es-419" : "en-US";
}

type I18nValue = { locale: Locale; t: Messages; setLocale: (next: Locale) => void };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const initial = initialLocale ?? detectLocale();
    setFormatLocale(formattingLocale(initial));
    return initial;
  });

  const setLocale = useCallback((next: Locale) => {
    setFormatLocale(formattingLocale(next));
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.warn("Unable to save language choice.", error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es" : "en";
  }, [locale]);

  const value = useMemo(() => ({ locale, t: catalogs[locale], setLocale }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
