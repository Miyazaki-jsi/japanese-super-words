import { sampleWords, type WordCard } from '@/data/words';
import {
  APP_BASE_URL,
  LINK_EVERY_N_POSTS,
  TEMPLATE_DEFINITIONS,
  TWEET_MAX_LENGTH,
} from './constants';
import { buildDialogueContext, nuanceLine } from './socialDialogues';
import type { GeneratedTweet, SocialTemplateId } from './types';

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

function linkFooter(link: string): string {
  return `\n\n🔊 Native audio + 1,000+ phrases\n${link}`;
}

function isSaveWorthyPhrase(word: WordCard): boolean {
  const ja = word.japanese.trim();
  if (ja.length < 3) return false;
  return (
    ja.includes('。') ||
    ja.includes('？') ||
    ja.includes('?') ||
    ja.includes('！') ||
    ja.includes('ください') ||
    ja.includes('すみません') ||
    ja.length >= 6
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

/** 会話例 + 話し言葉解説のミニ教科書 */
function renderSaveCard(word: WordCard, link: string | null): string {
  const ctx = buildDialogueContext(word);
  const body = `${ctx.emoji} Mini textbook · ${ctx.sceneEn}

【会話例】
${ctx.dialogue}

【このフレーズ】
「${word.japanese}」
(${word.reading})
→ ${word.english}

【話し言葉メモ】
${ctx.spokenNoteJa}

【使うタイミング】
${ctx.usageTipEn}`;

  return truncateToMax(link ? body + linkFooter(link) : body);
}

/** 場面ストーリー型 */
function renderPhraseNote(word: WordCard, link: string | null): string {
  const ctx = buildDialogueContext(word);
  const body = `${ctx.emoji} Scene: ${ctx.settingLine}

Imagine you're there right now.

${ctx.dialogue}

That line — 「${word.japanese}」 — is what locals actually say.
Not textbook Japanese. Real, usable, right-now Japanese.

${nuanceLine(word)}

🇯🇵 話し言葉ポイント：
${ctx.spokenNoteJa}`;

  return truncateToMax(link ? body + linkFooter(link) : body);
}

/** フレーズ深掘り + 会話 */
function renderQuickTip(word: WordCard, link: string | null): string {
  const ctx = buildDialogueContext(word);
  const body = `🇯🇵 Phrase deep-dive

Target: 「${word.japanese}」
${word.romaji} · ${word.english}

会話でこう使う：
${ctx.dialogue}

ネイティブっぽく言うコツ：
${ctx.spokenNoteJa}

${nuanceLine(word)}

📌 ${ctx.sceneEn} — save this for your trip.`;

  return truncateToMax(link ? body + linkFooter(link) : body);
}

/** 1ページ教科書（いちばん情報量多め） */
function renderSituationBite(word: WordCard, link: string | null): string {
  const ctx = buildDialogueContext(word);
  const body = `${ctx.emoji} 1-page lesson · ${ctx.sceneJa}

① 場面
${ctx.settingLine}

② 会話例
${ctx.dialogue}

③ フレーズ
「${word.japanese}」
${word.reading} / ${word.romaji}
= ${word.english}

④ 話し言葉解説
${ctx.spokenNoteJa}

⑤ When to use
${ctx.usageTipEn}

💡 Bookmark this — one phrase, one real Japan moment.`;

  return truncateToMax(link ? body + linkFooter(link) : body);
}

export function buildTweet(
  templateId: SocialTemplateId,
  word: WordCard,
  options?: { includeLink?: boolean }
): GeneratedTweet {
  const includeLink = options?.includeLink ?? false;
  const linkUrl = includeLink ? buildAppLink(word.situation, templateId, word.id) : '';

  const renderers: Record<SocialTemplateId, (w: WordCard, l: string | null) => string> = {
    save_card: renderSaveCard,
    phrase_note: renderPhraseNote,
    quick_tip: renderQuickTip,
    situation_bite: renderSituationBite,
  };

  const tweetText = renderers[templateId](word, includeLink ? linkUrl : null);
  return {
    templateId,
    wordId: word.id,
    situation: word.situation,
    tweetText,
    linkUrl,
  };
}

export function previewAllTemplates(word: WordCard, includeLink = true): GeneratedTweet[] {
  const ids: SocialTemplateId[] = ['save_card', 'phrase_note', 'quick_tip', 'situation_bite'];
  return ids.map((templateId) => buildTweet(templateId, word, { includeLink }));
}
