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
  echo "Then set Vercel env (if not already):"
  echo "  GUMROAD_TRIP_PRODUCT_IDS=$TRIP_PERMALINK"
  echo "  GUMROAD_PRO_PRODUCT_IDS=$PRO_PERMALINK"
  exit 0
fi

register_webhook() {
  local resource="$1"
  echo "Registering webhook: $resource → $WEBHOOK_URL"
  curl -sf -X PUT "https://api.gumroad.com/v2/resource_subscriptions" \
    -d "access_token=${GUMROAD_ACCESS_TOKEN}" \
    -d "resource_name=${resource}" \
    -d "post_url=${WEBHOOK_URL}" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('  ok:', d.get('success', False))"
}

list_products() {
  curl -sf "https://api.gumroad.com/v2/products?access_token=${GUMROAD_ACCESS_TOKEN}"
}

echo "Registering sale + refund webhooks..."
register_webhook sale
register_webhook refund

echo ""
echo "Products on your Gumroad account:"
list_products | python3 - <<'PY'
import json, sys
data = json.load(sys.stdin)
for p in data.get("products", []):
    print(f"  - {p.get('name')}  permalink={p.get('custom_permalink')}  id={p.get('id')}")
PY

echo ""
echo "Done. Verify:"
echo "  curl -s ${APP_URL}/api/monetization/status"
echo "  curl -s ${APP_URL}/api/webhooks/gumroad"
