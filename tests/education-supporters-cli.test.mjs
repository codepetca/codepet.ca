import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const script = resolve("scripts/education-supporters.mjs");
async function fixture(run) {
  const home = await mkdtemp(join(tmpdir(), "education-supporters-"));
  const directory = join(home, ".codex/private/codepet.ca/education-supporters/test");
  await mkdir(directory, { recursive: true });
  const cli = (args, input = "") => spawnSync(process.execPath, [script, ...args, "--mode", "test"], { env: { ...process.env, HOME: home, STRIPE_SECRET_KEY: "" }, input, encoding: "utf8", timeout: 5000 });
  try { await run({ directory, cli }); } finally { await rm(home, { recursive: true, force: true }); }
}

test("withdrawal is normalized and private, clears stale recipients, and deduplicates", async () => fixture(async ({ directory, cli }) => {
  await writeFile(join(directory, "suppression.json"), "[]\n");
  await writeFile(join(directory, "updates-eligible.csv"), "stale@example.com\n");
  const first = cli(["suppress", "--source", "test withdrawal"], " Person@Example.com \n");
  assert.equal(first.status, 0, first.stderr);
  assert.doesNotMatch(first.stdout, /person@example/i);
  assert.equal(cli(["suppress"], "person@example.com").status, 0);
  const rows = JSON.parse(await readFile(join(directory, "suppression.json"), "utf8"));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].email, "person@example.com");
  assert.equal(rows[0].source, "test withdrawal");
  assert.doesNotMatch(await readFile(join(directory, "updates-eligible.csv"), "utf8"), /stale@example/);
  assert.equal(JSON.parse(await readFile(join(directory, "latest-export.json"))).status, "refresh_required");
  assert.equal((await stat(directory)).mode & 0o777, 0o700);
  assert.equal((await stat(join(directory, "suppression.json"))).mode & 0o777, 0o600);
  await assert.rejects(stat(join(directory, ".lock")), { code: "ENOENT" });
}));

test("invalid suppression evidence fails closed and is preserved", async () => fixture(async ({ directory, cli }) => {
  await writeFile(join(directory, "suppression.json"), "invalid json");
  await writeFile(join(directory, "updates-eligible.csv"), "stale@example.com\n");
  const result = cli(["export"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid/);
  assert.equal(await readFile(join(directory, "suppression.json"), "utf8"), "invalid json");
  assert.doesNotMatch(await readFile(join(directory, "updates-eligible.csv"), "utf8"), /stale@example/);
  await assert.rejects(stat(join(directory, ".lock")), { code: "ENOENT" });
}));

test("a mode-mismatched or missing key cannot leave an old recipient list usable", async () => fixture(async ({ directory, cli }) => {
  await writeFile(join(directory, "suppression.json"), "[]\n");
  await writeFile(join(directory, "updates-eligible.csv"), "stale@example.com\n");
  const result = cli(["export"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /private Stripe key/);
  assert.doesNotMatch(await readFile(join(directory, "updates-eligible.csv"), "utf8"), /stale@example/);
}));

test("missing suppression evidence after initialization blocks both operations without recreating an empty log", async () => fixture(async ({ directory, cli }) => {
  assert.equal(cli(["suppress"], "first@example.com").status, 0);
  await rm(join(directory, "suppression.json"));
  for (const command of ["suppress", "export"]) {
    const result = cli([command], "second@example.com");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Suppression evidence is missing/);
    await assert.rejects(stat(join(directory, "suppression.json")), { code: "ENOENT" });
    assert.doesNotMatch(await readFile(join(directory, "updates-eligible.csv"), "utf8"), /@example/);
    assert.equal(JSON.parse(await readFile(join(directory, "latest-export.json"))).status, "refresh_required");
  }
}));

test("first-use initialization persists before a failed export so a normal retry remains possible", async () => fixture(async ({ directory, cli }) => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = cli(["export"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /private Stripe key/);
    assert.deepEqual(JSON.parse(await readFile(join(directory, "suppression.json"))), []);
  }
}));

test("a concurrent operation cannot take or remove the existing lock", async () => fixture(async ({ directory, cli }) => {
  await writeFile(join(directory, ".lock"), "active");
  const result = cli(["suppress"], "person@example.com");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /holds the lock/);
  assert.equal(await readFile(join(directory, ".lock"), "utf8"), "active");
  await assert.rejects(stat(join(directory, "suppression.json")), { code: "ENOENT" });
}));
