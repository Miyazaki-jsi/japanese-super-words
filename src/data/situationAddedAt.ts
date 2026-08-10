import type { SituationId } from './words';

/** When a situation scene first shipped (YYYY-MM-DD). Only list scenes that need a New badge. */
export const SITUATION_ADDED_AT: Partial<Record<SituationId, string>> = {
  // 2026-08-08
  chou_tsukau: '2026-08-08',
  suki_kirai: '2026-08-08',
  japanese_table: '2026-08-08',
  // 2026-07-18
  asking_for_directions: '2026-07-18',
  // 2026-07-17
  ryokan: '2026-07-17',
  // 2026-07-02 batch
  coin_locker: '2026-07-02',
  vending_machine: '2026-07-02',
  tourist_information: '2026-07-02',
  trash_carry_out: '2026-07-02',
  kaiten_sushi: '2026-07-02',
  post_office: '2026-07-02',
  cabaret_club: '2026-07-02',
  tachinomi: '2026-07-02',
  photo_etiquette: '2026-07-02',
};

/** Days after add date to keep showing New. Default ≈ 2 months. */
export const SITUATION_NEW_WINDOW_DAYS = 60;

export function isSituationNew(
  id: SituationId | string,
  now: Date = new Date(),
  windowDays: number = SITUATION_NEW_WINDOW_DAYS
): boolean {
  const iso = SITUATION_ADDED_AT[id as SituationId];
  if (!iso) return false;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return false;
  const added = new Date(y, m - 1, d);
  const ms = windowDays * 24 * 60 * 60 * 1000;
  return now.getTime() - added.getTime() <= ms && now.getTime() >= added.getTime();
}
