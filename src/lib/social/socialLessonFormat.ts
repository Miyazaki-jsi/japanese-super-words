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

export function sceneOpener(situation: string): string {
  const label = getSituationLabel(situation);
  return `${label.ja}で使える今日の日本語！`;
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

export function buildContextStory(word: WordCard): string {
  const ja = word.japanese;

  if (/にんにく.*抜き/.test(ja)) {
    return `にんにくは超うまい！けど臭い！\nその日にもしデートがあったら口が臭くなって彼女と喋りづらくなる…。\nそんな時に使えるフレーズです。`;
  }
  if (/わさび.*抜き/.test(ja)) {
    return `わさびは旨い！けど、思ってるよりキツいことも。\n鼻がツーンとして、会話中に集中できなくなる…。\nそんな時は遠慮なく「抜き」でOK。`;
  }
  if (/ネギ.*抜き|ねぎ.*抜き/.test(ja)) {
    return `ネギ好きな人も多いけど、嫌いな人も結構いる。\n匂いが気になる日や、口の中をスッキリさせたい時に使えます。`;
  }
  if (/卵.*抜き/.test(ja)) {
    return `日本の料理って、意外と卵が入ってる。\nアレルギーがある人は、注文の最初に言っておくと安心。`;
  }
  if (/替え玉/.test(ja)) {
    return `ラーメン、スープ残して麺だけなくなった…。\nそんな時「替え玉」があるお店は神。\n日本だけの文化、知ってるとラーメンが2倍楽しい。`;
  }
  if (/食券|券売機/.test(ja)) {
    return `ラーメン屋、券売機で先に買うタイプ多い。\n並んでる時に慌てないよう、この言葉知っておくと余裕が出る。`;
  }
  if (/すみません/.test(ja)) {
    return `日本では「すみません」が万能。\n呼びかけにも、謝る時にも使える。\n旅行者が最初に覚えるならこれ。`;
  }
  if (/お会計|会計/.test(ja)) {
    return `食べ終わった後、会計どうする？って焦ることある。\nこの1文あれば、スマートに店を出られる。`;
  }
  if (/持ち帰り/.test(ja)) {
    return `食べきれない！でも捨てたくない！\nそんな時「持ち帰り」が使える。\nコンビニでもラーメン屋でも通じる。`;
  }
  if (/予約/.test(ja)) {
    return `人気店、並ばないと入れない。\n「予約」しておけば、現地到着後も余裕。`;
  }
  if (/切符|きっぷ/.test(ja)) {
    return `駅の券売機、初見だと迷子になりがち。\n焦ってる時ほど、短い日本語1文が助けになる。`;
  }
  if (/トイレ/.test(ja)) {
    return `トイレどこ？は旅行者の永遠の悩み。\n短く聞ければ、すぐ解決。`;
  }
  if (/荷物/.test(ja)) {
    return `スーツケース持ち歩き、しんどい。\n「荷物」系のフレーズは、ホテルでも駅でも使える。`;
  }

  return buildSituationFallbackStory(word);
}

function buildSituationFallbackStory(word: WordCard): string {
  const label = getSituationLabel(word.situation);
  const stories: Partial<Record<string, string>> = {
    ramen_shop: `ラーメン屋、英語メニューないことも多い。\nでもこの1文覚えれば、注文で困らない。\n${label.ja}デビュー前に保存しておこう。`,
    convenience_store: `コンビニは日本の生活インフラ。\nレジで聞かれること多いから、短い日本語があるとテンポよく買い物できる。`,
    train_station: `駅は情報が多すぎてパニックになりやすい。\n短い日本語1文があるだけで、だいぶ落ち着ける。`,
    izakaya: `居酒屋、メニューが読めなくても注文できる。\nこのフレーズを覚えておけば、現地で「使えた！」となる。`,
    hotel: `ホテルチェックイン、疲れてる時に英語説明はキツい。\n短い日本語の方が、フロントも助かる。`,
    sushi_shop: `寿司屋、職人さんとの距離が近い。\n短くはっきり伝えるのが、実は正解。`,
    taxi: `タクシー、目的地を伝えるだけでも緊張する。\nこのフレーズ、スマホより早いことも。`,
    onsen: `温泉、ルールが独特。\n知らないと入れないこともあるから、先にフレーズだけ覚えとこう。`,
    kaiten_sushi: `回転寿司、回ってるだけじゃ注文できない。\n声出し文化、ここで使う。`,
  };

  return (
    stories[word.situation] ??
    `${label.ja}で「使えた！」となるフレーズ。\n現地で困った時、英語より短い日本語の方が通じる。\n今日の1文、保存しておこう。`
  );
}

export function formatVocabLines(parts: VocabPart[]): string {
  return parts.map((part) => `・${part.ja}（${part.en}）`).join('\n');
}

export function renderDailyJapaneseLesson(word: WordCard, link: string | null): string {
  const parts = extractVocabParts(word);
  const spaced = formatSpacedReading(word, parts);
  const phrase = phraseForDisplay(word.japanese);

  const body = `${sceneOpener(word.situation)}
「${phrase}」

${buildContextStory(word)}

${formatVocabLines(parts)}

「${spaced}」
（${word.english}）`;

  if (link) {
    return `${body}\n\n${link}`;
  }
  return body;
}
