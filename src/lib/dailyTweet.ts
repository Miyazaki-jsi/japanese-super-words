import { sampleWords, type WordCard, type SituationId } from '@/data/words';
import { getSituationLabel } from '@/data/situationLabels';

const TWITTER_URL_CHARS = 23;
const MAX_TWEET_CHARS = 280;

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

/** Deterministic phrase for a calendar day (UTC). Same day → same phrase. */
export function pickDailyPhrase(date = new Date()): WordCard {
  const eligible = sampleWords.filter(
    (card) =>
      card.japanese.length <= 40 &&
      card.english.length <= 80 &&
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
  while (lines.length > 2 && tweetCharCount(lines.join('\n')) > maxChars) {
    lines.splice(1, 1);
  }

  let result = lines.join('\n');
  while (tweetCharCount(result) > maxChars && result.length > 0) {
    result = result.slice(0, -1);
  }
  return result.trimEnd();
}

function isQuestionPhrase(card: WordCard): boolean {
  return card.japanese.includes('？') || card.japanese.includes('?');
}

const SITUATION_HOOKS: Partial<Record<SituationId, string[]>> = {
  ramen_shop: [
    'You point at the menu. Staff waits. This line saves the moment:',
    'Ramen shops move fast — memorize this before you land:',
  ],
  convenience_store: [
    'Konbini staff talk quick. This phrase is your lifeline:',
    "You'll use this at every Lawson / 7-Eleven / FamilyMart:",
  ],
  train_station: [
    'Stations are loud and rushed. Keep this ready:',
    'Miss this phrase and you might board the wrong train:',
  ],
  izakaya: [
    'Izakaya nights get chaotic. This helps you order like a local:',
    'After a long day of sightseeing, you’ll want this at the counter:',
  ],
  hotel: [
    'Check-in time. Jet-lagged. This line makes it smooth:',
    'Hotel front desks love polite, short Japanese — try this:',
  ],
  airport_immigration: [
    'Immigration officers ask fast questions. Have this ready:',
    'First minutes in Japan — this phrase comes up a lot:',
  ],
  taxi: [
    'Taxi drivers appreciate clear, simple Japanese:',
    'Late night, tired, trying to get home — say this:',
  ],
  onsen: [
    'Onsen etiquette is real. This phrase helps you not mess up:',
    'Before you soak, you’ll probably need this line:',
  ],
  lost_emergency: [
    'Hope you never need it — but save this just in case:',
    'Lost wallet / phone panic mode? Start with this:',
  ],
  koban: [
    'At a koban (police box), simple Japanese goes a long way:',
    'If something goes wrong in Japan, this is a good opener:',
  ],
  sushi_shop: [
    'Sushi counters are intimate — short phrases work best:',
    'Omakase nerves? This line keeps things moving:',
  ],
  pharmacy: [
    'Pharmacy runs are stressful abroad. This helps:',
    'When you need medicine and charades aren’t working:',
  ],
};

const GENERIC_HOOKS = [
  'Save this for your Japan trip — you’ll actually hear it:',
  'Not textbook Japanese. People say this for real:',
  'Learned Japanese but froze in the moment? Same. Try this:',
  'One line that makes Japan feel less scary:',
  'Bookmark this before your flight:',
];

const SITUATION_TIPS: Partial<Record<SituationId, string>> = {
  ramen_shop: 'Point + this phrase = order done.',
  convenience_store: 'Works even when the cashier speaks fast.',
  train_station: 'Short and clear beats perfect grammar.',
  izakaya: 'Locals use lines like this all night.',
  hotel: 'Polite, simple, effective.',
  airport_immigration: 'Calm tone matters more than fancy words.',
  taxi: 'Say the destination after this if needed.',
  onsen: 'When in doubt, ask politely first.',
};

function pickHook(card: WordCard, key: string): string {
  const hooks = SITUATION_HOOKS[card.situation] ?? GENERIC_HOOKS;
  return hooks[hashString(`${key}:hook`) % hooks.length];
}

function pickCta(key: string): string {
  const ctas = [
    '🔊 Hear it & practice (free):',
    'Tap to hear native-style audio ↓',
    'Practice with audio here ↓',
    'I built an app for moments like this ↓',
  ];
  return ctas[hashString(`${key}:cta`) % ctas.length];
}

type TweetParts = {
  hook: string;
  scene?: string;
  japanese: string;
  subline: string;
  english: string;
  romaji: string;
  tip?: string;
  cta: string;
  link: string;
};

function buildParts(card: WordCard, link: string, key: string): TweetParts {
  const situation = getSituationLabel(card.situation);
  const hook = pickHook(card, key);
  const cta = pickCta(key);
  const tip = SITUATION_TIPS[card.situation];

  const romajiShort = card.romaji.length <= 42 ? card.romaji : '';
  const subline = romajiShort
    ? `"${card.english}" · ${romajiShort}`
    : `"${card.english}"`;

  return {
    hook,
    scene: situation.en,
    japanese: card.japanese,
    subline,
    english: card.english,
    romaji: romajiShort,
    tip,
    cta,
    link,
  };
}

function assemble(styles: ((p: TweetParts) => string)[], parts: TweetParts): string {
  for (const style of styles) {
    const text = style(parts);
    if (tweetCharCount(text) <= MAX_TWEET_CHARS) return text;
  }
  return truncateForTwitter(styles[0](parts), MAX_TWEET_CHARS);
}

const TWEET_STYLES: ((p: TweetParts) => string)[] = [
  // Scenario — mini story
  (p) =>
    [
      p.hook,
      '',
      `「${p.japanese}」`,
      p.subline,
      p.tip ? `💡 ${p.tip}` : '',
      '',
      p.cta,
      p.link,
    ]
      .filter(Boolean)
      .join('\n'),

  // Scene label + question energy
  (p) =>
    [
      `🇯🇵 ${p.scene}`,
      p.hook,
      `「${p.japanese}」`,
      p.subline,
      p.cta,
      p.link,
    ].join('\n'),

  // Conversational / friendly
  (p) =>
    [
      `Japan trip tip 🇯🇵`,
      p.hook,
      '',
      `「${p.japanese}」`,
      `→ ${p.english}${p.romaji ? ` (${p.romaji})` : ''}`,
      p.cta,
      p.link,
    ].join('\n'),

  // Compact punchy
  (p) =>
    [
      p.hook,
      `「${p.japanese}」 = ${p.subline}`,
      p.cta,
      p.link,
    ].join('\n'),
];

function pickStyleOrder(card: WordCard, key: string): ((p: TweetParts) => string)[] {
  const idx = hashString(`${key}:style`) % TWEET_STYLES.length;
  const questionBoost = isQuestionPhrase(card);

  const order = [...TWEET_STYLES.slice(idx), ...TWEET_STYLES.slice(0, idx)];

  if (questionBoost) {
    // Prefer styles that include scene context for questions
    return [order[1], order[0], ...order.slice(2)];
  }

  return order;
}

export function buildDailyTweetText(
  card: WordCard,
  appBaseUrl: string,
  date = new Date(),
): { text: string; link: string; styleIndex: number } {
  const key = dayKey(date);
  const link = buildPhraseDeepLink(card, appBaseUrl);
  const parts = buildParts(card, link, key);
  const styleOrder = pickStyleOrder(card, key);
  const styleIndex = TWEET_STYLES.indexOf(styleOrder[0]);
  const text = assemble(styleOrder, parts);

  return { text, link, styleIndex };
}

export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;

  return 'https://japanese-super-words.vercel.app';
}
