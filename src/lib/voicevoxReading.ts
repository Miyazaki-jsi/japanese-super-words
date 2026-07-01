import type { WordCard } from '@/data/words';

/**
 * VOICEVOX synthesis text overrides for more natural intonation.
 * Display `reading` stays unchanged for learners; only TTS input differs.
 */
const VOICEVOX_READING_OVERRIDES: Record<string, string> = {
  // 食券 — kanji input yields ショッケン' (accent on けん) vs flat ショ'ッケン from hiragana alone
  r3: '食券',
  // Polite requests — comma pause avoids を merging into the previous word (オミズオ → オミ'ズ、)
  r17: 'おみず、おねがいします。',
  r16: 'おかいけい、おねがいします。',
  su19: 'おかいけい、おねがいします。',
  dq20: 'おかいけい、おねがいします。',
  lnb17: 'おかいけい、おねがいします。',
};

export function getVoicevoxReading(card: Pick<WordCard, 'id' | 'reading' | 'japanese'>): string {
  return VOICEVOX_READING_OVERRIDES[card.id] ?? card.reading ?? card.japanese;
}
