# Codepet Agent Notes

For AI session startup and doc routing, read:

1. [`.ai/START-HERE.md`](.ai/START-HERE.md)
2. [`.ai/CURRENT.md`](.ai/CURRENT.md)
3. [`docs/ai-instructions.md`](docs/ai-instructions.md)

For branch and worktree usage, read [`docs/dev-workflow.md`](docs/dev-workflow.md).

This is a small Next.js App Router site. Keep edits narrow, follow the existing component and Tailwind patterns, and preserve unrelated user changes in the worktree.

Do not commit secrets, private env files, or make deployment/production changes unless the user explicitly asks. Treat privacy, terms, and contact copy as user-facing policy content and avoid broad rewrites without approval.

Checks before handoff:

- Docs-only: `git diff --check` plus Markdown link review.
- Code or UI: `npm run lint` and `npm run build`.
- Visual/UI behavior: also run the app and verify the affected route or flow in a browser when practical.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
