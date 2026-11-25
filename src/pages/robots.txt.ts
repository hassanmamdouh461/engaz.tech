import type { APIRoute } from "astro";
import { SITE_URL } from "@/lib/seo";

export const GET: APIRoute = () =>
  new Response(
    `User-Agent: *\nAllow: /\n\nHost: ${SITE_URL}\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
