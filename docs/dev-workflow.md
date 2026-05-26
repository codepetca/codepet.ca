# Codepet Development Workflow

This document is the canonical source for branch and worktree usage for AI-assisted work.

## Core Rules

- Resolve the repo root with `git rev-parse --show-toplevel` and run commands from that root.
- Check `git status --short --branch` before editing.
- Preserve unrelated user changes. Do not revert files you did not change unless the user explicitly asks.
- Prefer one git worktree per branch for new feature work.
- Do not switch branches inside a worktree with uncommitted work.
- Treat `/Users/stew/Repos/codepet.ca` as the hub checkout when it is on `main`.
- Keep the hub checkout on `main`. After a branch or PR merge, fetch and fast-forward the hub to `origin/main` before starting more work.

## Worktree Locations

New named Codex worktrees should live under:

```bash
$HOME/.codex/worktrees/codepet.ca/<branch-slug>
```

Codex Desktop may also create app-managed worktrees under:

```bash
$HOME/.codex/worktrees/<id>/codepet.ca
```

Both shapes are valid. The important rule is that each task has one current checkout and one branch.

## Starting New Work

From the hub checkout:

```bash
HUB="/Users/stew/Repos/codepet.ca"
WT_ROOT="$HOME/.codex/worktrees/codepet.ca"
BRANCH="codex/<short-task-name>"
WT="$WT_ROOT/<short-task-name>"
BASE="${BASE:-origin/main}"

mkdir -p "$WT_ROOT"
git -C "$HUB" fetch origin
git -C "$HUB" switch main
git -C "$HUB" merge --ff-only origin/main
git -C "$HUB" worktree add -b "$BRANCH" "$WT" "$BASE"
cd "$WT"
```

Use `BASE=HEAD` or `BASE=<branch-name>` only when intentionally stacking on the current checkout or another unmerged branch.

If the user asks for a quick local edit in the current checkout, work there after checking status and clearly preserving unrelated changes.

## Environment Files

- No public env example currently exists.
- Never commit private env files.
- If future local env values are needed in multiple worktrees, prefer a symlink from a canonical local file:

```bash
ln -s "<canonical-env-path>" .env.local
```

Use branch-specific env files only when intentionally isolating backend state or secrets.

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

Helpers:

- `npm run dev:open` opens an existing dev server if one is already running, otherwise starts one.
- `scripts/run-action.sh` installs dependencies, starts the app on `PORT` default `3025`, and opens the route once ready.

## Verification

- Docs-only: `git diff --check` plus local Markdown link review.
- Code/UI: `npm run lint` and `npm run build`.
- UI or flow changes: run the app and browser-check the affected route or interaction.

## Cleanup After Merge

After a branch is merged, fast-forward the hub checkout and remove the merged worktree from the hub:

```bash
HUB="/Users/stew/Repos/codepet.ca"
BRANCH="codex/<short-task-name>"

git -C "$HUB" fetch origin
git -C "$HUB" switch main
git -C "$HUB" merge --ff-only origin/main
WT_PATH="$(git -C "$HUB" worktree list --porcelain \
  | awk -v branch="$BRANCH" '
      /^worktree / { path=substr($0, 10) }
      /^branch refs\/heads\// {
        ref=substr($0, 19)
        if (ref == branch) { print path; exit }
      }')"

if [ -n "$WT_PATH" ]; then
  git -C "$HUB" worktree remove "$WT_PATH"
fi

git -C "$HUB" branch -D "$BRANCH"
```
