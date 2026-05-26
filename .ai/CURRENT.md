# Codepet Current Context

Read this file at the start of every AI-assisted coding session.

## Current Shape

- Codepet is a small public Next.js site for playful learning experiences.
- The home route renders a pet icon and typewriter interaction.
- Supporting public routes include `/about`, `/contact`, `/privacy`, `/terms`, and `/dash`.
- `/dash` presents experimental Codepet projects such as `pika.codepet.ca`, `labs.codepet.ca`, and `lop.codepet.ca`.

## Repo Facts

- Framework: Next.js App Router.
- React: React 19.
- Package manager: npm with `package-lock.json`.
- Styling: Tailwind CSS v4 in `app/globals.css`.
- Icons: FontAwesome solid icons.
- Theme: `next-themes` with `class`-based dark mode.
- Import alias: `@/*`.
- Main branch: `main`.
- Deployment target: likely Vercel/Next hosting, but no project-specific deployment docs are present.

## Key Files

- `app/layout.tsx`: global metadata, font, theme provider, header, main shell, footer.
- `app/page.tsx` and `components/home-content.tsx`: home route entry point.
- `components/typewriter.tsx`, `components/pet-icon.tsx`, `lib/pets.ts`: home interaction.
- `components/header.tsx`, `components/footer.tsx`: site chrome.
- `app/dash/page.tsx`: experimental project dashboard.
- `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/contact/page.tsx`: policy/contact content.
- `scripts/dev-open.sh`: opens or starts a dev server.
- `scripts/run-action.sh`: installs dependencies, starts a dev server on `PORT` default `3025`, and opens it.

## Product Boundaries

- Keep the site simple and public-facing.
- Do not introduce accounts, databases, tracking, payments, or backend integrations without explicit direction.
- Keep legal/privacy/terms content factual and targeted; do not rewrite policy scope casually.
- External project links should be clear when they are beta or experimental.

## Known Hazards

- The global layout centers route content by default, so long pages need their own width and alignment classes.
- Some components are client components because they use hooks or pathname access. Keep server components as the default for static routes.
- There is no dedicated unit/e2e test harness yet; verification depends on lint, build, and browser checks for UI changes.
- This repo may be edited from the hub checkout or a Codex-managed worktree. Always check `git status --short --branch` before changing files.

## Normal Checks

- Docs-only: `git diff --check` and Markdown link review.
- Code/UI: `npm run lint` and `npm run build`.
- UI flow or visual changes: start the app with `npm run dev` or `scripts/run-action.sh`, then verify the affected route in a browser.
