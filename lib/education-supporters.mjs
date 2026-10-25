import { UPDATES_CONSENT_TEXT, UPDATES_CONSENT_VERSION, UPDATES_CONTACT_TEXT } from "./education-checkout.mjs";

export function normalizeEmail(value) {
  if (typeof value !== "string") throw new Error("Enter an email address.");
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email)) throw new Error("Enter an email address.");
  return email;
}

/** Capture Session evidence; never substitute a Customer's current email. */
export function supportRecord(session, mode) {
  if (!["test", "live"].includes(mode)) throw new Error("Choose test or live mode.");
  if (session.livemode !== (mode === "live") || session.metadata?.program !== "codepet_education" || session.status !== "complete" || session.payment_status !== "paid") return null;
  const meta = session.metadata;
  let email = "";
  try { email = normalizeEmail(session.customer_details?.email); } catch { /* Hold missing/invalid email. */ }
  const created = Number.isInteger(session.created) && session.created > 0 && session.created < 8_640_000_000_000 ? new Date(session.created * 1000).toISOString() : "";
  const consentVerified = Boolean(email && created && meta.updates_consent === "true" && meta.updates_consent_version === UPDATES_CONSENT_VERSION && meta.updates_consent_text === UPDATES_CONSENT_TEXT && meta.updates_consent_contact === UPDATES_CONTACT_TEXT && meta.updates_consent_source === "/education#support");
  return {
    mode, session_id: session.id, session_created_at: created,
    email, email_at_checkout: session.customer_details?.email || "",
    name: session.collected_information?.individual_name || session.customer_details?.individual_name || session.customer_details?.name || "",
    organization: session.collected_information?.business_name || session.customer_details?.business_name || "",
    amount_cents: session.amount_total, currency: session.currency,
    frequency: meta.support_frequency, payment_status: session.payment_status,
    payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || "",
    subscription_id: typeof session.subscription === "string" ? session.subscription : session.subscription?.id || "",
    updates_consent: meta.updates_consent, consent_verified: consentVerified,
    consent_version: meta.updates_consent_version || "", consent_text: meta.updates_consent_text || "",
    consent_contact: meta.updates_consent_contact || "", consent_source: meta.updates_consent_source || "",
  };
}

/** Unchecked repeat payments are not withdrawals; explicit suppression always wins. */
export function eligibleContacts(records, suppressions, mode) {
  if (!["test", "live"].includes(mode) || !Array.isArray(suppressions)) throw new Error("Invalid eligibility inputs.");
  const blocked = new Set(suppressions.map(row => normalizeEmail(row.email)));
  const contacts = new Map();
  for (const row of records) {
    if (row.mode !== mode || !row.consent_verified || !row.email || blocked.has(normalizeEmail(row.email))) continue;
    const previous = contacts.get(row.email);
    if (!previous || row.session_created_at > previous.session_created_at) contacts.set(row.email, row);
  }
  return [...contacts.values()].sort((a, b) => a.email.localeCompare(b.email));
}

/** Neutralize spreadsheet formulas as well as quoting CSV delimiters/newlines. */
export function csvRows(headers, rows) {
  const cell = value => {
    let text = String(value ?? "");
    if (/^\s*[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  return [headers.map(cell).join(","), ...rows.map(row => headers.map(key => cell(row[key])).join(","))].join("\r\n") + "\r\n";
}
