"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale, Localized } from "./types";

const STORAGE_KEY = "techcorp.locale";

interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: (value: Localized) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === "en" ? "ar" : "en"));
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      isRtl: locale === "ar",
      setLocale,
      toggleLocale,
      t: (localized: Localized) => localized[locale],
    }),
    [locale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside a LocaleProvider");
  }
  return context;
}
