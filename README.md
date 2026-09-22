# ENGAZ — engaz.tech

Bilingual (English / Arabic) marketing site for a software house building restaurant
& café systems, AI agents, websites, and mobile apps. Neo-brutalist design: hard
borders, offset shadows, taped paper surfaces. Built with Next.js App Router,
Tailwind CSS, Framer Motion, and GSAP, and deployed to Cloudflare Workers as a fully
static export — no server-side runtime.

## Stack

- Next.js 16 (App Router, TypeScript, `output: "export"`)
- React 19, Tailwind CSS 3.4 with a `data-theme` light/dark token system
- Framer Motion 13 for scroll reveals and counters; GSAP + ScrollTrigger for the
  pinned stroke-reveal section and the page-wipe transition
- Lenis smooth scrolling (disabled for `prefers-reduced-motion`)
- `lucide-react` icons resolved by name from the content file
- `next/font` self-hosted fonts: Space Grotesk (Latin display), Space Mono
  (metadata), Caveat (handwritten notes), Cairo (Arabic)

## Running it

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # production build → out/
npm start           # serve the built site
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (next/core-web-vitals + typescript)
npm test            # vitest
```

## Project layout

```text
src/app/(en)/page.tsx            English home at /
src/app/(ar)/ar/page.tsx         Arabic home at /ar/
src/app/(en|ar)/layout.tsx       per-locale root layouts (lang, fonts, theme script)
src/app/globals.css              design tokens, neo-* component classes, Arabic rules
src/app/{robots.ts,sitemap.ts}   static SEO routes
src/components/layout/           Navbar, Footer, LocaleShell, PageFrame, ProgressRail, LocaleSwitch
src/components/providers/        SmoothScroll (Lenis), PageTransition (SVG wipe)
src/components/sections/         Hero, Pillars, StrokeReveal, Stats, ProjectsGrid,
                                 EcosystemDiagram, Services, Partners, ContactForm
src/components/ui/               Section, SectionHeading, NeoCard, Marquee, Tape,
                                 PaperTear, Highlight, MarkedText, ScrambleText,
                                 BrandMark, ThemeToggle, Loader
src/data/content.json            every user-visible string, as { en, ar } pairs
src/lib/types.ts                 the schema content.json must satisfy
src/lib/seo.ts                   canonical/hreflang helpers, JSON-LD structured data
src/lib/contact.ts               FormSubmit delivery (payload, validation, response check)
src/lib/locale-context.tsx       locale provider + t() helper
src/lib/theme-context.tsx        theme provider + pre-paint ThemeScript
src/lib/intro-state.ts           "intro finished" external store (useSyncExternalStore)
src/lib/use-gsap-lenis.ts        GSAP↔Lenis bridge for pinned ScrollTriggers
```

## Localization and direction

Each locale is a real route (`/` and `/ar/`), so crawlers get translated markup, a
matching `lang` attribute, per-locale canonical/hreflang links, and localized
JSON-LD. There is no client-side locale state to persist.

The layout is deliberately left-to-right in both languages — the page does not
mirror. Arabic text direction is applied at the text level in `globals.css`
(`html[lang^="ar"]` rules), and Latin-only values (phone numbers, counters) are
pinned with `dir="ltr"`. Nav/UI elements that must read forward for Arabic (the
hero CTA arrow) flip per-locale, not via `dir`.

## Re-branding

Every user-visible value is a `{ "en": "...", "ar": "..." }` pair inside
`src/data/content.json`. To rebrand, edit that file only:

- `brand.name` / `brand.tagline` control the logo text, loader, and metadata.
- `stats.cards[].value` is a plain number; the counter formats it and appends `suffix`.
- `work.featured` / `work.secondary` are arrays; the grids reflow automatically.
- `*.icon` fields hold Lucide icon names. Unknown names fall back to `Sparkles` —
  add new imports to `src/lib/icons.ts` when introducing a new icon.

`src/lib/types.ts` is the contract. `npm run typecheck` points at anything that drifts.

## The contact form

`ContactForm` posts to FormSubmit (`src/lib/contact.ts`), which relays submissions
to the inbox — no backend needed. Validations: required name/message, email pattern
check, a hidden honeypot field, and a 30-second resend cooldown. The relay's JSON
`success` flag is checked, so a refused submission surfaces as an error instead of
a fake success.

After the first real submission, FormSubmit issues a hashed endpoint id. Set it as
`NEXT_PUBLIC_CONTACT_FORM_ID` (see `.env.example`) so the raw inbox address stops
appearing in the client bundle. The deploy workflow reads it from the
`NEXT_PUBLIC_CONTACT_FORM_ID` GitHub secret — it must reach the build step, because
`NEXT_PUBLIC_*` values are inlined at build time.

## Deploying to Cloudflare

`npm run build` writes the static site to `out/`. `wrangler.toml` points the
Worker's `[assets]` directory at `out/` and declares `engaz.tech` and
`www.engaz.tech` as `custom_domain` routes, so Cloudflare manages the DNS records
itself. `public/_headers` ships security headers (CSP, nosniff, frame-ancestors).

```bash
npm run deploy    # next build, then wrangler deploy
npm run preview   # build and serve locally through Wrangler
```

### Automatic deployment

`.github/workflows/deploy.yml` runs on every push to `main`: install, typecheck,
lint, test, build, then `wrangler deploy`. Required repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
NEXT_PUBLIC_CONTACT_FORM_ID   # optional; falls back to the inbox address
```

Create the API token at **My Profile → API Tokens → Create Token** using the
*Edit Cloudflare Workers* template, scoped to the `engaz.tech` zone.

## Accessibility & motion

- Skip link precedes the navbar; nav landmarks carry localized `aria-label`s.
- The contact form reports status through `role="status"` + `aria-live`.
- All animation honours `prefers-reduced-motion`: Lenis stays off, the wipe
  teleports without animating, the pinned stroke section renders static, and a
  global media query collapses CSS animation/transition durations.
- Client-only state (theme, intro seen, reduced motion) is gated behind
  `useSyncExternalStore`/`useMounted` so hydration output matches the server.
