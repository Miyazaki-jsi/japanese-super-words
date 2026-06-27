import type { UnlockTier } from '@/data/monetization';

function parseCodeList(envValue: string | undefined): Set<string> {
  if (!envValue?.trim()) return new Set();
  return new Set(
    envValue
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean)
  );
}

const isDev = process.env.NODE_ENV === 'development';

const tripCodes = parseCodeList(process.env.TRIP_PACK_UNLOCK_CODES);
const proCodes = parseCodeList(process.env.JAPAN_PRO_UNLOCK_CODES);

if (isDev) {
  if (tripCodes.size === 0) tripCodes.add('dev-trip');
  if (proCodes.size === 0) proCodes.add('dev-pro');
}

export type UnlockGrant = { kind: 'tier'; tier: UnlockTier };

export function verifyUnlockCodeOnServer(code: string): UnlockGrant | null {
  const normalized = code.trim().toLowerCase();
  if (!normalized) return null;
  if (proCodes.has(normalized)) return { kind: 'tier', tier: 'pro' };
  if (tripCodes.has(normalized)) return { kind: 'tier', tier: 'trip' };
  return null;
}
