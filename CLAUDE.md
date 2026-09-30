# Model workflow

- **Thinking and planning:** Claude Opus 5.5 (`claude-opus-5-5`). Use it to understand the task, review code and write the plan.
- **Implementation:** Claude Sonnet 5.5 (`claude-sonnet-5-5`). Use it to write the code, run the checks and fix errors, following the plan from Opus.

In Claude Code, the `opusplan` model setting does this split automatically: Opus in plan mode, Sonnet outside it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
