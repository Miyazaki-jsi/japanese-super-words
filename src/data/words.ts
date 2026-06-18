export type SituationId =
  | 'ramen_shop'
  | 'convenience_store'
  | 'greetings'
  | 'hospital'
  | 'train_station'
  | 'izakaya'
  | 'hangover'
  | 'missed_last_train'
  | 'festival'
  | 'bank'
  | 'highway'
  | 'rainy_day';

export interface WordCard {
  id: string;
  japanese: string;
  reading: string;
  romaji: string;
  english: string;
  situation: SituationId;
}

export const sampleWords: WordCard[] = [
  // Ramen Shop (旧 Restaurant)
  {
    id: 'r1',
    japanese: 'メニューを見せてください。',
    reading: 'めにゅーをみせてください。',
    romaji: 'Menyū o misete kudasai.',
    english: 'Please show me the menu.',
    situation: 'ramen_shop',
  },
  {
    id: 'r2',
    japanese: 'これをお願いします。',
    reading: 'これをおねがいします。',
    romaji: 'Kore o onegai shimasu.',
    english: 'This one, please.',
    situation: 'ramen_shop',
  },
  {
    id: 'r3',
    japanese: 'お会計をお願いします。',
    reading: 'おかいけいをおねがいします。',
    romaji: 'Okaikei o onegai shimasu.',
    english: 'Check, please.',
    situation: 'ramen_shop',
  },
  {
    id: 'r4',
    japanese: 'お水をお願いします。',
    reading: 'おみずをおねがいします。',
    romaji: 'Omizu o onegai shimasu.',
    english: 'Water, please.',
    situation: 'ramen_shop',
  },
  {
    id: 'r5',
    japanese: 'ごちそうさまでした。',
    reading: 'ごちそうさまでした。',
    romaji: 'Gochisōsama deshita.',
    english: 'Thank you for the delicious meal.',
    situation: 'ramen_shop',
  },
  // Convenience Store (旧 Shopping)
  {
    id: 's1',
    japanese: 'これはいくらですか？',
    reading: 'これはいくらですか？',
    romaji: 'Kore wa ikura desu ka?',
    english: 'How much is this?',
    situation: 'convenience_store',
  },
  {
    id: 's2',
    japanese: 'クレジットカードは使えますか？',
    reading: 'くれじっとかーどはつかえますか？',
    romaji: 'Kurejitto kādo wa tsukaemasu ka?',
    english: 'Can I use a credit card?',
    situation: 'convenience_store',
  },
  {
    id: 's3',
    japanese: 'これに決めます。',
    reading: 'これにきめます。',
    romaji: 'Kore ni kimemasu.',
    english: "I'll take this one.",
    situation: 'convenience_store',
  },
  {
    id: 's4',
    japanese: '袋をいただけますか？',
    reading: 'ふくろをいただけますか？',
    romaji: 'Fukuro o itadakemasu ka?',
    english: 'Could I have a bag, please?',
    situation: 'convenience_store',
  },
  {
    id: 's5',
    japanese: 'ちょっと見ているだけです。',
    reading: 'ちょっとみているだけです。',
    romaji: 'Chotto mite iru dake desu.',
    english: "I'm just looking, thank you.",
    situation: 'convenience_store',
  },
  // Greetings (新規)
  {
    id: 'g1',
    japanese: 'はじめまして。',
    reading: 'はじめまして。',
    romaji: 'Hajimemashite.',
    english: 'Nice to meet you.',
    situation: 'greetings',
  },
  {
    id: 'g2',
    japanese: 'ありがとうございます。',
    reading: 'ありがとうございます。',
    romaji: 'Arigatō gozaimasu.',
    english: 'Thank you very much.',
    situation: 'greetings',
  },
  {
    id: 'g3',
    japanese: 'すみません。',
    reading: 'すみません。',
    romaji: 'Sumimasen.',
    english: 'Excuse me / Sorry.',
    situation: 'greetings',
  },
  {
    id: 'g4',
    japanese: 'お元気ですか？',
    reading: 'おげんきですか？',
    romaji: 'Ogenki desu ka?',
    english: 'How are you?',
    situation: 'greetings',
  },
  {
    id: 'g5',
    japanese: 'さようなら。',
    reading: 'さようなら。',
    romaji: 'Sayōnara.',
    english: 'Goodbye.',
    situation: 'greetings',
  },
  // Hospital (新規)
  {
    id: 'h1',
    japanese: '気分が悪いです。',
    reading: 'きぶんがわるいです。',
    romaji: 'Kibun ga warui desu.',
    english: 'I feel sick.',
    situation: 'hospital',
  },
  {
    id: 'h2',
    japanese: '頭が痛いです。',
    reading: 'あたまがいたいです。',
    romaji: 'Atama ga itai desu.',
    english: 'I have a headache.',
    situation: 'hospital',
  },
  {
    id: 'h3',
    japanese: '熱があります。',
    reading: 'ねつがあります。',
    romaji: 'Netsu ga arimasu.',
    english: 'I have a fever.',
    situation: 'hospital',
  },
  {
    id: 'h4',
    japanese: '保険証は使えますか？',
    reading: 'ほけんしょうはつかえますか？',
    romaji: 'Hokenshō wa tsukaemasu ka?',
    english: 'Can I use health insurance?',
    situation: 'hospital',
  },
  {
    id: 'h5',
    japanese: '薬をください。',
    reading: 'くすりをください。',
    romaji: 'Kusuri o kudasai.',
    english: 'Please give me medicine.',
    situation: 'hospital',
  },
  // Train Station (旧 Airport)
  {
    id: 'a1',
    japanese: '乗車手続きはどこですか？',
    reading: 'じょうしゃてつづきはどこですか？',
    romaji: 'Jōsha tetsuzuki wa doko desu ka?',
    english: 'Where is check-in / ticketing?',
    situation: 'train_station',
  },
  {
    id: 'a2',
    japanese: 'これは車内に持ち込めますか？',
    reading: 'これはしゃないにもちこめますか？',
    romaji: 'Kore wa shanai ni mochikomemasu ka?',
    english: 'Can I take this on board?',
    situation: 'train_station',
  },
  {
    id: 'a3',
    japanese: '切符をどうぞ。',
    reading: 'きっぷをどうぞ。',
    romaji: 'Kippu o dōzo.',
    english: 'Here is my ticket.',
    situation: 'train_station',
  },
  {
    id: 'a4',
    japanese: '荷物を預けたいです。',
    reading: 'にもつをあずけたいです。',
    romaji: 'Nimotsu o azuketai desu.',
    english: 'I would like to check my baggage / use a locker.',
    situation: 'train_station',
  },
  {
    id: 'a5',
    japanese: '私の席はどこですか？',
    reading: 'わたしのせきはどこですか？',
    romaji: 'Watashi no seki wa doko desu ka?',
    english: 'Where is my seat?',
    situation: 'train_station',
  },
  // Izakaya (新規)
  {
    id: 'i1',
    japanese: '生ビールをお願いします。',
    reading: 'なまびーるをおねがいします。',
    romaji: 'Nama bīru o onegai shimasu.',
    english: 'Draft beer, please.',
    situation: 'izakaya',
  },
  {
    id: 'i2',
    japanese: 'おすすめは何ですか？',
    reading: 'おすすめはなんですか？',
    romaji: 'Osusume wa nan desu ka?',
    english: 'What do you recommend?',
    situation: 'izakaya',
  },
  {
    id: 'i3',
    japanese: '焼き鳥を盛り合わせで。',
    reading: 'やきとりをもりあわせで。',
    romaji: 'Yakitori o moriawase de.',
    english: 'Assorted Yakitori, please.',
    situation: 'izakaya',
  },
  {
    id: 'i4',
    japanese: 'とりあえずこれで。',
    reading: 'とりあえずこれで。',
    romaji: 'Toriaezu kore de.',
    english: "That's all for now.",
    situation: 'izakaya',
  },
  {
    id: 'i5',
    japanese: 'カンパイ！',
    reading: 'かんぱい！',
    romaji: 'Kanpai!',
    english: 'Cheers!',
    situation: 'izakaya',
  },
];
