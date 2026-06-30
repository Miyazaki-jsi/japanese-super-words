'use client';

import { useEffect, useRef } from 'react';
import type { UnlockTier } from '@/data/monetization';
import { saveUnlockTier } from '@/data/monetization';
import { trackEvent } from '@/lib/analytics';
import { verifyUnlockCode } from '@/lib/unlockClient';

export type PurchaseReturnPayload = {
  licenseKey: string;
  tierHint?: UnlockTier;
};

export function readPurchaseReturnFromUrl(): PurchaseReturnPayload | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const licenseKey =
    params.get('license_key')?.trim() ||
    params.get('key')?.trim() ||
    params.get('code')?.trim() ||
    '';

  if (!licenseKey) return null;

  const tierParam = params.get('tier')?.trim().toLowerCase();
  const tierHint = tierParam === 'trip' || tierParam === 'pro' ? tierParam : undefined;

  return { licenseKey, tierHint };
}

export function clearPurchaseReturnParams(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  for (const key of ['license_key', 'key', 'code', 'tier', 'sale_id']) {
    url.searchParams.delete(key);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, '', next);
}

type UsePurchaseReturnUnlockOptions = {
  onUnlocked: (tier: UnlockTier) => void;
  onNeedsManualUnlock?: (payload: PurchaseReturnPayload) => void;
};

/** After Gumroad checkout, auto-unlock when license_key is present in the URL. */
export function usePurchaseReturnUnlock({
  onUnlocked,
  onNeedsManualUnlock,
}: UsePurchaseReturnUnlockOptions): void {
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const payload = readPurchaseReturnFromUrl();
    if (!payload) return;

    handledRef.current = true;
    clearPurchaseReturnParams();

    void verifyUnlockCode(payload.licenseKey).then((result) => {
      if (result.ok) {
        saveUnlockTier(result.tier);
        trackEvent('unlock_success', { tier: result.tier, source: 'gumroad_return' });
        onUnlocked(result.tier);
        return;
      }

      trackEvent('unlock_failed', { source: 'gumroad_return' });
      onNeedsManualUnlock?.(payload);
    });
  }, [onUnlocked, onNeedsManualUnlock]);
}
