export const UPDATES_CONSENT_TEXT = "Email me occasional Zero and impact updates.";
export const UPDATES_CONSENT_VERSION = "2026-10-25-v1";
export const MIN_AMOUNT_CENTS = 100;
export const MAX_AMOUNT_CENTS = 1_000_000;

/** @param {unknown} amount */
export function amountToCents(amount) {
  if (typeof amount !== "string" || !/^\d{1,5}(?:\.\d{1,2})?$/.test(amount.trim())) {
    throw new Error("Enter CA$1–10,000 with up to two decimal places.");
  }
  const [whole, fraction = ""] = amount.trim().split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (cents < MIN_AMOUNT_CENTS || cents > MAX_AMOUNT_CENTS) {
    throw new Error("Enter CA$1–10,000 with up to two decimal places.");
  }
  return cents;
}

/** @param {unknown} input */
export function validateSupportRequest(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid support request.");
  const data = /** @type {Record<string, unknown>} */ (input);
  if (Object.keys(data).some(key => !["frequency", "amount", "updatesConsent", "attemptId"].includes(key))) throw new Error("Invalid support request.");
  if (data.frequency !== "monthly" && data.frequency !== "once") throw new Error("Choose monthly or one-time support.");
  if (typeof data.updatesConsent !== "boolean") throw new Error("Choose an updates preference.");
  if (typeof data.attemptId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.attemptId)) throw new Error("Start a new checkout attempt.");
  return { frequency: data.frequency, amountCents: amountToCents(data.amount), updatesConsent: data.updatesConsent, attemptId: data.attemptId.toLowerCase() };
}

/** Fail closed: live setup requires a separate activation flag and production origin.
 * @param {Record<string, string | undefined>} env
 */
export function checkoutConfiguration(env) {
  const mode = env.EDUCATION_PAYMENTS_MODE;
  if (mode !== "test" && mode !== "live") return null;
  if (mode === "live" && (env.EDUCATION_LIVE_PAYMENTS_APPROVED !== "true" || env.NODE_ENV !== "production")) return null;
  const secretKey = env.STRIPE_SECRET_KEY || "";
  if (!new RegExp(`^(sk|rk)_${mode}_[a-zA-Z0-9]+$`).test(secretKey)) return null;
  const productId = env.STRIPE_EDUCATION_PRODUCT_ID || "";
  if (!/^prod_[a-zA-Z0-9]+$/.test(productId)) return null;
  const portalUrl = env.EDUCATION_PORTAL_URL || "";
  const portalPattern = mode === "test" ? /^https:\/\/billing\.stripe\.com\/p\/login\/test_[a-zA-Z0-9]+$/ : /^https:\/\/billing\.stripe\.com\/p\/login\/(?!test_)[a-zA-Z0-9]+$/;
  if (!portalPattern.test(portalUrl)) return null;
  try {
    const origin = new URL(env.EDUCATION_CHECKOUT_ORIGIN || "");
    const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname);
    if (origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) return null;
    if (origin.protocol !== "https:" && !(origin.protocol === "http:" && loopback)) return null;
    if (mode === "live" && (origin.protocol !== "https:" || !["codepet.ca", "www.codepet.ca"].includes(origin.hostname) || origin.port)) return null;
    return { secretKey, productId, portalUrl, origin: origin.origin, mode };
  } catch { return null; }
}

/** @param {ReturnType<typeof validateSupportRequest>} support
 * @param {{productId: string, origin: string}} config
 * @returns {import('stripe').Stripe.Checkout.SessionCreateParams}
 */
export function checkoutParameters(support, config) {
  const metadata = {
    program: "codepet_education",
    support_frequency: support.frequency,
    updates_consent: String(support.updatesConsent),
    updates_consent_version: UPDATES_CONSENT_VERSION,
    updates_consent_text: UPDATES_CONSENT_TEXT,
    updates_consent_source: "/education#support",
    support_attempt_id: support.attemptId,
  };
  const monthly = support.frequency === "monthly";
  return {
    mode: monthly ? "subscription" : "payment",
    ...(monthly ? { subscription_data: { metadata } } : { customer_creation: "always", payment_intent_data: { metadata } }),
    line_items: [{ quantity: 1, price_data: {
      currency: "cad", product: config.productId, unit_amount: support.amountCents,
      ...(monthly ? { recurring: { interval: "month" } } : {}),
    } }],
    name_collection: { individual: { enabled: true, optional: true }, business: { enabled: true, optional: true } },
    excluded_payment_method_types: ["klarna", "afterpay_clearpay", "affirm"],
    // Owner-approved no-benefit contribution model. No tax is calculated or added.
    automatic_tax: { enabled: false },
    billing_address_collection: "auto",
    metadata,
    custom_text: { submit: { message: `support for Zero and Codepet Inc.'s other education projects. No charitable tax receipt.${monthly ? " Monthly until canceled; manage future renewals through Stripe." : ""}` } },
    success_url: `${config.origin}/education/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.origin}/education#support`,
  };
}

/** @param {unknown} value */
export function isStripeCheckoutUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.stripe.com" && !url.username && !url.password && !url.port;
  } catch { return false; }
}

/** @param {Request} request @param {number} [limit] */
export async function readCheckoutBody(request, limit = 4096) {
  if (!request.body) throw new Error("Invalid support request.");
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("Support request is too large."); }
      text += decoder.decode(part.value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally { reader.releaseLock(); }
}
