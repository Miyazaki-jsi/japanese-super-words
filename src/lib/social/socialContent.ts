import { sampleWords, type WordCard } from '@/data/words';
import { getSituationLabel } from '@/data/situationLabels';
import {
  APP_BASE_URL,
  SCENE_EMOJI,
  SCENE_TIPS,
  TWEET_MAX_LENGTH,
} from './constants';
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

function isSaveWorthyPhrase(word: WordCard): boolean {
  const ja = word.japanese.trim();
  if (ja.length < 4) return false;
  if (/^[ぁ-んァ-ンー]+$/.test(ja) && ja.length < 6) return false;
  return (
    ja.includes('。') ||
    ja.includes('？') ||
    ja.includes('?') ||
    ja.includes('！') ||
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

function sceneLabel(situation: string): { en: string; ja: string; emoji: string; tip: string } {
  const label = getSituationLabel(situation);
  return {
    en: label.en,
    ja: label.ja,
    emoji: SCENE_EMOJI[situation] ?? '🇯🇵',
    tip: SCENE_TIPS[situation] ?? `Useful in ${label.en.toLowerCase()} situations in Japan.`,
  };
}

function renderSaveCard(word: WordCard, link: string): string {
  const scene = sceneLabel(word.situation);
  return truncateToMax(
    `📌 Save this for Japan\n\n${scene.emoji} ${scene.en}\n「${word.japanese}」\n${word.romaji}\n→ ${word.english}\n\n${link}`
  );
}

function renderPhraseNote(word: WordCard, link: string): string {
  const scene = sceneLabel(word.situation);
  return truncateToMax(
    `🇯🇵 Phrase note\n\n「${word.japanese}」\n(${word.reading})\n${word.english}\n\nWhen: ${scene.tip}\n\n${link}`
  );
}

function renderQuickTip(word: WordCard, link: string): string {
  return truncateToMax(
    `Quick Japanese for travelers:\n\nTry saying:\n「${word.japanese}」\n= ${word.english}\n\nTap to hear it in the app 👇\n${link}`
  );
}

function renderSituationBite(word: WordCard, link: string): string {
  const scene = sceneLabel(word.situation);
  return truncateToMax(
    `${scene.emoji} ${scene.en} in Japan\n\nMust-know phrase:\n「${word.japanese}」\n${word.english}\n\n${link}`
  );
}

export function buildTweet(
  templateId: SocialTemplateId,
  word: WordCard
): GeneratedTweet {
  const linkUrl = buildAppLink(word.situation, templateId, word.id);
  const renderers: Record<SocialTemplateId, (w: WordCard, l: string) => string> = {
    save_card: renderSaveCard,
    phrase_note: renderPhraseNote,
    quick_tip: renderQuickTip,
    situation_bite: renderSituationBite,
  };

  const tweetText = renderers[templateId](word, linkUrl);
  return {
    templateId,
    wordId: word.id,
    situation: word.situation,
    tweetText,
    linkUrl,
  };
}

export function previewAllTemplates(word: WordCard): GeneratedTweet[] {
  const ids: SocialTemplateId[] = ['save_card', 'phrase_note', 'quick_tip', 'situation_bite'];
  return ids.map((templateId) => buildTweet(templateId, word));
}
