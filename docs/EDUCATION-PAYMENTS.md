# Codepet Education payments

Owner requested Stripe setup on 2026-10-25 after funding UI PR #10 merged.
The current implementation is local test-mode preparation, not live activation.
The owner signed in through Chrome. Created the Codepet Education support test
product with a CAD $10/month default price; the backend will use that product for
inline custom prices. Saved the test customer-portal configuration: invoice
history, payment-method updates and cancellation at the end of the billing
period; no cancellation reason, coupons, plan switching or quantity changes.
Activated its test login link. No live product, key, payment or payout change.
The owner supplied the existing test secret through ignored private configuration.
Authenticated API verification matches the Codepet dashboard account and confirms
the active test product and portal; no secret is stored in Git.
Stripe inherited its SaaS product tax category by default; this is a test-only
placeholder, not a determination of the contribution's tax treatment. Automatic
tax is not enabled by this integration. Do not copy that category into live setup
without accounting review.

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

The integration fails closed with missing/invalid settings and rejects live
keys even if live mode is requested. No `NEXT_PUBLIC_` secret exists. Local
loopback HTTP or an explicit HTTPS origin is required; the Host header cannot
choose the callback origin. Do not use a production key to test.

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
The prior funding plan's accounting/name checks have not been marked complete.
Add narrow Stripe-specific privacy/terms disclosures before live collection.
Live-key support and completion of the remaining end-to-end sandbox cases
are still required. The independent static security/correctness review passed. Do not weaken the test-only guard merely
to make the funding button active.

Checks so far: lint/build and 13 Node tests pass (six existing campaign tests and
seven checkout tests). Local API smoke check returns503 with no-store when
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
challenge frame and remains unverified. Other hosted monthly/portal and receipt
checks are still in progress.

Actual Stripe testing exposed an API compatibility issue: payment_method_types
is no longer accepted. The integration now uses Dashboard-managed methods and
excludes Klarna/Afterpay/Affirm; verified Stripe returns card and Link. A regression
assertion protects this contract. Lint/build/13tests pass after that correction.

## Official references

- https://docs.stripe.com/api/checkout/sessions/create
- https://docs.stripe.com/payments/checkout/name-collection
- https://docs.stripe.com/payments/checkout/pay-what-you-want
- https://docs.stripe.com/api/idempotent_requests
- https://docs.stripe.com/metadata
- https://docs.stripe.com/customer-management/activate-no-code-customer-portal
- https://docs.stripe.com/billing/testing
