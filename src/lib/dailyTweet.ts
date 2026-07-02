import { sampleWords, type WordCard } from '@/data/words';
import { pickTemplateIdForDay } from '@/lib/dailyTweetLearning';
import { getTweetTemplate, type TweetTemplateId } from '@/lib/dailyTweetTemplates';

const TWITTER_URL_CHARS = 23;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function dayKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

/** X Premium / long-form limit (default 2500). Set X_TWEET_MAX_CHARS on Vercel. */
export function getMaxTweetChars(): number {
  const raw = process.env.X_TWEET_MAX_CHARS?.trim();
  const parsed = raw ? Number(raw) : 2500;
  if (!Number.isFinite(parsed)) return 2500;
  return Math.max(280, Math.min(parsed, 25_000));
}

/** Deterministic phrase for a calendar day (UTC). Same day → same phrase. */
export function pickDailyPhrase(date = new Date()): WordCard {
  const eligible = sampleWords.filter(
    (card) =>
      card.japanese.length <= 48 &&
      card.english.length <= 100 &&
      !card.japanese.includes('\n'),
  );

  if (eligible.length === 0) {
    return sampleWords[0];
  }

  const key = dayKey(date);
  return eligible[hashString(key) % eligible.length];
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

export function tweetCharCount(text: string): number {
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
  while (lines.length > 4 && tweetCharCount(lines.join('\n')) > maxChars) {
    lines.splice(Math.floor(lines.length / 2), 1);
  }

  let result = lines.join('\n');
  while (tweetCharCount(result) > maxChars && result.length > 0) {
    result = result.slice(0, -1);
  }
  return result.trimEnd();
}

export async function buildDailyTweetText(
  card: WordCard,
  appBaseUrl: string,
  date = new Date(),
): Promise<{
  text: string;
  link: string;
  templateId: TweetTemplateId;
  charCount: number;
}> {
  const key = dayKey(date);
  const link = buildPhraseDeepLink(card, appBaseUrl);
  const templateId = await pickTemplateIdForDay(`${key}:${card.id}`);
  const template = getTweetTemplate(templateId);
  const maxChars = getMaxTweetChars();

  let text = template.build({ card, link });
  if (tweetCharCount(text) > maxChars) {
    text = truncateForTwitter(text, maxChars);
  }

  return {
    text,
    link,
    templateId,
    charCount: text.length,
  };
}

export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;

  return 'https://japanese-super-words.vercel.app';
}

// Sync preview helper (no DB learning weights)
export function buildDailyTweetTextSync(
  card: WordCard,
  appBaseUrl: string,
  templateId: TweetTemplateId,
): string {
  const template = getTweetTemplate(templateId);
  const link = buildPhraseDeepLink(card, appBaseUrl);
  const maxChars = getMaxTweetChars();
  let text = template.build({ card, link });
  if (tweetCharCount(text) > maxChars) {
    text = truncateForTwitter(text, maxChars);
  }
  return text;
}
