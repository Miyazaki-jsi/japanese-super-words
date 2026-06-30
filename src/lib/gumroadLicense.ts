import type { UnlockTier } from '@/data/monetization';
import type { UnlockGrant } from '@/lib/verifyUnlockCodes';

type GumroadVerifyResponse = {
  success: boolean;
  message?: string;
  purchase?: {
    refunded?: boolean;
    disputed?: boolean;
    chargebacked?: boolean;
    subscription_cancelled_at?: string | null;
    subscription_ended_at?: string | null;
    product_id?: string;
    permalink?: string;
    seller_id?: string;
  };
};

function parseProductIds(envValue: string | undefined): string[] {
  if (!envValue?.trim()) return [];
  return envValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function getTripProductIds(): string[] {
  return parseProductIds(process.env.GUMROAD_TRIP_PRODUCT_IDS);
}

function getProProductIds(): string[] {
  return parseProductIds(process.env.GUMROAD_PRO_PRODUCT_IDS);
}

async function verifyGumroadLicenseForProduct(
  productId: string,
  licenseKey: string
): Promise<GumroadVerifyResponse | null> {
  const body = new URLSearchParams({
    license_key: licenseKey,
    increment_uses_count: 'false',
  });

  // Gumroad accepts product_id or product_permalink (short slug like gxmbiol).
  if (productId.includes('=') || productId.length > 24) {
    body.set('product_id', productId);
  } else {
    body.set('product_permalink', productId);
  }

  try {
    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) return null;
    return (await res.json()) as GumroadVerifyResponse;
  } catch {
    return null;
  }
}

function isPurchaseActive(purchase: GumroadVerifyResponse['purchase']): boolean {
  if (!purchase) return false;
  if (purchase.refunded || purchase.disputed || purchase.chargebacked) return false;
  if (purchase.subscription_cancelled_at || purchase.subscription_ended_at) return false;
  return true;
}

/** Verify a Gumroad-issued license key against Trip / Pro product IDs. */
export async function verifyGumroadLicense(licenseKey: string): Promise<UnlockGrant | null> {
  const trimmed = licenseKey.trim();
  if (!trimmed) return null;

  for (const productId of getProProductIds()) {
    const result = await verifyGumroadLicenseForProduct(productId, trimmed);
    if (result?.success && isPurchaseActive(result.purchase)) {
      return { kind: 'tier', tier: 'pro' };
    }
  }

  for (const productId of getTripProductIds()) {
    const result = await verifyGumroadLicenseForProduct(productId, trimmed);
    if (result?.success && isPurchaseActive(result.purchase)) {
      return { kind: 'tier', tier: 'trip' };
    }
  }

  return null;
}

export function isGumroadLicenseVerifyConfigured(): boolean {
  return getTripProductIds().length > 0 || getProProductIds().length > 0;
}

export function getConfiguredGumroadProductCounts(): { trip: number; pro: number } {
  return { trip: getTripProductIds().length, pro: getProProductIds().length };
}

export type GumroadTier = UnlockTier;
