"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGamepad, faHeadphones, faTrophy, faLock, faCheck, faWandSparkles, faHeart } from "@fortawesome/free-solid-svg-icons";
import { crossedMilestones, getCountdown } from "@/lib/campaign-preview.mjs";
import styles from "./campaign-preview.module.css";

const deadline = Date.parse("2026-11-07T23:59:00-05:00");
const milestones = [100, 125, 150];
const prizes = [
  { threshold: 100, name: "Creator kit", description: "A controller and a fresh set of creative tools.", icon: faGamepad, color: "emerald" },
  { threshold: 125, name: "Sound & play", description: "Headphones for a standout game and its creator.", icon: faHeadphones, color: "violet" },
  { threshold: 150, name: "Teamwork award", description: "An extra prize for a team that lifts others up.", icon: faTrophy, color: "amber" },
];

function subscribeClock(onChange: () => void) {
  const timer = window.setInterval(onChange, 1000);
  return () => window.clearInterval(timer);
}
function clockSnapshot() { return Math.floor(Date.now() / 1000) * 1000; }
function serverClockSnapshot() { return null; }

export function CampaignPreview() {
  const now = useSyncExternalStore(subscribeClock, clockSnapshot, serverClockSnapshot);
  const [percentage, setPercentage] = useState(72);
  const [previewEnded, setPreviewEnded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [celebration, setCelebration] = useState<{ id: number; threshold: number; count: number } | null>(null);
  const highWater = useRef(72);
  const celebrationId = useRef(0);
  const countdown = now === null ? null : getCountdown(deadline, previewEnded ? deadline : now);
  const ended = previewEnded || countdown?.ended === true;
  const nextMilestone = milestones.find((value) => value > percentage);
  const stretchProgress = Math.min(100, Math.max(0, (percentage - 100) / 50 * 100));

  useEffect(() => {
    if (!celebration) return;
    const timer = window.setTimeout(() => setCelebration(null), 4200);
    return () => window.clearTimeout(timer);
  }, [celebration]);

  function changeProgress(value: number) {
    if (ended) return;
    const next = Math.max(0, Math.min(175, value));
    const crossed = crossedMilestones(highWater.current, next, milestones);
    highWater.current = Math.max(highWater.current, next);
    setPercentage(next);
    if (crossed.length) {
      setCelebration({ id: ++celebrationId.current, threshold: crossed[crossed.length - 1], count: crossed.length });
    }
  }

  function resetDemo() {
    highWater.current = 72;
    setPercentage(72);
    setPreviewEnded(false);
    setCelebration(null);
  }

  const controlClass = "min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800";

  return (
    <section className={`${reducedMotion ? styles.reducedMotion : ""} w-full max-w-5xl px-4 py-8 text-gray-950 sm:px-6 sm:py-12 dark:text-white`}>
      <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 text-sm" aria-label="Campaign navigation">
        <Link href="/education" className="inline-flex min-h-11 items-center gap-2 text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"><FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />Codepet Education</Link>
        <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">Preview · no payments</span>
      </nav>

      <header className="mb-9 grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Small games. Big possibilities.</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Codepet Game Jam</h1>
          <p className="mt-4 max-w-lg text-lg leading-7 text-gray-600 dark:text-gray-300">Make something playful. Celebrate new creators. Give something back.</p>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Sample campaign · prizes and progress are illustrative.</p>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.orbit} />
          <span className={styles.heroController}><FontAwesomeIcon icon={faGamepad} /></span>
          <span className={styles.heroStar}><FontAwesomeIcon icon={faTrophy} /></span>
          <span className={styles.heroHeart}><FontAwesomeIcon icon={faHeart} /></span>
          <span className={styles.pixelOne} /><span className={styles.pixelTwo} />
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="progress-title" className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div><h2 id="progress-title" className="text-sm text-gray-500 dark:text-gray-400">Community progress</h2><p className="mt-2 text-6xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">{percentage}<span className="text-3xl">%</span></p></div>
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium dark:bg-gray-900">{ended ? "Campaign ended · demo" : percentage >= 100 ? "Goal reached!" : "Let’s make it happen"}</span>
          </div>

          <div role="progressbar" aria-label="Campaign funding goal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, percentage)} aria-valuetext={`${percentage}% of the original demo target`} className="h-5 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950">
            <div className={`${styles.progressFill} h-full rounded-full bg-emerald-600`} style={{ width: `${Math.min(100, percentage)}%` }} />
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{nextMilestone ? `${nextMilestone - percentage}% to the ${nextMilestone === 100 ? "first goal" : `${nextMilestone}% milestone`}.` : "Every stretch milestone is unlocked. Keep the good going."}</p>

          {percentage >= 100 && (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>Beyond the goal</span><span>150% stretch goal</span></div>
              <div role="progressbar" aria-label="Stretch goal progress" aria-valuemin={100} aria-valuemax={150} aria-valuenow={Math.min(150, percentage)} aria-valuetext={`${percentage}% of the original demo target`} className="h-2 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-950"><div className={`${styles.progressFill} h-full rounded-full bg-violet-500`} style={{ width: `${stretchProgress}%` }} /></div>
            </div>
          )}

          <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-800">
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{ended ? "The demo deadline has passed" : "Sample deadline · Nov 7, 11:59 p.m. Toronto"}</p>
            <div role="timer" aria-live="off" aria-label="Time remaining" className="grid grid-cols-4 gap-2">
              {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
                <div key={unit} className="rounded-lg bg-gray-50 py-3 text-center dark:bg-gray-900"><span className="block text-2xl font-semibold tabular-nums sm:text-3xl">{countdown ? String(countdown[unit]).padStart(2, "0") : "–"}</span><span className="mt-1 block text-[0.65rem] uppercase tracking-wide text-gray-500 dark:text-gray-400">{unit}</span></div>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => changeProgress(percentage + 10)} disabled={ended || percentage >= 175} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"><FontAwesomeIcon icon={faHeart} className="h-4 w-4" />{ended ? "Campaign ended" : "Add demo support · +10%"}</button>
          <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">Simulated progress only. No money is collected.</p>
        </section>

        <aside aria-labelledby="demo-title" className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
          <h2 id="demo-title" className="text-base font-semibold">Try the campaign</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">Move the goal forward and watch the prizes unlock.</p>
          <label htmlFor="demo-progress" className="mt-6 flex justify-between text-sm font-medium"><span>Demo progress</span><span>{percentage}%</span></label>
          <input id="demo-progress" type="range" min={0} max={175} step={1} value={percentage} onChange={(event) => changeProgress(Number(event.target.value))} disabled={ended} className="mt-3 min-h-11 w-full cursor-pointer accent-emerald-600 disabled:opacity-40" />
          <div className="mt-3 grid grid-cols-3 gap-2">{milestones.map((value) => <button key={value} type="button" disabled={ended} onClick={() => changeProgress(value)} className={controlClass}>{value}%</button>)}</div>
          <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={previewEnded} onChange={(event) => { setPreviewEnded(event.target.checked); setCelebration(null); }} className="h-4 w-4 accent-emerald-600" />Preview ended state</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} className="h-4 w-4 accent-emerald-600" />Reduce motion</label>
          <button type="button" onClick={resetDemo} className={`${controlClass} mt-4 w-full`}>Reset demo</button>
          <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">Milestones celebrate once per demo run. Reset to play them again.</p>
        </aside>
      </div>

      <section aria-labelledby="prizes-title" className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><h2 id="prizes-title" className="text-2xl font-semibold tracking-tight">More support. More possibilities.</h2><span className="text-xs text-gray-500 dark:text-gray-400">Illustrative prizes · not awarded or sponsored</span></div>
        <div className="grid gap-4 md:grid-cols-3">
          {prizes.map((prize) => {
            const unlocked = percentage >= prize.threshold;
            return (
              <article key={prize.threshold} className={`overflow-hidden rounded-2xl border bg-white dark:bg-gray-950 ${unlocked ? "border-emerald-500 dark:border-emerald-700" : "border-gray-200 dark:border-gray-800"}`}>
                <div className={`${styles.prizeArt} ${styles[prize.color]}`} aria-hidden="true"><FontAwesomeIcon icon={prize.icon} /><span className={styles.prizeSparkle}>✦</span></div>
                <div className="p-5"><div className="mb-3 flex items-center justify-between gap-2 text-xs"><span className="font-medium text-gray-500 dark:text-gray-400">{prize.threshold}% milestone</span><span className={unlocked ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}><FontAwesomeIcon icon={unlocked ? faCheck : faLock} className="mr-1 h-3 w-3" />{unlocked ? "Unlocked" : "Locked"}</span></div><h3 className="text-lg font-semibold">{prize.name}</h3><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{prize.description}</p></div>
              </article>
            );
          })}
        </div>
      </section>

      <details className="mt-8 rounded-xl border border-gray-200 p-5 text-sm dark:border-gray-800"><summary className="cursor-pointer font-medium">Before a real campaign opens</summary><p className="mt-3 leading-6 text-gray-600 dark:text-gray-400">The event dates, prize rules, charity partner and proceeds allocation will be agreed and published first. This preview runs no prize draw, accepts no entries or payments, and makes no charitable receipt promise.</p></details>

      {celebration && !ended && (
        <div key={celebration.id} className={styles.celebration}>
          <div role="status" className={styles.toast}><FontAwesomeIcon icon={faWandSparkles} className="h-5 w-5" /><div><strong>{celebration.count > 1 ? `${celebration.count} milestones reached!` : celebration.threshold === 100 ? "We did it! Goal reached." : "Stretch goal unlocked!"}</strong><span className="mt-1 block text-sm">{celebration.threshold}% · a little more possibility.</span></div></div>
          <div aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <span key={index} className={styles.confetti} style={{ "--left": `${(index * 37) % 100}%`, "--delay": `${(index % 6) * 0.07}s`, "--drift": `${(index % 2 ? 1 : -1) * (30 + index * 3)}px`, "--color": ["#10b981", "#a78bfa", "#fbbf24", "#38bdf8"][index % 4] } as CSSProperties} />)}</div>
        </div>
      )}
    </section>
  );
}
