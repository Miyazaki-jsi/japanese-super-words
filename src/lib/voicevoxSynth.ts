/** Server-side VOICEVOX HTTP engine client (local VOICEVOX app or voicevox_engine). */

import {
  buildConversationalWoQuery,
  shouldApplyConversationalWoPatch,
  type VoicevoxAudioQuery,
} from '@/lib/voicevoxQueryPatch';

const DEFAULT_VOICEVOX_URL = 'http://127.0.0.1:50021';
/** 春日部つむぎ ノーマル — clear, natural tone for phrase learning */
const DEFAULT_SPEAKER = 8;
const REQUEST_TIMEOUT_MS = 15_000;

async function fetchWithTimeout(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export type SynthesizeVoicevoxOptions = {
  cardId?: string;
};

export async function synthesizeVoicevoxWav(
  text: string,
  options?: SynthesizeVoicevoxOptions
): Promise<ArrayBuffer | null> {
  const baseUrl = process.env.VOICEVOX_URL ?? DEFAULT_VOICEVOX_URL;
  const speaker = Number(process.env.VOICEVOX_SPEAKER ?? DEFAULT_SPEAKER);

  try {
    const queryParams = new URLSearchParams({
      text,
      speaker: String(speaker),
    });
    const queryRes = await fetchWithTimeout(
      `${baseUrl}/audio_query?${queryParams.toString()}`,
      { method: 'POST' }
    );
    if (!queryRes.ok) return null;

    let query = (await queryRes.json()) as VoicevoxAudioQuery;
    if (shouldApplyConversationalWoPatch(text, options?.cardId)) {
      query = await buildConversationalWoQuery(baseUrl, speaker, text, query);
    } else {
      query.speedScale = 0.92;
    }

    const synthRes = await fetchWithTimeout(`${baseUrl}/synthesis?speaker=${speaker}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    if (!synthRes.ok) return null;

    return await synthRes.arrayBuffer();
  } catch {
    return null;
  }
}
