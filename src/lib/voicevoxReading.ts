import type { WordCard } from '@/data/words';

/**
 * VOICEVOX synthesis text overrides for more natural intonation.
 * Display `reading` stays unchanged for learners; only TTS input differs.
 */
const VOICEVOX_READING_OVERRIDES: Record<string, string> = {
  // 食券 — kanji input yields ショッケン' (accent on けん) vs flat ショ'ッケン from hiragana alone
  r3: '食券',
  // Polite requests — ｜ splits を so it is not glued to the noun (オミズオ → オミズ、オ)
  r17: 'お水｜を｜お願いします。',
  r16: 'お会計｜を｜お願いします。',
  su19: 'お会計｜を｜お願いします。',
  dq20: 'お会計｜を｜お願いします。',
  lnb17: 'お会計｜を｜お願いします。',
};

export function getVoicevoxReading(card: Pick<WordCard, 'id' | 'reading' | 'japanese'>): string {
  return VOICEVOX_READING_OVERRIDES[card.id] ?? card.reading ?? card.japanese;
}
