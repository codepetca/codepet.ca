#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3025}"
HOST="${HOST:-127.0.0.1}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

cd "$REPO_ROOT"

# Only stop processes that are both listening on the target port and running from this repo.
matched_pids=""
for pid in $(lsof -ti "tcp:${PORT}" 2>/dev/null || true); do
  cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1 || true)"
  if [[ "$cwd" == "$REPO_ROOT" ]]; then
    matched_pids="$matched_pids $pid"
  fi
done

if [[ -n "${matched_pids// }" ]]; then
  echo "Stopping existing codepet.ca dev server on port ${PORT}:$matched_pids"
  kill -TERM $matched_pids 2>/dev/null || true

  for _ in {1..10}; do
    still_running=""
    for pid in $matched_pids; do
      if kill -0 "$pid" 2>/dev/null; then
        still_running="$still_running $pid"
      fi
    done
    if [[ -z "${still_running// }" ]]; then
      break
    fi
    sleep 0.5
  done

  if [[ -n "${still_running// }" ]]; then
    echo "Force stopping remaining processes:$still_running"
    kill -KILL $still_running 2>/dev/null || true
  fi
fi

npm install

(
  for _ in {1..60}; do
    if curl -fsS "http://${HOST}:${PORT}" >/dev/null 2>&1; then
      open "http://${HOST}:${PORT}" >/dev/null 2>&1 || true
      break
    fi
    sleep 1
  done
) &

exec npm run dev -- --hostname "$HOST" --port "$PORT"
