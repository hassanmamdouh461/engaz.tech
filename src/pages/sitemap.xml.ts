import type { APIRoute } from "astro";
import { PAGES, absoluteUrl } from "@/lib/routes";
import { HREFLANG } from "@/lib/seo";
import type { Locale } from "@/lib/types";

const LOCALES: Locale[] = ["en", "ar"];

/** Every URL lists all its language versions, which is what Google expects. */
export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();
  const urls = PAGES.flatMap((page) =>
    LOCALES.map((locale) => {
      const alternates = LOCALES.map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${HREFLANG[alt]}" href="${absoluteUrl(alt, page)}"/>`,
      ).join("\n");
      return `  <url>
    <loc>${absoluteUrl(locale, page)}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl("en", page)}"/>
  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
