import { voicevoxTextHash } from '@/lib/voicevoxTextHash';

export type SpeakJapaneseOptions = {
  cardId?: string;
  situation?: string;
  /** Browser TTS fallback: pick the best available ja-JP system voice. */
  preferNativeVoice?: boolean;
};

const PREFERRED_JAPANESE_VOICE_NAMES = [
  'kyoko',
  'otoya',
  'nanami',
  'haruka',
  'hattori',
  'google 日本語',
  'microsoft nanami',
  'microsoft haruka',
];

let currentAudio: HTMLAudioElement | null = null;

function stopCurrentAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

function getVoicevoxCardStaticUrl(situation: string, cardId: string): string {
  return `/audio/voicevox/${situation}/${cardId}.wav`;
}

function getVoicevoxTextStaticUrl(text: string): string {
  return `/audio/voicevox/text/${voicevoxTextHash(text)}.wav`;
}

function getVoicevoxCardApiUrl(cardId: string): string {
  return `/api/voicevox/card/${cardId}`;
}

function getVoicevoxTextApiUrl(text: string): string {
  return `/api/voicevox/text/${voicevoxTextHash(text)}`;
}

function tryPlayUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.volume = 1;
    currentAudio = audio;
    let settled = false;
    const timeout = window.setTimeout(() => finish(false), 5_000);

    function finish(played: boolean): void {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      audio.onplaying = null;
      audio.onerror = null;
      audio.onabort = null;
      if (!played) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (!played && currentAudio === audio) currentAudio = null;
      resolve(played);
    }

    audio.onplaying = () => finish(true);
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    audio.onerror = () => finish(false);
    audio.onabort = () => finish(false);
    audio.load();
    void audio.play().then(
      () => undefined,
      () => finish(false)
    );
  });
}

async function playVoicevoxUrls(urls: string[]): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  stopCurrentAudio();
  window.speechSynthesis?.cancel();

  for (const url of urls) {
    if (await tryPlayUrl(url)) return true;
  }
  return false;
}

function isJapaneseVoice(voice: SpeechSynthesisVoice): boolean {
  return voice.lang.toLowerCase().startsWith('ja');
}

function scoreJapaneseVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();

  let score = 0;
  if (lang === 'ja-jp') score += 20;
  else if (lang.startsWith('ja')) score += 10;
  if (voice.localService) score += 5;

  const nameRank = PREFERRED_JAPANESE_VOICE_NAMES.findIndex((preferred) =>
    name.includes(preferred)
  );
  if (nameRank >= 0) score += 100 - nameRank;

  return score;
}

function pickJapaneseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const japaneseVoices = voices.filter(isJapaneseVoice);
  if (japaneseVoices.length === 0) return null;

  return japaneseVoices.reduce((best, voice) =>
    scoreJapaneseVoice(voice) > scoreJapaneseVoice(best) ? voice : best
  );
}

function speakWithBrowserTts(text: string, options?: SpeakJapaneseOptions): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  stopCurrentAudio();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.92;

  if (options?.preferNativeVoice) {
    const voice = pickJapaneseVoice(window.speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}

function speakWithBrowserTtsWhenReady(text: string, options?: SpeakJapaneseOptions): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0 && options?.preferNativeVoice) {
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      speakWithBrowserTts(text, options);
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    return;
  }

  speakWithBrowserTts(text, options);
}

/** VOICEVOX (static/API) with browser TTS fallback. */
export function speakJapanese(text: string, options?: SpeakJapaneseOptions): void {
  const situation = options?.situation;
  const cardId = options?.cardId;

  if (situation && cardId) {
    void playVoicevoxUrls([
      getVoicevoxCardStaticUrl(situation, cardId),
      getVoicevoxCardApiUrl(cardId),
    ]).then((played) => {
      if (!played) speakWithBrowserTtsWhenReady(text, options);
    });
    return;
  }

  void playVoicevoxUrls([
    getVoicevoxTextStaticUrl(text),
    getVoicevoxTextApiUrl(text),
  ]).then((played) => {
    if (!played) speakWithBrowserTtsWhenReady(text, options);
  });
}
