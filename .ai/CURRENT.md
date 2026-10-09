# Codepet Current Context

Read this file at the start of every AI-assisted coding session.

## Current Shape

- Codepet is a small public Next.js site for playful learning experiences.
- The home route renders a pet icon and typewriter interaction. One pet opens
  `/dash` after the 0.6s heart animation and 360ms page fade; a second pet starts
  the fade immediately. Navigation preserves the pet in the query string,
  guards duplicate transitions, and clears its timer on unmount.
- The dashboard tagline is “Build fun stuff together”. Cards stack vertically
  in this order: Codepet Education (mortarboard, `/education`), Pika, Labs.
  Each whole card is a link with visible keyboard focus; Lop is removed.
- The footer house icon opens `/dash` with a 44px hit area and accessible label.
  Copyright is plain text. The former global paw header is removed.
- `/education` introduces Codepet Education, an internal program of Codepet Inc.,
  and features Zero. Keep visible copy minimal, with links and native collapsed
  About the program / Support education disclosures. Payments remain pending;
  the page does not claim charitable status or offer charitable tax receipts.
- Public routes include `/about`, `/contact`, `/privacy`, `/terms`, `/dash`, and
  `/education`; the sitemap includes the education page.
- Next.js and eslint-config-next are pinned to 16.4.0 after dependency advisories
  were found during this work. Compatible nanoid/source-map-js lockfile updates
  remove remaining production advisories. Production audit: 0 vulnerabilities;
  full audit still reports 8 development-tooling advisories (1 moderate/7 high).
- Verification on 2026-10-09: lint/build pass. Browser checks cover footer→dash,
  Education card→education, native disclosure open/close using click and Enter,
  and pet navigation. Single pet measured 1100ms; second pet measured 453ms
  before the heart-duration refinement. Light desktop dashboard and dark narrow
  education layout were inspected. Final dark stacked cards fit a 390px viewport
  with no horizontal overflow. No dedicated test harness exists.
- PR/merge authorized by the owner on 2026-10-09 for the accumulated Codepet
  changes. Funding activation, payment-provider setup, and separate Zero changes
  remain outside this PR. Local preview: http://127.0.0.1:3220.

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

- `app/layout.tsx`: global metadata, font, theme provider, main shell, footer.
- `app/page.tsx` and `components/home-content.tsx`: home route entry point.
- `components/typewriter.tsx`, `components/pet-icon.tsx`, `lib/pets.ts`: home interaction.
- `components/footer.tsx`: site chrome and dashboard navigation.
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
