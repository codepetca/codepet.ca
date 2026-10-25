import test from "node:test";
import assert from "node:assert/strict";
import { educationFeeEstimate } from "../lib/education-fee-estimate.mjs";
import { MAX_AMOUNT_CENTS, validateSupportRequest } from "../lib/education-checkout.mjs";

test("fee coverage grosses up the total rather than adding fees calculated only on the base", () => {
  assert.deepEqual(educationFeeEstimate("20", "once"), { amountCents: 2000, extraCents: 91, totalCents: 2091 });
  assert.deepEqual(educationFeeEstimate("10", "monthly"), { amountCents: 1000, extraCents: 69, totalCents: 1069 });
  assert.deepEqual(educationFeeEstimate("20", "monthly"), { amountCents: 2000, extraCents: 106, totalCents: 2106 });
  assert.deepEqual(educationFeeEstimate("12.34", "once"), { amountCents: 1234, extraCents: 68, totalCents: 1302 });
});

test("every preset and custom amount uses the smallest whole cent covering the rate estimate", () => {
  for (const frequency of ["once", "monthly"]) {
    const divisor = 10_000 - (frequency === "monthly" ? 360 : 290);
    for (let cents = 100; cents <= MAX_AMOUNT_CENTS; cents += 137) {
      const quote = educationFeeEstimate((cents / 100).toFixed(2), frequency);
      const numerator = (cents + 30) * 10_000;
      assert.ok(Number.isSafeInteger(quote.totalCents));
      assert.ok(quote.totalCents * divisor >= numerator);
      assert.ok((quote.totalCents - 1) * divisor < numerator);
      assert.equal(quote.extraCents + cents, quote.totalCents);
    }
  }
});

test("invalid amounts/frequencies cannot produce a usable quote and the server still caps the full charge", () => {
  for (const amount of ["", "0", "-5", "10.001", "1e2", "Infinity", "10001", NaN, undefined]) assert.throws(() => educationFeeEstimate(amount, "once"));
  assert.throws(() => educationFeeEstimate("10", "annual"));
  const quote = educationFeeEstimate("10000", "monthly");
  assert.ok(quote.totalCents > MAX_AMOUNT_CENTS);
  assert.throws(() => validateSupportRequest({ frequency: "monthly", amount: (quote.totalCents / 100).toFixed(2), updatesConsent: false, attemptId: "12345678-1234-4123-8123-123456789abc" }));
});
