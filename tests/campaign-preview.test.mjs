import test from "node:test";
import assert from "node:assert/strict";
import { crossedMilestones, getCountdown } from "../lib/campaign-preview.mjs";

test("countdown stays live for a partial final second and ends at the deadline", () => {
  const deadline = Date.parse("2026-11-07T23:59:00-05:00");
  assert.deepEqual(getCountdown(deadline, deadline - 1), {
    days: 0, hours: 0, minutes: 0, seconds: 1, ended: false,
  });
  const ended = { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  assert.deepEqual(getCountdown(deadline, deadline), ended);
  assert.deepEqual(getCountdown(deadline, deadline + 5000), ended);
});

test("countdown decomposes multiple days and rounds partial seconds consistently", () => {
  const durationSeconds = 2 * 86400 + 3 * 3600 + 4 * 60 + 5;
  assert.deepEqual(getCountdown(durationSeconds * 1000, 0), {
    days: 2, hours: 3, minutes: 4, seconds: 5, ended: false,
  });
  assert.deepEqual(getCountdown(60_001, 0), {
    days: 0, hours: 0, minutes: 1, seconds: 1, ended: false,
  });
  assert.deepEqual(getCountdown(0, -1000), {
    days: 0, hours: 0, minutes: 0, seconds: 1, ended: false,
  });
});

test("countdown rejects invalid timestamps and overflowing intervals", () => {
  for (const invalid of [NaN, Infinity, -Infinity, "1000", null, undefined]) {
    assert.throws(() => getCountdown(invalid, 0), /deadlineMs must be a finite number/);
    assert.throws(() => getCountdown(0, invalid), /nowMs must be a finite number/);
  }
  assert.throws(() => getCountdown(Number.MAX_VALUE, -Number.MAX_VALUE), /interval must be finite/);
});

test("milestones include the destination, exclude the high-water mark, and sort/deduplicate", () => {
  const thresholds = [150, 100, 125, 100, 125];
  assert.deepEqual(crossedMilestones(72, 150, thresholds), [100, 125, 150]);
  assert.deepEqual(crossedMilestones(100, 125, thresholds), [125]);
  assert.deepEqual(crossedMilestones(0, 0, [0]), []);
  assert.deepEqual(thresholds, [150, 100, 125, 100, 125]);
});

test("retaining the high-water mark prevents retriggering after backwards changes", () => {
  const thresholds = [100, 125, 150];
  assert.deepEqual(crossedMilestones(72, 125, thresholds), [100, 125]);
  assert.deepEqual(crossedMilestones(125, 90, thresholds), []);
  assert.deepEqual(crossedMilestones(125, 125, thresholds), []);
  assert.deepEqual(crossedMilestones(125, 149.99, thresholds), []);
  assert.deepEqual(crossedMilestones(125, 151, thresholds), [150]);
  assert.deepEqual(crossedMilestones(72, 100, []), []);
});

test("milestones validate percentages and thresholds even when moving backwards", () => {
  for (const invalid of [NaN, Infinity, -Infinity, "100", null, undefined]) {
    assert.throws(() => crossedMilestones(invalid, 100, []), /previousHighWater must be a finite number/);
    assert.throws(() => crossedMilestones(72, invalid, []), /nextPercentage must be a finite number/);
    assert.throws(() => crossedMilestones(150, 72, [invalid]), /threshold must be a finite number/);
  }
  assert.throws(() => crossedMilestones(-1, 100, []), /percentages must be nonnegative/);
  assert.throws(() => crossedMilestones(72, -1, []), /percentages must be nonnegative/);
  assert.throws(() => crossedMilestones(150, 72, [-1]), /threshold must be nonnegative/);
  assert.throws(() => crossedMilestones(72, 100, null), /thresholds must be an array/);
});
