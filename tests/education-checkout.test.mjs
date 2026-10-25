import test from "node:test";
import assert from "node:assert/strict";
import { amountToCents, checkoutConfiguration, checkoutParameters, checkoutResponseUrl, isStripeCheckoutUrl, readCheckoutBody, validateSupportRequest, UPDATES_CONSENT_TEXT } from "../lib/education-checkout.mjs";

const attemptId = "dc66f4b3-bbc6-4252-9545-c37e0469fa43";
const input = { frequency: "monthly", amount: "10", updatesConsent: false, attemptId };
const config = { origin: "http://127.0.0.1:3220", productId: "prod_testExample" };
const env = { EDUCATION_PAYMENTS_MODE: "test", STRIPE_SECRET_KEY: "sk_test_example", STRIPE_EDUCATION_PRODUCT_ID: config.productId, EDUCATION_CHECKOUT_ORIGIN: config.origin, EDUCATION_PORTAL_URL: "https://billing.stripe.com/p/login/test_example" };

test("CAD amount uses exact integer cents and enforces configured boundaries", () => {
  for (const [value, cents] of [["1", 100], ["5", 500], ["10", 1000], ["20", 2000], ["50", 5000], ["12.50", 1250], [" 20.1 ", 2010], ["10000.00", 1000000]]) assert.equal(amountToCents(value), cents);
  for (const value of ["", "0", "0.99", "-5", "1e3", "1,000", "1.001", "10.", ".50", "10000.01", "999999", "NaN", 20, null, [], {}]) assert.throws(() => amountToCents(value));
});

test("support requests validate frequency, strict consent, attempt identity and reject injected fields", () => {
  assert.deepEqual(validateSupportRequest(input), { frequency: "monthly", amountCents: 1000, updatesConsent: false, attemptId });
  for (const patch of [{ frequency: "annual" }, { updatesConsent: "false" }, { updatesConsent: undefined }, { attemptId: "arbitrary" }, { customer: "cus_other" }, { currency: "usd" }, { success_url: "https://evil.example" }]) assert.throws(() => validateSupportRequest({ ...input, ...patch }));
  for (const value of [null, [], "wrong"]) assert.throws(() => validateSupportRequest(value));
});

test("configuration fails closed for missing settings, live keys and untrusted callback origins", () => {
  assert.equal(checkoutConfiguration(env)?.mode, "test");
  assert.equal(checkoutConfiguration({ ...env, EDUCATION_PORTAL_URL: "https://evil.example" }), null);
  assert.equal(checkoutConfiguration({ ...env, EDUCATION_PORTAL_URL: "" }), null);
  for (const patch of [{ EDUCATION_PAYMENTS_MODE: undefined }, { EDUCATION_PAYMENTS_MODE: "live" }, { STRIPE_SECRET_KEY: "sk_live_example" }, { STRIPE_SECRET_KEY: "" }, { STRIPE_EDUCATION_PRODUCT_ID: "price_other" }, { EDUCATION_CHECKOUT_ORIGIN: "http://codepet.ca" }, { EDUCATION_CHECKOUT_ORIGIN: "https://user:pass@codepet.ca" }, { EDUCATION_CHECKOUT_ORIGIN: "https://codepet.ca/path" }, { EDUCATION_CHECKOUT_ORIGIN: "https://codepet.ca?next=bad" }]) assert.equal(checkoutConfiguration({ ...env, ...patch }), null);
});

test("live configuration requires deliberate activation, production, matching key/portal and Codepet HTTPS origin", () => {
  const live = { ...env, EDUCATION_PAYMENTS_MODE: "live", EDUCATION_LIVE_PAYMENTS_APPROVED: "true", NODE_ENV: "production", STRIPE_SECRET_KEY: "sk_live_example", EDUCATION_PORTAL_URL: "https://billing.stripe.com/p/login/example", EDUCATION_CHECKOUT_ORIGIN: "https://codepet.ca" };
  assert.equal(checkoutConfiguration(live)?.mode, "live");
  assert.equal(checkoutConfiguration({ ...live, EDUCATION_CHECKOUT_ORIGIN: "https://www.codepet.ca" })?.mode, "live");
  for (const patch of [{ EDUCATION_LIVE_PAYMENTS_APPROVED: "false" }, { EDUCATION_LIVE_PAYMENTS_APPROVED: undefined }, { NODE_ENV: "development" }, { NODE_ENV: undefined }, { STRIPE_SECRET_KEY: "sk_test_example" }, { EDUCATION_PORTAL_URL: env.EDUCATION_PORTAL_URL }, { EDUCATION_CHECKOUT_ORIGIN: config.origin }, { EDUCATION_CHECKOUT_ORIGIN: "https://other.example" }, { EDUCATION_CHECKOUT_ORIGIN: "https://codepet.ca:444" }]) assert.equal(checkoutConfiguration({ ...live, ...patch }), null);
  assert.equal(checkoutConfiguration({ ...env, EDUCATION_PORTAL_URL: live.EDUCATION_PORTAL_URL }), null);
});

test("monthly and one-time Checkout fix currency, quantity, product, interval and redirect destinations", () => {
  const monthly = checkoutParameters(validateSupportRequest(input), config);
  assert.equal(monthly.mode, "subscription");
  assert.deepEqual(monthly.line_items, [{ quantity: 1, price_data: { currency: "cad", product: config.productId, unit_amount: 1000, recurring: { interval: "month" } } }]);
  assert.equal(monthly.customer_creation, undefined);
  assert.equal(monthly.payment_method_types, undefined);
  assert.deepEqual(monthly.excluded_payment_method_types, ["klarna", "afterpay_clearpay", "affirm"]);
  assert.deepEqual(monthly.automatic_tax, { enabled: false });
  assert.equal(monthly.success_url, `${config.origin}/education/thanks?session_id={CHECKOUT_SESSION_ID}`);
  assert.equal(monthly.cancel_url, `${config.origin}/education#support`);
  const once = checkoutParameters(validateSupportRequest({ ...input, frequency: "once", amount: "20.25" }), config);
  assert.equal(once.mode, "payment");
  assert.equal(once.customer_creation, "always");
  assert.equal(once.line_items[0].price_data.unit_amount, 2025);
  assert.equal(once.line_items[0].price_data.recurring, undefined);
  assert.deepEqual(once.automatic_tax, { enabled: false });
  assert.equal(monthly.customer_email, undefined);
  assert.deepEqual(monthly.name_collection, { individual: { enabled: true, optional: true }, business: { enabled: true, optional: true } });
});

test("consent evidence is explicit, server-controlled, propagated, and stable for idempotent retries", () => {
  for (const frequency of ["monthly", "once"]) {
    for (const updatesConsent of [false, true]) {
      const support = validateSupportRequest({ ...input, frequency, updatesConsent });
      const params = checkoutParameters(support, config);
      assert.equal(params.metadata.updates_consent, String(updatesConsent));
      assert.equal(params.metadata.updates_consent_text, UPDATES_CONSENT_TEXT);
      assert.equal(params.metadata.updates_consent_source, "/education#support");
      assert.equal(params.metadata.program, "codepet_education");
      assert.equal(params.metadata.support_attempt_id, attemptId);
      assert.deepEqual(frequency === "monthly" ? params.subscription_data.metadata : params.payment_intent_data.metadata, params.metadata);
      assert.deepEqual(checkoutParameters(support, config), params);
    }
  }
});

test("redirect allowlist accepts only HTTPS Stripe Checkout without credentials or custom ports", () => {
  assert.equal(isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_example"), true);
  for (const url of [null, "https://checkout.stripe.com.evil.example/x", "http://checkout.stripe.com/x", "https://user:pass@checkout.stripe.com/x", "https://checkout.stripe.com:444/x", "javascript:alert(1)", "/relative"]) assert.equal(isStripeCheckoutUrl(url), false);
});

test("request reader limits actual streamed bytes and rejects malformed JSON", async () => {
  const request = (body) => new Request("http://127.0.0.1/api/support/checkout", { method: "POST", body });
  assert.deepEqual(await readCheckoutBody(request(JSON.stringify(input))), input);
  await assert.rejects(readCheckoutBody(request("not json")), SyntaxError);
  await assert.rejects(readCheckoutBody(request('"' + "x".repeat(5000) + '"')), /too large/);
  await assert.rejects(readCheckoutBody(request('"' + "é".repeat(2100) + '"')), /too large/);
});

test("checkout responses handle hosting throttles/non-JSON errors and keep the redirect allowlist", async () => {
  await assert.rejects(checkoutResponseUrl(new Response("<html>Rate limited</html>", { status: 429 })), /wait a minute/);
  await assert.rejects(checkoutResponseUrl(new Response("<html>Unavailable</html>", { status: 503 })), /Could not open checkout/);
  await assert.rejects(checkoutResponseUrl(Response.json({ error: "Start a new attempt." }, { status: 409 })), /Start a new attempt/);
  await assert.rejects(checkoutResponseUrl(new Response("not json")), /Could not open checkout/);
  await assert.rejects(checkoutResponseUrl(Response.json({ url: "https://evil.example/" })), /Could not open checkout/);
  const url = "https://checkout.stripe.com/c/pay/cs_live_example";
  assert.equal(await checkoutResponseUrl(Response.json({ url })), url);
});
