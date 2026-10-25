# Codepet Current Context

Read this file at the start of every AI-assisted coding session.

## Current Shape


- Supporter follow-up phase (Oct25): branch `codex/education-supporter-workflow`
  based on merged funding PR #11/main `59f86e1`. Production live payments verified
  at https://www.codepet.ca/education#support; local dev stays test-only. The owner
  accepted receipt/portal checks, reusable drafts and a minimal manual workflow.
  Sandbox receipt arrived in business Gmail; public portal email login succeeded
  and selected the older subscribed customer over a newer empty duplicate-email
  customer. Temporary test subscription/customers were cleaned up. Live automatic
  email delivery has not been tested with a real charge.
- New private local exporter reads paid completed Education Sessions, keeps the
  checkout email/identity and consent evidence, deduplicates eligible recipients,
  and gives explicit unsubscribe suppression priority. Test/live lists stay
  outside Git under the owner's private Codepet directory. Failed refreshes and
  withdrawals clear the current CSV. No automatic sending, provider or database.
  Live export currently has zero completed contributions/eligible contacts.
- Consent v2 adds a minimal expandable business contact/withdrawal disclosure and
  requires the matching client version for opt-in. Earlier v1 grants are held
  out of the generated updates list. An unchecked repeat payment is not a
  withdrawal; newer metadata does not lift an explicit suppression automatically.
  See `docs/EDUCATION-SUPPORTERS.md` and `docs/templates/` for manual sending,
  evidence, unsubscribe and retention instructions. Two unaddressed templates
  are saved in business Gmail Drafts; no thank-you or impact update was sent.
- Follow-up checks: 27 tests, lint and production build pass. Browser verified collapsed/expanded contact details, unchecked default and
  opt-in checkout; Stripe confirmed exact v2 evidence and CAD10 test total, then
  the unpaid Session was expired. Independent review pending. These follow-up code/UI changes are local, not
  deployed; the production checkout from PR #11 remains live.


- Stripe setup requested 2026-10-25; implemented on `codex/education-stripe-checkout`
  over PR #10 (`4292159`), with integration PR #11:
  https://github.com/codepetca/codepet.ca/pull/11. Canonical checkout remains
  `/Users/stew/Repos/codepet.ca`; retire the feature worktree after merge while
  preserving private configuration. Local checkout uses test mode. Live mode requires a
  separate activation flag, production runtime, matching live key/portal and
  official Codepet HTTPS origin. Owner instructed proceeding with launch without
  a Stripe Support response; local private activation flags remain false. Check
  the production environment/deployment for actual live availability.
  Private `.env.local` is ignored and saved. `.env.production.local` is an
  ignored private live-preparation file; never print or commit either file.
  Account/API identity, active test product and portal match Codepet's dashboard.
  Owner subsequently saved the existing live key privately. Read-only live API
  verification confirms Codepet Inc., CA, charges/payouts enabled, and the correct
  live product/default price/active portal. Activation false; no live Session,
  customer, charge or subscription created during this verification.
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
  passed; simulation cleaned up. Chrome3DS initially showed a blank frame;
  a later in-app browser test completed the3DS2 challenge, authenticated and paid
  CAD12.50 with no tax, and reached the verified thank-you page. Hosted monthly
  CAD12.50 passed with optional
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
- Lint/build/15Node tests pass, including money/config/metadata/redirect/body
  regressions. Local preview3220; code/publication tracked through PR #11.
  Minimal Stripe-specific privacy/support terms are prepared locally. Live
  product/portal prepared and saved support email/policy links configured.
  Vercel production hosting verified through GitHub deployment status. Live
  private configuration verified. Exact question
  about own free-content/education support prepared for Stripe Support. Owner
  chose to ask Stripe personally; do not send or request duplicate permission.
  Owner subsequently instructed proceeding without a response. No agent
  message sent and no program-specific Stripe approval claimed. Owner tax/name
  decisions recorded. Vercel's live checkout POST endpoint is limited to10
  attempts per60seconds/IP. Production-only configuration was added, with the
  key stored sensitive and activation initially false; preview has no live key.
  Canonical site is https://www.codepet.ca (bare domain redirects there).
  Client handles hosting429/non-JSON errors safely. stripe_live_behavior reviewed
  complete8335ddd..9a5418f delta at high reasoning: complete, no findings;
  synthetic retry/409/429/abort/client tests passed. Review session now3launches,
  1initial+1targeted wave,2fix batches (docs then hosting errors), under60minutes;
  no further code changes. Live WAF probe with invalid requests gave10x404 then
  429 before deployment, confirming enforcement without Stripe calls.
  Public email portal login/duplicate-email selection and receipt delivery
  remain coverage limitations; browser3DS completion is now verified.
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
