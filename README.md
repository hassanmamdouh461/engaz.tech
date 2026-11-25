# ENGAZ — engaz.tech

Bilingual (English / Arabic) marketing site for a software house building restaurant
& café systems, AI agents, websites, and mobile apps. "Engineered grid" design: warm
paper, black ink, one yellow accent, structural rules instead of decoration. Built with
Astro and Tailwind CSS, and deployed to Cloudflare Workers as static files — no
server-side runtime and almost no client JavaScript.

## Stack

- Astro 7 (static output, `trailingSlash: "always"`, i18n routing)
- Tailwind CSS 4 through `@tailwindcss/vite`; design tokens live in
  `src/styles/global.css` under `@theme` (there is no `tailwind.config`)
- Self-hosted fonts from Fontsource: Geist and Geist Mono (Latin), Alexandria
  (Arabic display), IBM Plex Sans Arabic (Arabic text)
- Lucide icons via `@lucide/astro`, imported one module per icon
- Motion is CSS only: scroll-timeline reveals, the order-flow line, and
  cross-document view transitions — no animation library
- A few lines of vanilla TypeScript for the menu, theme toggle, and contact form

## Running it

Requires Node 22.12 or newer.

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # static site → dist/
npm run preview        # serve dist/ locally
npm run typecheck      # astro check
npm run lint           # eslint (typescript-eslint + astro)
npm run format         # prettier --write (format:check is what CI runs)
npm test               # vitest
```

## Project layout

```text
src/pages/                       one file per URL: /, /pos/, /ai-agents/, /websites/, /mobile-apps/,
                                 /contact/ and the same under /ar/,
                                 plus 404, robots.txt and sitemap.xml
src/components/pages/            HomePage, PosPage, ServicePage, ContactPage — each takes a locale
src/components/                  Header, Footer, MobileCta, ThemeToggle, SectionHeader,
                                 MarkedText, OrderFlow, ProcessSteps, ClosingCta,
                                 ContactForm, BrandMark
src/layouts/Base.astro           <html lang/dir>, meta/OG/hreflang, font preloads, JSON-LD
src/styles/global.css            tokens, component classes, Arabic rules, motion
src/data/content.json            every user-visible string, as { en, ar } pairs
src/lib/types.ts                 the schema content.json must satisfy
src/lib/routes.ts                page list, per-locale URLs, WhatsApp links
src/lib/seo.ts                   titles, keywords, canonical/hreflang helpers, JSON-LD
src/lib/contact.ts               FormSubmit delivery (payload, validation, response check)
src/lib/icons.ts                 content icon names → Lucide components
```

## Localization and direction

Each locale is a real route: English at `/` and Arabic at `/ar/`, with matching
`lang`/`dir` on `<html>`, per-page canonical and hreflang links (plus `x-default`), and
a sitemap that lists every language version of every page.

The Arabic pages are right-to-left. Layout uses logical utilities (`start-*`, `end-*`,
`border-s`, `ps-*`) so it mirrors on its own; arrows flip with `rtl:-scale-x-100`.
Latin-only values (phone numbers, figures, step numbers) sit in `dir="ltr"` and use
Western digits in both languages. Arabic text gets no letter-spacing, a taller line
height, and the Arabic faces through the font stack — Latin glyphs fall to Geist,
Arabic glyphs to Alexandria or Plex, so mixed copy needs no extra classes.

## Content and re-branding

Every user-visible value is a `{ "en": "...", "ar": "..." }` pair inside
`src/data/content.json`:

- `brand`, `hero`, `services`, `work`, `pillars`, `ecosystem`, `stats`, `contact`,
  `footer` drive the homepage and shared chrome.
- `posPage` holds the POS page (modules, order flow, CTA); `servicePages` the AI
  agents, websites and mobile apps pages (they reuse `services`/`work` copy by id);
  `contactPage` the contact page metadata; `ui` the nav labels, CTAs, and 404 copy.
- Phrases wrapped in `==…==` render highlighted.
- `*.icon` fields are Lucide names; unknown names fall back to `Sparkles`. Add the
  import to `src/lib/icons.ts` when introducing a new one.
- `ui.whatsappMessage` and `posPage.whatsappMessage` are the pre-filled WhatsApp
  texts, different per page so incoming chats show where the lead came from.

`src/lib/types.ts` is the contract; `npm run typecheck` points at anything that drifts.

Still to come from the business (do not fill with placeholders): client logos,
named testimonials, case studies with numbers, "starting from" prices, and real
product screenshots.

## The contact form

`ContactForm` posts to FormSubmit (`src/lib/contact.ts`), which relays submissions to
the inbox — no backend needed. Validations: required name/message, an email pattern
check, length caps on every field, a hidden honeypot, and a 30-second resend
cooldown. The relay's JSON `success` flag is checked, so a refused submission shows
as an error instead of a fake success.

After the first real submission, FormSubmit issues a hashed endpoint id. Set it as
`PUBLIC_CONTACT_FORM_ID` (see `.env.example`) so the endpoint no longer carries the raw
inbox address. This does **not** hide the address from scrapers: the email contact
card in `content.json` shows it on the page and in the JSON-LD. `PUBLIC_*` values are
inlined at build time, so the value must be present when `npm run build` runs.

## Deploying to Cloudflare

`npm run build` writes the static site to `dist/`. `wrangler.toml` points the Worker's
`[assets]` directory at `dist/` and declares `engaz.tech` and `www.engaz.tech` as
`custom_domain` routes, so Cloudflare manages the DNS records itself.
`public/_headers` ships security headers (CSP, nosniff, frame-ancestors) and a
one-year immutable `Cache-Control` for the content-hashed `/_astro/*` assets.

```bash
npm run deploy           # astro build, then wrangler deploy
npm run preview:worker   # build and serve locally through Wrangler
```

### Automatic deployment

`.github/workflows/deploy.yml` runs on every push to `main`: install, typecheck, lint,
format check, test, build, then `wrangler deploy`. Required repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
NEXT_PUBLIC_CONTACT_FORM_ID   # optional; passed to the build as PUBLIC_CONTACT_FORM_ID
```

The FormSubmit secret keeps its original name from the Next.js version so the
repository settings did not need to change.

Create the API token at **My Profile → API Tokens → Create Token** using the
_Edit Cloudflare Workers_ template, scoped to the `engaz.tech` zone.

## Accessibility & motion

- A skip link precedes the header; nav landmarks carry localized `aria-label`s.
- The mobile menu is a native `<details>` disclosure; Escape closes it.
- The contact form reports status through `role="status"` + `aria-live`.
- Content is visible by default. Reveals and the order-flow line run only where
  CSS scroll timelines exist and the visitor has not asked for reduced motion;
  otherwise everything is simply drawn. View transitions are off for reduced motion.
- The theme is applied before first paint from `localStorage`, so dark-mode visitors
  never see a light flash. Light is the default.
