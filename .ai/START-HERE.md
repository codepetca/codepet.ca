# Codepet - AI Agent Starting Checklist

Follow this checklist at the start of every AI-assisted coding session.

## Start Here

```text
[ ] Resolve repo root: git rev-parse --show-toplevel
[ ] Confirm the current checkout/worktree is the intended place to edit
[ ] Check status: git status --short --branch
[ ] Read: AGENTS.md
[ ] Read: .ai/CURRENT.md
[ ] Read: docs/ai-instructions.md
[ ] Read: docs/dev-workflow.md for branch or worktree work
[ ] Load only the task-specific files needed for the request
[ ] Confirm the work stays inside project boundaries
```

## Boundaries

- Keep changes scoped to Codepet's public site and its local scripts/config.
- Preserve unrelated user edits, especially in a dirty worktree.
- Do not commit secrets, private env files, generated build output, or `node_modules`.
- Do not change deployment, DNS, analytics, payment, auth, or production settings unless the user explicitly asks.
- Treat `app/privacy`, `app/terms`, and `app/contact` as policy/contact pages; make targeted edits only.

## Before Coding

- Prefer existing App Router, component, Tailwind, FontAwesome, and `next-themes` patterns.
- Read the route/component you will touch before editing.
- Keep UI changes responsive and verify that text fits on mobile and desktop.
- For non-trivial behavior or shared logic, consider tests first; this repo does not currently have a test harness beyond lint/build.

## Before Handoff

- Explain what changed and where.
- Run the checks required for the change type.
- State any checks skipped and why.
- Leave existing user changes intact.

## Source Order

When docs disagree, trust them in this order:

1. `AGENTS.md`
2. `.ai/CURRENT.md`
3. `docs/ai-instructions.md`
4. `docs/dev-workflow.md` for branch and worktree workflow
5. `README.md`
6. Source code and package scripts
