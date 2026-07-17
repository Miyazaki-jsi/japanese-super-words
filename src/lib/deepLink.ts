import type { SituationId } from '@/data/words';
import type { MiniPackId } from '@/data/miniPacks';

export type DeepLinkTarget =
  | { type: 'situation'; situationId: SituationId }
  | { type: 'pack'; packId: 'trip' | MiniPackId }
  | { type: 'tab'; tab: 'packs' | 'situations' | 'review' };

export const PENDING_DEEP_LINK_KEY = 'japanese-super-words-pending-deeplink';

const VALID_SITUATIONS = new Set<string>([
  'ramen_shop', 'convenience_store', 'greetings', 'hospital', 'train_station',
  'izakaya', 'sushi_shop', 'koban', 'hotel', 'hangover', 'missed_last_train',
  'festival', 'rainy_day', 'late_night_bar', 'date',
  'sauna', 'don_quijote', 'pharmacy', 'coffee_shop', 'gyudon_shop', 'taxi',
  'coin_laundry', 'luggage_shipping', 'sim_card',
  'airport_immigration', 'ticket_machine', 'onsen', 'karaoke', 'allergies_dietary',
  'lost_emergency', 'shrine_temple', 'hatsumode',
  'restaurant_reservation', 'highway_bus', 'disaster_evacuation',
  'theme_park', 'atm_payments', 'shinkansen', 'ryokan',
  'asking_for_directions',
]);

const VALID_MINI_PACKS = new Set<string>([
  'hatsumode',
  'arrival_24h',
  'night_japan',
  'foodie',
  'onsen_intro',
  'trouble_survival',
]);

export function parseDeepLink(search: string): DeepLinkTarget | null {
  const params = new URLSearchParams(search);

  const situation = params.get('situation');
  if (situation && VALID_SITUATIONS.has(situation)) {
    return { type: 'situation', situationId: situation as SituationId };
  }

  const pack = params.get('pack');
  if (pack === 'trip') return { type: 'pack', packId: 'trip' };
  if (pack && VALID_MINI_PACKS.has(pack)) {
    return { type: 'pack', packId: pack as MiniPackId };
  }

  const tab = params.get('tab');
  if (tab === 'packs' || tab === 'situations' || tab === 'review') {
    return { type: 'tab', tab };
  }

  return null;
}

export function storePendingDeepLink(target: DeepLinkTarget): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(PENDING_DEEP_LINK_KEY, JSON.stringify(target));
  } catch {
    /* ignore */
  }
}

export function readPendingDeepLink(): DeepLinkTarget | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PENDING_DEEP_LINK_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DeepLinkTarget;
  } catch {
    return null;
  }
}

export function clearPendingDeepLink(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_DEEP_LINK_KEY);
}

export function stripDeepLinkParamsFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const keys = ['situation', 'pack', 'tab', 'from', 'utm_source', 'utm_medium', 'utm_campaign', 'video'];
  let changed = false;
  for (const key of keys) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }
}
