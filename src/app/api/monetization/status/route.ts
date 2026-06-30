import { NextResponse } from 'next/server';
import {
  getConfiguredGumroadProductCounts,
  isGumroadLicenseVerifyConfigured,
} from '@/lib/gumroadLicense';

/** Public readiness check — booleans/counts only, no secrets exposed. */
export async function GET() {
  const tripUrl = process.env.NEXT_PUBLIC_TRIP_PACK_GUMROAD_URL?.trim() ?? '';
  const proUrl = process.env.NEXT_PUBLIC_JAPAN_PRO_GUMROAD_URL?.trim() ?? '';
  const tripCodes = process.env.TRIP_PACK_UNLOCK_CODES?.trim() ?? '';
  const proCodes = process.env.JAPAN_PRO_UNLOCK_CODES?.trim() ?? '';
  const sellerId = process.env.GUMROAD_SELLER_ID?.trim() ?? '';
  const productCounts = getConfiguredGumroadProductCounts();

  const countCodes = (raw: string) =>
    raw ? raw.split(',').map((c) => c.trim()).filter(Boolean).length : 0;

  const gumroadLicenseVerify = isGumroadLicenseVerifyConfigured();

  return NextResponse.json({
    ok: true,
    gumroad: {
      tripUrlConfigured: tripUrl.length > 0,
      proUrlConfigured: proUrl.length > 0,
      webhookSellerConfigured: sellerId.length > 0,
      licenseVerifyConfigured: gumroadLicenseVerify,
      tripProductIds: productCounts.trip,
      proProductIds: productCounts.pro,
    },
    unlockCodes: {
      tripCount: countCodes(tripCodes),
      proCount: countCodes(proCodes),
    },
    readyForPaidLaunch:
      tripUrl.length > 0 &&
      proUrl.length > 0 &&
      (countCodes(tripCodes) > 0 || productCounts.trip > 0) &&
      (countCodes(proCodes) > 0 || productCounts.pro > 0),
  });
}
