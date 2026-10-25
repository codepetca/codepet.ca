# Codepet Current Context

Read this file at the start of every AI-assisted coding session.

## Current Shape

- Owner authorized PR and merge on 2026-10-25 for the Education support and
  campaign preview changes. Payments remain unavailable; no provider setup,
  account changes, entries, draws, charity commitments, or receipts are enabled.
- `/dash` stacks Codepet Education, Pika, and Labs cards. Each card is clickable;
  Education also has a separate green Support Education button. Pika/Labs status
  chips are removed. The tagline is “Build fun stuff together”.
- `/education` describes an internal education program of Codepet Inc., with Zero
  links and native About/Support disclosures. The support button and #support
  navigation open the disclosure, including after manual collapse.
- Funding choices are CAD monthly $5/10/20/50 or one-time $10/20/50/100. Defaults
  are $10 monthly and $20 one-time. Prominent Other amount accepts $1+ with up to
  two decimals; choices persist separately while switching frequency. Payments
  coming soon stays disabled. All students get the same tools/materials.
- `/education/campaign-preview` is an illustrative game-jam campaign, linked from
  Education, noindex and omitted from the sitemap. The sample deadline is
  Nov 7, 2026 at 23:59 America/Toronto. Progress starts at 72%, supports 0–175%,
  and unlocks prize cards at 100/125/150%. Milestones celebrate once per run;
  Reset allows replay. Ended-state and reduced-motion controls are available.
  OS reduced-motion preferences also suppress confetti and animation.
- Existing home pet navigation, footer house link to `/dash`, and policy pages
  are preserved. One pet navigates after the heart animation and fade; a second
  pet starts the fade immediately. The former paw header and Lop are removed.
- Next.js and eslint-config-next are pinned to 16.4.3, patching the critical
  advisory encountered with 16.4.0. Last production dependency audit was clean;
  full audit reported four development-tooling advisories.
- Checks: lint, production build, and six Node helper tests pass. Prior browser
  checks cover support navigation, radio/custom choices and validation, countdown,
  100/125/150% milestones, 175% semantics, once-per-run celebrations, ended state,
  reset, and reduced motion. Dark desktop/narrow layouts had no overflow; the
  campaign narrow override measured 520px rather than the requested 390px.
- Review ledger (2026-10-25): standard risk; one independent GPT-6.1-Sol reviewer
  at medium reasoning for the full diff and immediate callers. Budget: at most
  seven launches, four fix rounds, 60 minutes. Final revision/verdict recorded
  in the PR. No separate Zero repository changes belong in this PR.

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
- Pure campaign helpers have Node tests; UI behavior still requires browser verification.
- This repo may be edited from the hub checkout or a Codex-managed worktree. Always check `git status --short --branch` before changing files.

## Normal Checks

- Docs-only: `git diff --check` and Markdown link review.
- Code/UI: `npm run lint` and `npm run build`.
- UI flow or visual changes: start the app with `npm run dev` or `scripts/run-action.sh`, then verify the affected route in a browser.
