import type { MetadataRoute } from "next";
import { HREFLANG, LOCALE_PATH, SITE_URL, canonicalFor } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const dynamic = "force-static";

const LOCALES: Locale[] = ["en", "ar"];

/** Each locale URL lists the other as an alternate, which is what Google expects. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return LOCALES.map((locale) => ({
    url: canonicalFor(locale),
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        [HREFLANG.en]: `${SITE_URL}${LOCALE_PATH.en}`,
        [HREFLANG.ar]: `${SITE_URL}${LOCALE_PATH.ar}`,
      },
    },
  }));
}
