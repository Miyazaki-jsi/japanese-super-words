#!/usr/bin/env bash
# Fully provision Supabase + Vercel admin env (one command when tokens are set).
#
# Required:
#   export SUPABASE_ACCESS_TOKEN="sbp_..."   # https://supabase.com/dashboard/account/tokens
#   export VERCEL_TOKEN="..."                # https://vercel.com/account/tokens
#
# Optional:
#   VERCEL_PROJECT=japanese-super-words
#   VERCEL_TEAM_ID=...                       # if project is under a team
#   SUPABASE_PROJECT_NAME=jsw-analytics
#   SUPABASE_REGION=ap-northeast-1
#   ADMIN_PASSWORD=...                       # auto-generated if unset
#   ADMIN_SESSION_SECRET=...                 # auto-generated if unset
#   SKIP_SUPABASE_CREATE=1                   # use existing SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
#
# Usage:
#   bash scripts/provision-admin.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ] && [ -z "${SUPABASE_URL:-}" ]; then
  echo "ERROR: Set SUPABASE_ACCESS_TOKEN (or existing SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY with SKIP_SUPABASE_CREATE=1)."
  echo "  Supabase token: https://supabase.com/dashboard/account/tokens"
  exit 1
fi

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "ERROR: Set VERCEL_TOKEN to push env vars to Vercel."
  echo "  Vercel token: https://vercel.com/account/tokens (scope: project env vars)"
  exit 1
fi

exec npx tsx scripts/provision-admin.ts
