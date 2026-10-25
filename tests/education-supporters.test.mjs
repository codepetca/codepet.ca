import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEmail, supportRecord, eligibleContacts, csvRows } from "../lib/education-supporters.mjs";
import { UPDATES_CONSENT_TEXT, UPDATES_CONSENT_VERSION, UPDATES_CONTACT_TEXT } from "../lib/education-checkout.mjs";

const session = {
  id: "cs_live_example", livemode: true, status: "complete", payment_status: "paid", created: 1792944000,
  currency: "cad", amount_total: 1000, customer_details: { email: "Person@Example.com", name: "Person" },
  collected_information: { individual_name: "Chosen name", business_name: "Example organization" },
  metadata: { program: "codepet_education", support_frequency: "monthly", updates_consent: "true", updates_consent_version: UPDATES_CONSENT_VERSION, updates_consent_text: UPDATES_CONSENT_TEXT, updates_consent_contact: UPDATES_CONTACT_TEXT, updates_consent_source: "/education#support" },
};

test("only completed paid program Sessions in the requested mode become support records", () => {
  for (const patch of [{ status: "open" }, { status: "expired" }, { payment_status: "unpaid" }, { payment_status: "no_payment_required" }, { livemode: false }, { metadata: {} }]) assert.equal(supportRecord({ ...session, ...patch }, "live"), null);
  assert.throws(() => supportRecord(session, "other"));
  assert.equal(supportRecord({ ...session, livemode: false }, "test").mode, "test");
});

test("records retain checkout identity, exact consent evidence, and accurately labelled Session creation time", () => {
  const record = supportRecord({ ...session, customer: { id: "cus_example", email: "changed@example.com" } }, "live");
  assert.equal(record.email, "person@example.com");
  assert.equal(record.email_at_checkout, "Person@Example.com");
  assert.equal(record.name, "Chosen name");
  assert.equal(record.organization, "Example organization");
  assert.equal(record.consent_verified, true);
  assert.equal(record.consent_contact, UPDATES_CONTACT_TEXT);
  assert.equal(record.session_created_at, "2026-10-25T16:00:00.000Z");
  assert.equal(supportRecord({ ...session, customer_details: { email: null }, customer: { email: "changed@example.com" } }, "live").consent_verified, false);
});

test("legacy, missing, forged or unchecked consent is held out of the optional updates list", () => {
  for (const patch of [{ updates_consent: "false" }, { updates_consent_version: "2026-10-25-v1" }, { updates_consent_version: "" }, { updates_consent_text: "different" }, { updates_consent_contact: "" }, { updates_consent_source: "/elsewhere" }]) {
    const record = supportRecord({ ...session, metadata: { ...session.metadata, ...patch } }, "live");
    assert.equal(record.consent_verified, false);
    assert.deepEqual(eligibleContacts([record], [], "live"), []);
  }
});

test("unchecked repeat contributions do not revoke an earlier documented opt-in", () => {
  const first = supportRecord(session, "live");
  const repeat = supportRecord({ ...session, id: "cs_live_repeat", created: session.created + 100, metadata: { ...session.metadata, updates_consent: "false" } }, "live");
  assert.deepEqual(eligibleContacts([first, repeat], [], "live"), [first]);
});

test("suppression wins over historical and newer metadata, including case and whitespace variants", () => {
  const record = supportRecord(session, "live");
  assert.deepEqual(eligibleContacts([record], [{ email: " PERSON@example.com ", recorded_at: "2020-01-01T00:00:00Z" }], "live"), []);
  assert.throws(() => eligibleContacts([record], [{ email: "broken" }], "live"));
  assert.throws(() => eligibleContacts([record], {}, "live"));
});

test("recipients are deduplicated, modes isolated, and renewal metadata is not a new event", () => {
  const first = supportRecord(session, "live");
  const newer = supportRecord({ ...session, id: "cs_live_new", created: session.created + 100 }, "live");
  const sandbox = supportRecord({ ...session, id: "cs_test_new", livemode: false, created: session.created + 200 }, "test");
  assert.deepEqual(eligibleContacts([first, newer, sandbox], [], "live"), [newer]);
  assert.equal(normalizeEmail(" Person+tag@Example.com "), "person+tag@example.com");
  for (const bad of ["", null, "a@example.com\nb@example.com", "a@example.com,b@example.com", "Name <a@example.com>"]) assert.throws(() => normalizeEmail(bad));
});

test("CSV preserves quoted/multiline fields and neutralizes spreadsheet formulas", () => {
  const csv = csvRows(["name", "email"], [{ name: '=HYPERLINK("x")', email: "person@example.com" }, { name: " \t+cmd", email: "line\nquote\"" }]);
  assert.ok(csv.includes('"\'=HYPERLINK(""x"")"'));
  assert.ok(csv.includes('"\' \t+cmd"'));
  assert.ok(csv.includes('"line\nquote"""'));
});
