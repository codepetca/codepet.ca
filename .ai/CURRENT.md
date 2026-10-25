# Codepet Current Context

Read this file at the start of every AI-assisted coding session.

## Current Shape

- Stripe setup requested 2026-10-25: `codex/education-stripe-checkout` in
  `/Users/stew/.codex/worktrees/codepet.ca/education-stripe-checkout`, based on
  PR #10 (`4292159`). Local checkout uses test mode. Live mode requires a
  separate activation flag, production runtime, matching live key/portal and
  official Codepet HTTPS origin. Activation remains disabled.
  Private `.env.local` is ignored and saved. `.env.production.local` is an
  ignored private live-preparation file; never print or commit either file.
  Account/API identity, active test product and portal match Codepet's dashboard.
- Created education support test product ($10/month default) and hosted portal:
  invoice history, payment updates, cancellation at period end; no reason,
  coupon, plan or quantity changes. Test resources/evidence are in the private
  HQ education record, outside Git. Also prepared a live education product and
  portal with the same simple management features, Codepet Inc. identity and
  return link to education. No live charge/subscription or payout change.
- Owner's latest checkout description: “support for Zero and Codepet Inc.'s
  other education projects. No charitable tax receipt.” Applied to the Stripe
  test/live products and local submit text; monthly cancellation disclosure remains.
- Actual Stripe API verifies all eight preset/custom combinations, exact CAD
  totals, idempotent retries and409 conflicts, foreign-origin403, wrong-type415,
  invalid/injected400 and no-store. API-only test Sessions were expired.
  Hosted CAD20 one-time passed decline then success, names omitted/email present,
  consentfalse propagated to PaymentIntent and verified thank-you. Test-clock
  initial/renewal payments, failure/recovery and cancellation/no next renewal
  passed; simulation cleaned up. Chrome3DS simulator gave a blank frame, so that
  completion remains unverified. Hosted CAD12.50 monthly passed with optional
  names and consenttrue. Test portal invoice/payment controls and period-end
  cancellation verified; actual public email-login/receipt delivery outstanding.
- Accounting/name source review completed Oct25 at owner's request. Preliminary
  treatment: corporate business income; no-benefit support outside GST/HST.
  Owner explicitly approved the working GST/HST position Oct25; no external
  accountant sign-off or CRA ruling obtained. Existing HST registration is from the
  July21 owner record, not newly reverified. OBR confirms Codepet Inc.; exact
  Codepet Education name search returned no results. Recommend $60/five-year
  operating-name registration under Codepet Inc. Owner will file later and
  explicitly instructed us to keep using the name and proceed. No filing or
  accountant message sent. Both education products now use Nontaxable
  txcd_00000000; Checkout explicitly disables automatic tax. Account-wide SaaS
  preset unchanged. No CRA ruling is represented as obtained.
- Initial test-mode review ledger: two fresh GPT-6.1-Sol/high full-diff passes at d7ed68b over
  4292159; no blockers. Actual API testing then found rejected legacy
  payment_method_types. Fix batch1 removes it and excludes BNPL methods; Stripe
  confirms card/Link. Targeted GPT-6.1-Sol/high review passed at47aff1f. Total
  3launches/2waves/1code-fix batch; one P3 stale-doc finding accepted/corrected in
  this receipt. Reviews completed within60minute budget; attributable elapsed/
  tokens/effective config unknown. No supported worker shutdown API is exposed.
  Later owner-approved copy changes are nonfunctional and checked directly.
- Live-readiness review: complete delta47aff1f..8335ddd independently checked
  by fresh stripe_live_security and stripe_live_behavior GPT-6.1-Sol/high agents.
  Both scopes complete, no code blockers. Shared P3 stale-document finding
  accepted/corrected in one documentation batch; code unchanged after review.
  New review session:2launches/1initial wave/1docs-only fix batch; no extra
  review wave required for status corrections. Reviewer token and effective
  runtime telemetry unavailable. Prior test-only coverage remains reused.
- Lint/build/14Node tests pass, including money/config/metadata/redirect/body
  regressions. Local preview3220. No push/publication/PR for this integration.
  Minimal Stripe-specific privacy/support terms are prepared locally. Live
  product/portal prepared and saved support email/policy links configured.
  Vercel production hosting verified through GitHub deployment status. Private
  live key/configuration, deployment abuse controls and remaining hosted tests
  still gate activation. Owner approval of tax treatment/name deferral recorded.
  See `docs/EDUCATION-PAYMENTS.md` for configuration and acceptance evidence.

## Earlier merged work (historical status)

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
