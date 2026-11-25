import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HeadScripts } from "@/components/layout/HeadScripts";
import { localeMetadata } from "@/components/layout/LocaleShell";
import { fontVariables } from "@/lib/fonts";
import { HREFLANG } from "@/lib/seo";
import { pageViewport } from "@/lib/viewport";
import "../globals.css";

export const metadata: Metadata = localeMetadata("en");
export const viewport = pageViewport;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={HREFLANG.en} dir="ltr" className={fontVariables} suppressHydrationWarning>
      <head>
        <HeadScripts />
      </head>
      <body>{children}</body>
    </html>
  );
}
