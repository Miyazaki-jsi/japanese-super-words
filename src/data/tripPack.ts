import { sampleWords, WordCard } from '@/data/words';

export type TripPackRoleplayChoice = {
  label: string;
  /** Hiragana reading for ruby on the label (kanji in choices) */
  labelReading?: string;
  sublabel?: string;
  correct: boolean;
  feedback: string;
};

export type TripPackRoleplayTurn = {
  staffLine: string;
  staffReading: string;
  staffEnglish: string;
  choices: TripPackRoleplayChoice[];
};

export type TripPackRoleplay = {
  sceneTitle: string;
  sceneTitleEn: string;
  turns: TripPackRoleplayTurn[];
};

export type TripPackDay = {
  dayNumber: number;
  daysBeforeTrip: number;
  title: string;
  titleEn: string;
  goal: string;
  goalEn: string;
  emoji: string;
  accent: string;
  wordIds: string[];
  roleplays: TripPackRoleplay[];
  quizCount: number;
};

export const TRIP_PACK_STORAGE_KEY = 'japanese-super-words-trip-pack-progress';
export const TRIP_PACK_PHRASE_COUNT = 15;
export const TRIP_PACK_ROLEPLAY_COUNT = 5;
export const TRIP_PACK_QUIZ_COUNT_DEFAULT = 8;

const choice = (
  label: string,
  sublabel: string,
  correct: boolean,
  feedback: string,
  labelReading?: string,
): TripPackRoleplayChoice => ({ label, sublabel, correct, feedback, labelReading });

export const tripPackDays: TripPackDay[] = [
  {
    dayNumber: 1,
    daysBeforeTrip: 7,
    title: '到着サバイバル',
    titleEn: 'Arrival Survival',
    goal: '空港で旅行者が話すフレーズ',
    goalEn: 'Phrases you say at the airport',
    emoji: '✈️',
    accent: 'from-sky-500 to-blue-600',
    quizCount: TRIP_PACK_QUIZ_COUNT_DEFAULT,
    wordIds: [
      'ap11', 'ap12', 'ap13', 'ap14', 'ap15',
      'ap2', 'ap3', 'ap5', 'ap20', 'ap24',
      'ap17', 'ap18', 'ap23', 'ap1', 'ap10',
    ],
    roleplays: [
      {
        sceneTitle: '切符売り場',
        sceneTitleEn: 'Buying a Shinkansen ticket',
        turns: [
          {
            staffLine: 'いらっしゃいませ。どちらまで行かれますか？',
            staffReading: 'いらっしゃいませ。どちらまでいかれますか？',
            staffEnglish: 'Welcome. Where are you headed?',
            choices: [
              choice(
                '東京までお願いします。',
                'Tōkyō made onegai shimasu.',
                true,
                'Natural — say your destination clearly.',
                'とうきょうまでおねがいします。',
              ),
              choice(
                'さようなら。',
                'Sayōnara.',
                false,
                'That means goodbye — tell them where you want to go.',
                'さようなら。',
              ),
              choice(
                'お元気ですか？',
                'Ogenki desu ka?',
                false,
                'That is a greeting, not an answer to "where to?"',
                'おげんきですか？',
              ),
            ],
          },
          {
            staffLine: '何月何日のご利用ですか？',
            staffReading: 'なんがつなんにちのごりようですか？',
            staffEnglish: 'What date will you travel?',
            choices: [
              choice(
                '明日お願いします。',
                'Ashita onegai shimasu.',
                true,
                'Perfect — staff will find tomorrow\'s trains.',
                'あしたおねがいします。',
              ),
              choice(
                '新幹線の切符を買いたいです。',
                'Shinkansen no kippu o kaitai desu.',
                false,
                'You already said that — now answer the date.',
                'しんかんせんのきっぷをかいたいです。',
              ),
              choice(
                '切符をどうぞ。',
                'Kippu o dōzo.',
                false,
                'You give your ticket at the gate, not when buying.',
                'きっぷをどうぞ。',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '座席の選択',
        sceneTitleEn: 'Choosing reserved or unreserved',
        turns: [
          {
            staffLine: '指定席と自由席、どちらになさいますか？',
            staffReading: 'していせきとじゆうせき、どちらになさいますか？',
            staffEnglish: 'Reserved seat or unreserved?',
            choices: [
              choice(
                '自由席でお願いします。',
                'Jiyūseki de onegai shimasu.',
                true,
                'Cheaper and flexible — great for travelers.',
                'じゆうせきでおねがいします。',
              ),
              choice(
                '荷物を預けたいです。',
                'Nimotsu o azuketai desu.',
                false,
                'That is for luggage lockers, not seat type.',
                'にもつをあずけたいです。',
              ),
              choice(
                '次の電車は何時ですか？',
                'Tsugi no densha wa nanji desu ka?',
                false,
                'Answer the seat question first.',
                'つぎのでんしゃはなんじですか？',
              ),
            ],
          },
          {
            staffLine: '13,320円になります。よろしいですか？',
            staffReading: 'えんになります。よろしいですか？',
            staffEnglish: 'That will be ¥13,320. Is that okay?',
            choices: [
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'Standard way to confirm and pay.',
                'はい、おねがいします。',
              ),
              choice(
                'すみません。',
                'Sumimasen.',
                false,
                'Too vague — confirm yes or ask a specific question.',
                'すみません。',
              ),
              choice(
                '何番線ですか？',
                'Nanbansen desu ka?',
                false,
                'They asked about the price — confirm first.',
                'なんばんせんですか？',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'ホーム案内',
        sceneTitleEn: 'Finding your platform',
        turns: [
          {
            staffLine: '新幹線のご案内でしょうか？',
            staffReading: 'しんかんせんのごあんないでしょうか？',
            staffEnglish: 'Are you looking for the Shinkansen?',
            choices: [
              choice(
                'のぞみ123号は何番ホームですか？',
                'Nozomi 123 wa nanban hōmu desu ka?',
                true,
                'Natural — ask which platform for your train.',
                'のぞみ123ごうはなんばんほーむですか？',
              ),
              choice(
                '切符をどうぞ。',
                'Kippu o dōzo.',
                false,
                'Show your ticket at the gate, not at the info desk.',
                'きっぷをどうぞ。',
              ),
              choice(
                'さようなら。',
                'Sayōnara.',
                false,
                'You need platform info — ask a question.',
                'さようなら。',
              ),
            ],
          },
          {
            staffLine: '13番ホームです。まもなく発車します。',
            staffReading: 'じゅうさんばんほーむです。まもなくはっしゃします。',
            staffEnglish: 'Platform 13. It departs shortly.',
            choices: [
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Perfect — thank them and head to platform 13.',
                'ありがとうございます。',
              ),
              choice(
                '何番線から出発しますか？',
                'Nanbansen kara shuppatsu shimasu ka?',
                false,
                'They just said platform 13 — head that way.',
                'なんばんせんからしゅっぱつしますか？',
              ),
              choice(
                '新幹線の切符を買いたいです。',
                'Shinkansen no kippu o kaitai desu.',
                false,
                'You already have your ticket.',
                'しんかんせんのきっぷをかいたいです。',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '改札を通る',
        sceneTitleEn: 'Passing through the ticket gate',
        turns: [
          {
            staffLine: '新幹線券をお持ちですか？',
            staffReading: 'しんかんせんけんをおもちですか？',
            staffEnglish: 'Do you have your Shinkansen ticket?',
            choices: [
              choice(
                'はい、こちらです。',
                'Hai, kochira desu.',
                true,
                'Natural — show your ticket as you say this.',
                'はい、こちらです。',
              ),
              choice(
                '切符をどうぞ。',
                'Kippu o dōzo.',
                true,
                'Also natural when handing over your ticket.',
                'きっぷをどうぞ。',
              ),
              choice(
                'すみません、道に迷いました。',
                'Sumimasen, michi ni mayoimashita.',
                false,
                'You are at the gate — show your ticket.',
                'すみません、みちにまよいました。',
              ),
            ],
          },
          {
            staffLine: '13番ホームへお進みください。',
            staffReading: 'じゅうさんばんほーむへおすすみください。',
            staffEnglish: 'Please proceed to platform 13.',
            choices: [
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Polite — then follow the signs.',
                'ありがとうございます。',
              ),
              choice(
                '次の電車は何時ですか？',
                'Tsugi no densha wa nanji desu ka?',
                false,
                'They already told you — head to platform 13.',
                'つぎのでんしゃはなんじですか？',
              ),
              choice(
                '失礼します。',
                'Shitsurei shimasu.',
                false,
                'Used when entering/leaving rooms, not here.',
                'しつれいします。',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '車内で',
        sceneTitleEn: 'On the train',
        turns: [
          {
            staffLine: 'すみません、こちら指定席でございます。',
            staffReading: 'すみません、こちらしていせきでございます。',
            staffEnglish: 'Excuse me, this is a reserved seat.',
            choices: [
              choice(
                'すみません。どこに座ればいいですか？',
                'Sumimasen. Doko ni suwareba ii desu ka?',
                true,
                'Polite — ask where your seat is.',
                'すみません。どこにすわればいいですか？',
              ),
              choice(
                '私の席はどこですか？',
                'Watashi no seki wa doko desu ka?',
                true,
                'Direct and clear — staff will help you.',
                'わたしのせきはどこですか？',
              ),
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                false,
                'They said you are in a reserved seat — ask where to sit.',
                'ありがとうございます。',
              ),
            ],
          },
          {
            staffLine: '15号車の12番です。あちらです。',
            staffReading: 'じゅうごごうしゃのじゅうにばんです。あちらです。',
            staffEnglish: 'Car 15, seat 12. That way.',
            choices: [
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Perfect — thank them and find your seat.',
                'ありがとうございます。',
              ),
              choice(
                '乗り換えは必要ですか？',
                'Norikae wa hitsuyō desu ka?',
                false,
                'You are on the right train — go to car 15.',
                'のりかえはひつようですか？',
              ),
              choice(
                '切符をどうぞ。',
                'Kippu o dōzo.',
                false,
                'You already passed the gate.',
                'きっぷをどうぞ。',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    dayNumber: 2,
    daysBeforeTrip: 6,
    title: 'ホテルチェックイン',
    titleEn: 'Hotel Check-in',
    goal: '予約・Wi-Fi・荷物預けができる',
    goalEn: 'Check in, get Wi-Fi, store luggage',
    emoji: '🏨',
    accent: 'from-violet-500 to-purple-600',
    quizCount: TRIP_PACK_QUIZ_COUNT_DEFAULT,
    wordIds: [
      'ht6', 'ht7', 'ht14', 'ht15', 'ht16', 'ht18', 'ht19',
      'ht23', 'ht24', 'ht28', 'ht29', 'ht30', 'ht17', 'ht8', 'ht27',
    ],
    roleplays: [
      {
        sceneTitle: 'フロントでチェックイン',
        sceneTitleEn: 'Checking in at the front desk',
        turns: [
          {
            staffLine: 'いらっしゃいませ。ご予約はお持ちですか？',
            staffReading: 'いらっしゃいませ。ごよやくはおもちですか？',
            staffEnglish: 'Welcome. Do you have a reservation?',
            choices: [
              choice(
                '予約しています。',
                'Yoyaku shite imasu.',
                true,
                'Perfect — they will look up your booking.',
              ),
              choice(
                'チェックアウトをお願いします。',
                'Chekkuauto o onegai shimasu.',
                false,
                'That is for leaving — you are checking in.',
              ),
              choice(
                'Wi-Fiのパスワードを教えてください。',
                'Waifai no pasuwādo o oshiete kudasai.',
                false,
                'Ask that after check-in is done.',
              ),
            ],
          },
          {
            staffLine: 'お名前をお願いします。',
            staffReading: 'おなまえをおねがいします。',
            staffEnglish: 'May I have your name, please?',
            choices: [
              choice(
                '田中です。',
                'Tanaka desu.',
                true,
                'Give the name on your reservation.',
              ),
              choice(
                '予約しています。',
                'Yoyaku shite imasu.',
                false,
                'They know — now tell them your name.',
              ),
              choice(
                '静かな部屋をお願いします。',
                'Shizuka na heya o onegai shimasu.',
                false,
                'Answer your name first.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '部屋のリクエスト',
        sceneTitleEn: 'Requesting a room preference',
        turns: [
          {
            staffLine: '禁煙ルームと喫煙ルーム、どちらがよろしいですか？',
            staffReading: 'きんえんるーむときつえんるーむ、どちらがよろしいですか？',
            staffEnglish: 'Non-smoking or smoking room?',
            choices: [
              choice(
                '禁煙ルームをお願いします。',
                "Kin'en rūmu o onegai shimasu.",
                true,
                'Most travelers prefer non-smoking.',
              ),
              choice(
                'チェックアウトは何時ですか？',
                'Chekkuauto wa nanji desu ka?',
                false,
                'Answer the smoking question first.',
              ),
              choice(
                '荷物を預かってもらえますか？',
                'Nimotsu o azukatte moraemasu ka?',
                false,
                'Good question, but answer room type first.',
              ),
            ],
          },
          {
            staffLine: '高い階のお部屋でよろしいですか？',
            staffReading: 'たかいかいのへやでよろしいですか？',
            staffEnglish: 'Is a higher floor okay?',
            choices: [
              choice(
                '静かな部屋をお願いします。',
                'Shizuka na heya o onegai shimasu.',
                true,
                'Great add-on — quieter rooms are often higher up.',
              ),
              choice(
                'はい、大丈夫です。',
                'Hai, daijōbu desu.',
                true,
                'Also fine if any room works for you.',
              ),
              choice(
                '予約しています。',
                'Yoyaku shite imasu.',
                false,
                'They are asking about floor preference.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'Wi-Fiと朝食',
        sceneTitleEn: 'Wi-Fi and breakfast info',
        turns: [
          {
            staffLine: '801号室です。鍵カードをどうぞ。',
            staffReading: 'はっぴゃくいちごうしつです。きーカードをどうぞ。',
            staffEnglish: 'Room 801. Here is your key card.',
            choices: [
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Polite — then ask what you still need.',
              ),
              choice(
                'Wi-Fiのパスワードを教えてください。',
                'Waifai no pasuwādo o oshiete kudasai.',
                true,
                'Smart — get Wi-Fi before heading to your room.',
              ),
              choice(
                'チェックアウトをお願いします。',
                'Chekkuauto o onegai shimasu.',
                false,
                'You just checked in!',
              ),
            ],
          },
          {
            staffLine: 'Wi-Fiは部屋番号とお名前です。朝食は7時から1階です。',
            staffReading: 'わいふぁいはへやばんごうとおなまえです。ちょうしょくはしちじからいっかいです。',
            staffEnglish: 'Wi-Fi password is your room number and name. Breakfast is from 7 AM on the 1st floor.',
            choices: [
              choice(
                '朝食は何時からですか？',
                'Chōshoku wa nanji kara desu ka?',
                true,
                'Good to confirm — they said 7 AM.',
              ),
              choice(
                'エレベーターはどこですか？',
                'Erebētā wa doko desu ka?',
                true,
                'Practical — find the elevator to your room.',
              ),
              choice(
                '予約しています。',
                'Yoyaku shite imasu.',
                false,
                'Check-in is done — ask about the hotel.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '荷物を預ける',
        sceneTitleEn: 'Leaving luggage before check-in',
        turns: [
          {
            staffLine: 'チェックインは15時からです。',
            staffReading: 'ちぇっくいんはじゅうごじからです。',
            staffEnglish: 'Check-in is from 3 PM.',
            choices: [
              choice(
                '荷物を預かってもらえますか？',
                'Nimotsu o azukatte moraemasu ka?',
                true,
                'Very common — drop bags and explore the city.',
              ),
              choice(
                'チェックアウトをお願いします。',
                'Chekkuauto o onegai shimasu.',
                false,
                'You have not checked in yet.',
              ),
              choice(
                'Wi-Fiのパスワードを教えてください。',
                'Waifai no pasuwādo o oshiete kudasai.',
                false,
                'You need a room first for Wi-Fi.',
              ),
            ],
          },
          {
            staffLine: 'はい、こちらでお預かりします。何時頃お戻りですか？',
            staffReading: 'はい、こちらでおあずかりします。なんじごろおもどりですか？',
            staffEnglish: 'Yes, we can store it here. What time will you return?',
            choices: [
              choice(
                '18時ごろ戻ります。',
                'Jūhachi-ji goro modorimasu.',
                true,
                'Helpful for the hotel — give a rough time.',
              ),
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Polite — a time estimate is even better.',
              ),
              choice(
                '静かな部屋をお願いします。',
                'Shizuka na heya o onegai shimasu.',
                false,
                'Answer when you will pick up your bags.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'チェックアウト',
        sceneTitleEn: 'Checking out',
        turns: [
          {
            staffLine: 'おはようございます。本日チェックアウトですか？',
            staffReading: 'おはようございます。ほんじつちぇっくあうとですか？',
            staffEnglish: 'Good morning. Checking out today?',
            choices: [
              choice(
                'チェックアウトをお願いします。',
                'Chekkuauto o onegai shimasu.',
                true,
                'Standard phrase for checking out.',
              ),
              choice(
                '予約しています。',
                'Yoyaku shite imasu.',
                false,
                'You are leaving, not arriving.',
              ),
              choice(
                'Wi-Fiのパスワードを教えてください。',
                'Waifai no pasuwādo o oshiete kudasai.',
                false,
                'You are checking out.',
              ),
            ],
          },
          {
            staffLine: '合計12,800円です。カードでよろしいですか？',
            staffReading: 'ごうけいいちまんにせんはっぴゃくえんです。カードでよろしいですか？',
            staffEnglish: 'The total is ¥12,800. Card payment okay?',
            choices: [
              choice(
                'はい、カードでお願いします。',
                'Hai, kādo de onegai shimasu.',
                true,
                'Natural — confirm payment method.',
              ),
              choice(
                '荷物を預かってもらえますか？',
                'Nimotsu o azukatte moraemasu ka?',
                false,
                'Pay first — you can ask about luggage after.',
              ),
              choice(
                '朝食は何時からですか？',
                'Chōshoku wa nanji kara desu ka?',
                false,
                'You are checking out, not asking about breakfast.',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    dayNumber: 3,
    daysBeforeTrip: 5,
    title: 'コンビニ＆支払い',
    titleEn: 'Convenience Store',
    goal: '買い物・会計・カード支払い',
    goalEn: 'Shop, pay, and use cards',
    emoji: '🏪',
    accent: 'from-pink-500 to-rose-500',
    quizCount: TRIP_PACK_QUIZ_COUNT_DEFAULT,
    wordIds: [
      's2', 's3', 's6', 's7', 's14', 's15', 's16', 's17',
      's18', 's19', 's20', 's24', 's25', 's29', 's30',
    ],
    roleplays: [
      {
        sceneTitle: '店内で買い物',
        sceneTitleEn: 'Shopping in the store',
        turns: [
          {
            staffLine: 'いらっしゃいませ。',
            staffReading: 'いらっしゃいませ。',
            staffEnglish: 'Welcome. (Standard greeting)',
            choices: [
              choice(
                'すみません、おにぎりはどこですか？',
                'Sumimasen, onigiri wa doko desu ka?',
                true,
                'Natural — ask where to find something.',
              ),
              choice(
                'ちょっと見ているだけです。',
                'Chotto mite iru dake desu.',
                true,
                'Fine if you are just browsing.',
              ),
              choice(
                '袋は要りません。',
                'Fukuro wa irimasen.',
                false,
                'That is for checkout, not when entering.',
              ),
            ],
          },
          {
            staffLine: 'おにぎりは奥の冷蔵庫にございます。',
            staffReading: 'おにぎりはおくのれいぞうこにございます。',
            staffEnglish: 'Onigiri is in the fridge at the back.',
            choices: [
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Polite — then grab what you need.',
              ),
              choice(
                'これはいくらですか？',
                'Kore wa ikura desu ka?',
                false,
                'Ask price at the register, or check the tag.',
              ),
              choice(
                'クレジットカードは使えますか？',
                'Kurejitto kādo wa tsukaemasu ka?',
                false,
                'Ask that when paying.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'レジで会計',
        sceneTitleEn: 'At the register',
        turns: [
          {
            staffLine: 'お弁当を温めますか？',
            staffReading: 'おべんとうをあたためますか？',
            staffEnglish: 'Would you like your bento heated?',
            choices: [
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'Standard yes — staff will microwave it.',
              ),
              choice(
                'いいえ、結構です。',
                'Iie, kekkō desu.',
                true,
                'Also fine if you want it cold.',
              ),
              choice(
                'レシートは要りません。',
                'Reshīto wa irimasen.',
                false,
                'They asked about heating, not the receipt.',
              ),
            ],
          },
          {
            staffLine: 'お箸はお付けしますか？',
            staffReading: 'おはしはおつけしますか？',
            staffEnglish: 'Would you like chopsticks?',
            choices: [
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'You will need them for bento.',
              ),
              choice(
                '袋をいただけますか？',
                'Fukuro o itadakemasu ka?',
                true,
                'Also useful — ask for a bag.',
              ),
              choice(
                'お弁当を温めますか？',
                'Obentō o atatame masu ka?',
                false,
                'They already asked that — answer chopsticks.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '支払い方法',
        sceneTitleEn: 'Payment method',
        turns: [
          {
            staffLine: '648円です。',
            staffReading: 'ろっぴゃくよんじゅうはちえんです。',
            staffEnglish: 'That will be ¥648.',
            choices: [
              choice(
                'クレジットカードは使えますか？',
                'Kurejitto kādo wa tsukaemasu ka?',
                true,
                'Always good to confirm before paying.',
              ),
              choice(
                '電子マネーは使えますか？',
                'Denshi manē wa tsukaemasu ka?',
                true,
                'Suica/Pasmo work at most konbini.',
              ),
              choice(
                'これはいくらですか？',
                'Kore wa ikura desu ka?',
                false,
                'They just told you the total.',
              ),
            ],
          },
          {
            staffLine: 'はい、カードで大丈夫です。',
            staffReading: 'はい、カードでだいじょうぶです。',
            staffEnglish: 'Yes, card is fine.',
            choices: [
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Pay and thank them.',
              ),
              choice(
                'これに決めます。',
                'Kore ni kimemasu.',
                false,
                'You already decided — time to pay.',
              ),
              choice(
                'ちょっと見ているだけです。',
                'Chotto mite iru dake desu.',
                false,
                'You are at checkout with items.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'ポイントカード',
        sceneTitleEn: 'Points card question',
        turns: [
          {
            staffLine: 'ポイントカードはお持ちですか？',
            staffReading: 'ぽいんとかーどはおもちですか？',
            staffEnglish: 'Do you have a point card?',
            choices: [
              choice(
                'いいえ、結構です。',
                'Iie, kekkō desu.',
                true,
                'Polite no — tourists rarely have one.',
              ),
              choice(
                '持っていません。',
                'Motte imasen.',
                true,
                'Also natural.',
              ),
              choice(
                '袋は要りません。',
                'Fukuro wa irimasen.',
                false,
                'Answer the points question first.',
              ),
            ],
          },
          {
            staffLine: 'レシートは要りますか？',
            staffReading: 'れしーとはいりますか？',
            staffEnglish: 'Do you need a receipt?',
            choices: [
              choice(
                'レシートは要りません。',
                'Reshīto wa irimasen.',
                true,
                'Eco-friendly and faster.',
              ),
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'Fine if you want a receipt.',
              ),
              choice(
                'ポイントカードはお持ちですか？',
                'Pointo kādo wa omochi desu ka?',
                false,
                'They are asking about the receipt now.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '在庫を確認',
        sceneTitleEn: 'Checking if something is in stock',
        turns: [
          {
            staffLine: 'すみません、何かお探しですか？',
            staffReading: 'すみません、なにかおさがしですか？',
            staffEnglish: 'Excuse me, are you looking for something?',
            choices: [
              choice(
                '在庫はありますか？',
                'Zaiko wa arimasu ka?',
                true,
                'Direct — ask if they have it in stock.',
              ),
              choice(
                'すみません、これはありますか？',
                'Sumimasen, kore wa arimasu ka?',
                true,
                'Show your phone or describe the item.',
              ),
              choice(
                '袋は要りません。',
                'Fukuro wa irimasen.',
                false,
                'They asked if you need help finding something.',
              ),
            ],
          },
          {
            staffLine: '申し訳ございません、本日は売り切れです。',
            staffReading: 'もうしわけございません、ほんじつはうりきれです。',
            staffEnglish: 'Sorry, we are sold out today.',
            choices: [
              choice(
                'わかりました。ありがとうございます。',
                'Wakarimashita. Arigatō gozaimasu.',
                true,
                'Polite acceptance — try another store.',
              ),
              choice(
                '近くに他の店はありますか？',
                'Chikaku ni hoka no mise wa arimasu ka?',
                true,
                'Smart follow-up if you really need it.',
              ),
              choice(
                'クレジットカードは使えますか？',
                'Kurejitto kādo wa tsukaemasu ka?',
                false,
                'Wrong moment — they said sold out.',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    dayNumber: 4,
    daysBeforeTrip: 4,
    title: 'レストラン＆ラーメン',
    titleEn: 'Restaurant & Ramen',
    goal: '注文・お会計・おいしかったの一言',
    goalEn: 'Order food and pay the bill',
    emoji: '🍜',
    accent: 'from-orange-500 to-amber-500',
    quizCount: TRIP_PACK_QUIZ_COUNT_DEFAULT,
    wordIds: [
      'r6', 'r7', 'r14', 'r15', 'r16', 'r17', 'r18', 'r19',
      'r24', 'r26', 'r29', 'r30', 'i15', 'g20', 'g15',
    ],
    roleplays: [
      {
        sceneTitle: 'ラーメン屋に入店',
        sceneTitleEn: 'Entering a ramen shop',
        turns: [
          {
            staffLine: 'いらっしゃいませ。何名様ですか？',
            staffReading: 'いらっしゃいませ。なんめいさまですか？',
            staffEnglish: 'Welcome. How many?',
            choices: [
              choice(
                '一名です。',
                'Ichimei desu.',
                true,
                'One person — standard reply.',
              ),
              choice(
                'これをお願いします。',
                'Kore o onegai shimasu.',
                false,
                'They asked headcount first — answer that.',
              ),
              choice(
                'ごちそうさまでした。',
                'Gochisōsama deshita.',
                false,
                'Say that after eating, not when entering.',
              ),
            ],
          },
          {
            staffLine: 'カウンター席でよろしいですか？',
            staffReading: 'カウンターせきでよろしいですか？',
            staffEnglish: 'Counter seat okay?',
            choices: [
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'Counter seats are common at ramen shops.',
              ),
              choice(
                'お会計をお願いします。',
                'Okaikei o onegai shimasu.',
                false,
                'You have not eaten yet!',
              ),
              choice(
                'メニューを見せてください。',
                'Menyū o misete kudasai.',
                false,
                'Ramen shops often use ticket machines — sit first.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '食券機で注文',
        sceneTitleEn: 'Ordering at the ticket machine',
        turns: [
          {
            staffLine: '先に券売機でご注文ください。',
            staffReading: 'さきにけんばいきでごちゅうもんください。',
            staffEnglish: 'Please order at the ticket machine first.',
            choices: [
              choice(
                'わかりました。',
                'Wakarimashita.',
                true,
                'Acknowledge and head to the machine.',
              ),
              choice(
                'すみません、使い方がわかりません。',
                'Sumimasen, tsukaikata ga wakarimasen.',
                true,
                'Totally fine — staff will help.',
              ),
              choice(
                '替え玉をお願いします。',
                'Kaedama o onegai shimasu.',
                false,
                'Kaedama is after you finish your noodles.',
              ),
            ],
          },
          {
            staffLine: '人気は豚骨ラーメンです。こちらを押してください。',
            staffReading: 'にんきはとんこつらーめんです。こちらをおしてください。',
            staffEnglish: 'Tonkotsu ramen is popular. Press this button.',
            choices: [
              choice(
                'これをお願いします。',
                'Kore o onegai shimasu.',
                true,
                'Point and confirm your choice.',
              ),
              choice(
                'おすすめは何ですか？',
                'Osusume wa nan desu ka?',
                true,
                'They just recommended tonkotsu — good confirmation.',
              ),
              choice(
                'ごちそうさまでした。',
                'Gochisōsama deshita.',
                false,
                'You have not eaten yet.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '味の好み',
        sceneTitleEn: 'Customize your ramen',
        turns: [
          {
            staffLine: '麺の硬さはいかがなさいますか？',
            staffReading: 'めんのかたさはいかがなさいますか？',
            staffEnglish: 'How firm would you like the noodles?',
            choices: [
              choice(
                '普通でお願いします。',
                'Futsū de onegai shimasu.',
                true,
                'Standard — safe choice for first-timers.',
              ),
              choice(
                '硬めでお願いします。',
                'Katame de onegai shimasu.',
                true,
                'Firmer noodles — popular option.',
              ),
              choice(
                'お会計をお願いします。',
                'Okaikei o onegai shimasu.',
                false,
                'They are customizing your order.',
              ),
            ],
          },
          {
            staffLine: 'スープの濃さは？',
            staffReading: 'スープのこさは？',
            staffEnglish: 'Soup thickness?',
            choices: [
              choice(
                '普通で。',
                'Futsū de.',
                true,
                'Casual and natural at ramen shops.',
              ),
              choice(
                '脂少なめでお願いします。',
                'Abura sukuname de onegai shimasu.',
                true,
                'Less oily — good if you want it lighter.',
              ),
              choice(
                '一名です。',
                'Ichimei desu.',
                false,
                'They already seated you.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '食事中',
        sceneTitleEn: 'During the meal',
        turns: [
          {
            staffLine: '替え玉はいかがですか？',
            staffReading: 'かえだまはいかがですか？',
            staffEnglish: 'Would you like extra noodles (kaedama)?',
            choices: [
              choice(
                '替え玉をお願いします。',
                'Kaedama o onegai shimasu.',
                true,
                'Classic ramen move — extra noodles only.',
              ),
              choice(
                'いいえ、結構です。',
                'Iie, kekkō desu.',
                true,
                'Fine if you are full.',
              ),
              choice(
                'これをお願いします。',
                'Kore o onegai shimasu.',
                false,
                'They asked specifically about kaedama.',
              ),
            ],
          },
          {
            staffLine: '200円です。食券機でお願いします。',
            staffReading: 'にひゃくえんです。しょっけんきでおねがいします。',
            staffEnglish: '¥200. Please use the ticket machine.',
            choices: [
              choice(
                'わかりました。',
                'Wakarimashita.',
                true,
                'Head to the machine and buy a kaedama ticket.',
              ),
              choice(
                'お会計をお願いします。',
                'Okaikei o onegai shimasu.',
                false,
                'Pay for kaedama at the machine, not the table.',
              ),
              choice(
                'ごちそうさまでした。',
                'Gochisōsama deshita.',
                false,
                'You are still eating.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '食後の会計',
        sceneTitleEn: 'After the meal',
        turns: [
          {
            staffLine: 'ごちそうさまでした。',
            staffReading: 'ごちそうさまでした。',
            staffEnglish: 'Thank you for the meal. (Staff says this)',
            choices: [
              choice(
                'ごちそうさまでした。',
                'Gochisōsama deshita.',
                true,
                'Reply with the same phrase — great manners!',
              ),
              choice(
                'おいしかったです。',
                'Oishikatta desu.',
                true,
                'Staff love hearing this.',
              ),
              choice(
                'これをお願いします。',
                'Kore o onegai shimasu.',
                false,
                'You already ate — time to leave.',
              ),
            ],
          },
          {
            staffLine: 'お会計はレジでお願いします。',
            staffReading: 'おかいけいはれじでおねがいします。',
            staffEnglish: 'Please pay at the register.',
            choices: [
              choice(
                'お会計をお願いします。',
                'Okaikei o onegai shimasu.',
                true,
                'Standard way to ask for the bill.',
              ),
              choice(
                'ありがとうございました。',
                'Arigatō gozaimashita.',
                true,
                'Polite thank-you when leaving.',
              ),
              choice(
                'メニューを見せてください。',
                'Menyū o misete kudasai.',
                false,
                'You already finished eating.',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    dayNumber: 5,
    daysBeforeTrip: 3,
    title: '居酒屋デビュー',
    titleEn: 'Izakaya Night',
    goal: '乾杯・注文・お会計まで',
    goalEn: 'Cheers, order, and pay at an izakaya',
    emoji: '🍺',
    accent: 'from-purple-500 to-indigo-600',
    quizCount: TRIP_PACK_QUIZ_COUNT_DEFAULT,
    wordIds: [
      'i6', 'i12', 'i14', 'i15', 'i16', 'i17', 'i18', 'i20',
      'i23', 'i25', 'i28', 'i29', 'i19', 'i24', 'i26',
    ],
    roleplays: [
      {
        sceneTitle: '居酒屋に入店',
        sceneTitleEn: 'Entering an izakaya',
        turns: [
          {
            staffLine: 'いらっしゃいませ。何名様ですか？',
            staffReading: 'いらっしゃいませ。なんめいさまですか？',
            staffEnglish: 'Welcome. How many in your party?',
            choices: [
              choice(
                '二名です。',
                'Nimei desu.',
                true,
                'Two people — adjust the number as needed.',
              ),
              choice(
                '席は空いていますか？',
                'Seki wa aite imasu ka?',
                true,
                'Also natural when it looks busy.',
              ),
              choice(
                'お会計、別々でお願いします。',
                'Okaikei, betsubetsu de onegai shimasu.',
                false,
                'Way too early — you have not ordered yet.',
              ),
            ],
          },
          {
            staffLine: '禁煙席と喫煙席、どちらにしますか？',
            staffReading: 'きんえんせきときつえんせき、どちらにしますか？',
            staffEnglish: 'Non-smoking or smoking section?',
            choices: [
              choice(
                '禁煙席はありますか？',
                "Kin'en seki wa arimasu ka?",
                true,
                'Most travelers prefer non-smoking.',
              ),
              choice(
                '禁煙でお願いします。',
                "Kin'en de onegai shimasu.",
                true,
                'Short and clear.',
              ),
              choice(
                '生ビールをお願いします。',
                'Nama bīru o onegai shimasu.',
                false,
                'Order drinks after you are seated.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '最初の注文',
        sceneTitleEn: 'First round of orders',
        turns: [
          {
            staffLine: 'ご注文はお決まりですか？',
            staffReading: 'ごちゅうもんはおきまりですか？',
            staffEnglish: 'Ready to order?',
            choices: [
              choice(
                'とりあえず生ビールをお願いします。',
                'Toriaezu nama bīru o onegai shimasu.',
                true,
                '"Toriaezu" = for starters — very izakaya!',
              ),
              choice(
                'おすすめは何ですか？',
                'Osusume wa nan desu ka?',
                true,
                'Great when the menu is all in Japanese.',
              ),
              choice(
                'カンパイ！',
                'Kanpai!',
                false,
                'Say cheers with friends, not to the waiter.',
              ),
            ],
          },
          {
            staffLine: 'お通しの枝豆です。本日380円です。',
            staffReading: 'おとおしのえだまめです。ほんじつさんびゃくはちじゅうえんです。',
            staffEnglish: 'Today\'s otōshi is edamame. ¥380.',
            choices: [
              choice(
                'わかりました。',
                'Wakarimashita.',
                true,
                'Otōshi is a table charge appetizer — standard at izakaya.',
              ),
              choice(
                'お通しは何ですか？',
                'Otōshi wa nan desu ka?',
                true,
                'Fine to ask if you are not sure.',
              ),
              choice(
                'お会計、別々でお願いします。',
                'Okaikei, betsubetsu de onegai shimasu.',
                false,
                'They are explaining otōshi, not the bill.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '追加注文',
        sceneTitleEn: 'Ordering more food',
        turns: [
          {
            staffLine: '他にご注文はございますか？',
            staffReading: 'ほかにごちゅうもんはございますか？',
            staffEnglish: 'Anything else to order?',
            choices: [
              choice(
                '焼き鳥を盛り合わせで。',
                'Yakitori o moriawase de.',
                true,
                'Classic izakaya order.',
              ),
              choice(
                '唐揚げをお願いします。',
                'Karaage o onegai shimasu.',
                true,
                'Popular and easy to share.',
              ),
              choice(
                '乾杯する',
                'Kanpai suru',
                false,
                'That is an action, not an order.',
              ),
            ],
          },
          {
            staffLine: '少々お待ちください。',
            staffReading: 'しょうしょうおまちください。',
            staffEnglish: 'Please wait a moment.',
            choices: [
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'Simple acknowledgment.',
              ),
              choice(
                'とりあえずこれで。',
                'Toriaezu kore de.',
                true,
                'Means "that\'s all for now" — if you are done ordering.',
              ),
              choice(
                'ラストオーダーは何時ですか？',
                'Rasuto ōdā wa nanji desu ka?',
                false,
                'Wrong timing — they are bringing your food.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'もう一杯',
        sceneTitleEn: 'Another drink',
        turns: [
          {
            staffLine: 'お飲み物のおかわりはいかがですか？',
            staffReading: 'おのみもののおかわりはいかがですか？',
            staffEnglish: 'Would you like another drink?',
            choices: [
              choice(
                'もう一杯お願いします。',
                'Mō ippai onegai shimasu.',
                true,
                'Natural way to order another round.',
              ),
              choice(
                'おかわりをお願いします。',
                'Okawari o onegai shimasu.',
                true,
                'Same meaning — another round.',
              ),
              choice(
                '席は空いていますか？',
                'Seki wa aite imasu ka?',
                false,
                'You are already seated and drinking.',
              ),
            ],
          },
          {
            staffLine: 'ビールとハイボール、どちらにしますか？',
            staffReading: 'ビールとはいぼーる、どちらにしますか？',
            staffEnglish: 'Beer or highball?',
            choices: [
              choice(
                '生ビールをお願いします。',
                'Nama bīru o onegai shimasu.',
                true,
                'Stick with draft beer.',
              ),
              choice(
                'ハイボールをお願いします。',
                'Haibōru o onegai shimasu.',
                true,
                'Whiskey highball — izakaya staple.',
              ),
              choice(
                'お通しは何ですか？',
                'Otōshi wa nan desu ka?',
                false,
                'They asked which drink you want.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'お会計',
        sceneTitleEn: 'Paying the bill',
        turns: [
          {
            staffLine: 'そろそろお時間よろしいですか？',
            staffReading: 'そろそろおじかんよろしいですか？',
            staffEnglish: 'Are you about ready to wrap up? (Closing time approaching)',
            choices: [
              choice(
                'お会計をお願いします。',
                'Okaikei o onegai shimasu.',
                true,
                'Standard way to ask for the bill.',
              ),
              choice(
                'ラストオーダーは何時ですか？',
                'Rasuto ōdā wa nanji desu ka?',
                true,
                'Good to know if you want one more round.',
              ),
              choice(
                'とりあえず生ビールをお願いします。',
                'Toriaezu nama bīru o onegai shimasu.',
                false,
                'They are asking if you are finishing up.',
              ),
            ],
          },
          {
            staffLine: '4,850円です。一括でよろしいですか？',
            staffReading: 'よんせんはっぴゃくごじゅうえんです。いっかつでよろしいですか？',
            staffEnglish: '¥4,850. One bill for everyone?',
            choices: [
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'One bill — pay together.',
              ),
              choice(
                'お会計、別々でお願いします。',
                'Okaikei, betsubetsu de onegai shimasu.',
                true,
                'Split the bill — common with friends.',
              ),
              choice(
                'カンパイ！',
                'Kanpai!',
                false,
                'Time to pay, not toast.',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    dayNumber: 6,
    daysBeforeTrip: 2,
    title: 'トラブル対応',
    titleEn: 'Trouble Survival',
    goal: '体調不良・道に迷う・助けを求める',
    goalEn: 'Handle sickness and emergencies',
    emoji: '🆘',
    accent: 'from-red-500 to-rose-600',
    quizCount: TRIP_PACK_QUIZ_COUNT_DEFAULT,
    wordIds: [
      'kb14', 'kb15', 'kb16', 'kb19', 'kb20', 'kb23', 'kb24',
      'h14', 'h15', 'h16', 'h18', 'h20', 'h25', 'h27', 'h28',
    ],
    roleplays: [
      {
        sceneTitle: '道に迷った',
        sceneTitleEn: 'Lost on the street',
        turns: [
          {
            staffLine: 'すみません、どうかしましたか？',
            staffReading: 'すみません、どうかしましたか？',
            staffEnglish: 'Excuse me, is something wrong?',
            choices: [
              choice(
                '道に迷いました。',
                'Michi ni mayoimashita.',
                true,
                'Clear — people will help you.',
              ),
              choice(
                'すみません。',
                'Sumimasen.',
                true,
                'Gets attention — then explain you are lost.',
              ),
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                false,
                'Explain your problem first.',
              ),
            ],
          },
          {
            staffLine: 'どちらに行きたいですか？',
            staffReading: 'どちらにいきたいですか？',
            staffEnglish: 'Where do you want to go?',
            choices: [
              choice(
                'ここからホテルまでの道を教えてください。',
                'Koko kara hoteru made no michi o oshiete kudasai.',
                true,
                'Specific — show hotel name on your phone.',
              ),
              choice(
                '最寄りの交番はどこですか？',
                'Moyori no kōban wa doko desu ka?',
                true,
                'Police boxes are great for directions.',
              ),
              choice(
                '助けてください。',
                'Tasukete kudasai.',
                false,
                'Too vague — say where you want to go.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '交番で相談',
        sceneTitleEn: 'At a police box (kōban)',
        turns: [
          {
            staffLine: 'どうしましたか？',
            staffReading: 'どうしましたか？',
            staffEnglish: 'What happened?',
            choices: [
              choice(
                '財布をなくしました。',
                'Saifu o nakushimashita.',
                true,
                'Clear report — they will help you.',
              ),
              choice(
                '道に迷いました。',
                'Michi ni mayoimashita.',
                true,
                'Also common at kōban.',
              ),
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                false,
                'Explain your problem first.',
              ),
            ],
          },
          {
            staffLine: 'いつなくしましたか？',
            staffReading: 'いつなくしましたか？',
            staffEnglish: 'When did you lose it?',
            choices: [
              choice(
                '1時間前です。',
                'Ichi-jikan mae desu.',
                true,
                'Helpful detail for the report.',
              ),
              choice(
                'さっきです。',
                'Sakki desu.',
                true,
                'Casual for "just now / a little while ago."',
              ),
              choice(
                '英語は話せますか？',
                'Eigo wa hanasemasu ka?',
                false,
                'Answer when first — ask about English after.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '病院の受付',
        sceneTitleEn: 'Hospital reception',
        turns: [
          {
            staffLine: 'どうされましたか？',
            staffReading: 'どうされましたか？',
            staffEnglish: 'What seems to be the problem?',
            choices: [
              choice(
                '気分が悪いです。',
                'Kibun ga warui desu.',
                true,
                'Simple and clear for feeling sick.',
              ),
              choice(
                '熱があります。',
                'Netsu ga arimasu.',
                true,
                'Specific — mention fever if you have one.',
              ),
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                false,
                'Describe symptoms first.',
              ),
            ],
          },
          {
            staffLine: '他に症状はありますか？',
            staffReading: 'ほかにしょうじょうはありますか？',
            staffEnglish: 'Any other symptoms?',
            choices: [
              choice(
                '頭が痛いです。',
                'Atama ga itai desu.',
                true,
                'Headache — common and clear.',
              ),
              choice(
                'のどが痛いです。',
                'Nodo ga itai desu.',
                true,
                'Sore throat — good to mention.',
              ),
              choice(
                '予約は必要ですか？',
                'Yoyaku wa hitsuyō desu ka?',
                false,
                'Answer symptoms first — you already walked in.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '診察後',
        sceneTitleEn: 'After seeing the doctor',
        turns: [
          {
            staffLine: 'お薬を3日分出します。食後に1日3回です。',
            staffReading: 'おくすりをみっかぶんだします。しょくごにいちにちさんかいです。',
            staffEnglish: 'I will prescribe 3 days of medicine. 3 times daily after meals.',
            choices: [
              choice(
                'わかりました。',
                'Wakarimashita.',
                true,
                'Acknowledge the instructions.',
              ),
              choice(
                '薬をください。',
                'Kusuri o kudasai.',
                false,
                'They are explaining — listen first.',
              ),
              choice(
                '気分が悪いです。',
                'Kibun ga warui desu.',
                false,
                'You already explained symptoms.',
              ),
            ],
          },
          {
            staffLine: '保険証はお持ちですか？',
            staffReading: 'ほけんしょうはおもちですか？',
            staffEnglish: 'Do you have insurance?',
            choices: [
              choice(
                'いいえ、持っていません。',
                'Iie, motte imasen.',
                true,
                'Tourists usually pay out of pocket.',
              ),
              choice(
                '保険証は使えますか？',
                'Hokenshō wa tsukaemasu ka?',
                true,
                'Good to ask — most travelers cannot use Japanese insurance.',
              ),
              choice(
                'ここが痛みます。',
                'Koko ga itamimasu.',
                false,
                'Answer the insurance question.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'スマホを落とした',
        sceneTitleEn: 'Lost your phone',
        turns: [
          {
            staffLine: '交番です。どうしましたか？',
            staffReading: 'こうばんです。どうしましたか？',
            staffEnglish: 'This is the police box. What happened?',
            choices: [
              choice(
                '携帯電話を落としました。',
                'Keitai denwa o otoshimashita.',
                true,
                'Clear report for a lost phone.',
              ),
              choice(
                'スマホを落としました。',
                'Sumaho o otoshimashita.',
                true,
                'Same meaning — more casual.',
              ),
              choice(
                '道に迷いました。',
                'Michi ni mayoimashita.',
                false,
                'You lost your phone, not your way.',
              ),
            ],
          },
          {
            staffLine: 'どこで落としたか覚えていますか？',
            staffReading: 'どこでおとしたかおぼえていますか？',
            staffEnglish: 'Do you remember where you dropped it?',
            choices: [
              choice(
                '電車の中だと思います。',
                'Densha no naka da to omoimasu.',
                true,
                'Helpful — they can contact the train company.',
              ),
              choice(
                'この近くです。',
                'Kono chikaku desu.',
                true,
                'Near here — they will search the area.',
              ),
              choice(
                '助けてください。',
                'Tasukete kudasai.',
                false,
                'Give location details if you can.',
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    dayNumber: 7,
    daysBeforeTrip: 1,
    title: '最終チェック',
    titleEn: 'Final Check',
    goal: 'タクシー・最終復習で日本準備完了',
    goalEn: 'Taxi phrases and final review',
    emoji: '🎌',
    accent: 'from-indigo-600 to-violet-700',
    quizCount: TRIP_PACK_QUIZ_COUNT_DEFAULT,
    wordIds: [
      'tx6', 'tx7', 'tx14', 'tx15', 'tx16', 'tx17', 'tx18', 'tx19',
      'tx20', 'tx21', 'a20', 'g15', 'g16', 'g19', 'g25',
    ],
    roleplays: [
      {
        sceneTitle: 'タクシーを止める',
        sceneTitleEn: 'Hailing a taxi',
        turns: [
          {
            staffLine: '（タクシーが止まる）どうぞ。',
            staffReading: '（たくしーがとまる）どうぞ。',
            staffEnglish: '(Taxi stops) Please get in.',
            choices: [
              choice(
                '空港までお願いします。',
                'Kūkō made onegai shimasu.',
                true,
                'Clear destination — show address on phone too.',
              ),
              choice(
                'ここまでお願いします。',
                'Koko made onegai shimasu.',
                true,
                'Point at address on your phone.',
              ),
              choice(
                'ここで降ろしてください。',
                'Koko de oroshite kudasai.',
                false,
                'Say that when arriving, not getting in.',
              ),
            ],
          },
          {
            staffLine: '第一ターミナルですか？国内線ですか？',
            staffReading: 'だいいちたーみなるですか？こくないせんですか？',
            staffEnglish: 'Terminal 1? Domestic flights?',
            choices: [
              choice(
                '国際線ターミナルです。',
                'Kokusaisen tāminaru desu.',
                true,
                'International terminal — specify clearly.',
              ),
              choice(
                'はい、第一ターミナルです。',
                'Hai, daiichi tāminaru desu.',
                true,
                'Confirm terminal 1.',
              ),
              choice(
                'メーターをお願いします。',
                'Mētā o onegai shimasu.',
                false,
                'Meters are always used — answer the terminal question.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '運賃確認',
        sceneTitleEn: 'Confirming the fare',
        turns: [
          {
            staffLine: '高速道路を使いますか？',
            staffReading: 'こうそくどうろをつかいますか？',
            staffEnglish: 'Shall we take the highway?',
            choices: [
              choice(
                'はい、お願いします。',
                'Hai, onegai shimasu.',
                true,
                'Faster but costs extra — good if you are in a hurry.',
              ),
              choice(
                'いいえ、一般道で。',
                'Iie, ippandō de.',
                true,
                'Regular roads — cheaper but slower.',
              ),
              choice(
                'ここで降ろしてください。',
                'Koko de oroshite kudasai.',
                false,
                'You are not there yet.',
              ),
            ],
          },
          {
            staffLine: 'だいたい8,000円くらいです。',
            staffReading: 'だいたいはっせんえんくらいです。',
            staffEnglish: 'It will be about ¥8,000.',
            choices: [
              choice(
                'わかりました。',
                'Wakarimashita.',
                true,
                'Acknowledge the estimate.',
              ),
              choice(
                '空港までいくらですか？',
                'Kūkō made ikura desu ka?',
                true,
                'They just estimated — confirm if unsure.',
              ),
              choice(
                '領収書をください。',
                'Ryōshūsho o kudasai.',
                false,
                'Ask for receipt when paying at the end.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'タクシーで降車',
        sceneTitleEn: 'Getting out of a taxi',
        turns: [
          {
            staffLine: 'こちらでよろしいですか？',
            staffReading: 'こちらでよろしいですか？',
            staffEnglish: 'Is this spot okay?',
            choices: [
              choice(
                'ここで降ろしてください。',
                'Koko de oroshite kudasai.',
                true,
                'Ask to stop here.',
              ),
              choice(
                'はい、ここで大丈夫です。',
                'Hai, koko de daijōbu desu.',
                true,
                'Confirm this spot is fine.',
              ),
              choice(
                '空港までお願いします。',
                'Kūkō made onegai shimasu.',
                false,
                'You are almost there.',
              ),
            ],
          },
          {
            staffLine: '7,850円です。カードでよろしいですか？',
            staffReading: 'ななせんはっぴゃくごじゅうえんです。カードでよろしいですか？',
            staffEnglish: '¥7,850. Card okay?',
            choices: [
              choice(
                'はい、カードでお願いします。',
                'Hai, kādo de onegai shimasu.',
                true,
                'Most Tokyo taxis accept cards.',
              ),
              choice(
                '領収書をください。',
                'Ryōshūsho o kudasai.',
                true,
                'Ask for receipt when paying.',
              ),
              choice(
                'メーターをお願いします。',
                'Mētā o onegai shimasu.',
                false,
                'Meter was running — time to pay.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: 'ホテルからタクシー',
        sceneTitleEn: 'Taxi from hotel',
        turns: [
          {
            staffLine: 'お迎えのタクシーが到着しました。',
            staffReading: 'おむかえのたくしーがとうちゃくしました。',
            staffEnglish: 'Your taxi has arrived. (Hotel staff)',
            choices: [
              choice(
                'ありがとうございます。',
                'Arigatō gozaimasu.',
                true,
                'Thank staff and head to the taxi.',
              ),
              choice(
                '失礼します。',
                'Shitsurei shimasu.',
                true,
                'Polite when leaving the hotel desk.',
              ),
              choice(
                'チェックアウトをお願いします。',
                'Chekkuauto o onegai shimasu.',
                false,
                'You already checked out if the taxi is here.',
              ),
            ],
          },
          {
            staffLine: '（運転手）どちらまでですか？',
            staffReading: '（うんてんしゅ）どちらまでですか？',
            staffEnglish: '(Driver) Where to?',
            choices: [
              choice(
                '成田空港までお願いします。',
                'Narita kūkō made onegai shimasu.',
                true,
                'Narita Airport — say clearly.',
              ),
              choice(
                'この住所までお願いします。',
                'Kono jūsho made onegai shimasu.',
                true,
                'Show address on your phone.',
              ),
              choice(
                'ここで降ろしてください。',
                'Koko de oroshite kudasai.',
                false,
                'You just got in.',
              ),
            ],
          },
        ],
      },
      {
        sceneTitle: '駅で別れ',
        sceneTitleEn: 'Saying goodbye at the station',
        turns: [
          {
            staffLine: 'お世話になりました。',
            staffReading: 'おせわになりました。',
            staffEnglish: 'Thank you for everything. (Someone who helped you)',
            choices: [
              choice(
                'こちらこそ、ありがとうございました。',
                'Kochira koso, arigatō gozaimashita.',
                true,
                'Warm reply — "thank you too."',
              ),
              choice(
                'お疲れ様でした。',
                'Otsukaresama deshita.',
                true,
                'Good after spending time together.',
              ),
              choice(
                'すみません。',
                'Sumimasen.',
                false,
                'Too neutral — they thanked you warmly.',
              ),
            ],
          },
          {
            staffLine: 'また日本に来てくださいね。',
            staffReading: 'またにほんにきてくださいね。',
            staffEnglish: 'Please come to Japan again.',
            choices: [
              choice(
                'はい、また来ます！',
                'Hai, mata kimasu!',
                true,
                'Enthusiastic and natural reply.',
              ),
              choice(
                'よろしくお願いします。',
                'Yoroshiku onegai shimasu.',
                true,
                'Softer farewell — "please take care of me again."',
              ),
              choice(
                'さようなら。',
                'Sayōnara.',
                false,
                'A bit final — "mata kimasu" is warmer.',
              ),
            ],
          },
        ],
      },
    ],
  },
];

export function getTripPackWords(day: TripPackDay): WordCard[] {
  const map = new Map(sampleWords.map((w) => [w.id, w]));
  return day.wordIds.map((id) => map.get(id)).filter((w): w is WordCard => Boolean(w));
}

export function getAllTripPackWords(): WordCard[] {
  const ids = new Set(tripPackDays.flatMap((d) => d.wordIds));
  return sampleWords.filter((w) => ids.has(w.id));
}

export function getRecommendedTripPackDay(daysUntilTrip: number | null): number {
  if (daysUntilTrip === null || daysUntilTrip < 0) return 1;
  if (daysUntilTrip === 0) return 7;
  if (daysUntilTrip > 7) return 1;
  return 8 - daysUntilTrip;
}

export function getTripPackDayEstimateMinutes(day: TripPackDay): number {
  const cards = day.wordIds.length;
  const exchanges = day.roleplays.reduce((sum, rp) => sum + rp.turns.length, 0);
  const quiz = day.quizCount;
  return Math.round(cards * 0.75 + exchanges * 1.5 + quiz * 0.5 + 2);
}
