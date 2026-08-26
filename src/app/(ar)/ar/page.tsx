import type { Metadata } from "next";
import { LocaleShell, localeMetadata } from "@/components/layout/LocaleShell";
import { HomeSections } from "@/components/sections/HomeSections";

export const metadata: Metadata = localeMetadata("ar");

export default function ArabicHomePage() {
  return (
    <LocaleShell locale="ar">
      <HomeSections />
    </LocaleShell>
  );
}
