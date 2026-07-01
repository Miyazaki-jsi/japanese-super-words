#!/usr/bin/env bash
# Configure Supabase + Admin dashboard for Japanese Super Words.
#
# Usage:
#   bash scripts/setup-admin.sh
#   ADMIN_PASSWORD='your-password' bash scripts/setup-admin.sh
#
# Optional (verify DB after you have keys):
#   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... bash scripts/setup-admin.sh

set -euo pipefail

APP_URL="${APP_URL:-https://japanese-super-words.vercel.app}"
SCHEMA_FILE="${SCHEMA_FILE:-supabase/schema.sql}"

echo "== Japanese Super Words · Admin + Supabase setup =="
echo "App URL:    $APP_URL"
echo "Admin URL:  ${APP_URL}/admin/login"
echo "Schema SQL: $SCHEMA_FILE"
echo ""

if [ -z "${ADMIN_SESSION_SECRET:-}" ]; then
  if command -v openssl >/dev/null 2>&1; then
    ADMIN_SESSION_SECRET="$(openssl rand -base64 32 | tr -d '\n')"
    echo "Generated ADMIN_SESSION_SECRET (save this — shown once):"
    echo "  $ADMIN_SESSION_SECRET"
  else
    echo "Set ADMIN_SESSION_SECRET manually (32+ random bytes, base64 ok)."
    ADMIN_SESSION_SECRET="<generate-with-openssl-rand-base64-32>"
  fi
  echo ""
fi

if [ -z "${ADMIN_PASSWORD:-}" ]; then
  echo "Choose ADMIN_PASSWORD (not auto-generated — pick something you'll remember)."
  ADMIN_PASSWORD="<your-strong-admin-password>"
fi

echo "Step 1 — Supabase project"
echo "  1. Create a free project: https://supabase.com/dashboard"
echo "  2. SQL Editor → New query → paste contents of $SCHEMA_FILE → Run"
echo "  3. Project Settings → API:"
echo "       SUPABASE_URL        = Project URL"
echo "       SUPABASE_SERVICE_ROLE_KEY = service_role (secret, not anon)"
echo ""

echo "Step 2 — Vercel environment variables (Production + Preview)"
echo "  SUPABASE_URL=$([ -n "${SUPABASE_URL:-}" ] && echo "$SUPABASE_URL" || echo 'https://xxxx.supabase.co')"
echo "  SUPABASE_SERVICE_ROLE_KEY=$([ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ] && echo '<set — do not commit>' || echo 'eyJ...')"
echo "  ADMIN_PASSWORD=$ADMIN_PASSWORD"
echo "  ADMIN_SESSION_SECRET=$ADMIN_SESSION_SECRET"
echo ""

echo "Step 3 — Redeploy, then verify"
echo "  curl -s ${APP_URL}/api/monetization/status | python3 -m json.tool"
echo "  # admin.authConfigured + admin.dbConfigured should be true"
echo "  open ${APP_URL}/admin/login"
echo ""

if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "Running Supabase verification with provided env…"
  SUPABASE_URL="$SUPABASE_URL" SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
    npx tsx scripts/verify-supabase.ts
  echo ""
fi

echo "Local verify (after exporting env):"
echo "  npm run verify:supabase"
