# Codepet Current Context

Read this file at the start of every AI-assisted coding session.

## Current Shape

- Stripe setup requested 2026-10-25: local worktree `education-stripe-checkout`,
  branch `codex/education-stripe-checkout`, based on PR #10 (`4292159`).
  See `docs/EDUCATION-PAYMENTS.md` for implementation/configuration and gates.
  Hosted Checkout backend is test-only, defaults disabled, rejects live keys.
  Owner signed in through Chrome; created the education support test product
  ($10/month default) and saved/activated the hosted test customer portal, with
  cancellation at period end and no reason collection, plan or quantity changes.
  Existing test key is now saved in ignored private .env.local; API account,
  active test product and portal match the observed Codepet dashboard.
  No live product/payment/payout changes. Tax category inherited SaaS by default;
  do not use it as a live tax decision. Actual hosted Checkout/lifecycle tests
  remain pending. Independent review ledger: payment-boundary risk, two fresh
  GPT-6.1-Sol/high reviewers for security/consent and behavior/compatibility.
  Initial wave2launches,0fixbatches; cap4fixrounds/7launches/60minutes.
  Both full-diff passes completed at d7ed68bad089b6cce3344aa1ff1ade5a822be7f4
  over4292159 with zero findings/fixes and no coverage gap within static test-only
  scope. Security reviewer also passed focused adversarial helper assertions;
  behavior reviewer verified SDK schema. Both reused local lint/build/13tests.
  Under10minutes; exact elapsed/tokens/effective config unknown. No supported
  worker shutdown API is exposed. No live approval or actual sandbox payment
  evidence inferred from these passes. Manual secret entry is still pending;
  computer-use safety permissions blocked the attempted Terminal hidden prompt.
  SDK integration fix batch1 removes rejected payment_method_types and excludes
  BNPL methods. Actual API matrix/idempotency/validation and hosted one-time
  decline/success passed; test-clock renewal/failure/recovery/cancel passed.
  Browser3DS frame is blank; monthly browser/portal/receipts still being checked.
  Nothing pushed/published.
  Local lint/build and 13 Node tests pass; missing-config API503/no-store and
  disabled UI/range validation verified. Local preview uses port3220.
  API helper worker: GPT-6.1-Sol/medium, read-only official docs contract review,
  no edits or account access. Useful finding: Stripe native promotions consent
  is US-only, so retain the separate unchecked site checkbox. Worker contract
  inspected against actual SDK/schema; no rework/conflicts. Telemetry unknown.

- Funding UI refinement authorized for PR/merge on 2026-10-25:
  `codex/supporter-details` adds optional name/organization and an unchecked
  Zero/impact updates option. Email is described as required at future Stripe
  checkout. Preview fields are not submitted or persisted; payments stay disabled.
- Three presets per frequency fill an always-visible editable amount. The field
  matches one preset column, with a $ prefix and an adjacent CAD/frequency label.
  The disabled button displays Contribute plus amount/frequency, or Choose an
  amount for invalid input. Payments coming soon appears below it.
- Zero's title links to its site; its Experimental badge and separate Source/Open
  Zero links are removed. Other education and campaign behavior is preserved.
- Verification: lint/build and whitespace checks pass. Browser checks cover
  preset-to-field synchronization, custom edits/validation, independent amounts
  per frequency, optional fields, keyboard consent toggle and reload defaults.
  Field/preset widths match (191.4px in the measured view); dark narrow layouts
  inspected without overflow. Local preview uses port 3220.
- Funding UI review ledger: standard risk, one independent GPT-6.1-Sol reviewer
  at medium reasoning. One initial full-diff pass; up to four fix rounds, seven
  total launches and 60 minutes. Exact revision/verdict recorded in the PR.

- Owner authorized PR and merge on 2026-10-25 for the Education support and
  campaign preview changes. Payments remain unavailable; no provider setup,
  account changes, entries, draws, charity commitments, or receipts are enabled.
- `/dash` stacks Codepet Education, Pika, and Labs cards. Each card is clickable;
  Education also has a separate green Support Education button. Pika/Labs status
  chips are removed. The tagline is “Build fun stuff together”.
- `/education` describes an internal education program of Codepet Inc., with Zero
  links and native About/Support disclosures. The support button and #support
  navigation open the disclosure, including after manual collapse.
- Funding choices are CAD monthly $5/10/20 or one-time $10/20/50. Defaults
  are $10 monthly and $20 one-time. The editable amount accepts $1+ with up to
  two decimals; choices persist separately while switching frequency. The
  contribution button stays disabled. All students get the same tools/materials.
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
- Education/campaign preview shipped in PR #9 at `1e46270`. Its independent
  review was clean and local/CI checks passed. No separate Zero repository
  changes belong in the funding UI PR.

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
