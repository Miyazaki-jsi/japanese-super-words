import type { MiniPackId } from '@/data/miniPacks';
import { JAPAN_PRO_GUMROAD_URL } from '@/data/monetization';
import {
  JAPAN_PRO_UNLOCK_STORAGE_KEY,
  LEGACY_PREMIUM_STORAGE_KEY,
  type UnlockTier,
} from '@/data/monetization';
import { getMiniPackCompletedKey, getMiniPackStorageKey } from '@/data/miniPacks';

export type { UnlockTier };

export const MINI_PACK_GUMROAD_URLS: Record<MiniPackId, string> = {
  hatsumode:
    process.env.NEXT_PUBLIC_HATSUMODE_GUMROAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MINI_PACK_GUMROAD_URL?.trim() ||
    '',
  arrival_24h:
    process.env.NEXT_PUBLIC_ARRIVAL_24H_GUMROAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MINI_PACK_GUMROAD_URL?.trim() ||
    '',
  night_japan:
    process.env.NEXT_PUBLIC_NIGHT_JAPAN_GUMROAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MINI_PACK_GUMROAD_URL?.trim() ||
    '',
  foodie:
    process.env.NEXT_PUBLIC_FOODIE_GUMROAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MINI_PACK_GUMROAD_URL?.trim() ||
    '',
  onsen_intro:
    process.env.NEXT_PUBLIC_ONSEN_INTRO_GUMROAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MINI_PACK_GUMROAD_URL?.trim() ||
    '',
  trouble_survival:
    process.env.NEXT_PUBLIC_TROUBLE_SURVIVAL_GUMROAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MINI_PACK_GUMROAD_URL?.trim() ||
    '',
};

export function getMiniPackGumroadUrl(packId: MiniPackId): string {
  return MINI_PACK_GUMROAD_URLS[packId] || JAPAN_PRO_GUMROAD_URL;
}

function readJapanProUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem(JAPAN_PRO_UNLOCK_STORAGE_KEY) === 'true' ||
    localStorage.getItem(LEGACY_PREMIUM_STORAGE_KEY) === 'true'
  );
}

export function readMiniPackUnlocked(packId: MiniPackId): boolean {
  if (typeof window === 'undefined') return false;
  if (readJapanProUnlocked()) return true;
  return localStorage.getItem(getMiniPackStorageKey(packId)) === 'true';
}

export function saveMiniPackUnlock(packId: MiniPackId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getMiniPackStorageKey(packId), 'true');
}

export function clearAllMiniPackUnlocks(): void {
  if (typeof window === 'undefined') return;
  const ids: MiniPackId[] = [
    'hatsumode',
    'arrival_24h',
    'night_japan',
    'foodie',
    'onsen_intro',
    'trouble_survival',
  ];
  ids.forEach((id) => {
    localStorage.removeItem(getMiniPackStorageKey(id));
    localStorage.removeItem(getMiniPackCompletedKey(id));
  });
}
