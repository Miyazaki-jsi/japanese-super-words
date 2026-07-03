import type { WordCard } from '@/data/words';
import { getSituationLabel } from '@/data/situationLabels';
import { SCENE_EMOJI } from './constants';

type DialogueContext = {
  emoji: string;
  sceneEn: string;
  sceneJa: string;
  settingLine: string;
  dialogue: string;
  spokenNoteJa: string;
  usageTipEn: string;
};

function phraseForDialogue(japanese: string): string {
  const trimmed = japanese.trim();
  if (/[。！？!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}。`;
}

function spokenNoteFromPhrase(word: WordCard): string {
  const ja = word.japanese;
  if (ja.includes('お願い')) {
    return '「お願いします」のトーンは柔らかめ。語尾を落とさず、でも急がなくてOK。';
  }
  if (ja.includes('すみません')) {
    return '声は小さすぎなくていい。軽く手を挙げながら言うと、日本人にも伝わりやすい。';
  }
  if (ja.includes('？') || ja.includes('?')) {
    return '質問は語尾を少し上げるイメージ。ゆっくりで大丈夫。';
  }
  if (ja.length <= 12) {
    return `短いフレーズほど、そのまま覚えて使える。${word.reading}と口に出してみて。`;
  }
  return `そのまま使える完成文。${word.reading}をゆっくり2回言うと口慣れする。`;
}

const SITUATION_DIALOGUES: Partial<
  Record<string, (word: WordCard, sceneEn: string, sceneJa: string) => Omit<DialogueContext, 'emoji'>>
> = {
  ramen_shop: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🍜 ${sceneJa}（${sceneEn}）`,
    dialogue: `店員「いらっしゃいませ！」
You「${phraseForDialogue(word.japanese)}」
店員「かしこまりました！」`,
    spokenNoteJa:
      'ラーメン屋は短く言い切るのが自然。長い英語説明より、この1文の方が100倍通じる。',
    usageTipEn: 'Say it right after ordering or when you need something mid-meal.',
  }),
  convenience_store: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🏪 ${sceneJa}（${sceneEn}）`,
    dialogue: `店員「袋はお分けしますか？」
You「${phraseForDialogue(word.japanese)}」
店員「はい、どうぞ！」`,
    spokenNoteJa: 'コンビニはテンポが速い。でもこのくらいの長さなら余裕で間に合う。',
    usageTipEn: 'Use at checkout — staff expect quick, clear phrases.',
  }),
  train_station: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🚉 ${sceneJa}（${sceneEn}）`,
    dialogue: `You「すみません、${phraseForDialogue(word.japanese.replace(/。$/, ''))}」
駅員「はい、こちらです。」`,
    spokenNoteJa: '「すみません」から入ると、駅員も止まってくれる。迷子になってもこれで動ける。',
    usageTipEn: 'Start with sumimasen — it gets staff to pause and help you.',
  }),
  izakaya: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🍶 ${sceneJa}（${sceneEn}）`,
    dialogue: `店員「ご注文お決まりですか？」
You「${phraseForDialogue(word.japanese)}」
店員「少々お待ちください！」`,
    spokenNoteJa: '居酒屋はカジュアルでOK。敬語より「はっきり伝わるか」が大事。',
    usageTipEn: 'Izakaya staff are used to tourists — clear beats perfect grammar.',
  }),
  hotel: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🏨 ${sceneJa}（${sceneEn}）`,
    dialogue: `フロント「チェックインですか？」
You「${phraseForDialogue(word.japanese)}」
フロント「承知しました。」`,
    spokenNoteJa: 'ホテルは丁寧語でOK。ゆっくりはっきりが一番好かれる。',
    usageTipEn: 'Front desk staff expect polite tone — this phrase fits perfectly.',
  }),
  hospital: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🏥 ${sceneJa}（${sceneEn}）`,
    dialogue: `受付「どうされましたか？」
You「${phraseForDialogue(word.japanese)}」
受付「わかりました。お待ちください。」`,
    spokenNoteJa: '体調不良は焦るけど、短い日本語1文で十分伝わる。',
    usageTipEn: 'Keep it short — reception needs clear symptoms or requests.',
  }),
  onsen: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `♨️ ${sceneJa}（${sceneEn}）`,
    dialogue: `Staff「いらっしゃいませ。」
You「${phraseForDialogue(word.japanese)}」
Staff「はい、こちらへどうぞ。」`,
    spokenNoteJa: '温泉はルール確認が多い。聞くのが普通なので遠慮しないで。',
    usageTipEn: 'Asking about rules is normal — staff appreciate clear questions.',
  }),
  taxi: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🚕 ${sceneJa}（${sceneEn}）`,
    dialogue: `Driver「どちらまで？」
You「${phraseForDialogue(word.japanese)}」
Driver「了解です！」`,
    spokenNoteJa: 'タクシーは目的地か確認事項を短く。スマホの地図を見せるのもアリ。',
    usageTipEn: 'Show your phone map if needed — but try the phrase first.',
  }),
  kaiten_sushi: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🍣 ${sceneJa}（${sceneEn}）`,
    dialogue: `Staff「何名様ですか？」
You「${phraseForDialogue(word.japanese)}」
Staff「どうぞ！」`,
    spokenNoteJa: '回転寿司は声出しOK。遠慮なく一言で頼むのが正解。',
    usageTipEn: 'Kaiten sushi = speak up briefly. Staff move fast.',
  }),
  lost_emergency: (word, sceneEn, sceneJa) => ({
    sceneEn,
    sceneJa,
    settingLine: `🆘 ${sceneJa}（${sceneEn}）`,
    dialogue: `You「すみません！${phraseForDialogue(word.japanese.replace(/。$/, ''))}」
相手「大丈夫ですか？！」`,
    spokenNoteJa: '困った時こそ短い日本語。長い説明よりこの1文を先に。',
    usageTipEn: 'In trouble, one clear Japanese sentence beats a long English story.',
  }),
};

function genericDialogue(word: WordCard, sceneEn: string, sceneJa: string): Omit<DialogueContext, 'emoji'> {
  const phrase = phraseForDialogue(word.japanese);
  return {
    sceneEn,
    sceneJa,
    settingLine: `${sceneJa}（${sceneEn}）`,
    dialogue: `相手「どうぞ！」
You「${phrase}」
相手「あ、わかりました！」`,
    spokenNoteJa: spokenNoteFromPhrase(word),
    usageTipEn: `Use this in ${sceneEn.toLowerCase()} situations when you need to act fast.`,
  };
}

export function buildDialogueContext(word: WordCard): DialogueContext {
  const label = getSituationLabel(word.situation);
  const builder = SITUATION_DIALOGUES[word.situation];
  const base = builder
    ? builder(word, label.en, label.ja)
    : genericDialogue(word, label.en, label.ja);

  return {
    emoji: SCENE_EMOJI[word.situation] ?? '🇯🇵',
    ...base,
  };
}

export function nuanceLine(word: WordCard): string {
  const ja = word.japanese;
  if (ja.includes('ください')) return '「ください」= polite request. Softer than a direct command.';
  if (ja.includes('です') || ja.includes('ます')) return 'Polite form — safe default for travelers anywhere in Japan.';
  if (ja.includes('ない')) return 'Negative form — useful when declining or saying you do not need something.';
  return `Literal meaning: ${word.english}. Worth memorizing as a complete chunk.`;
}
