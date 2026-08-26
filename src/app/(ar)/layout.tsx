import type { Metadata } from "next";
import type { ReactNode } from "react";
import { localeMetadata } from "@/components/layout/LocaleShell";
import { fontVariables } from "@/lib/fonts";
import { HREFLANG } from "@/lib/seo";
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
    <html lang={HREFLANG.ar} dir="ltr" className={fontVariables}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
