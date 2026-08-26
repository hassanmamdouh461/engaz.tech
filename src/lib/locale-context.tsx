"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { HREFLANG, LOCALE_PATH } from "./seo";
import type { Locale, Localized } from "./types";

interface LocaleContextValue {
  locale: Locale;
  /** The other locale, and the route that serves it. */
  alternate: { locale: Locale; href: string };
  t: (value: Localized) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * The locale is decided by the route, not by client state: `/` serves English and
 * `/ar` serves Arabic. Crawlers then get real translated markup at each URL instead
 * of one page that rewrites itself after hydration.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  useEffect(() => {
    // Language changes the text and the font, never the layout direction:
    // the document stays left-to-right so switching locales only translates.
    document.documentElement.lang = HREFLANG[locale];
    document.documentElement.dir = "ltr";
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const other: Locale = locale === "en" ? "ar" : "en";
    return {
      locale,
      alternate: { locale: other, href: LOCALE_PATH[other] },
      t: (localized: Localized) => localized[locale],
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside a LocaleProvider");
  }
  return context;
}
