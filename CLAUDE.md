# Model workflow

- **Thinking and planning:** Claude Opus 5.5 (`claude-opus-5-5`). Use it to understand the task, review code and write the plan.
- **Implementation:** Claude Sonnet 5.5 (`claude-sonnet-5-5`). Use it to write the code, run the checks and fix errors, following the plan from Opus.

In Claude Code, the `opusplan` model setting does this split automatically: Opus in plan mode, Sonnet outside it.

# Project notes

- The site is Astro 7 + Tailwind CSS v4, built as static files to `dist/`. Astro 7 and
  Tailwind v4 changed APIs from earlier versions; check the official docs before
  relying on memory (Tailwind config lives in `src/styles/global.css` via `@theme`,
  there is no `tailwind.config`).
- Every user-visible string lives in `src/data/content.json` as `{ en, ar }` pairs;
  `src/lib/types.ts` is its schema. Never invent claims, testimonials, client logos
  or prices — they must come from the owner.
- Arabic is RTL (`/ar/`); use logical utilities (`ms-*`, `start-*`, `border-s`) and
  keep Latin-only values (phones, numbers) in `dir="ltr"`.
- Pushing to `main` deploys to engaz.tech through GitHub Actions.
- Run `npm run typecheck && npm run lint && npm run format:check && npm test && npm run build`
  before committing.
