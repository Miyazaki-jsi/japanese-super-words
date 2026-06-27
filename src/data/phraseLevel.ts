import type { LucideIcon } from 'lucide-react';
import { Compass, Footprints, MapPinned, Mountain, Plane, Sprout } from 'lucide-react';
import { phraseCheckGrammarQuestions } from './phraseCheckGrammar';
import type { SituationId, WordCard } from './words';

export const PHRASE_LEVEL_STORAGE_KEY = 'japanese-super-words-phrase-level';
export const PHRASE_CHECK_QUESTION_COUNT = 20;
export const PHRASE_CHECK_PER_TYPE = 5;

export type PhraseCheckQuestionKind = 'vocab' | 'kanji' | 'grammar' | 'listening';

export const PHRASE_CHECK_KIND_LABELS: Record<
  PhraseCheckQuestionKind,
  { en: string; ja: string }
> = {
  vocab: { en: 'Vocabulary', ja: '語彙' },
  kanji: { en: 'Kanji', ja: '漢字' },
  grammar: { en: 'Grammar', ja: '文法' },
  listening: { en: 'Listening', ja: 'リスニング' },
};

export const PHRASE_CHECK_PROMPTS: Record<
  PhraseCheckQuestionKind,
  { en: string; ja: string }
> = {
  vocab: { en: 'What does this mean?', ja: '意味は？' },
  kanji: { en: 'What is the reading?', ja: '読み方は？' },
  grammar: { en: 'Fill in the blank', ja: '空欄に入るのは？' },
  listening: { en: 'Listen and choose the meaning', ja: '聞いて意味を選んで' },
};

export type PhraseLevelId = 1 | 2 | 3 | 4 | 5 | 6;

export type PhraseLevelMeta = {
  id: PhraseLevelId;
  enName: string;
  jaName: string;
  icon: LucideIcon;
  minPercent: number;
  gradient: string;
  ring: string;
  iconBg: string;
  iconColor: string;
  taglineEn: string;
  taglineJa: string;
};

export type SavedPhraseLevel = {
  levelId: PhraseLevelId;
  bestPercent: number;
  bestScore: number;
  bestTotal: number;
  updatedAt: string;
};

export type PhraseCheckQuestion = {
  kind: PhraseCheckQuestionKind;
  card?: WordCard;
  situationId?: SituationId;
  grammarId?: string;
  sentenceBefore?: string;
  sentenceAfter?: string;
  choices: string[];
  correctIndex: number;
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function hasKanji(text: string): boolean {
  return /[\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
}

function pickUniqueCards(pool: WordCard[], count: number, excludeIds = new Set<string>()): WordCard[] {
  const available = shuffle(pool.filter((card) => !excludeIds.has(card.id)));
  return available.slice(0, count);
}

function buildEnglishChoices(card: WordCard, pool: WordCard[]): { choices: string[]; correctIndex: number } {
  const sameSituation = pool.filter(
    (w) => w.id !== card.id && w.situation === card.situation,
  );
  const distractorSource =
    sameSituation.length >= 2 ? sameSituation : pool.filter((w) => w.id !== card.id);
  const distractors = shuffle(distractorSource).slice(0, 2);
  const choices = shuffle([card.english, ...distractors.map((d) => d.english)]);
  return { choices, correctIndex: choices.indexOf(card.english) };
}

function buildReadingChoices(card: WordCard, pool: WordCard[]): { choices: string[]; correctIndex: number } | null {
  if (!hasKanji(card.japanese)) return null;
  const others = pool.filter((w) => w.id !== card.id && w.reading !== card.reading);
  if (others.length < 2) return null;
  const distractors = shuffle(others).slice(0, 2);
  const choices = shuffle([card.reading, ...distractors.map((d) => d.reading)]);
  return { choices, correctIndex: choices.indexOf(card.reading) };
}

function buildVocabQuestions(pool: WordCard[], count: number): PhraseCheckQuestion[] {
  return pickUniqueCards(pool, count).map((card) => {
    const { choices, correctIndex } = buildEnglishChoices(card, pool);
    return { kind: 'vocab' as const, card, choices, correctIndex };
  });
}

function buildKanjiQuestions(pool: WordCard[], count: number): PhraseCheckQuestion[] {
  const kanjiPool = pool.filter((card) => hasKanji(card.japanese));
  const questions: PhraseCheckQuestion[] = [];
  const usedIds = new Set<string>();

  for (const card of shuffle(kanjiPool)) {
    if (questions.length >= count) break;
    const built = buildReadingChoices(card, kanjiPool);
    if (!built) continue;
    usedIds.add(card.id);
    questions.push({
      kind: 'kanji',
      card,
      choices: built.choices,
      correctIndex: built.correctIndex,
    });
  }

  return questions;
}

function buildListeningQuestions(pool: WordCard[], count: number): PhraseCheckQuestion[] {
  return pickUniqueCards(pool, count).map((card) => {
    const { choices, correctIndex } = buildEnglishChoices(card, pool);
    return { kind: 'listening', card, choices, correctIndex };
  });
}

function buildGrammarQuestions(
  count: number,
  excludeIds = new Set<string>(),
): PhraseCheckQuestion[] {
  const available = shuffle(
    phraseCheckGrammarQuestions.filter((question) => !excludeIds.has(question.id)),
  ).slice(0, count);

  return available.map((question) => {
    const choices = shuffle([question.correct, ...question.distractors]);
    return {
      kind: 'grammar' as const,
      grammarId: question.id,
      situationId: question.situation,
      sentenceBefore: question.sentenceBefore,
      sentenceAfter: question.sentenceAfter,
      choices,
      correctIndex: choices.indexOf(question.correct),
    };
  });
}

export function estimatePhraseCheckQuestionCount(pool: WordCard[]): number {
  const kanjiPool = pool.filter((card) => hasKanji(card.japanese));
  const perType = PHRASE_CHECK_PER_TYPE;
  let total =
    Math.min(perType, pool.length) +
    Math.min(perType, kanjiPool.length) +
    Math.min(perType, pool.length) +
    Math.min(perType, phraseCheckGrammarQuestions.length);

  if (total < PHRASE_CHECK_QUESTION_COUNT) {
    const grammarUsed = Math.min(perType, phraseCheckGrammarQuestions.length);
    total += Math.min(
      PHRASE_CHECK_QUESTION_COUNT - total,
      phraseCheckGrammarQuestions.length - grammarUsed,
    );
  }

  return Math.min(PHRASE_CHECK_QUESTION_COUNT, total);
}

/** Travel-phrase ranks — separate from XP medals (Bronze / Silver / …). */
export const phraseLevels: PhraseLevelMeta[] = [
  {
    id: 1,
    enName: 'First Step',
    jaName: 'はじめの一歩',
    icon: Footprints,
    minPercent: 0,
    gradient: 'from-stone-400 to-stone-500',
    ring: 'ring-stone-200',
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-600',
    taglineEn: 'Just getting started with phrases',
    taglineJa: 'フレーズをこれから増やそう',
  },
  {
    id: 2,
    enName: 'Sprout',
    jaName: '芽生え',
    icon: Sprout,
    minPercent: 20,
    gradient: 'from-lime-500 to-green-600',
    ring: 'ring-lime-200',
    iconBg: 'bg-lime-50',
    iconColor: 'text-lime-700',
    taglineEn: 'A few phrases are sticking',
    taglineJa: '少しずつ覚えてきた',
  },
  {
    id: 3,
    enName: 'Pathfinder',
    jaName: '道しるべ',
    icon: Compass,
    minPercent: 40,
    gradient: 'from-sky-500 to-blue-600',
    ring: 'ring-sky-200',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-700',
    taglineEn: 'Basic travel phrases work',
    taglineJa: '基本フレーズが使える',
  },
  {
    id: 4,
    enName: 'Street Ready',
    jaName: '街で通じる',
    icon: MapPinned,
    minPercent: 55,
    gradient: 'from-violet-500 to-purple-600',
    ring: 'ring-violet-200',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-700',
    taglineEn: 'Comfortable in everyday scenes',
    taglineJa: '日常シーンで困りにくい',
  },
  {
    id: 5,
    enName: 'Trip Ready',
    jaName: '旅行準備OK',
    icon: Plane,
    minPercent: 70,
    gradient: 'from-indigo-500 to-indigo-700',
    ring: 'ring-indigo-200',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-700',
    taglineEn: 'Strong recall for your trip',
    taglineJa: '旅行に自信がついてきた',
  },
  {
    id: 6,
    enName: 'Japan Guide',
    jaName: '案内役クラス',
    icon: Mountain,
    minPercent: 85,
    gradient: 'from-rose-500 via-fuchsia-500 to-violet-600',
    ring: 'ring-fuchsia-200',
    iconBg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-700',
    taglineEn: 'Excellent phrase memory',
    taglineJa: 'フレーズ記憶がとても強い',
  },
];

export function getPhraseLevelById(id: PhraseLevelId): PhraseLevelMeta {
  return phraseLevels.find((l) => l.id === id) ?? phraseLevels[0];
}

export function getPhraseLevelFromPercent(percent: number): PhraseLevelMeta {
  const clamped = Math.max(0, Math.min(100, percent));
  let matched = phraseLevels[0];
  for (const level of phraseLevels) {
    if (clamped >= level.minPercent) matched = level;
  }
  return matched;
}

export function getNextPhraseLevel(current: PhraseLevelMeta): PhraseLevelMeta | null {
  return phraseLevels.find((l) => l.id === current.id + 1) ?? null;
}

export function readSavedPhraseLevel(): SavedPhraseLevel | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PHRASE_LEVEL_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedPhraseLevel;
    if (typeof parsed.levelId === 'number' && parsed.levelId >= 1 && parsed.levelId <= 6) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function savePhraseLevelResult(score: number, total: number): {
  saved: SavedPhraseLevel;
  level: PhraseLevelMeta;
  leveledUp: boolean;
  previousLevelId: PhraseLevelId | null;
} {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const prev = readSavedPhraseLevel();
  const bestPercent = Math.max(prev?.bestPercent ?? 0, percent);
  const bestScore =
    bestPercent === percent ? score : (prev?.bestScore ?? score);
  const bestTotal =
    bestPercent === percent ? total : (prev?.bestTotal ?? total);
  const level = getPhraseLevelFromPercent(bestPercent);
  const saved: SavedPhraseLevel = {
    levelId: level.id,
    bestPercent,
    bestScore,
    bestTotal,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(PHRASE_LEVEL_STORAGE_KEY, JSON.stringify(saved));
  const leveledUp = prev !== null ? level.id > prev.levelId : false;
  return {
    saved,
    level,
    leveledUp,
    previousLevelId: prev?.levelId ?? null,
  };
}

export function buildPhraseCheckQuestions(
  learnedPool: WordCard[],
  fallbackPool: WordCard[],
  maxTotal = PHRASE_CHECK_QUESTION_COUNT,
): PhraseCheckQuestion[] {
  const pool = learnedPool.length >= 3 ? learnedPool : fallbackPool;
  const perType = PHRASE_CHECK_PER_TYPE;

  const vocab = buildVocabQuestions(pool, perType);
  const kanji = buildKanjiQuestions(pool, perType);
  const listening = buildListeningQuestions(pool, perType);
  const grammar = buildGrammarQuestions(perType);

  let questions = shuffle([...vocab, ...kanji, ...listening, ...grammar]);

  if (questions.length < maxTotal) {
    const usedGrammarIds = new Set(
      questions.filter((q) => q.kind === 'grammar').map((q) => q.grammarId!),
    );
    const extraGrammar = buildGrammarQuestions(maxTotal - questions.length, usedGrammarIds);
    questions = shuffle([...questions, ...extraGrammar]);
  }

  return questions.slice(0, maxTotal);
}
