import { sampleWords, type WordCard } from '@/data/words';
import { APP_BASE_URL, LINK_EVERY_N_POSTS, TWEET_MAX_LENGTH } from './constants';
import { renderDailyJapaneseLesson } from './socialLessonFormat';
import type { GeneratedTweet, SocialTemplateId } from './types';
import { pickWowPromptForDate, renderWowPromptThread, type WowPrompt } from './wowPrompts';

function buildAppLink(situation: string, templateId: SocialTemplateId, wordId: string): string {
  const url = new URL(APP_BASE_URL);
  url.searchParams.set('situation', situation);
  url.searchParams.set('utm_source', 'x');
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', 'daily_phrase');
  url.searchParams.set('utm_content', `${templateId}_${wordId}`);
  return url.toString();
}

function truncateToMax(text: string, max = TWEET_MAX_LENGTH): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function isSaveWorthyPhrase(word: WordCard): boolean {
  const ja = word.japanese.trim();
  if (ja.length < 4) return false;
  return (
    ja.includes('。') ||
    ja.includes('？') ||
    ja.includes('?') ||
    ja.includes('！') ||
    ja.includes('ください') ||
    ja.includes('すみません') ||
    ja.includes('お願い') ||
    ja.length >= 8
  );
}

export function getSaveWorthyWords(): WordCard[] {
  return sampleWords.filter(isSaveWorthyPhrase);
}

export function pickWordForTweet(recentWordIds: string[]): WordCard {
  const pool = getSaveWorthyWords();
  const recent = new Set(recentWordIds);
  const fresh = pool.filter((word) => !recent.has(word.id));
  const candidates = fresh.length > 0 ? fresh : pool;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] ?? pool[0];
}

export function shouldIncludeAppLink(existingPostCount: number): boolean {
  return (existingPostCount + 1) % LINK_EVERY_N_POSTS === 0;
}

function renderLesson(word: WordCard, link: string | null): string {
  return truncateToMax(renderDailyJapaneseLesson(word, link));
}

export function buildTweet(
  templateId: SocialTemplateId,
  word: WordCard,
  options?: { includeLink?: boolean }
): GeneratedTweet {
  const includeLink = options?.includeLink ?? false;
  const linkUrl = includeLink ? buildAppLink(word.situation, templateId, word.id) : '';
  const tweetText = renderLesson(word, includeLink ? linkUrl : null);

  return {
    templateId,
    wordId: word.id,
    situation: word.situation,
    tweetText,
    linkUrl,
  };
}

export type WowGeneratedTweet = GeneratedTweet & {
  threadReply: string;
  wowPrompt: WowPrompt;
};

/** Wednesday wow-prompt thread (parent + reply with full prompt). */
export function buildWowPromptTweet(
  scheduledFor: string,
  templateId: SocialTemplateId = 'quick_tip'
): WowGeneratedTweet {
  const wowPrompt = pickWowPromptForDate(scheduledFor);
  const thread = renderWowPromptThread(wowPrompt);
  const tweetText = `${thread.parent}

---
REPLY:
${thread.reply}`;

  return {
    templateId,
    wordId: wowPrompt.id,
    situation: 'ai_prompt',
    tweetText,
    linkUrl: '',
    threadReply: thread.reply,
    wowPrompt,
  };
}

export function previewAllTemplates(word: WordCard, includeLink = true): GeneratedTweet[] {
  const ids: SocialTemplateId[] = ['save_card', 'phrase_note', 'quick_tip', 'situation_bite'];
  return ids.map((templateId) => buildTweet(templateId, word, { includeLink }));
}
