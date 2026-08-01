import type { WordCard } from '@/data/words';
import { getSituationLabel } from '@/data/situationLabels';

export type VocabPart = { ja: string; reading: string; en: string };

const GLOSSARY: VocabPart[] = [
  { ja: 'にんにく', reading: 'にんにく', en: 'garlic' },
  { ja: 'わさび', reading: 'わさび', en: 'wasabi' },
  { ja: 'ネギ', reading: 'ねぎ', en: 'green onion' },
  { ja: '卵', reading: 'たまご', en: 'egg' },
  { ja: '海苔', reading: 'のり', en: 'seaweed' },
  { ja: '替え玉', reading: 'かえだま', en: 'extra noodles (same broth)' },
  { ja: '食券', reading: 'しょっけん', en: 'food ticket' },
  { ja: '抜き', reading: 'ぬき', en: 'without (leave it out)' },
  { ja: 'なし', reading: 'なし', en: 'without / none' },
  { ja: 'お願いします', reading: 'おねがいします', en: 'please' },
  { ja: 'ください', reading: 'ください', en: 'please give me' },
  { ja: 'すみません', reading: 'すみません', en: 'excuse me / sorry' },
  { ja: '大丈夫', reading: 'だいじょうぶ', en: "it's okay / I'm fine" },
  { ja: '持ち帰り', reading: 'もちかえり', en: 'takeout' },
  { ja: '店内', reading: 'てんない', en: 'eat in (at the shop)' },
  { ja: '袋', reading: 'ふくろ', en: 'bag' },
  { ja: '箸', reading: 'はし', en: 'chopsticks' },
  { ja: '水', reading: 'みず', en: 'water' },
  { ja: 'お会計', reading: 'おかいけい', en: 'check / bill' },
  { ja: '現金', reading: 'げんきん', en: 'cash' },
  { ja: 'カード', reading: 'カード', en: 'card (payment)' },
  { ja: '禁煙', reading: 'きんえん', en: 'non-smoking' },
  { ja: '予約', reading: 'よやく', en: 'reservation' },
  { ja: 'トイレ', reading: 'トイレ', en: 'restroom' },
  { ja: '荷物', reading: 'にもつ', en: 'luggage' },
  { ja: '切符', reading: 'きっぷ', en: 'ticket' },
  { ja: '出口', reading: 'でぐち', en: 'exit' },
  { ja: '入口', reading: 'いりぐち', en: 'entrance' },
  { ja: '右', reading: 'みぎ', en: 'right' },
  { ja: '左', reading: 'ひだり', en: 'left' },
  { ja: 'まっすぐ', reading: 'まっすぐ', en: 'straight ahead' },
];

const PARTICLES = 'でとはをがにのへも';

const DEFAULT_QUESTIONS = [
  'Have you used this in Japan?',
  'Would you try saying this out loud?',
  'Which word is hardest for you here?',
  'Save or skip — what do you think?',
];

const SITUATION_QUESTIONS: Partial<Record<string, string[]>> = {
  coffee_shop: [
    'Have you ordered coffee in Japanese?',
    'Would you say this or just point?',
  ],
  convenience_store: [
    'Konbini — have you used this line?',
    'Which konbini phrase do you need most?',
  ],
  ramen_shop: [
    'Ramen order — confident or nervous?',
    'Have you said this at a ramen shop?',
  ],
  train_station: [
    'Ever asked this at a station?',
    'Station stress: which phrase saves you?',
  ],
  restaurant_reservation: [
    'Would you book with this phrase?',
    'Reservation or walk-in — which are you?',
  ],
  hotel: [
    'Hotel check-in: would this help you?',
    'Tried this at a hotel front desk?',
  ],
  izakaya: [
    'Izakaya ready? Have you used this?',
    'Would you try this on your next night out?',
  ],
  onsen: [
    'Onsen rules — does this help?',
    'Would you ask this before going in?',
  ],
  taxi: [
    'Taxi in Japan — said this before?',
    'Would you use Japanese or the map?',
  ],
  greetings: [
    'Do you use this greeting already?',
    'Polite or casual — which do you prefer?',
  ],
};

export function sceneOpener(situation: string): string {
  const label = getSituationLabel(situation);
  return `${label.en} Japanese`;
}

export function phraseForDisplay(japanese: string): string {
  return japanese.replace(/[。！？!?]+$/g, '').trim();
}

export function extractVocabParts(word: WordCard): VocabPart[] {
  const cleaned = word.japanese.replace(/[。！？!?]/g, '').trim();
  const sorted = [...GLOSSARY].sort((a, b) => b.ja.length - a.ja.length);
  const parts: VocabPart[] = [];
  let pos = 0;

  while (pos < cleaned.length) {
    const match = sorted.find((item) => cleaned.startsWith(item.ja, pos));
    if (match) {
      parts.push(match);
      pos += match.ja.length;
      continue;
    }
    if (PARTICLES.includes(cleaned[pos] ?? '')) {
      pos += 1;
      continue;
    }
    break;
  }

  if (parts.length >= 2) return parts;

  return [{ ja: cleaned, reading: word.reading.replace(/[。]/g, ''), en: word.english }];
}

export function formatSpacedReading(word: WordCard, parts: VocabPart[]): string {
  const reading = word.reading.replace(/[。！？!?]/g, '').trim();
  if (parts.length < 2) return reading;

  const segments: string[] = [];
  let cursor = 0;

  for (const part of parts) {
    const idx = reading.indexOf(part.reading, cursor);
    if (idx === -1) continue;

    if (idx > cursor) {
      segments.push(reading.slice(cursor, idx));
    }

    let chunk = part.reading;
    const nextChar = reading[idx + part.reading.length];
    if (nextChar && PARTICLES.includes(nextChar)) {
      chunk += nextChar;
      cursor = idx + part.reading.length + 1;
    } else {
      cursor = idx + part.reading.length;
    }
    segments.push(chunk);
  }

  if (cursor < reading.length) {
    segments.push(reading.slice(cursor));
  }

  return segments.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

/** Stable pick from a list based on word id (same word → same question). */
export function pickEngagementQuestion(word: WordCard): string {
  const pool = SITUATION_QUESTIONS[word.situation] ?? DEFAULT_QUESTIONS;
  let hash = 0;
  for (let i = 0; i < word.id.length; i += 1) {
    hash = (hash + word.id.charCodeAt(i) * (i + 1)) % 997;
  }
  return pool[hash % pool.length] ?? DEFAULT_QUESTIONS[0];
}

export function formatVocabLines(parts: VocabPart[]): string {
  return parts.map((part) => `・${part.ja}（${part.en}）`).join('\n');
}

/** Short phrase + reading + English + reply-bait question. */
export function renderDailyJapaneseLesson(word: WordCard, link: string | null): string {
  const parts = extractVocabParts(word);
  const spaced = formatSpacedReading(word, parts);
  const phrase = phraseForDisplay(word.japanese);
  const question = pickEngagementQuestion(word);

  const body = `${sceneOpener(word.situation)}
「${phrase}」
${spaced}
(${word.english})

${question}`;

  if (link) {
    return `${body}\n\n${link}`;
  }
  return body;
}
