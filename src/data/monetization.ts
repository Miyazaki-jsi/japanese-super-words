import { tripPackDays } from './tripPack';
import { allPremiumSituations } from './premiumSituations';
import { miniPacks } from './miniPacks';
import { sampleWords } from './words';

export const TRIP_PACK_UNLOCK_STORAGE_KEY = 'japanese-super-words-trip-pack-unlocked';
export const JAPAN_PRO_UNLOCK_STORAGE_KEY = 'japanese-super-words-japan-pro-unlocked';
export const LEGACY_PREMIUM_STORAGE_KEY = 'japanese-super-words-premium';

export const TRIP_PACK_FREE_DAY_MAX = 1;

export const TRIP_PACK_PRICE_USD = '$6.99';
export const TRIP_PACK_PRICE_JPY_NOTE = '≈ ¥1,000';
export const JAPAN_PRO_PRICE_USD = '$12.99';
export const JAPAN_PRO_PRICE_JPY_NOTE = '≈ ¥2,000';
export const JAPAN_PRO_UPSELL_NOTE = '+$6 vs Trip Course';

export const TRIP_PACK_GUMROAD_URL =
  process.env.NEXT_PUBLIC_TRIP_PACK_GUMROAD_URL?.trim() || '';

export const JAPAN_PRO_GUMROAD_URL =
  process.env.NEXT_PUBLIC_JAPAN_PRO_GUMROAD_URL?.trim() ||
  process.env.NEXT_PUBLIC_TRIP_PACK_GUMROAD_URL?.trim() ||
  '';

export type UnlockTier = 'trip' | 'pro';

export function readTripPackUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem(TRIP_PACK_UNLOCK_STORAGE_KEY) === 'true' ||
    readJapanProUnlocked()
  );
}

export function readJapanProUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem(JAPAN_PRO_UNLOCK_STORAGE_KEY) === 'true' ||
    localStorage.getItem(LEGACY_PREMIUM_STORAGE_KEY) === 'true'
  );
}

/** Premium situations + SUPER TEST full word pool */
export function readPremiumUnlocked(): boolean {
  return readJapanProUnlocked();
}

export function saveUnlockTier(tier: UnlockTier): void {
  if (typeof window === 'undefined') return;
  if (tier === 'pro') {
    localStorage.setItem(JAPAN_PRO_UNLOCK_STORAGE_KEY, 'true');
    localStorage.setItem(TRIP_PACK_UNLOCK_STORAGE_KEY, 'true');
    localStorage.setItem(LEGACY_PREMIUM_STORAGE_KEY, 'true');
    return;
  }
  localStorage.setItem(TRIP_PACK_UNLOCK_STORAGE_KEY, 'true');
}

export function clearAllUnlocks(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRIP_PACK_UNLOCK_STORAGE_KEY);
  localStorage.removeItem(JAPAN_PRO_UNLOCK_STORAGE_KEY);
  localStorage.removeItem(LEGACY_PREMIUM_STORAGE_KEY);
}

export function canAccessTripPackDay(dayNumber: number, isUnlocked?: boolean): boolean {
  const unlocked = isUnlocked ?? readTripPackUnlocked();
  return unlocked || dayNumber <= TRIP_PACK_FREE_DAY_MAX;
}

export function getJapanProPhraseCount(): number {
  const ids = new Set<string>();
  for (const day of tripPackDays) {
    for (const id of day.wordIds) ids.add(id);
  }
  for (const pack of miniPacks) {
    for (const id of pack.wordIds) ids.add(id);
  }
  const premiumSituationIds = new Set(allPremiumSituations.map((situation) => situation.id));
  for (const word of sampleWords) {
    if (premiumSituationIds.has(word.situation)) ids.add(word.id);
  }
  return ids.size;
}
