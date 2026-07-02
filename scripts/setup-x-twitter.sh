#!/usr/bin/env bash
# Set up daily auto-tweets for Japanese Super Words.
#
# Prerequisites:
#   1. X Developer account: https://developer.x.com/
#   2. Project + App with OAuth 1.0a User authentication
#   3. App permissions: Read and write
#   4. Generate Access Token and Secret (for your @account)
#
# Note: X API posting usually requires a paid API tier (check current pricing).
#
# Usage:
#   bash scripts/setup-x-twitter.sh

set -euo pipefail

APP_URL="${APP_URL:-https://japanese-super-words.vercel.app}"

echo "== Japanese Super Words · Daily X (Twitter) posts =="
echo "App URL:     $APP_URL"
echo "Cron path:   /api/cron/daily-tweet"
echo "Schedule:    0 0 * * * UTC (09:00 Japan time)"
echo ""

echo "Step 1 — X Developer Portal"
echo "  1. https://developer.x.com/ → Projects & Apps"
echo "  2. Create an app (or reuse one)"
echo "  3. User authentication → OAuth 1.0a → Read and write"
echo "  4. Keys and tokens → Generate Access Token and Secret"
echo ""

echo "Step 2 — Vercel environment variables"
echo "  TWITTER_API_KEY=            (Consumer Key / API Key)"
echo "  TWITTER_API_SECRET=         (Consumer Secret)"
echo "  TWITTER_ACCESS_TOKEN=       (for @your_account)"
echo "  TWITTER_ACCESS_TOKEN_SECRET="
echo "  CRON_SECRET=                (openssl rand -base64 32)"
echo "  NEXT_PUBLIC_APP_URL=$APP_URL"
echo ""

echo "Step 3 — Preview (no post)"
echo "  curl -s '${APP_URL}/api/cron/daily-tweet?preview=1' | python3 -m json.tool"
echo ""

echo "Step 4 — Dry run on Vercel (credentials set, no tweet)"
echo "  TWITTER_DRY_RUN=1  → cron returns tweet text without posting"
echo ""

echo "Step 5 — Deploy with vercel.json cron, then check Vercel → Cron Jobs"
echo ""

if command -v openssl >/dev/null 2>&1; then
  echo "Suggested CRON_SECRET:"
  echo "  $(openssl rand -base64 32 | tr -d '\n')"
  echo ""
fi

echo "Local preview:"
echo "  npm run tweet:preview"
