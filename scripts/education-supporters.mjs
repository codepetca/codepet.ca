import { mkdir, chmod, readFile, writeFile, rename, open, unlink } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import Stripe from "stripe";
import { normalizeEmail, supportRecord, eligibleContacts, csvRows } from "../lib/education-supporters.mjs";

const [command, ...args] = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1]; };
const mode = option("--mode");
const headers = ["email", "name", "organization", "session_id", "session_created_at", "consent_version", "consent_text", "consent_contact", "consent_source"];
let lock;
let directory;
let lockPath;

async function atomic(path, data) {
  const temporary = path + "." + randomUUID() + ".tmp";
  await writeFile(temporary, data, { mode: 0o600, flag: "wx" });
  await rename(temporary, path);
  await chmod(path, 0o600);
}

async function jsonFile(path, fallback) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; throw new Error("Private data file is invalid; no recipients were exported."); }
}

async function invalidateRecipients() {
  await atomic(join(directory, "updates-eligible.csv"), csvRows(headers, []));
  await atomic(join(directory, "latest-export.json"), JSON.stringify({ status: "refresh_required", mode, changed_at: new Date().toISOString() }, null, 2) + "\n");
}

try {
  if (!["export", "suppress"].includes(command) || !["test", "live"].includes(mode)) throw new Error("Usage: node scripts/education-supporters.mjs <export|suppress> --mode <test|live> [--source reference]");
  directory = join(homedir(), ".codex", "private", "codepet.ca", "education-supporters", mode);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await chmod(directory, 0o700);
  lockPath = join(directory, ".lock");
  lock = await open(lockPath, "wx", 0o600);
  await invalidateRecipients();
  const suppressionPath = join(directory, "suppression.json");
  const suppressions = await jsonFile(suppressionPath, []);
  if (!Array.isArray(suppressions)) throw new Error("Invalid suppression log; recipients remain empty.");
  for (const row of suppressions) normalizeEmail(row.email);
  if (command === "suppress") {
    let input;
    if (process.stdin.isTTY) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      try { input = await rl.question("Email address to unsubscribe: "); } finally { rl.close(); }
    } else { input = ""; process.stdin.setEncoding("utf8"); for await (const chunk of process.stdin) input += chunk; }
    const email = normalizeEmail(input);
    if (!suppressions.some(row => normalizeEmail(row.email) === email)) suppressions.push({ email, recorded_at: new Date().toISOString(), applied_at: new Date().toISOString(), source: option("--source") || "owner-recorded withdrawal" });
    await atomic(suppressionPath, JSON.stringify(suppressions, null, 2) + "\n");
    console.log(JSON.stringify({ mode, suppression_saved: true, recipients_cleared: true }));
  } else {
    const key = process.env.STRIPE_SECRET_KEY || "";
    if (!new RegExp(`^(sk|rk)_${mode}_[a-zA-Z0-9]+$`).test(key)) throw new Error("Load the private Stripe key matching the selected mode.");
    const stripe = new Stripe(key, { timeout: 10_000, maxNetworkRetries: 1 });
    const account = await stripe.accounts.retrieve();
    if (account.id !== "acct_1T9QlCCBBm2ywoQM") throw new Error("This key belongs to another account; no contacts exported.");
    const records = [];
    let scanned = 0;
    for await (const session of stripe.checkout.sessions.list({ status: "complete", limit: 100 })) {
      if (++scanned > 10_000) throw new Error("Export scan limit reached; no recipients exported. Review scope before increasing it.");
      const record = supportRecord(session, mode);
      if (record) records.push(record);
    }
    const eligible = eligibleContacts(records, suppressions, mode);
    const now = new Date().toISOString();
    const snapshot = "support-" + now.replaceAll(":", "-") + ".json";
    await atomic(join(directory, snapshot), JSON.stringify({ exported_at: now, mode, records }, null, 2) + "\n");
    await atomic(suppressionPath, JSON.stringify(suppressions, null, 2) + "\n");
    try { const log = await open(join(directory, "send-log.csv"), "wx", 0o600); await log.writeFile(csvRows(["sent_at", "email", "template_version", "consent_session_id", "operator_reference"], [])); await log.close(); } catch (error) { if (error.code !== "EEXIST") throw error; }
    await atomic(join(directory, "updates-eligible.csv"), csvRows(headers, eligible));
    await atomic(join(directory, "latest-export.json"), JSON.stringify({ status: "ready_for_manual_review", exported_at: now, mode, snapshot, completed_support_records: records.length, eligible_update_contacts: eligible.length, suppression_count: suppressions.length }, null, 2) + "\n");
    console.log(JSON.stringify({ mode, completed_support_records: records.length, eligible_update_contacts: eligible.length, suppression_count: suppressions.length, private_directory: directory, emails_sent: 0 }));
  }
} catch (error) {
  const message = error.code === "EEXIST" ? "Another supporter operation holds the lock. Wait for it to finish; do not remove an active lock." : String(error.type || "").startsWith("Stripe") ? "Stripe export failed; recipients remain empty. Check account access and retry." : String(error.message || "Supporter operation failed.");
  console.error(message.replace(/(sk|rk)_(test|live)_[a-zA-Z0-9]+/g, "[redacted]"));
  process.exitCode = 1;
} finally {
  if (lock) { await lock.close(); await unlink(lockPath); }
}
