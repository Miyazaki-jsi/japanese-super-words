import { sampleWords, type WordCard } from '@/data/words';
import { getSituationLabel } from '@/data/situationLabels';

const TWITTER_URL_CHARS = 23;
const MAX_TWEET_CHARS = 280;

/** Deterministic phrase for a calendar day (UTC). Same day → same phrase. */
export function pickDailyPhrase(date = new Date()): WordCard {
  const eligible = sampleWords.filter(
    (card) =>
      card.japanese.length <= 36 &&
      card.english.length <= 72 &&
      !card.japanese.includes('\n'),
  );

  if (eligible.length === 0) {
    return sampleWords[0];
  }

  const dayKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
  }

  return eligible[hash % eligible.length];
}

export function buildPhraseDeepLink(
  card: WordCard,
  appBaseUrl: string,
): string {
  const base = appBaseUrl.replace(/\/$/, '');
  const params = new URLSearchParams({
    situation: card.situation,
    utm_source: 'x',
    utm_medium: 'daily',
    utm_campaign: `phrase_${card.id}`,
  });
  return `${base}/?${params.toString()}`;
}

function tweetCharCount(text: string): number {
  const urlPattern = /https?:\/\/\S+/g;
  let count = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlPattern.exec(text)) !== null) {
    count += match.index - lastIndex;
    count += TWITTER_URL_CHARS;
    lastIndex = match.index + match[0].length;
  }

  count += text.length - lastIndex;
  return count;
}

function truncateForTwitter(text: string, maxChars: number): string {
  if (tweetCharCount(text) <= maxChars) return text;

  const lines = text.split('\n');
  while (lines.length > 3 && tweetCharCount(lines.join('\n')) > maxChars) {
    lines.splice(2, 1);
  }

  let result = lines.join('\n');
  while (tweetCharCount(result) > maxChars && result.length > 0) {
    result = result.slice(0, -1);
  }
  return result.trimEnd();
}

export function buildDailyTweetText(
  card: WordCard,
  appBaseUrl: string,
): { text: string; link: string } {
  const situation = getSituationLabel(card.situation);
  const link = buildPhraseDeepLink(card, appBaseUrl);

  const variants = [
    [
      '🇯🇵 Japanese for your Japan trip',
      '',
      `${situation.en}:`,
      `「${card.japanese}」`,
      `"${card.english}"`,
      '',
      '🔊 Practice with audio 👇',
      link,
    ].join('\n'),
    [
      '🇯🇵 Travel Japanese',
      `${situation.en} · 「${card.japanese}」`,
      `"${card.english}"`,
      link,
    ].join('\n'),
    [
      `🇯🇵 ${situation.en}`,
      `「${card.japanese}」 = "${card.english}"`,
      link,
    ].join('\n'),
  ];

  for (const variant of variants) {
    if (tweetCharCount(variant) <= MAX_TWEET_CHARS) {
      return { text: variant, link };
    }
  }

  const fallback = truncateForTwitter(variants[0], MAX_TWEET_CHARS);
  return { text: fallback, link };
}

export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;

  return 'https://japanese-super-words.vercel.app';
}
