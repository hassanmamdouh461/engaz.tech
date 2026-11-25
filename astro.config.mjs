// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://engaz.tech",
  // Every page is a folder with an index.html, and every internal link ends in a
  // slash, so Cloudflare serves each URL directly instead of redirecting to it.
  trailingSlash: "always",
  build: { format: "directory" },
  // Astro 7 defaults to JSX-style whitespace, which glues inline elements together
  // ("<span>a</span><em>b</em>" → "ab"). Mixed Arabic/Latin copy relies on those
  // spaces, so keep the HTML-style collapsing.
  compressHTML: true,
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
    // English keeps the unprefixed URLs the site already ranks on; Arabic is /ar/.
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    // Tailwind v4 runs as a Vite plugin, not through PostCSS. An inline (empty)
    // config stops Vite searching parent folders, where a stray postcss.config
    // from another project would otherwise load Tailwind v3 into this build.
    css: { postcss: {} },
  },
});
