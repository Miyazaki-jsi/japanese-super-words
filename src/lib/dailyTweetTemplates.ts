import type { WordCard } from '@/data/words';
import { buildEducationContext } from '@/lib/dailyTweetEducation';

export type TweetTemplateId =
  | 'mini-lesson'
  | 'mistake-vs-natural'
  | 'when-to-use'
  | 'culture-note'
  | 'phrase-breakdown'
  | 'picture-this'
  | 'dont-say-this';

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

function numbered(lines: string[]): string {
  return lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
}

export const TWEET_TEMPLATES: TweetTemplate[] = [
  {
    id: 'picture-this',
    label: 'Real-life scenario (educational story)',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      return [
        '🇯🇵 Picture this in Japan',
        '',
        edu.scenarioStory,
        '',
        'What to say:',
        `「${card.japanese}」`,
        `${card.romaji} → ${card.english}`,
        '',
        'Why this works:',
        edu.rememberThis,
        '',
        edu.nativeTip,
        edu.textbookTrap ? `\nCommon mistake:\n${edu.textbookTrap}` : '',
        '',
        '🔊 Hear natural audio + practice the full scene:',
        link,
      ]
        .filter(Boolean)
        .join('\n');
    },
  },
  {
    id: 'dont-say-this',
    label: 'Textbook trap vs what natives do',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      return [
        '🇯🇵 Japanese learners: save this before your trip',
        '',
        edu.textbookTrap ??
          'Textbooks teach grammar. Japan runs on short, practical phrases.',
        '',
        'Instead, use:',
        `「${card.japanese}」`,
        `(${card.romaji})`,
        `= ${card.english}`,
        '',
        '3 things to remember:',
        numbered([
          edu.rememberThis,
          edu.whenToUse.split('.')[0] ?? edu.whenToUse,
          edu.nativeTip.split('.')[0] ?? edu.nativeTip,
        ]),
        edu.relatedPhrase ? `\nBonus phrase: ${edu.relatedPhrase}` : '',
        '',
        'Practice with audio + more lines from this scene:',
        link,
      ]
        .filter(Boolean)
        .join('\n');
    },
  },
  {
    id: 'mini-lesson',
    label: 'Mini lesson (why it works)',
    build: ({ card, link }) => {
      const edu = buildEducationContext(card);
      return [
        '🇯🇵 Useful Japanese for Japan (mini-lesson)',
        '',
        `Scene: ${edu.sceneEn}`,
        edu.scenarioStory,
        '',
        'Phrase:',
        `「${card.japanese}」`,
        card.romaji,
        `→ ${card.english}`,
        '',
        'Why this is useful:',
        bullets(edu.whyBullets),
        '',
        'Takeaway:',
        edu.rememberThis,
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
        '🇯🇵 This phrase will actually help you in Japan',
        '',
        edu.mistakeNote ??
          edu.textbookTrap ??
          'Many learners study grammar but freeze in real shops and stations.',
        '',
        `Natural in ${edu.sceneEn}:`,
        `「${card.japanese}」`,
        `(${card.romaji})`,
        `= ${card.english}`,
        '',
        'Why it works:',
        bullets(edu.whyBullets.slice(0, 3)),
        '',
        edu.nativeTip,
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
        edu.scenarioStory,
        '',
        edu.whenToUse,
        '',
        'Say:',
        `「${card.japanese}」`,
        card.romaji,
        `(${card.english})`,
        '',
        'Quick takeaway:',
        edu.rememberThis,
        '',
        edu.cultureNote ?? edu.nativeTip,
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
        '🇯🇵 Japan culture note + useful phrase',
        '',
        edu.cultureNote ?? edu.nativeTip,
        '',
        'Useful line:',
        `「${card.japanese}」`,
        `→ ${card.english}`,
        `(${card.romaji})`,
        '',
        'What to notice:',
        bullets(edu.whyBullets.slice(0, 3)),
        '',
        edu.rememberThis,
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
      const readingNote =
        card.reading !== card.japanese ? `Reading: ${card.reading}` : undefined;

      return [
        '🇯🇵 Phrase breakdown (bookmark for your trip)',
        '',
        `「${card.japanese}」`,
        card.romaji,
        readingNote,
        `Meaning: ${card.english}`,
        '',
        'Breakdown:',
        bullets(edu.whyBullets),
        '',
        `Context: ${edu.sceneEn}`,
        edu.whenToUse,
        '',
        'Remember:',
        edu.rememberThis,
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
