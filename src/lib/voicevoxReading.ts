import type { WordCard } from '@/data/words';

/**
 * VOICEVOX synthesis text overrides for more natural intonation.
 * Display `reading` stays unchanged for learners; only TTS input differs.
 */
const VOICEVOX_READING_OVERRIDES: Record<string, string> = {
  // 食券 — kanji input yields ショッケン' (accent on けん) vs flat ショ'ッケン from hiragana alone
  r3: '食券',
  // Suica is commonly read スイカ; all-hiragana すいか can sound odd / ambiguous
  s41: 'スイカにチャージしたいです。',
  a36: 'ICカード',
};

/** Cards that use japanese (not hiragana reading) + conversational を patch at synthesis time. */
const CONVERSATIONAL_JAPANESE_CARD_IDS = new Set([
  'r16',
  'r17',
  'su19',
  'dq20',
  'lnb17',
]);

/**
 * Cards where an all-hiragana reading makes OpenJTalk misparse topic-marker は
 * as part of an unrelated verb — e.g. "ふくろはいりません" is read as 袋 + 入りません
 * ("doesn't enter", は pronounced "ha") instead of 袋 + は + 要りません
 * ("don't need", は correctly pronounced "wa"). Using the kanji text disambiguates it.
 */
const KANJI_DISAMBIGUATED_CARD_IDS = new Set([
  's20', // 袋は要りません。
  's25', // レシートは要りません。
  's30', // 電子マネーは使えますか？
  's38', // ポイントカードは持っていません。
  's39', // ATMはどこですか？
  's40', // トイレはどこですか？
  's42', // 傘は売っていますか？
  's43', // イートインはできますか？
  's45', // お箸はありますか？
  'a32', // この電車は新宿行きですか？
  'a34', // 乗り換えはどこですか？
  'a35', // 出口はどちらですか？
  'a39', // 窓口はどこですか？
  'a45', // この改札で入れますか？（では→で+入れ）
  'dp26', // 袋は要りません。
  'ry23', // 夕食は何時ですか？
  'ry25', // 大浴場はどこですか？
  'ry30', // チェックアウトは何時ですか？
  'dir2', // 駅はどこですか？
  'dir3', // この辺にコンビニはありますか？
  'dir4', // ここはどこですか？
  'dir24', // トイレはどこですか？
  'dir25', // 出口はどちらですか？
  'dir26', // 入り口はどこですか？
]);

export function getVoicevoxReading(card: Pick<WordCard, 'id' | 'reading' | 'japanese'>): string {
  if (VOICEVOX_READING_OVERRIDES[card.id]) {
    return VOICEVOX_READING_OVERRIDES[card.id];
  }
  if (CONVERSATIONAL_JAPANESE_CARD_IDS.has(card.id) || KANJI_DISAMBIGUATED_CARD_IDS.has(card.id)) {
    return card.japanese;
  }
  return card.reading ?? card.japanese;
}

/**
 * Free-text (trip pack roleplay) synthesis overrides, keyed by the exact
 * all-hiragana `staffReading` string. The hiragana stays unchanged for
 * furigana display (RubyText); only the audio synthesis input is swapped
 * for the kanji version to fix は/topic-marker misparsing (see
 * KANJI_DISAMBIGUATED_CARD_IDS above for the underlying issue).
 */
const VOICEVOX_TEXT_SYNTHESIS_OVERRIDES: Record<string, string> = {
  'れしーとはいりますか？': 'レシートは要りますか？',
};

export function getVoicevoxSynthesisText(text: string): string {
  return VOICEVOX_TEXT_SYNTHESIS_OVERRIDES[text] ?? text;
}
