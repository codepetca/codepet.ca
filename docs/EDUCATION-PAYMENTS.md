# Codepet Education payments

Owner requested Stripe setup on 2026-10-25 after funding UI PR #10 merged.
The local preview uses test mode. Live catalog/portal preparation is authorized;
the live payment button has not been published or activated.
The owner signed in through Chrome. Created the Codepet Education support test
product with a CAD $10/month default price; the backend will use that product for
inline custom prices. Saved the test customer-portal configuration: invoice
history, payment-method updates and cancellation at the end of the billing
period; no cancellation reason, coupons, plan switching or quantity changes.
Activated its test login link. Later live preparation is described below;
no live key, charge or payout setting has been changed.
The owner supplied the existing test secret through ignored private configuration.
Authenticated API verification matches the Codepet dashboard account and confirms
the active test product and portal; no secret is stored in Git.
After approving the no-benefit contribution tax treatment, the owner instructed
us to continue with Codepet Education and said they will file the operating name
later. Both education product setups now use Stripe's Nontaxable category
`txcd_00000000`; the account-wide SaaS preset was not changed. Checkout explicitly
disables automatic tax. This records the chosen treatment, not a CRA ruling.
Created the live education product and a live portal configuration/login link
with invoice history, payment-method updates and period-end cancellation; no
reason questionnaire, coupons, plan or quantity switching. The portal identifies
Codepet Education and Codepet Inc. No live charge or subscription was created.
Stripe's public settings now link to the site's privacy, terms and contact pages
and use the saved Codepet business support email. Successful-payment/refund
receipt emails are enabled for future transactions; actual delivery is untested.
No receipt or updates email was manually sent.

The owner saved the live key privately. Read-only live API verification confirmed
the expected Codepet Inc. Canadian account, charges/payouts enabled, active live
education product with Nontaxable category, CAD10/month default price, and the
matching active live portal login/configuration. Cancellation is at period end,
reason collection and plan updates disabled, invoices/payment updates enabled.
The activation flag remains false. No live Checkout Session, customer, charge or
subscription was created for this verification; no secret was printed or retained
in documentation.

Provider-use classification still needs confirmation before launch. Stripe's
tips/donations guidance distinguishes support for already-provided content from
donations for a committed charitable purpose, and its restricted-business rules
address fundraising. Account enablement is not specific approval of this program.
Prepared the following request for Stripe Support; do not send without the
owner's explicit messaging authorization:

> Codepet Inc. is a Canadian for-profit corporation. Our Codepet Education
> program distributes our free Zero Java teaching kit and learning materials at
> zero.codepet.ca. We want to accept optional one-time and monthly contributions
> through codepet.ca/education to maintain these free resources and develop more
> education projects. Paying provides no additional access, services, rewards or
> ownership; all users receive the same resources. Funds go to Codepet Inc. for
> its own projects, and we issue no charitable tax receipts. Is this model
> supported on our existing Stripe account? Please confirm the appropriate
> classification and whether program-specific approval or documentation is needed.

References:

- [Stripe tips/donations requirements](https://support.stripe.com/questions/requirements-for-accepting-tips-or-donations)
- [Stripe restricted businesses](https://stripe.com/legal/restricted-businesses)

## Local integration

- Stripe SDK pinned to 23.0.1. Hosted Checkout, CAD, quantity one, no rewards,
  no charitable donation receipts. One-time payments and monthly subscriptions
  use server-validated integer cents and a single configured education product.
- Suggested monthly $5/10/20; one-time $10/20/50. Existing defaults $10 monthly
  and $20 one-time. Custom amounts currently limited to $1–10,000 per payment;
  this is an application safety limit, not Stripe's maximum.
- `POST /api/support/checkout` accepts only amount, frequency, updatesConsent
  and a random UUID attemptId. Same attempt retries keep the same parameters
  and Stripe idempotency key. Edits start a new attempt; a conflict requires a
  fresh attempt. Server fixes the currency, product and callback destinations.
- Same-origin JSON requests only, with a 4 KiB streamed body limit. Stripe SDK
  timeouts/retries are bounded. No raw Stripe errors, payment payloads or keys
  are logged or returned. Redirects are restricted to HTTPS checkout.stripe.com.
- Native Stripe optional individual/business-name fields and required email
  collect identity once at checkout. When checkout is enabled, the local name/
  organization preview inputs are replaced by a short explanation.
- The site supplies the separate unchecked updates checkbox. Stripe's native
  promotions consent is US-only. Server-controlled consent text/version/source,
  the boolean and attempt ID are retained in Session metadata and copied to
  PaymentIntent or Subscription metadata. Session.created is the server-recorded
  submission time; no fresh timestamp is inserted during idempotent retries.
  This records a choice; it does not automatically subscribe or email anyone.
- `/education/thanks` queries Stripe before confirming a completed, paid test
  Session for this program. The redirect alone is not payment proof. No personal
  contact details are rendered. No webhook, donor account or new database.

## Private configuration

Copy `.env.example` to `.env.local`; never commit keys. Required settings:

```text
EDUCATION_PAYMENTS_MODE=test
EDUCATION_CHECKOUT_ORIGIN=http://127.0.0.1:3220
STRIPE_SECRET_KEY=<test-mode key supplied through a private mechanism>
STRIPE_EDUCATION_PRODUCT_ID=<existing or approved test product ID>
EDUCATION_PORTAL_URL=<activated Stripe test portal login URL>
```

The integration fails closed with missing/invalid settings and rejects mismatched
test/live keys or portal URLs. No `NEXT_PUBLIC_` secret exists. Local
loopback HTTP or an explicit HTTPS origin is required; the Host header cannot
choose the callback origin. Do not use a production key to test.

Live preparation is separate from activation. Live mode additionally requires
`EDUCATION_PAYMENTS_MODE=live`, `EDUCATION_LIVE_PAYMENTS_APPROVED=true`,
`NODE_ENV=production`, a private live key, the live product and live portal URL,
and the exact HTTPS origin `https://codepet.ca` or `https://www.codepet.ca`.
Localhost, preview hosts, ports and a test portal/key are rejected in live mode.
The runtime checks the returned Session's livemode and the thank-you route only
retrieves Session IDs for the configured mode. Do not enable the activation flag
until deployment controls and the final owner launch decision are complete.
Never paste live secrets into chat or commit them.

The existing Codepet dashboard and test-mode context are accessible. Verify the
key belongs to that same account before making API changes. The test product
identifies the internal program and equal access to materials. The backend creates the exact
one-time or recurring price inline; preset-specific Payment Links are not needed.
Use an existing approved server-side test key if available. Creating a new
credential or broadening access needs the owner's action-time approval. Keep
passwords, verification codes and API keys out of chat and Git.

## Test acceptance before live configuration

1. Create and retrieve hosted test Checkout Sessions for both frequencies,
   presets and custom cents; verify CAD totals, optional names, required email,
   recipient and no charitable receipt promise.
2. Verify opt-in and opt-out metadata, Session.created evidence and a private
   export combining completed Sessions with Customer names/email. An updates
   list must exclude abandoned payments and honor later unsubscribes; Stripe
   historical metadata alone is not a mailing-list suppression system.
3. Test successful, declined and authentication-required initial payments,
   canceled/expired checkout and repeated-click/network retries.
4. Configure Stripe's hosted customer-portal login link for invoices, payment
   methods and cancellation. Verify cancellation and renewal failure/recovery
   in Stripe sandbox/test clocks. Do not expose arbitrary customer IDs through
   an unauthenticated custom portal endpoint. Duplicate customer emails can
   affect the hosted portal's subscription selection and need testing.
5. Confirm automatic receipt/customer-email settings; test receipts may need
   manual sending. No email is sent by this application yet.

Before live activation, confirm corporate charges/payout eligibility, funding-use
acceptance, accounting/GST-HST treatment, operating-name requirements, support/
refund/cancellation wording, portal availability and deployment abuse controls.
The source review below is complete. The owner approved the working no-benefit
support GST/HST treatment and will handle operating-name filing later; no external
tax sign-off or filing is represented as complete. Narrow Stripe-specific
privacy/support terms are prepared locally. Production is deployed by Vercel
(confirmed from GitHub deployment status); deployment-specific abuse controls,
private live configuration and remaining hosted cases still need verification.
The original test-only code passed independent static review; live-mode changes
require their own proportional review before activation.

Checks so far: lint/build and 14 Node tests pass (six existing campaign tests and
eight checkout tests). Local API smoke check returns503 with no-store when
unconfigured; browser verifies disabled checkout and amount-range validation.
Two independent GPT-6.1-Sol/high full-diff reviews passed at
`d7ed68bad089b6cce3344aa1ff1ade5a822be7f4` over `4292159`: security/consent and
behavior/compatibility, zero findings or fixes. Static checks do not substitute
for actual hosted test payments, cancellation/renewal or receipt verification.
The account is signed in and private test configuration is saved. The attempted
hidden Terminal prompt was blocked by computer-use safety permissions; no
alternative clipboard/shell transfer was used. Authenticated tests now verify all eight preset/custom combinations in CAD,
including same-request idempotency, changed-request409, foreign-origin403,
wrong-content-type415, invalid/injected400 and no-store. Those API-check Sessions
were expired. One-time hosted checkout passed decline then success (CAD20),
optional names omitted, required email, consentfalse propagated to PaymentIntent,
and verified thank-you. Test-clock simulation passed initial/renewal payments,
renewal decline, payment-method recovery and cancellation with no next renewal;
the simulation was cleaned up. Browser3DS authentication displayed a blank Stripe
challenge frame and remains unverified. Hosted custom monthly checkout passed
at CAD12.50, with optional individual/business names and consenttrue retained.
The test portal showed the paid invoice and payment-method controls; cancellation
was scheduled for the current period end and verified against Stripe's API.
Stripe represented this with cancel_at matching the item's current_period_end,
although cancel_at_period_end was false. Public email-login, duplicate-email
selection and actual receipt-email delivery remain unverified. No email was sent.

Actual Stripe testing exposed an API compatibility issue: payment_method_types
is no longer accepted. The integration now uses Dashboard-managed methods and
excludes Klarna/Afterpay/Affirm; verified Stripe returns card and Link. A regression
assertion protects this contract. Lint/build/13tests pass after that correction.

The subsequent live-readiness delta47aff1f..8335ddd passed two independent
GPT-6.1-Sol/high reviews (security/correctness and behavior/compatibility), with
no code blockers. Both found the same P3 stale status documentation; corrected
without changing reviewed code. Synthetic mode/route/thank-you checks passed.
The 14-test suite, lint/build and local browser checks pass for live preparation.
Additional actual Stripe test Sessions for both frequencies at CAD12.50 confirmed
automatic_tax=false and total_tax=0; these Sessions were expired.

## Accounting and operating-name review — 2026-10-25

Owner requested a source check and discussion before real payments. This is a
documented preliminary assessment, not accountant sign-off or a CRA ruling.

- Keep Codepet Education within Codepet Inc. The program does not acquire
  nonprofit or charitable status by being educational. Ordinary acknowledgements
  only; the existing no-charitable-tax-receipt disclosure stays.
- Budget support as corporate business income, tracking gross contributions,
  Stripe fees and education spending separately in existing books. CRA's
  income-tax folio paragraph1.5 and its crowdfunding example support this
  treatment; confirm account mapping and expense treatment with the accountant.
- Proposed GST/HST treatment for the current no-benefit support model: payments
  outside the scope of GST/HST where there is no direct link to a supply. CRA's
  Memorandum18-4 includes contributions from individuals and commercial
  organizations. This is not an education exemption. Free equal access, no paid
  entitlements and no promised advertising support that assessment. Monthly
  billing or the word support alone does not determine tax treatment. The owner
  explicitly approved this working treatment on October25; no CRA ruling or
  licensed accountant sign-off has been obtained. Reassess
  separately if perks, advertising, entry fees or specified-recipient services
  are introduced. Do not rely on the inherited Stripe SaaS classification.
- Private company records report an active GST/HST account, owner-confirmed
  July21; current CRA status/reporting dates were not independently reverified.
  This review does not determine input-tax-credit allocation for program costs.
- Ontario guidance requires corporations using a different business name to
  register it. Recommended route if retaining the public Codepet Education
  identity: register that operating name under the existing corporation, with
  Codepet Inc. as payment recipient. Direct government registration is $60 and
  lasts five years. No new corporation or separate bank account is proposed.
  Free OBR search confirmed Codepet Inc.'s federal extra-provincial entry;
  no Codepet Education entry appeared in the Codepet results. An exact-match
  search for Codepet Education across all registers/statuses returned no results.
  This is a basic
  search, not a certified name-clearance or trademark opinion. No filing made.

Focused question prepared for the accountant (not sent):

> Codepet Inc. proposes optional one-time and recurring support for free Zero
> and education projects. Support buys no access, licence, advertising, reward
> or service for the payer or a named third party. Can we record gross support
> as business income, fees separately, and treat receipts as outside GST/HST
> under Memorandum18-4? Please confirm expense/ITC allocation as well.

Sources checked:

- [CRA income-tax folio, gifts/business receipts, paragraphs1.3–1.5](https://www.canada.ca/en/revenue-agency/services/tax/technical-information/income-tax/income-tax-folios-index/series-3-property-investments-savings-plans/series-3-property-investments-savings-plans-folio-9-miscellaneous-payments-receipts/income-tax-folio-s3-f9-c1-lottery-winnings-miscellaneous-receipts-income-losses-crime.html)
- [CRA GST/HST Memorandum18-4, paragraphs1–16](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/18-4/determining-whether-transfer-payment-consideration-supply.html)
- [CRA charity/NPO differences](https://www.canada.ca/en/revenue-agency/services/charities-giving/about-registered-charities/what-difference-between-a-registered-charity-a-non-profit-organization.html)
- [Ontario business-name registration notice, effective February1,2025](https://forms.mgcs.gov.on.ca/en/dataset/6073def4-7470-47a9-bf13-4bc22cec9bda/resource/48361552-0263-4e5b-b4d6-43bbfac83fe1/download/on00227e.pdf)
- [FedDev Ontario registration guidance and fee](https://sbs-spe.feddevontario.canada.ca/en/starting-business-getting-started)
- [Ontario Business Registry and free search entry](https://www.ontario.ca/page/ontario-business-registry)

## Official references

- https://docs.stripe.com/api/checkout/sessions/create
- https://docs.stripe.com/payments/checkout/name-collection
- https://docs.stripe.com/payments/checkout/pay-what-you-want
- https://docs.stripe.com/api/idempotent_requests
- https://docs.stripe.com/metadata
- https://docs.stripe.com/customer-management/activate-no-code-customer-portal
- https://docs.stripe.com/billing/testing
