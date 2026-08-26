"use client";

import Link from "next/link";
import { LOCALE_PATH } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/cn";

const OPTIONS: { locale: Locale; label: string; title: string }[] = [
  { locale: "en", label: "EN", title: "English" },
  { locale: "ar", label: "ع", title: "العربية" },
];

/**
 * Real links rather than buttons: each locale is its own indexable URL, so the switch
 * has to be crawlable for the Arabic page to be discovered and associated with it.
 */
export function LocaleSwitch({
  locale,
  ariaLabel,
  className,
}: {
  locale: Locale;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/50 p-0.5 backdrop-blur-md",
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const active = option.locale === locale;
        return (
          <Link
            key={option.locale}
            href={LOCALE_PATH[option.locale]}
            hrefLang={option.locale}
            title={option.title}
            aria-current={active ? "true" : undefined}
            className={cn(
              "relative inline-flex min-h-[2.25rem] min-w-[2.5rem] items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-neon sm:px-4",
              active
                ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-base-950 shadow-glow"
                : "text-slate-400 hover:text-white",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
