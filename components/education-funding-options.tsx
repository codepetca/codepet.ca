"use client";

import { useEffect, useId, useRef, useState } from "react";
import { amountToCents, checkoutResponseUrl, UPDATES_CONSENT_TEXT } from "@/lib/education-checkout.mjs";

type Frequency = "monthly" | "once";

const amounts = { monthly: [5, 10, 20], once: [10, 20, 50] };
const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

export function EducationFundingOptions({ checkoutReady = false, testMode = true, portalUrl }: { checkoutReady?: boolean; testMode?: boolean; portalUrl?: string }) {
  const id = useId();
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [selected, setSelected] = useState({ monthly: "10", once: "20" });
  const rawAmount = selected[frequency].trim();
  const valid = (() => { try { amountToCents(rawAmount); return true; } catch { return false; } })();
  const showError = rawAmount !== "" && !valid;
  const [updatesConsent, setUpdatesConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);
  useEffect(() => () => controller.current?.abort(), []);

  async function openCheckout() {
    if (!checkoutReady || !valid || busy.current) return;
    busy.current = true;
    setSubmitting(true);
    setCheckoutError("");
    const payload = { frequency, amount: rawAmount, updatesConsent };
    const fingerprint = JSON.stringify(payload);
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() };
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetch("/api/support/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, attemptId: attempt.current.id }), signal: abort.signal });
      if (response.status === 409) attempt.current = null;
      const url = await checkoutResponseUrl(response);
      if (abort.signal.aborted) return;
      window.location.assign(url);
    } catch (error) {
      if (!abort.signal.aborted) setCheckoutError(error instanceof Error ? error.message : "Could not open checkout. Please try again.");
    } finally {
      busy.current = false;
      if (!abort.signal.aborted) setSubmitting(false);
    }
  }

  const choiceClass = "flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 peer-checked:border-emerald-700 peer-checked:bg-emerald-700 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-700 dark:border-gray-700 dark:text-gray-200";

  return (
    <section aria-label="Choose support amount" className="my-5 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
      <fieldset disabled={submitting}>
        <legend className="sr-only">Support frequency</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["monthly", "once"] as const).map((value) => (
            <label key={value}>
              <input type="radio" name={`${id}-frequency`} value={value} checked={frequency === value} onChange={() => setFrequency(value)} className="peer sr-only" />
              <span className={choiceClass}>{value === "monthly" ? "Monthly" : "One-time"}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={submitting}>
        <legend className="mb-2 text-xs text-gray-500 dark:text-gray-400">Amount in Canadian dollars (CAD)</legend>
        <div className="grid grid-cols-3 gap-2">
          {amounts[frequency].map(String).map((value) => (
            <label key={value}>
              <input type="radio" name={`${id}-amount`} value={value} checked={selected[frequency] === value} onChange={() => setSelected({ ...selected, [frequency]: value })} className="peer sr-only" />
              <span className={choiceClass}>{`$${value}${frequency === "monthly" ? "/mo" : ""}`}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-custom`} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
        <div className="grid grid-cols-3 items-center gap-2">
          <div className="relative min-w-0">
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base text-gray-500 dark:text-gray-400">$</span>
            <input id={`${id}-custom`} type="text" inputMode="decimal" maxLength={9} disabled={submitting} value={selected[frequency]} onChange={(event) => setSelected({ ...selected, [frequency]: event.target.value })} aria-invalid={showError} aria-describedby={`${id}-currency${showError ? ` ${id}-error` : ""}`} className="min-h-12 w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-8 text-right text-base tabular-nums text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
          </div>
          <span id={`${id}-currency`} className="col-span-2 text-sm text-gray-500 dark:text-gray-400">{frequency === "monthly" ? "CAD / month" : "CAD one-time"}</span>
        </div>
        {showError && <p id={`${id}-error`} className="mt-2 text-sm text-red-700 dark:text-red-400">Enter CA$1–10,000 with up to two decimal places.</p>}
      </div>

      <fieldset disabled={submitting} className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <legend className="sr-only">Supporter details</legend>
        {!checkoutReady && <div className="grid gap-3 sm:grid-cols-2">
          {[
            { key: "name", label: "Name (optional)", maxLength: 120 },
            { key: "organization", label: "Organization (optional)", maxLength: 160 },
          ].map(({ key, label, maxLength }) => (
            <div key={key}>
              <label htmlFor={`${id}-${key}`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
              <input id={`${id}-${key}`} type="text" autoComplete="off" maxLength={maxLength} className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
            </div>
          ))}
        </div>}
        <p className="text-xs text-gray-500 dark:text-gray-400">{checkoutReady ? "Email required at Stripe checkout. Name and organization optional." : "Email will be required at Stripe checkout for your receipt."}</p>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm text-gray-700 dark:text-gray-200">
          <input type="checkbox" checked={updatesConsent} onChange={event => setUpdatesConsent(event.target.checked)} aria-describedby={`${id}-updates-help`} className="mt-1 h-4 w-4 shrink-0 accent-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700" />
          <span>{UPDATES_CONSENT_TEXT}<span id={`${id}-updates-help`} className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Optional. Unsubscribe anytime.</span></span>
        </label>
      </fieldset>
      <button type="button" onClick={openCheckout} disabled={!checkoutReady || !valid || submitting} className="min-h-12 w-full rounded-lg bg-emerald-700 px-5 py-3 text-base font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:opacity-60">
        <span aria-live="polite">{submitting ? "Opening Stripe…" : valid ? `Contribute ${currency.format(Number(rawAmount))} CAD${frequency === "monthly" ? " / month" : " one-time"}` : "Choose an amount"}</span>
      </button>
      {checkoutError && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{checkoutError}</p>}
      <p className="text-xs text-gray-500 dark:text-gray-400">{checkoutReady ? testMode ? "Test checkout with Stripe. No real money. " : "Secure checkout with Stripe. " : "Payments coming soon. Preview only. Details aren’t saved. "}<a href="/privacy" className="underline">Privacy</a>{" · "}<a href="/terms#education-support" className="underline">Support terms</a></p>
      {checkoutReady && frequency === "monthly" && portalUrl && <p className="text-xs text-gray-500 dark:text-gray-400">Monthly until canceled. <a href={portalUrl} className="underline">Manage monthly support</a></p>}
    </section>
  );
}
