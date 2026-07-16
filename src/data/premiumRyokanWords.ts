import type { WordCard } from './words';

/** Premium: Ryokan (旅館) — Japanese inn etiquette & stay phrases */
export const premiumRyokanWords: WordCard[] = [
  // --- Nouns ---
  { id: 'ry1', japanese: '旅館', reading: 'りょかん', romaji: 'Ryokan', english: 'Japanese-style inn', situation: 'ryokan' },
  { id: 'ry2', japanese: '和室', reading: 'わしつ', romaji: 'Washitsu', english: 'Japanese-style room (tatami)', situation: 'ryokan' },
  { id: 'ry3', japanese: '畳', reading: 'たたみ', romaji: 'Tatami', english: 'Tatami mat', situation: 'ryokan' },
  { id: 'ry4', japanese: '布団', reading: 'ふとん', romaji: 'Futon', english: 'Futon (bedding)', situation: 'ryokan' },
  { id: 'ry5', japanese: '浴衣', reading: 'ゆかた', romaji: 'Yukata', english: 'Yukata (casual kimono / robe)', situation: 'ryokan' },
  { id: 'ry6', japanese: '玄関', reading: 'げんかん', romaji: 'Genkan', english: 'Entrance (where you remove shoes)', situation: 'ryokan' },
  { id: 'ry7', japanese: '下駄箱', reading: 'げたばこ', romaji: 'Getabako', english: 'Shoe cupboard', situation: 'ryokan' },
  { id: 'ry8', japanese: '夕食', reading: 'ゆうしょく', romaji: 'Yūshoku', english: 'Dinner / evening meal', situation: 'ryokan' },
  { id: 'ry9', japanese: '一泊二食', reading: 'いっぱくにしょく', romaji: 'Ippaku nishoku', english: 'One night with two meals', situation: 'ryokan' },
  { id: 'ry10', japanese: '素泊まり', reading: 'すどまり', romaji: 'Sudomari', english: 'Room-only stay (no meals)', situation: 'ryokan' },
  { id: 'ry11', japanese: '大浴場', reading: 'だいよくじょう', romaji: 'Daiyokujō', english: 'Large communal bath', situation: 'ryokan' },
  { id: 'ry12', japanese: '部屋食', reading: 'へやしょく', romaji: 'Heyashoku', english: 'In-room dining', situation: 'ryokan' },
  { id: 'ry13', japanese: '食事処', reading: 'しょくじどころ', romaji: 'Shokujidokoro', english: 'Dining hall / restaurant (in inn)', situation: 'ryokan' },
  { id: 'ry14', japanese: '仲居', reading: 'なかい', romaji: 'Nakai', english: 'Ryokan attendant / server', situation: 'ryokan' },
  { id: 'ry15', japanese: '館内着', reading: 'かんないぎ', romaji: 'Kannaigi', english: 'In-house loungewear', situation: 'ryokan' },
  // --- Verbs ---
  { id: 'ry16', japanese: '靴を脱ぐ', reading: 'くつをぬぐ', romaji: 'Kutsu o nugu', english: 'To take off your shoes', situation: 'ryokan' },
  { id: 'ry17', japanese: '布団を敷く', reading: 'ふとんをしく', romaji: 'Futon o shiku', english: 'To lay out the futon', situation: 'ryokan' },
  { id: 'ry18', japanese: 'チェックインする', reading: 'ちぇっくいんする', romaji: 'Chekkuin suru', english: 'To check in', situation: 'ryokan' },
  // --- Adjectives ---
  { id: 'ry19', japanese: '和風の', reading: 'わふうの', romaji: 'Wafū no', english: 'Japanese-style', situation: 'ryokan' },
  { id: 'ry20', japanese: '静かな', reading: 'しずかな', romaji: 'Shizuka na', english: 'Quiet / peaceful', situation: 'ryokan' },
  // --- Phrases ---
  { id: 'ry21', japanese: '予約しています。', reading: 'よやくしています。', romaji: 'Yoyaku shite imasu.', english: 'I have a reservation.', situation: 'ryokan' },
  { id: 'ry22', japanese: '一泊二食でお願いします。', reading: 'いっぱくにしょくでおねがいします。', romaji: 'Ippaku nishoku de onegai shimasu.', english: 'One night with two meals, please.', situation: 'ryokan' },
  { id: 'ry23', japanese: '夕食は何時ですか？', reading: 'ゆうしょくはなんじですか？', romaji: 'Yūshoku wa nanji desu ka?', english: 'What time is dinner?', situation: 'ryokan' },
  { id: 'ry24', japanese: '部屋で食事ですか？', reading: 'へやでしょくじですか？', romaji: 'Heya de shokuji desu ka?', english: 'Is dinner served in the room?', situation: 'ryokan' },
  { id: 'ry25', japanese: '大浴場はどこですか？', reading: 'だいよくじょうはどこですか？', romaji: 'Daiyokujō wa doko desu ka?', english: 'Where is the communal bath?', situation: 'ryokan' },
  { id: 'ry26', japanese: '布団を敷いてください。', reading: 'ふとんをしいてください。', romaji: 'Futon o shiite kudasai.', english: 'Please lay out the futon.', situation: 'ryokan' },
  { id: 'ry27', japanese: '靴を脱ぎます。', reading: 'くつをぬぎます。', romaji: 'Kutsu o nugimasu.', english: 'I will take off my shoes.', situation: 'ryokan' },
  { id: 'ry28', japanese: 'アレルギーがあります。', reading: 'あれるぎーがあります。', romaji: 'Arerugī ga arimasu.', english: 'I have an allergy.', situation: 'ryokan' },
  { id: 'ry29', japanese: 'お世話になりました。', reading: 'おせわになりました。', romaji: 'Osewa ni narimashita.', english: 'Thank you for taking care of us.', situation: 'ryokan' },
  { id: 'ry30', japanese: 'チェックアウトは何時ですか？', reading: 'ちぇっくあうとはなんじですか？', romaji: 'Chekkuauto wa nanji desu ka?', english: 'What time is check-out?', situation: 'ryokan' },
];
