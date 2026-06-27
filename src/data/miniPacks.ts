import { sampleWords, WordCard } from './words';
import { TripPackRoleplay } from './tripPack';
import { hatsumodePackWords } from './hatsumodePackWords';

export type MiniPackId = 'hatsumode' | 'arrival_24h' | 'night_japan' | 'foodie';

export type MiniPack = {
  id: MiniPackId;
  title: string;
  titleEn: string;
  goal: string;
  goalEn: string;
  emoji: string;
  accent: string;
  priceUsd: string;
  priceJpyNote: string;
  badge?: string;
  badgeStyle?: string;
  wordIds: string[];
  roleplays: TripPackRoleplay[];
  quizCount: number;
};

export const MINI_PACK_STORAGE_PREFIX = 'japanese-super-words-pack-';
export const MINI_PACK_COMPLETED_SUFFIX = '-completed';

export const miniPacks: MiniPack[] = [
  {
    id: 'hatsumode',
    title: '初詣パック',
    titleEn: 'New Year Shrine Visit',
    goal: '初詣の作法・おみくじ・混雑対応',
    goalEn: 'Shrine etiquette, fortunes & crowds',
    emoji: '⛩️',
    accent: 'from-rose-600 via-red-600 to-orange-600',
    priceUsd: '$1.99',
    priceJpyNote: '≈ ¥300',
    badge: 'Seasonal',
    wordIds: hatsumodePackWords.map((w) => w.id),
    quizCount: 5,
    roleplays: [
      {
        sceneTitle: '神社の入口',
        sceneTitleEn: 'At the shrine entrance',
        turns: [{
        staffLine: '初詣の方はこちらの列にお並びください。',
        staffReading: 'はつもうでのかたはこちらのれつにおならびください。',
        staffEnglish: 'Those visiting for hatsumōde, please line up here.',
        choices: [
          {
            label: 'すみません。初詣は初めてです。',
            sublabel: 'Sumimasen. Hatsumōde wa hajimete desu.',
            correct: true,
            feedback: 'Good — staff can guide you.',
          },
          {
            label: 'おみくじはどこでもらえますか？',
            sublabel: 'Omikuji wa doko de moraemasu ka?',
            correct: true,
            feedback: 'Also fine — you can ask where to get fortunes.',
          },
          {
            label: 'さようなら。',
            sublabel: 'Sayōnara.',
            correct: false,
            feedback: 'That means goodbye — try explaining you are new to hatsumōde.',
          },
        ],
      }],
      },
      {
        sceneTitle: 'おみくじを引いた後',
        sceneTitleEn: 'After drawing your fortune',
        turns: [{
        staffLine: '凶でしたか。結んでおきましょうか？',
        staffReading: 'きょうでしたか。むすんでおきましょうか？',
        staffEnglish: 'Was it bad luck? Shall we tie it here?',
        choices: [
          {
            label: 'はい、結んでください。',
            sublabel: 'Hai, musunde kudasai.',
            correct: true,
            feedback: 'Perfect — tying bad fortunes at the shrine is the custom.',
          },
          {
            label: 'お守りを買いたいです。',
            sublabel: 'Omamori o kaitai desu.',
            correct: true,
            feedback: 'Good — charms are sold nearby.',
          },
          {
            label: '大吉です！',
            sublabel: 'Daikichi desu!',
            correct: false,
            feedback: 'They asked about bad luck — if you got daikichi, say thank you instead.',
          },
        ],
      }],
      },
    ],
  },
  {
    id: 'arrival_24h',
    title: '到着24時間',
    titleEn: 'First 24 Hours',
    goal: '空港・駅・ホテル・コンビニで困らない',
    goalEn: 'Airport, station, hotel & konbini survival',
    emoji: '✈️',
    accent: 'from-sky-500 to-blue-600',
    priceUsd: '$2.99',
    priceJpyNote: '≈ ¥450',
    wordIds: [
      'ap1', 'ap2', 'ap6', 'ap11', 'ap13', 'ap14', 'ap23', 'ap30',
      'g14', 'g15', 'g16', 'g17', 'g19',
      'a14', 'a16', 'a19', 'a20', 'a23',
      'tm1', 'tm2', 'tm5', 'tm8', 'tm14',
      'ht6', 'ht7', 'ht14', 'ht15', 'ht16',
      's6', 's14', 's18',
    ],
    quizCount: 5,
    roleplays: [
      {
        sceneTitle: '入国審査',
        sceneTitleEn: 'At immigration',
        turns: [{
        staffLine: '目的は何ですか？',
        staffReading: 'もくてきはなんですか？',
        staffEnglish: 'What is the purpose of your visit?',
        choices: [
          {
            label: '観光です。',
            sublabel: 'Kankō desu.',
            correct: true,
            feedback: 'Perfect for tourists.',
          },
          {
            label: '一週間滞在します。',
            sublabel: 'Isshūkan taizai shimasu.',
            correct: true,
            feedback: 'Good — answers how long you will stay.',
          },
          {
            label: '申告するものはありません。',
            sublabel: 'Shinkoku suru mono wa arimasen.',
            correct: false,
            feedback: 'That is for customs, not immigration purpose.',
          },
        ],
      }],
      },
      {
        sceneTitle: 'ホテルチェックイン',
        sceneTitleEn: 'Hotel check-in',
        turns: [{
        staffLine: 'いらっしゃいませ。ご予約はありますか？',
        staffReading: 'いらっしゃいませ。ごよやくはありますか？',
        staffEnglish: 'Welcome. Do you have a reservation?',
        choices: [
          {
            label: '予約しています。',
            sublabel: 'Yoyaku shite imasu.',
            correct: true,
            feedback: 'Great — they will find your booking.',
          },
          {
            label: 'Wi-Fiのパスワードを教えてください。',
            sublabel: 'Waifai no pasuwādo o oshiete kudasai.',
            correct: false,
            feedback: 'Ask that after check-in, not when asked about reservation.',
          },
          {
            label: 'チェックアウトをお願いします。',
            sublabel: 'Chekkuauto o onegai shimasu.',
            correct: false,
            feedback: 'You are checking in, not out.',
          },
        ],
      }],
      },
      {
        sceneTitle: 'コンビニで買い物',
        sceneTitleEn: 'Shopping at a convenience store',
        turns: [{
        staffLine: 'ポイントカードはお持ちですか？',
        staffReading: 'ぽいんとかーどはおもちですか？',
        staffEnglish: 'Do you have a point card?',
        choices: [
          {
            label: 'いいえ、結構です。',
            sublabel: 'Iie, kekkō desu.',
            correct: true,
            feedback: 'Polite way to decline.',
          },
          {
            label: '袋はいりません。',
            sublabel: 'Fukuro wa irimasen.',
            correct: true,
            feedback: 'Also fine if you do not need a bag.',
          },
          {
            label: 'すみません。',
            sublabel: 'Sumimasen.',
            correct: false,
            feedback: 'Too vague — answer the point card question.',
          },
        ],
      }],
      },
    ],
  },
  {
    id: 'night_japan',
    title: '夜の日本',
    titleEn: 'Night in Japan',
    goal: '居酒屋・カラオケ・タクシー・終電',
    goalEn: 'Izakaya, karaoke, taxis & last train',
    emoji: '🌙',
    accent: 'from-indigo-600 via-violet-600 to-purple-700',
    priceUsd: '$2.99',
    priceJpyNote: '≈ ¥450',
    wordIds: [
      'i1', 'i2', 'i6', 'i10', 'i14', 'i15', 'i18', 'i22', 'i26', 'i28',
      'kr1', 'kr4', 'kr8', 'kr10', 'kr14', 'kr18', 'kr22',
      'tx1', 'tx4', 'tx8', 'tx14', 'tx18', 'tx22',
      'mlt1', 'mlt5', 'mlt10', 'mlt14', 'mlt18', 'mlt22',
    ],
    quizCount: 5,
    roleplays: [
      {
        sceneTitle: '居酒屋で注文',
        sceneTitleEn: 'Ordering at an izakaya',
        turns: [{
        staffLine: 'いらっしゃいませ。ご注文はお決まりですか？',
        staffReading: 'いらっしゃいませ。ごちゅうもんはおきまりですか？',
        staffEnglish: 'Welcome. Ready to order?',
        choices: [
          {
            label: '生ビールをください。',
            sublabel: 'Nama bīru o kudasai.',
            correct: true,
            feedback: 'Classic izakaya opener!',
          },
          {
            label: 'おすすめは何ですか？',
            sublabel: 'Osusume wa nan desu ka?',
            correct: true,
            feedback: 'Great when you cannot decide.',
          },
          {
            label: 'お会計をお願いします。',
            sublabel: 'Okaikei o onegai shimasu.',
            correct: false,
            feedback: 'You have not ordered yet.',
          },
        ],
      }],
      },
      {
        sceneTitle: 'カラオケ店',
        sceneTitleEn: 'At a karaoke shop',
        turns: [{
        staffLine: '何名様ですか？',
        staffReading: 'なんめいさまですか？',
        staffEnglish: 'How many people?',
        choices: [
          {
            label: '二名です。',
            sublabel: 'Nimei desu.',
            correct: true,
            feedback: 'Perfect — two people.',
          },
          {
            label: '何時までですか？',
            sublabel: 'Nan-ji made desu ka?',
            correct: false,
            feedback: 'Answer the headcount first.',
          },
          {
            label: '歌いたいです。',
            sublabel: 'Utaitai desu.',
            correct: false,
            feedback: 'They asked how many — say the number of people.',
          },
        ],
      }],
      },
      {
        sceneTitle: '終電を逃した',
        sceneTitleEn: 'Missed the last train',
        turns: [{
        staffLine: '終電はもう出ましたよ。',
        staffReading: 'しゅうでんはもうでましたよ。',
        staffEnglish: 'The last train already left.',
        choices: [
          {
            label: 'タクシーはありますか？',
            sublabel: 'Takushī wa arimasu ka?',
            correct: true,
            feedback: 'Smart backup plan.',
          },
          {
            label: '近くにホテルはありますか？',
            sublabel: 'Chikaku ni hoteru wa arimasu ka?',
            correct: true,
            feedback: 'Good if you need to stay overnight.',
          },
          {
            label: '新幹線はありますか？',
            sublabel: 'Shinkansen wa arimasu ka?',
            correct: false,
            feedback: 'Shinkansen stops earlier too — try taxi or hotel.',
          },
        ],
      }],
      },
    ],
  },
  {
    id: 'foodie',
    title: '食べ歩き',
    titleEn: 'Foodie Japan',
    goal: 'ラーメン・寿司・居酒屋・アレルギー対応',
    goalEn: 'Ramen, sushi, izakaya & dietary needs',
    emoji: '🍜',
    accent: 'from-orange-500 via-amber-500 to-yellow-600',
    priceUsd: '$2.99',
    priceJpyNote: '≈ ¥450',
    wordIds: [
      'r1', 'r2', 'r6', 'r10', 'r14', 'r18', 'r22', 'r26', 'r30',
      'su1', 'su6', 'su10', 'su14', 'su18', 'su22', 'su26',
      'i14', 'i18', 'i22',
      'al1', 'al4', 'al8', 'al12', 'al16', 'al20', 'al24',
      'gy1', 'gy6', 'gy14',
    ],
    quizCount: 5,
    roleplays: [
      {
        sceneTitle: 'ラーメン屋',
        sceneTitleEn: 'At a ramen shop',
        turns: [{
        staffLine: 'いらっしゃいませ。何名様ですか？',
        staffReading: 'いらっしゃいませ。なんめいさまですか？',
        staffEnglish: 'Welcome. How many?',
        choices: [
          {
            label: '一名です。',
            sublabel: 'Ichimei desu.',
            correct: true,
            feedback: 'One person — correct.',
          },
          {
            label: '豚骨ラーメンをください。',
            sublabel: 'Tonkotsu rāmen o kudasai.',
            correct: false,
            feedback: 'They asked how many — answer headcount first.',
          },
          {
            label: '替え玉をください。',
            sublabel: 'Kaedama o kudasai.',
            correct: false,
            feedback: 'Kaedama is for after you finish your noodles.',
          },
        ],
      }],
      },
      {
        sceneTitle: 'アレルギーを伝える',
        sceneTitleEn: 'Explaining an allergy',
        turns: [{
        staffLine: 'アレルギーはありますか？',
        staffReading: 'あれるぎーはありますか？',
        staffEnglish: 'Do you have any allergies?',
        choices: [
          {
            label: '卵アレルギーがあります。',
            sublabel: 'Tamago arerugī ga arimasu.',
            correct: true,
            feedback: 'Clear and important to say.',
          },
          {
            label: 'ベジタリアンです。',
            sublabel: 'Bejitarian desu.',
            correct: true,
            feedback: 'Good dietary info for staff.',
          },
          {
            label: 'おいしいです。',
            sublabel: 'Oishii desu.',
            correct: false,
            feedback: 'They asked about allergies — answer that question.',
          },
        ],
      }],
      },
      {
        sceneTitle: '寿司屋',
        sceneTitleEn: 'At a sushi restaurant',
        turns: [{
        staffLine: 'お飲み物はいかがですか？',
        staffReading: 'おのみものはいかがですか？',
        staffEnglish: 'Would you like a drink?',
        choices: [
          {
            label: 'お茶をください。',
            sublabel: 'Ocha o kudasai.',
            correct: true,
            feedback: 'Classic choice at sushi places.',
          },
          {
            label: 'おまかせでお願いします。',
            sublabel: 'Omakase de onegai shimasu.',
            correct: false,
            feedback: 'That is for ordering sushi, not drinks.',
          },
          {
            label: '会計をお願いします。',
            sublabel: 'Kaikei o onegai shimasu.',
            correct: false,
            feedback: 'You have not eaten yet.',
          },
        ],
      }],
      },
    ],
  },
];

export const MINI_PACK_COUNT = miniPacks.length;

export function getMiniPackById(id: MiniPackId): MiniPack | undefined {
  return miniPacks.find((p) => p.id === id);
}

export function getMiniPackWords(pack: MiniPack): WordCard[] {
  const map = new Map(sampleWords.map((w) => [w.id, w]));
  return pack.wordIds.map((id) => map.get(id)).filter((w): w is WordCard => Boolean(w));
}

export function getMiniPackEstimateMinutes(pack: MiniPack): number {
  return Math.round(pack.wordIds.length * 0.6 + pack.roleplays.length * 2 + pack.quizCount * 0.5 + 3);
}

export function getMiniPackStorageKey(packId: MiniPackId): string {
  return `${MINI_PACK_STORAGE_PREFIX}${packId}-unlocked`;
}

export function getMiniPackCompletedKey(packId: MiniPackId): string {
  return `${MINI_PACK_STORAGE_PREFIX}${packId}${MINI_PACK_COMPLETED_SUFFIX}`;
}
