import { amountToCents } from "./education-checkout.mjs";

/** Canadian domestic-card estimate, checked October 25, 2026.
 * Payments: 2.9% + CAD0.30; monthly Billing adds 0.7%.
 * https://stripe.com/en-ca/pricing
 * https://stripe.com/en-ca/billing/pricing
 * Gross up the entire payment, including the extra support, using integer cents.
 * Round upwards so the estimate does not understate the theoretical gross-up.
 * Actual processing fees, rounding and applicable taxes can differ.
 */
export function educationFeeEstimate(amount, frequency) {
  if (frequency !== "monthly" && frequency !== "once") throw new Error("Choose monthly or one-time support.");
  const amountCents = amountToCents(amount);
  const rateBasisPoints = frequency === "monthly" ? 360 : 290;
  const totalCents = Math.ceil((amountCents + 30) * 10_000 / (10_000 - rateBasisPoints));
  return { amountCents, extraCents: totalCents - amountCents, totalCents };
}
