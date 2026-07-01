/** Post-process VOICEVOX AudioQuery for more natural conversational speech. */

type Mora = {
  text: string;
  consonant: string | null;
  consonant_length: number | null;
  vowel: string;
  vowel_length: number;
  pitch: number;
};

type AccentPhrase = {
  moras: Mora[];
  accent: number;
  pause_mora: Mora | null;
  is_interrogative: boolean;
};

export type VoicevoxAudioQuery = {
  accent_phrases: AccentPhrase[];
  speedScale?: number;
  pitchScale?: number;
  intonationScale?: number;
  volumeScale?: number;
  prePhonemeLength?: number;
  postPhonemeLength?: number;
  pauseLength?: number | null;
  pauseLengthScale?: number;
  outputSamplingRate?: number;
  outputStereo?: boolean;
  kana?: string;
};

const CONVERSATIONAL_WO_CARD_IDS = new Set([
  'r16',
  'r17',
  'su19',
  'dq20',
  'lnb17',
]);

export function shouldApplyConversationalWoPatch(text: string, cardId?: string): boolean {
  if (cardId && CONVERSATIONAL_WO_CARD_IDS.has(cardId)) return true;
  return /を.*(おねがい|お願い)/.test(text);
}

export async function fetchAccentPhrases(
  baseUrl: string,
  speaker: number,
  text: string
): Promise<AccentPhrase[]> {
  const params = new URLSearchParams({
    speaker: String(speaker),
    text,
    is_kana: 'false',
  });
  const res = await fetch(`${baseUrl}/accent_phrases?${params.toString()}`, {
    method: 'POST',
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`accent_phrases failed (${res.status})`);
  }
  return (await res.json()) as AccentPhrase[];
}

/** Split at the first を and merge per-part accent phrases for natural particle pronunciation. */
export async function buildConversationalWoQuery(
  baseUrl: string,
  speaker: number,
  text: string,
  baseQuery: VoicevoxAudioQuery
): Promise<VoicevoxAudioQuery> {
  const woIndex = text.indexOf('を');
  if (woIndex === -1) return baseQuery;

  const parts = [text.slice(0, woIndex), 'を', text.slice(woIndex + 1)];
  const accentPhrases: AccentPhrase[] = [];
  for (const part of parts) {
    if (!part) continue;
    accentPhrases.push(...(await fetchAccentPhrases(baseUrl, speaker, part)));
  }

  return {
    ...baseQuery,
    accent_phrases: accentPhrases,
    speedScale: 0.94,
    intonationScale: 1.05,
    prePhonemeLength: 0.05,
    postPhonemeLength: 0.08,
  };
}
