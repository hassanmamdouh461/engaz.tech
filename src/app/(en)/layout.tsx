import type { Metadata } from "next";
import type { ReactNode } from "react";
import { localeMetadata } from "@/components/layout/LocaleShell";
import { fontVariables } from "@/lib/fonts";
import { IntroScript } from "@/lib/intro-script";
import { HREFLANG } from "@/lib/seo";
import { ThemeScript } from "@/lib/theme-context";
import { pageViewport } from "@/lib/viewport";
import "../globals.css";

export const metadata: Metadata = localeMetadata("en");
export const viewport = pageViewport;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={HREFLANG.en}
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
        {/* Scroll locked until hydration wires the scroll-driven pins — scrolling
            into the pin range before the trigger exists makes ScrollTrigger yank
            the page back up when it mounts. SmoothScroll unlocks on mount; the
            timeout is a failsafe if hydration never completes. */}
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
