import type { Metadata } from "next";
import type { ReactNode } from "react";
import { localeMetadata } from "@/components/layout/LocaleShell";
import { fontVariables } from "@/lib/fonts";
import { IntroScript } from "@/lib/intro-script";
import { HREFLANG } from "@/lib/seo";
import { ThemeScript } from "@/lib/theme-context";
import { pageViewport } from "@/lib/viewport";
import "../globals.css";

export const metadata: Metadata = localeMetadata("ar");
export const viewport = pageViewport;

/**
 * A separate root layout so the Arabic route ships `lang="ar-EG"` in the served HTML.
 * Setting it after hydration would leave crawlers reading Arabic copy tagged English.
 */
export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={HREFLANG.ar}
      dir="ltr"
      className={fontVariables}
      // The pre-paint scripts below add data-theme / data-intro and an inline
      // overflow lock to <html> before React hydrates; those are expected to
      // differ from the server render.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <IntroScript />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.style.overflow='hidden';setTimeout(function(){document.documentElement.style.overflow=''},5000)",
          }}
        />
        <noscript>
          <style>{"html{overflow:auto !important}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
