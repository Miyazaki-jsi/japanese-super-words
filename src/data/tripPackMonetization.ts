/** @deprecated Import from `@/data/monetization` instead */
export {
  TRIP_PACK_UNLOCK_STORAGE_KEY,
  TRIP_PACK_FREE_DAY_MAX,
  TRIP_PACK_PRICE_USD,
  TRIP_PACK_PRICE_JPY_NOTE,
  TRIP_PACK_GUMROAD_URL,
  readTripPackUnlocked,
  canAccessTripPackDay,
} from '@/data/monetization';

import { clearAllUnlocks, saveUnlockTier } from '@/data/monetization';

export function saveTripPackUnlocked(): void {
  saveUnlockTier('trip');
}

export function clearTripPackUnlocked(): void {
  clearAllUnlocks();
}

/** @deprecated Use server-side unlock via UnlockModal */
export function verifyTripPackUnlockCode(_code: string): boolean {
  return false;
}
