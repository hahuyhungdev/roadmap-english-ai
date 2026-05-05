#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# Manual fallback deploy (run on VPS directly).
# CI/CD builds on GitHub Actions and SCPs the standalone tarball,
# so this script is only needed for manual / emergency deploys.
# ──────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/marcus-app/roadmap-english-ai}"
SRC_DIR="${SRC_DIR:-/var/www/marcus-app/roadmap-english-ai-src}"
BRANCH="${BRANCH:-main}"
PM2_APP_NAME="${PM2_APP_NAME:-roadmap-ai}"
APP_URL="${APP_URL:-http://127.0.0.1:3000/}"

if [[ ! -d "$SRC_DIR/.git" ]]; then
  echo "Source directory is not a git repository: $SRC_DIR"
  exit 1
fi

cd "$SRC_DIR"

if [[ -f "$SRC_DIR/.env.local" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$SRC_DIR/.env.local"
  set +a
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Missing DATABASE_URL. Export it or set it in $SRC_DIR/.env.local"
  exit 1
fi

echo "== Sync repository to origin/$BRANCH =="
git fetch origin
git reset --hard "origin/$BRANCH"
git clean -fd

echo "== Install dependencies and build =="
pnpm install --frozen-lockfile

echo "== DB preflight =="
node -e "const u=new URL(process.env.DATABASE_URL); const db=u.pathname.replace(/^\//,''); console.log('DB target:', u.hostname + ':' + (u.port || '5432') + '/' + db)"
node -e "require.resolve('pg'); require.resolve('drizzle-orm/node-postgres'); console.log('DB driver preflight passed')"
node -e "const {Pool}=require('pg'); const p=new Pool({connectionString: process.env.DATABASE_URL}); p.query('select 1 as ok').then(()=>{console.log('DB connectivity preflight passed')}).catch((e)=>{console.error('DB connectivity preflight failed:', e.message); process.exit(1)}).finally(()=>p.end())"

echo "== Sync database schema =="
pnpm run db:push
pnpm run build

echo "== Verify build artifacts =="
test -f .next/standalone/server.js
test -d .next/static
find .next/static -type f -name "*.css" | head -n 1 >/dev/null

echo "== Package standalone build =="
rm -rf deploy_bundle
mkdir -p deploy_bundle
cp -a .next/standalone/. deploy_bundle/
mkdir -p deploy_bundle/.next
cp -a .next/static deploy_bundle/.next/static
if [[ -d public ]]; then cp -a public deploy_bundle/public; fi
cp -a content deploy_bundle/content
find deploy_bundle/.next/static -type f -name "*.css" | head -n 1 >/dev/null

echo "== Deploy standalone to $APP_DIR =="
TMP_RELEASE_DIR="$(mktemp -d /tmp/roadmap-release.XXXXXX)"
cp -a deploy_bundle/. "$TMP_RELEASE_DIR/"
test -f "$TMP_RELEASE_DIR/server.js"
test -d "$TMP_RELEASE_DIR/.next/static"
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR"
cp -a "$TMP_RELEASE_DIR"/. "$APP_DIR/"
rm -rf "$TMP_RELEASE_DIR" deploy_bundle

# Preserve existing .env.local (manual deploy keeps VPS env file)
if [[ -f "$SRC_DIR/.env.local" ]]; then
  cp "$SRC_DIR/.env.local" "$APP_DIR/.env.local"
fi

echo "== Restart PM2 process =="
cd "$APP_DIR"
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
pm2 start server.js --name "$PM2_APP_NAME"
pm2 save

sleep 2

echo "== Smoke test =="
status_code=$(curl -sS -o /tmp/roadmap-health.out -w "%{http_code}" "$APP_URL")
if [[ "$status_code" != "200" ]]; then
  echo "Health check failed: HTTP $status_code"
  head -c 500 /tmp/roadmap-health.out || true
  echo
  exit 1
fi

css_path=$(curl -fsS "$APP_URL" | grep -Eo 'href="/_next/static[^"]+\.css"' | head -n 1 | cut -d'"' -f2 || true)
if [[ -z "$css_path" ]]; then
  echo "Asset check failed: no CSS reference found in homepage HTML"
  exit 1
fi
css_status=$(curl -sS -o /tmp/roadmap-css.out -w "%{http_code}" "http://127.0.0.1:3000$css_path")
if [[ "$css_status" != "200" ]]; then
  echo "Asset check failed: CSS $css_path returned HTTP $css_status"
  head -c 300 /tmp/roadmap-css.out || true
  echo
  exit 1
fi

echo "== Deploy complete =="
echo "Commit: $(cd "$SRC_DIR" && git rev-parse --short HEAD)"
pm2 status "$PM2_APP_NAME" | sed -n '1,20p'
