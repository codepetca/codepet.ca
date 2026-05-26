# AI Instructions for Codepet

This file routes AI coding agents to the right project context. Use it after `.ai/START-HERE.md`.

## Default Startup Context

Read these files at the start of every session:

1. [`.ai/START-HERE.md`](../.ai/START-HERE.md)
2. [`.ai/CURRENT.md`](../.ai/CURRENT.md)
3. [`AGENTS.md`](../AGENTS.md)
4. [`README.md`](../README.md)
5. [`docs/ai-instructions.md`](./ai-instructions.md)

For branch or worktree work, also read [`docs/dev-workflow.md`](./dev-workflow.md).

After that, load only the files needed for the task.

## Task Routing

| Task | Read next |
|---|---|
| Home page interaction | `app/page.tsx`, `components/home-content.tsx`, `components/typewriter.tsx`, `components/pet-icon.tsx`, `lib/pets.ts` |
| Dashboard/projects page | `app/dash/page.tsx`, `components/footer.tsx`, `components/header.tsx` |
| Site chrome/layout | `app/layout.tsx`, `components/header.tsx`, `components/footer.tsx`, `app/globals.css` |
| Privacy, terms, or contact | Relevant route under `app/`, plus `.ai/CURRENT.md` product boundaries |
| Styling/theme | `app/globals.css`, `components/theme-provider.tsx`, relevant component/page |
| Scripts/local workflow | `package.json`, `scripts/dev-open.sh`, `scripts/run-action.sh`, `docs/dev-workflow.md` |
| Branches/worktrees/PR prep | `docs/dev-workflow.md`, then current `git status --short --branch` |

## Testing And TDD

- Preserve this repo's current testing posture: there is no dedicated test suite yet.
- For non-trivial shared logic, bug fixes, parsers, state machines, data transformations, or security-sensitive behavior, prefer adding focused tests if a harness exists or discuss the missing harness in the handoff.
- Do not require TDD for docs-only changes, copy edits, visual polish, or small static page updates.
- If behavior changes are not covered by tests, explain the verification that was performed.

## Repo Invariants

- Use npm and keep `package-lock.json` as the lockfile.
- Keep App Router routes under `app/`.
- Prefer server components for static pages and move `"use client"` only into components that need hooks, browser APIs, or pathname access.
- Use existing Tailwind utility patterns and the theme variables in `app/globals.css`.
- Preserve FontAwesome setup in `app/layout.tsx`; it prevents icon CSS flash.
- Do not commit `.next`, `node_modules`, local env files, or generated artifacts unless explicitly requested.

## Verification

- Docs-only: review local Markdown links and run `git diff --check`.
- Code changes: run `npm run lint` and `npm run build`.
- UI changes: run the app locally and browser-check the changed route or interaction when practical.
- If a command cannot be run, state the reason in the handoff.

## Source Of Truth Order

1. `AGENTS.md`
2. `.ai/CURRENT.md`
3. `docs/ai-instructions.md`
4. `docs/dev-workflow.md` for branch and worktree workflow
5. `README.md`
6. Source code and package scripts
