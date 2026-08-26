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
 * Real links rather than buttons: each locale is its own indexable URL, so the
 * switch has to be crawlable for the Arabic page to be found and associated.
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
      className={cn("inline-flex items-center gap-1", className)}
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
              "inline-flex h-11 w-8 items-center justify-center rounded-md border-3 border-edge text-xs font-bold transition-all duration-200 sm:w-9 sm:text-sm",
              active
                ? "bg-brand-pink text-black shadow-neo-0"
                : "bg-surface text-ink shadow-neo-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-0",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
