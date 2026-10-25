/**
 * @param {number} value
 * @param {string} name
 * @returns {void}
 */
function assertFinite(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
}

/**
 * Decompose time remaining, rounding partial seconds up until the deadline.
 *
 * @param {number} deadlineMs Deadline as a Unix timestamp in milliseconds.
 * @param {number} nowMs Current Unix timestamp in milliseconds.
 * @returns {{days: number, hours: number, minutes: number, seconds: number, ended: boolean}}
 */
export function getCountdown(deadlineMs, nowMs) {
  assertFinite(deadlineMs, "deadlineMs");
  assertFinite(nowMs, "nowMs");

  if (nowMs >= deadlineMs) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }

  const remaining = Math.ceil((deadlineMs - nowMs) / 1000);
  if (!Number.isFinite(remaining)) {
    throw new RangeError("The countdown interval must be finite.");
  }

  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    ended: false,
  };
}

/**
 * Return unique, increasing milestones newly passed above a caller's high-water
 * mark. The caller keeps that mark to prevent replay after a backwards change.
 *
 * @param {number} previousHighWater Highest percentage previously reached.
 * @param {number} nextPercentage Current percentage.
 * @param {number[]} thresholds Nonnegative milestone percentages.
 * @returns {number[]}
 */
export function crossedMilestones(previousHighWater, nextPercentage, thresholds) {
  assertFinite(previousHighWater, "previousHighWater");
  assertFinite(nextPercentage, "nextPercentage");
  if (previousHighWater < 0 || nextPercentage < 0) {
    throw new RangeError("Campaign percentages must be nonnegative.");
  }
  if (!Array.isArray(thresholds)) {
    throw new TypeError("thresholds must be an array of finite nonnegative numbers.");
  }
  for (const threshold of thresholds) {
    assertFinite(threshold, "Each threshold");
    if (threshold < 0) {
      throw new RangeError("Each threshold must be nonnegative.");
    }
  }

  return [...new Set(thresholds)]
    .filter((threshold) => previousHighWater < threshold && threshold <= nextPercentage)
    .sort((a, b) => a - b);
}
