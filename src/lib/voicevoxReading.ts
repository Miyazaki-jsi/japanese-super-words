import type { WordCard } from '@/data/words';

/**
 * VOICEVOX synthesis text overrides for more natural intonation.
 * Display `reading` stays unchanged for learners; only TTS input differs.
 */
const VOICEVOX_READING_OVERRIDES: Record<string, string> = {
  // 食券 — kanji input yields ショッケン' (accent on けん) vs flat ショ'ッケン from hiragana alone
  r3: '食券',
};

/** Cards that use japanese (not hiragana reading) + conversational を patch at synthesis time. */
const CONVERSATIONAL_JAPANESE_CARD_IDS = new Set([
  'r16',
  'r17',
  'su19',
  'dq20',
  'lnb17',
]);

export function getVoicevoxReading(card: Pick<WordCard, 'id' | 'reading' | 'japanese'>): string {
  if (VOICEVOX_READING_OVERRIDES[card.id]) {
    return VOICEVOX_READING_OVERRIDES[card.id];
  }
  if (CONVERSATIONAL_JAPANESE_CARD_IDS.has(card.id)) {
    return card.japanese;
  }
  return card.reading ?? card.japanese;
}
