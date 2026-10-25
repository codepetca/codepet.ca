"use client";

import { useId, useState } from "react";

type Frequency = "monthly" | "once";

const amounts = { monthly: [5, 10, 20, 50], once: [10, 20, 50, 100] };
const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

export function EducationFundingOptions() {
  const id = useId();
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [selected, setSelected] = useState({ monthly: "10", once: "20" });
  const [custom, setCustom] = useState({ monthly: "", once: "" });
  const isCustom = selected[frequency] === "other";
  const rawAmount = isCustom ? custom[frequency].trim() : selected[frequency];
  const valid = /^\d+(?:\.\d{1,2})?$/.test(rawAmount) && Number(rawAmount) >= 1;
  const showError = isCustom && rawAmount !== "" && !valid;

  const choiceClass = "flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 peer-checked:border-emerald-700 peer-checked:bg-emerald-700 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-700 dark:border-gray-700 dark:text-gray-200";

  return (
    <section aria-label="Choose support amount" className="my-5 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
      <fieldset>
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

      <fieldset>
        <legend className="mb-2 text-xs text-gray-500 dark:text-gray-400">Amount in Canadian dollars (CAD)</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[...amounts[frequency].map(String), "other"].map((value) => (
            <label key={value} className={value === "other" ? "col-span-2 sm:col-span-3" : undefined}>
              <input type="radio" name={`${id}-amount`} value={value} checked={selected[frequency] === value} onChange={() => setSelected({ ...selected, [frequency]: value })} className="peer sr-only" />
              <span className={choiceClass}>{value === "other" ? "Other amount" : `$${value}${frequency === "monthly" ? " / mo" : ""}`}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {isCustom && (
        <div>
          <label htmlFor={`${id}-custom`} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">{frequency === "monthly" ? "Monthly amount (CAD)" : "One-time amount (CAD)"}</label>
          <input id={`${id}-custom`} type="text" inputMode="decimal" maxLength={9} value={custom[frequency]} onChange={(event) => setCustom({ ...custom, [frequency]: event.target.value })} aria-invalid={showError} aria-describedby={showError ? `${id}-error` : undefined} className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
          {showError && <p id={`${id}-error`} className="mt-2 text-sm text-red-700 dark:text-red-400">Enter CA$1 or more, with up to two decimal places.</p>}
        </div>
      )}

      <p aria-live="polite" className="text-base font-semibold text-gray-950 dark:text-white">
        {valid ? `${currency.format(Number(rawAmount))} CAD${frequency === "monthly" ? " / month" : " one-time"}` : "Choose an amount"}
      </p>
      <button type="button" disabled className="min-h-12 w-full rounded-lg bg-emerald-700 px-5 py-3 text-base font-semibold text-white opacity-60">Payments coming soon</button>
    </section>
  );
}
