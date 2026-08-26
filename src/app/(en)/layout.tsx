import type { Metadata } from "next";
import type { ReactNode } from "react";
import { localeMetadata } from "@/components/layout/LocaleShell";
import { fontVariables } from "@/lib/fonts";
import { HREFLANG } from "@/lib/seo";
import { ThemeScript } from "@/lib/theme-context";
import { pageViewport } from "@/lib/viewport";
import "../globals.css";

export const metadata: Metadata = localeMetadata("en");
export const viewport = pageViewport;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={HREFLANG.en} dir="ltr" className={fontVariables}>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
