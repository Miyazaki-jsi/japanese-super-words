#!/usr/bin/env bash
# Configure Gumroad webhooks + product delivery for Japanese Super Words.
#
# Prerequisites:
#   export GUMROAD_ACCESS_TOKEN="..."  # https://app.gumroad.com/settings/advanced
#
# Usage:
#   bash scripts/setup-gumroad.sh

set -euo pipefail

APP_URL="${APP_URL:-https://japanese-super-words.vercel.app}"
WEBHOOK_URL="${APP_URL}/api/webhooks/gumroad"
TRIP_PERMALINK="${GUMROAD_TRIP_PRODUCT_IDS:-gxmbiol}"
PRO_PERMALINK="${GUMROAD_PRO_PRODUCT_IDS:-cspei}"
TRIP_CODE="${TRIP_PACK_UNLOCK_CODES:-7trip-jsi}"
PRO_CODE="${JAPAN_PRO_UNLOCK_CODES:-miyatori-pro}"

echo "== Japanese Super Words · Gumroad setup =="
echo "App URL:      $APP_URL"
echo "Webhook URL:  $WEBHOOK_URL"
echo "Trip product: $TRIP_PERMALINK"
echo "Pro product:  $PRO_PERMALINK"
echo ""

if [ -z "${GUMROAD_ACCESS_TOKEN:-}" ]; then
  echo "GUMROAD_ACCESS_TOKEN is not set."
  echo ""
  echo "Manual steps (5 min):"
  echo "1. Trip product → Content URL:"
  echo "   ${APP_URL}/?license_key={license_key}&tier=trip"
  echo "2. Pro product → Content URL:"
  echo "   ${APP_URL}/?license_key={license_key}&tier=pro"
  echo "3. Enable 'Generate a unique license key per sale' on both products"
  echo "4. Add to receipt / content text:"
  echo "   Trip unlock code (shared): $TRIP_CODE"
  echo "   Pro unlock code (shared):  $PRO_CODE"
  echo "5. Settings → Advanced → Webhooks → Ping:"
  echo "   $WEBHOOK_URL"
  echo ""
  echo "6. Vercel → Project → Settings → Environment Variables:"
  echo "   GUMROAD_SELLER_ID=<your seller id from Gumroad Settings → Advanced>"
  echo "   (Required for webhookSellerConfigured + seller verification on POST)"
  echo ""
  echo "Then set Vercel env (if not already):"
  echo "  GUMROAD_TRIP_PRODUCT_IDS=$TRIP_PERMALINK"
  echo "  GUMROAD_PRO_PRODUCT_IDS=$PRO_PERMALINK"
  exit 0
fi

gumroad_api() {
  local method="$1"
  local path="$2"
  shift 2
  curl -sf -X "$method" "https://api.gumroad.com/v2${path}" \
    -d "access_token=${GUMROAD_ACCESS_TOKEN}" \
    "$@"
}

fetch_seller_id() {
  gumroad_api GET /user | python3 -c "
import json, sys
data = json.load(sys.stdin)
user = data.get('user') or {}
print(user.get('user_id') or user.get('id') or '')
"
}

list_webhooks() {
  gumroad_api GET /resource_subscriptions | python3 -c "
import json, sys
data = json.load(sys.stdin)
for sub in data.get('resource_subscriptions', []):
    print(f\"  {sub.get('resource_name')}: {sub.get('post_url')}\")
"
}

register_webhook() {
  local resource="$1"
  echo "Registering webhook: $resource → $WEBHOOK_URL"
  gumroad_api PUT /resource_subscriptions \
    -d "resource_name=${resource}" \
    -d "post_url=${WEBHOOK_URL}" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('  ok:', d.get('success', False))"
}

echo "Fetching Gumroad seller ID..."
SELLER_ID="$(fetch_seller_id)"
if [ -n "$SELLER_ID" ]; then
  echo "  seller_id: $SELLER_ID"
  echo ""
  echo "Add to Vercel (Production + Preview):"
  echo "  GUMROAD_SELLER_ID=$SELLER_ID"
  echo ""
else
  echo "  (could not read seller_id — set GUMROAD_SELLER_ID manually from Gumroad Settings → Advanced)"
  echo ""
fi

echo "Current webhook subscriptions:"
list_webhooks || echo "  (none or API error)"
echo ""

echo "Registering sale + refund webhooks..."
register_webhook sale
register_webhook refund

echo ""
echo "Products on your Gumroad account:"
gumroad_api GET /products | python3 - <<'PY'
import json, sys
data = json.load(sys.stdin)
for p in data.get("products", []):
    print(f"  - {p.get('name')}  permalink={p.get('custom_permalink')}  id={p.get('id')}")
PY

echo ""
echo "Done. Verify production:"
echo "  curl -s ${APP_URL}/api/monetization/status | python3 -m json.tool"
echo "  curl -s ${APP_URL}/api/webhooks/gumroad"
echo ""
echo "webhookSellerConfigured becomes true after GUMROAD_SELLER_ID is set on Vercel and redeployed."
