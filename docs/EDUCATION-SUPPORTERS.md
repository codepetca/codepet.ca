# Codepet Education supporter follow-up

Stripe holds payment records. These local tools prepare a private list for manual
review; they never send mail, change Stripe records, or add a mailing provider.
Use the connected business Gmail for personal messages and monitor both replies
and info@codepet.ca. Never commit supporter exports or paste them into chat.

## Prepare the list

From this repository, load the existing private key without displaying it:

```bash
node --env-file=/Users/stew/.codex/private/codepet.ca/education-stripe/live.env scripts/education-supporters.mjs export --mode live
```

For sandbox verification substitute `test.env` and `--mode test`. The command
checks the Codepet account and key mode, then reads completed, paid Education
Checkout Sessions. It uses the email captured at checkout, never a Customer's
subsequently edited email. Subscription renewal metadata is not a new opt-in.

Output stays in `~/.codex/private/codepet.ca/education-supporters/live/` (or
`test/`), with owner-only directories/files:

- `support-<timestamp>.json`: payment and consent evidence snapshot, including
  supporters who did not choose updates. This is not an impact mailing list.
- `updates-eligible.csv`: unique emails with the current consent disclosure and
  no suppression. Only this list is a candidate for optional impact updates.
- `suppression.json`: withdrawals, retained across exports.
- `send-log.csv`: manually record sent time, recipient, template version,
  consent Session ID and operator reference to prevent duplicate messages.
- `latest-export.json`: counts, snapshot reference and review status.

An operation locks its mode directory. Wait for an active operation; remove a
stale lock only after verifying that its process has stopped. Export failures
clear the current recipient file. Old snapshots and previously copied CSVs remain
historical evidence: **never send from an old copy**. Refresh immediately before
each manual send after processing outstanding replies. Treat any failed export,
invalid suppression file or non-ready status as a stop for optional updates.
The empty suppression log is created only for a genuinely new, empty mode
directory. If it later disappears, both export and suppress stop with an empty
recipient file. Restore it from protected backup or reconcile the withdrawal
evidence before proceeding; never replace a missing log with an empty array.

## Thank-you and impact messages

Use [the personal thank-you](templates/education-thank-you.txt) only after checking
the payment, amount, frequency and any refund in Stripe. Keep it about that
transaction. Stripe supplies the payment receipt; this is not a charitable tax
receipt. Do not add product promotions or another funding request for someone
who did not opt in. Honor requests to stop optional personal follow-ups too.

Use [the impact update](templates/education-impact-update.txt) only for a freshly
reviewed eligible recipient. Replace every placeholder with a verified shipped
improvement, learning activity or result. Check refunds before attributing support
or quoting totals. Send individually so supporters cannot see others' addresses.
Record the send in the private log. Both templates are drafts, with no automatic
delivery or scheduled campaign. Unaddressed copies are also saved in business
Gmail Drafts; confirm the sender/reply address before sending.

Keep the business identity, full mailing address, contact email and obvious
reply-to-unsubscribe line in every message. Ensure the contact and unsubscribe
route works for at least 60 days after a message. Monitor replies; a reply asking
to stop is enough. No login, payment or explanation is required.

## Apply an unsubscribe

Run this command and enter the email at its prompt, keeping it out of shell history:

```bash
node scripts/education-supporters.mjs suppress --mode live --source "Gmail withdrawal reference"
```

Record a short private source reference, not the full email body. The command
immediately clears the current eligible CSV and saves the withdrawal; then rerun
the export before preparing any more messages. Apply requests without delay,
before the next send, and no later than 10 business days after receipt. The log's
recorded/applied timestamps are processing times, not a claim about when the
request arrived; retain the original request in the mailbox.

Suppression always wins, including over a later checkout checkbox. Never remove
it automatically. A fresh affirmative request can be reviewed manually with its
dated evidence before lifting a suppression. An unchecked repeat payment is not
a withdrawal, and cancellation/refund neither grants nor withdraws update consent.
Do not transfer consent to a different email address or email non-opted-in
supporters asking them to opt in; the website can offer the choice.

## Consent evidence and limits

The unchecked updates choice includes a collapsed “Details” disclosure
identifying Codepet Inc., its mailing/contact details and withdrawal route. The
client must submit the current disclosure version to opt in. Stripe records the
choice, exact text/contact/version, source and attempt ID in Session metadata.
The Session creation timestamp is labelled as such; it is not the exact checkbox
click, payment completion or renewed-consent time. Earlier v1 records lacking the
current contact disclosure are held out of the automatic eligibility calculation.

Keep exports on the owner's Mac and in its existing protected backup only. Avoid
unnecessary copies; retain consent/send/suppression evidence while relying on it
and review obsolete payment snapshots after reconciliation. Do not confuse this
manual contact list with accounting books or an automatic unsubscribe service.
If mail volume grows, migrate the suppression and consent history to a proper
mailing service before automating sends.

Source review (October 25, 2026):

- [CASL, sections 6, 10 and 11](https://laws-lois.justice.gc.ca/eng/acts/E-1.6/FullText.html)
- [CRTC consent guidance](https://crtc.gc.ca/eng/archive/2012/2012-549.htm)
- [CRTC identification/contact and unsubscribe guidance](https://crtc.gc.ca/eng/archive/2012/2012-548.htm)
- [CRTC regulations](https://laws.justice.gc.ca/eng/regulations/sor-2012-36/page-1.html)

## Verified provider email flows

On October 25, a manually sent sandbox payment receipt arrived in the owner's
business Gmail with CAD12.50, Codepet Education support and the correct support
contact. A public sandbox portal login email arrived at the owner's plus alias;
following its link opened the existing CAD10/month subscription. Stripe selected
the older subscribed customer despite a newer empty customer sharing that email.
The temporary subscription/customers were cleaned up. Authentication links and
full email bodies are not retained here. Live automatic receipt delivery still
has not been tested with a real charge; no real payment was made for these checks.
