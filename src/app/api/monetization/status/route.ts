import { NextResponse } from 'next/server';

/** Public readiness check — booleans/counts only, no secrets exposed. */
export async function GET() {
  const tripUrl = process.env.NEXT_PUBLIC_TRIP_PACK_GUMROAD_URL?.trim() ?? '';
  const proUrl = process.env.NEXT_PUBLIC_JAPAN_PRO_GUMROAD_URL?.trim() ?? '';
  const tripCodes = process.env.TRIP_PACK_UNLOCK_CODES?.trim() ?? '';
  const proCodes = process.env.JAPAN_PRO_UNLOCK_CODES?.trim() ?? '';

  const countCodes = (raw: string) =>
    raw ? raw.split(',').map((c) => c.trim()).filter(Boolean).length : 0;

  return NextResponse.json({
    ok: true,
    gumroad: {
      tripUrlConfigured: tripUrl.length > 0,
      proUrlConfigured: proUrl.length > 0,
    },
    unlockCodes: {
      tripCount: countCodes(tripCodes),
      proCount: countCodes(proCodes),
    },
    readyForPaidLaunch:
      tripUrl.length > 0 &&
      proUrl.length > 0 &&
      countCodes(tripCodes) > 0 &&
      countCodes(proCodes) > 0,
  });
}
