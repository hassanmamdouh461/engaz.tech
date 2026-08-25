# TECH CORP — Nation-Scale Digital Transformation Site

Bilingual (English / Arabic) enterprise marketing site built with Next.js 14 App Router,
Tailwind CSS, and Framer Motion. All copy lives in one JSON file, so the site can be re-branded
without touching component code.

## Stack

- Next.js 14.2 (App Router, TypeScript, static export of `/`)
- Tailwind CSS 3.4 with a custom dark enterprise theme
- Framer Motion 11 for scroll reveals, staggered text, counters, and marquees
- `lucide-react` icons resolved by name from the content file
- Google Fonts via `next/font`: Plus Jakarta Sans (Latin) and Cairo (Arabic)

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

## Deploying to Cloudflare

The site is a fully static export (`output: "export"` in `next.config.js`) served by a Cloudflare
Worker using static assets — no server-side rendering, no functions.

```bash
npm run deploy    # next build, then wrangler deploy
npm run preview   # build and serve locally through Wrangler
```

`npm run build` writes the static site to `out/`. `wrangler.toml` points the Worker's `[assets]`
directory at `out/` and declares both hostnames as `custom_domain` routes, so Cloudflare creates and
manages their DNS records itself — the zone needs no manual CNAME.

Live URLs, all verified returning 200 with assets loading:

```text
https://engaz.tech
https://www.engaz.tech
```

To move to a different domain, change the two `[[routes]]` patterns in `wrangler.toml` and redeploy.
The zone must already be on Cloudflare nameservers for `custom_domain` to work.



## Project layout

```text
src/app/layout.tsx              root layout, fonts, locale provider, navbar and footer
src/app/page.tsx                section composition for the single page
src/app/globals.css             theme primitives: .glass-card, .gradient-text, .btn-primary
src/components/layout/          Navbar, Footer
src/components/sections/        Hero, Pillars, Stats, ProjectsGrid, EcosystemDiagram,
                                Services, Partners, ContactForm
src/components/ui/              Section, SectionHeading, Marquee, CountUp, BackgroundDecor
src/data/content.json           every string and number rendered on the page
src/lib/types.ts                the schema content.json must satisfy
src/lib/locale-context.tsx      locale state, direction switching, the t() helper
src/lib/motion.ts               shared Framer Motion variants
src/lib/icons.ts                string-to-icon registry
```

## Micro-interactions layer

On top of the base motion model the site adds an Awwwards-style interaction layer:

- **Lenis smooth scroll** — global inertia scrolling via `SmoothScroll`, wired into the root layout and the anchor-navigation hook so in-page jumps keep the same easing. Disabled for reduced-motion users.
- **SpotlightCard** — mouse-tracked radial glow on the border and background (`rgba(0,240,255,0.15)`).
- **TiltCard** — spring-based `rotateX`/`rotateY` driven by motion values, used on the featured project cards.
- **MagneticButton** — shifts toward the cursor within a proximity radius using a damped spring.
- **SplitText** — hero headline words reveal from `y:100%` to `y:0%` inside an `overflow-hidden` mask.
- **SlidingTabs** — animated `layoutId="activeTab"` highlight pill shared by the language toggle and the project sector filter.
- **Drifting aura** — blurred SVG gradient orbs floating on infinite loops behind the content.

All of these live in `src/components/ui/` and are composable, so any card can gain a spotlight or tilt by wrapping its markup.

## Animation model

All motion is Framer Motion, and the shared vocabulary lives in `src/lib/motion.ts`:
`fadeInUp`, `fadeInDown`, `scaleUp` (0.9 to 1), `staggerContainer`, `drawPath`, `cardHover`, and the
direction-aware `slideInX(offset, sign)` factory.

Per section:

- Navbar fades down on load; anchor clicks route through `useAnchorScroll`, which offsets the
  scroll target by the fixed header height instead of hiding the heading behind it.
- Hero splits each headline line into words and animates them with an overflow-clipped rise, then
  releases the subtitle, buttons, and ticker in sequence.
- Pillars, Projects, and Ecosystem reveal with staggered `fadeInUp` on `whileInView`;
  Services uses staggered `scaleUp`.
- Stats counters run through `useMotionValue`, `useTransform`, and `animate`, triggered by
  `useInView`.
- Featured and secondary project cards share the `cardHover` state: scale to 1.02, cyan border, and
  a `0 0 20px 2px rgba(0, 240, 255, 0.3)` glow.
- Ecosystem connectors are inline SVG paths animating `pathLength` from 0 to 1, with a vertical
  variant for the stacked layout and a horizontal one from the four-column breakpoint up.
- Contact slides the channel list and the form in from opposite edges at once.

Cards whose hover state Framer Motion drives use `.glass-surface` rather than `.glass-card`, so a
CSS `hover:` rule does not fight the animated border colour.

## Re-branding

Every user-visible value is a `{ "en": "...", "ar": "..." }` pair inside `src/data/content.json`.
To rebrand, edit that file only:

- `brand.name` and `brand.tagline` control the logo text and footer signature.
- `stats.cards[].value` is a plain number; the counter animation formats it and appends `suffix`.
- `work.featured` and `work.secondary` are arrays. Add or remove entries freely; the grids reflow.
- `*.icon` fields hold a Lucide icon name. Names not present in `src/lib/icons.ts` fall back to
  `Sparkles`, so add new imports there when you introduce a new icon.

`src/lib/types.ts` is the contract for the file. Adding a required field to the content means
adding it to the interface too, and `npm run typecheck` will point at anything that drifted.

## Localization and direction

The locale provider writes `lang` and `dir` onto `<html>` and persists the choice in
`localStorage`. Layout uses logical Tailwind properties (`start-*`, `end-*`, `ms-*`) so the whole
page mirrors when Arabic is selected. Latin-only values such as phone numbers, the PGP fingerprint,
and animated counters are pinned with `dir="ltr"` so they are not reordered inside Arabic text.

## The contact form

`ContactForm` is client-side only. Submission validates that the organization name and message are
present, then resolves a simulated delay and shows the success state — no data leaves the browser.
Wire it to a real endpoint by replacing the `setTimeout` in `handleSubmit` with a `fetch` POST.
That endpoint will need its own validation, rate limiting, and spam protection; none of that exists
yet on the client side.

## Accessibility notes

- A skip link precedes the navbar.
- The mobile menu button exposes `aria-expanded` and a localized `aria-label`.
- Form status messages are announced through `role="status"` with `aria-live="polite"`.
- Duplicated marquee items are marked `aria-hidden` so screen readers read each item once.
- All animation honours `prefers-reduced-motion` through a global media query in `globals.css`.
