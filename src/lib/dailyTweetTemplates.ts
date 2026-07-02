import type { WordCard } from '@/data/words';
import { buildEducationContext } from '@/lib/dailyTweetEducation';

export type TweetTemplateId =
  | 'mini-lesson'
  | 'mistake-vs-natural'
  | 'when-to-use'
  | 'culture-note'
  | 'phrase-breakdown';

export type TweetBuildInput = {
  card: WordCard;
  link: string;
};

export type TweetTemplate = {
  id: TweetTemplateId;
  label: string;
  build: (input: TweetBuildInput) => string;
};

function bullets(lines: string[]): string {
  return lines.map((line) => `• ${line}`).join('\n');
}

export const TWEET_TEMPLATES: TweetTemplate[] = [
  {
    id: 'mini-lesson',
    label: 'Mini lesson (why it works)',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      return [
        '🇯🇵 Useful Japanese for Japan (mini-lesson)',
        '',
        `Situation: ${edu.sceneEn}`,
        '',
        'Phrase:',
        `「${card.japanese}」`,
        card.romaji,
        `→ ${card.english}`,
        '',
        'Why this is useful:',
        bullets(edu.whyBullets),
        '',
        'When to use it:',
        edu.whenToUse,
        edu.mistakeNote ? `\nLearner note:\n${edu.mistakeNote}` : '',
        '',
        '🔊 Practice with natural audio + more phrases from this scene:',
        link,
      ]
        .filter(Boolean)
        .join('\n');
    },
  },
  {
    id: 'mistake-vs-natural',
    label: 'Learner mistake vs natural phrase',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      return [
        '🇯🇵 Japanese learners: this one is worth saving',
        '',
        edu.mistakeNote ??
          'Textbooks teach grammar. Japan runs on short, practical phrases.',
        '',
        `Natural in ${edu.sceneEn}:`,
        `「${card.japanese}」`,
        `(${card.romaji})`,
        `= ${card.english}`,
        '',
        'Why it works:',
        bullets(edu.whyBullets.slice(0, 3)),
        '',
        'Hear it + practice the full scene:',
        link,
      ].join('\n');
    },
  },
  {
    id: 'when-to-use',
    label: 'When to use (scenario)',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      return [
        `🇯🇵 When do you say this in Japan? (${edu.sceneEn})`,
        '',
        edu.whenToUse,
        '',
        'Say:',
        `「${card.japanese}」`,
        card.romaji,
        `(${card.english})`,
        '',
        'Quick tip:',
        edu.whyBullets[0] ?? 'Keep it short. Polite + clear wins.',
        '',
        'Practice with audio + roleplay-style phrases:',
        link,
      ].join('\n');
    },
  },
  {
    id: 'culture-note',
    label: 'Culture + phrase',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      return [
        `🇯🇵 Japan culture note + useful phrase`,
        '',
        edu.cultureNote ??
          `In ${edu.sceneEn.toLowerCase()} settings, short polite Japanese goes a long way.`,
        '',
        'Useful line:',
        `「${card.japanese}」`,
        `→ ${card.english}`,
        '',
        'Breakdown:',
        bullets(edu.whyBullets.slice(0, 3)),
        '',
        'More phrases for this situation (with audio):',
        link,
      ].join('\n');
    },
  },
  {
    id: 'phrase-breakdown',
    label: 'Phrase breakdown',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      const readingNote = card.reading !== card.japanese
        ? `Reading: ${card.reading}`
        : undefined;

      return [
        '🇯🇵 Phrase breakdown (save for your trip)',
        '',
        `「${card.japanese}」`,
        card.romaji,
        readingNote,
        `Meaning: ${card.english}`,
        '',
        'What to notice:',
        bullets(edu.whyBullets),
        '',
        `Context: ${edu.sceneEn}`,
        edu.whenToUse,
        '',
        'Train your ear + practice more from this scene:',
        link,
      ]
        .filter(Boolean)
        .join('\n');
    },
  },
];

export function getTweetTemplate(id: TweetTemplateId): TweetTemplate {
  const found = TWEET_TEMPLATES.find((t) => t.id === id);
  if (!found) return TWEET_TEMPLATES[0];
  return found;
}
