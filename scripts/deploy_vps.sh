#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/marcus-app/roadmap-english-ai}"
BRANCH="${BRANCH:-main}"
PM2_APP_NAME="${PM2_APP_NAME:-roadmap-ai}"
APP_URL="${APP_URL:-http://127.0.0.1:3000/}"

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "App directory is not a git repository: $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

echo "== Sync repository to origin/$BRANCH =="
git fetch origin
git reset --hard "origin/$BRANCH"
# Remove stray files from manual hot-fixes to keep VPS identical to git.
git clean -fd

echo "== Install dependencies and build =="
npm ci
npm run build

echo "== Restart PM2 process =="
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$PM2_APP_NAME" --update-env
else
  pm2 start npm --name "$PM2_APP_NAME" -- start
fi

sleep 2

echo "== Smoke test =="
status_code=$(curl -sS -o /tmp/roadmap-health.out -w "%{http_code}" "$APP_URL")
if [[ "$status_code" != "200" ]]; then
  echo "Health check failed: HTTP $status_code"
  head -c 500 /tmp/roadmap-health.out || true
  echo
  exit 1
fi

echo "== Deploy complete =="
echo "Commit: $(git rev-parse --short HEAD)"
pm2 status "$PM2_APP_NAME" | sed -n '1,20p'
