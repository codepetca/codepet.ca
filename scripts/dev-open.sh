#!/usr/bin/env bash
set -euo pipefail

open_existing_if_running() {
  if [[ ! -f ".next/dev/lock" ]]; then
    return 1
  fi

  local lock_pid listen_addr
  lock_pid="$(lsof -t ".next/dev/lock" 2>/dev/null | head -n 1 || true)"
  if [[ -z "${lock_pid:-}" ]]; then
    rm -f ".next/dev/lock"
    return 1
  fi

  listen_addr="$(lsof -nP -a -p "$lock_pid" -iTCP -sTCP:LISTEN 2>/dev/null | awk 'NR>1 {print $9; exit}')"
  if [[ "$listen_addr" =~ :([0-9]+)$ ]]; then
    local url="http://localhost:${BASH_REMATCH[1]}"
    echo "Found running codepet.ca dev server at $url"
    open "$url" >/dev/null 2>&1 || true
    return 0
  fi

  return 1
}

if open_existing_if_running; then
  exit 0
fi

npm run dev -- --webpack 2>&1 | while IFS= read -r line; do
  echo "$line"

  if [[ -z "${OPENED_URL:-}" ]] && [[ "$line" =~ (https?://(localhost|127\.0\.0\.1):[0-9]+) ]]; then
    OPENED_URL="${BASH_REMATCH[1]}"
    open "$OPENED_URL" >/dev/null 2>&1 || true
  fi
done
