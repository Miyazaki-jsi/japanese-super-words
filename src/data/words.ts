import { premiumTravelEssentialWords } from './premiumTravelEssentialWords';
import { premiumNewSituationWords } from './premiumNewSituationWords';
import { premiumExtraSituationWords } from './premiumExtraSituationWords';
import { premiumBatch2SituationWords } from './premiumBatch2SituationWords';
import { premiumRyokanWords } from './premiumRyokanWords';
import { premiumJapaneseTableWords } from './premiumJapaneseTableWords';
import { premiumSukiKiraiWords } from './premiumSukiKiraiWords';
import { premiumChouTsukauWords } from './premiumChouTsukauWords';
import { hatsumodePackWords } from './hatsumodePackWords';

export type SituationId =
  | 'ramen_shop'
  | 'convenience_store'
  | 'greetings'
  | 'hospital'
  | 'train_station'
  | 'izakaya'
  | 'sushi_shop'
  | 'koban'
  | 'hotel'
  | 'hangover'
  | 'missed_last_train'
  | 'festival'
  | 'rainy_day'
  | 'late_night_bar'
  | 'date'
  | 'sauna'
  | 'don_quijote'
  | 'pharmacy'
  | 'coffee_shop'
  | 'gyudon_shop'
  | 'taxi'
  | 'coin_laundry'
  | 'luggage_shipping'
  | 'sim_card'
  | 'airport_immigration'
  | 'ticket_machine'
  | 'onsen'
  | 'karaoke'
  | 'allergies_dietary'
  | 'lost_emergency'
  | 'shrine_temple'
  | 'restaurant_reservation'
  | 'highway_bus'
  | 'disaster_evacuation'
  | 'theme_park'
  | 'atm_payments'
  | 'shinkansen'
  | 'hatsumode'
  | 'depachika'
  | 'game_center'
  | 'coin_locker'
  | 'vending_machine'
  | 'tourist_information'
  | 'trash_carry_out'
  | 'kaiten_sushi'
  | 'post_office'
  | 'cabaret_club'
  | 'tachinomi'
  | 'photo_etiquette'
  | 'ryokan'
  | 'japanese_table'
  | 'suki_kirai'
  | 'chou_tsukau'
  | 'asking_for_directions';

export interface WordCard {
  id: string;
  japanese: string;
  reading: string;
  romaji: string;
  english: string;
  situation: SituationId;
}

export const sampleWords: WordCard[] = [
  // ==================== RAMEN SHOP (30 items) ====================
  // --- Nouns ---
  { id: 'r1', japanese: '豚骨ラーメン', reading: 'とんこつらーめん', romaji: 'Tonkotsu rāmen', english: 'Pork bone broth ramen', situation: 'ramen_shop' },
  { id: 'r2', japanese: '替え玉', reading: 'かえだま', romaji: 'Kaedama', english: 'Extra serving of noodles', situation: 'ramen_shop' },
  { id: 'r3', japanese: '食券', reading: 'しょっけん', romaji: 'Shokken', english: 'Food ticket', situation: 'ramen_shop' },
  { id: 'r4', japanese: 'トッピング', reading: 'とっぴんぐ', romaji: 'Toppingu', english: 'Toppings', situation: 'ramen_shop' },
  { id: 'r5', japanese: 'レンゲ', reading: 'れんげ', romaji: 'Renge', english: 'Ramen spoon', situation: 'ramen_shop' },
  // --- Verbs ---
  { id: 'r6', japanese: '並ぶ', reading: 'ならぶ', romaji: 'Narabu', english: 'To line up / stand in queue', situation: 'ramen_shop' },
  { id: 'r7', japanese: '注文する', reading: 'ちゅうもんする', romaji: 'Chūmon suru', english: 'To order', situation: 'ramen_shop' },
  { id: 'r8', japanese: 'すする', reading: 'すする', romaji: 'Susuru', english: 'To slurp (noodles)', situation: 'ramen_shop' },
  // --- Adjectives ---
  { id: 'r9', japanese: '濃厚な', reading: 'のうこうな', romaji: 'Nōkō na', english: 'Rich / creamy / thick', situation: 'ramen_shop' },
  { id: 'r10', japanese: '硬め', reading: 'かため', romaji: 'Katame', english: 'Firm (noodles)', situation: 'ramen_shop' },
  { id: 'r11', japanese: '熱い', reading: 'あつい', romaji: 'Atsui', english: 'Hot (temperature)', situation: 'ramen_shop' },
  // --- Adverbs ---
  { id: 'r12', japanese: '一気に', reading: 'いっきに', romaji: 'Ikki ni', english: 'All at once / in one go', situation: 'ramen_shop' },
  { id: 'r13', japanese: '大盛りで', reading: 'おおもりで', romaji: 'Ōmori de', english: 'With a large portion', situation: 'ramen_shop' },
  // --- Phrases ---
  { id: 'r14', japanese: 'メニューを見せてください。', reading: 'めにゅーをみせてください。', romaji: 'Menyū o misete kudasai.', english: 'Please show me the menu.', situation: 'ramen_shop' },
  { id: 'r15', japanese: 'これをお願いします。', reading: 'これをおねがいします。', romaji: 'Kore o onegai shimasu.', english: 'This one, please.', situation: 'ramen_shop' },
  { id: 'r16', japanese: 'お会計をお願いします。', reading: 'おかいけいをおねがいします。', romaji: 'Okaikei o onegai shimasu.', english: 'Check, please.', situation: 'ramen_shop' },
  { id: 'r17', japanese: 'お水をお願いします。', reading: 'おみずをおねがいします。', romaji: 'Omizu o onegai shimasu.', english: 'Water, please.', situation: 'ramen_shop' },
  { id: 'r18', japanese: 'ごちそうさまでした。', reading: 'ごちそうさまでした。', romaji: 'Gochisōsama deshita.', english: 'Thank you for the delicious meal.', situation: 'ramen_shop' },
  { id: 'r19', japanese: '麺の硬さは普通で。', reading: 'めんのかたさはふつうで。', romaji: 'Men no katasa wa futsū de.', english: 'Medium noodle hardness, please.', situation: 'ramen_shop' },
  { id: 'r20', japanese: 'にんにく抜きでお願いします。', reading: 'にんにくぬきでおねがいします。', romaji: 'Ninniku nuki de onegai shimasu.', english: 'Without garlic, please.', situation: 'ramen_shop' },
  // --- Extra ---
  { id: 'r21', japanese: '背脂', reading: 'せあぶら', romaji: 'Seabura', english: 'Pork back fat (for broth)', situation: 'ramen_shop' },
  { id: 'r22', japanese: '味見する', reading: 'あじみする', romaji: 'Ajimi suru', english: 'To taste / sample', situation: 'ramen_shop' },
  { id: 'r23', japanese: 'ズルズル', reading: 'ずるずる', romaji: 'Zuruzuru', english: 'Slurping sound (noodles)', situation: 'ramen_shop' },
  { id: 'r24', japanese: '替え玉をお願いします。', reading: 'かえだまをおねがいします。', romaji: 'Kaedama o onegai shimasu.', english: 'Extra noodles, please.', situation: 'ramen_shop' },
  { id: 'r25', japanese: 'ここは人気ですか？', reading: 'ここはにんきですか？', romaji: 'Koko wa ninki desu ka?', english: 'Is this place popular?', situation: 'ramen_shop' },
  { id: 'r26', japanese: 'チャーシュー', reading: 'ちゃーしゅー', romaji: 'Chāshū', english: 'Chashu pork (ramen topping)', situation: 'ramen_shop' },
  { id: 'r27', japanese: '辛い', reading: 'からい', romaji: 'Karai', english: 'Spicy / hot', situation: 'ramen_shop' },
  { id: 'r28', japanese: '待つ', reading: 'まつ', romaji: 'Matsu', english: 'To wait', situation: 'ramen_shop' },
  { id: 'r29', japanese: '半分でお願いします。', reading: 'はんぶんでおねがいします。', romaji: 'Hanbun de onegai shimasu.', english: 'Half portion, please.', situation: 'ramen_shop' },
  { id: 'r30', japanese: 'テイクアウトできますか？', reading: 'ていくあうとできますか？', romaji: 'Teikuauto dekimasu ka?', english: 'Can I get it to go?', situation: 'ramen_shop' },

  // ==================== CONVENIENCE STORE (45 items) ====================
  // --- Nouns ---
  { id: 's1', japanese: 'おにぎり', reading: 'おにぎり', romaji: 'Onigiri', english: 'Rice ball', situation: 'convenience_store' },
  { id: 's2', japanese: 'レジ', reading: 'れじ', romaji: 'Reji', english: 'Cash register', situation: 'convenience_store' },
  { id: 's3', japanese: 'お弁当', reading: 'おべんとう', romaji: 'Obentō', english: 'Bento box / boxed lunch', situation: 'convenience_store' },
  { id: 's4', japanese: '公共料金', reading: 'こうきょうりょうきん', romaji: 'Kōkyō ryōkin', english: 'Utility bills', situation: 'convenience_store' },
  { id: 's5', japanese: '肉まん', reading: 'にくまん', romaji: 'Nikuman', english: 'Steamed pork bun', situation: 'convenience_store' },
  // --- Verbs ---
  { id: 's6', japanese: '温める', reading: 'あたためる', romaji: 'Atatameru', english: 'To heat up (in microwave)', situation: 'convenience_store' },
  { id: 's7', japanese: '支払う', reading: 'しはらう', romaji: 'Shiharau', english: 'To pay', situation: 'convenience_store' },
  { id: 's8', japanese: 'チャージする', reading: 'ちゃーじする', romaji: 'Chāji suru', english: 'To top up / recharge (IC card)', situation: 'convenience_store' },
  // --- Adjectives ---
  { id: 's9', japanese: '冷たい', reading: 'つめたい', romaji: 'Tsumetai', english: 'Cold (to the touch)', situation: 'convenience_store' },
  { id: 's10', japanese: '便利な', reading: 'べんりな', romaji: 'Benri na', english: 'Convenient', situation: 'convenience_store' },
  { id: 's11', japanese: '焼きたての', reading: 'やきたての', romaji: 'Yakitate no', english: 'Freshly baked / freshly fried', situation: 'convenience_store' },
  // --- Adverbs ---
  { id: 's12', japanese: '別々に', reading: 'べつべつに', romaji: 'Betsubetsu ni', english: 'Separately', situation: 'convenience_store' },
  { id: 's13', japanese: 'さっと', reading: 'さっと', romaji: 'Satto', english: 'Quickly / briefly', situation: 'convenience_store' },
  // --- Phrases ---
  { id: 's14', japanese: 'これはいくらですか？', reading: 'これはいくらですか？', romaji: 'Kore wa ikura desu ka?', english: 'How much is this?', situation: 'convenience_store' },
  { id: 's15', japanese: 'クレジットカードは使えますか？', reading: 'くれじっとかーどはつかえますか？', romaji: 'Kurejitto kādo wa tsukaemasu ka?', english: 'Can I use a credit card?', situation: 'convenience_store' },
  { id: 's16', japanese: 'これに決めます。', reading: 'これにきめます。', romaji: 'Kore ni kimemasu.', english: "I'll take this one.", situation: 'convenience_store' },
  { id: 's17', japanese: '袋をいただけますか？', reading: 'ふくろをいただけますか？', romaji: 'Fukuro o itadakemasu ka?', english: 'Could I have a bag, please?', situation: 'convenience_store' },
  { id: 's18', japanese: 'ちょっと見ているだけです。', reading: 'ちょっとみているだけです。', romaji: 'Chotto mite iru dake desu.', english: "I'm just looking, thank you.", situation: 'convenience_store' },
  { id: 's19', japanese: 'お弁当を温めてもらえますか？', reading: 'おべんとうをあたためてもらえますか？', romaji: 'Obentō o atatamete moraemasu ka?', english: 'Can you heat up my bento?', situation: 'convenience_store' },
  { id: 's20', japanese: '袋は要りません。', reading: 'ふくろはいりません。', romaji: 'Fukuro wa irimasen.', english: "I don't need a bag.", situation: 'convenience_store' },
  // --- Extra ---
  { id: 's21', japanese: 'アイスクリーム', reading: 'あいすくりーむ', romaji: 'Aisukurīmu', english: 'Ice cream', situation: 'convenience_store' },
  { id: 's22', japanese: '探す', reading: 'さがす', romaji: 'Sagasu', english: 'To look for / search', situation: 'convenience_store' },
  { id: 's23', japanese: '手軽な', reading: 'てがるな', romaji: 'Tegaru na', english: 'Easy / handy / convenient', situation: 'convenience_store' },
  { id: 's24', japanese: 'ポイントは使えますか？', reading: 'ぽいんとはつかえますか？', romaji: 'Pointo wa tsukaemasu ka?', english: 'Can I use points?', situation: 'convenience_store' },
  { id: 's25', japanese: 'レシートは要りません。', reading: 'れしーとはいりません。', romaji: 'Reshīto wa irimasen.', english: "I don't need a receipt.", situation: 'convenience_store' },
  { id: 's26', japanese: 'コーヒー', reading: 'こーひー', romaji: 'Kōhī', english: 'Coffee', situation: 'convenience_store' },
  { id: 's27', japanese: '選ぶ', reading: 'えらぶ', romaji: 'Erabu', english: 'To choose / select', situation: 'convenience_store' },
  { id: 's28', japanese: '新しい', reading: 'あたらしい', romaji: 'Atarashii', english: 'New / fresh', situation: 'convenience_store' },
  { id: 's29', japanese: '在庫はありますか？', reading: 'ざいこはありますか？', romaji: 'Zaiko wa arimasu ka?', english: 'Is it in stock?', situation: 'convenience_store' },
  { id: 's30', japanese: '電子マネーは使えますか？', reading: 'でんしマネーはつかえますか？', romaji: 'Denshi manē wa tsukaemasu ka?', english: 'Can I use electronic money?', situation: 'convenience_store' },
  // --- Deeper: checkout & daily survival ---
  { id: 's31', japanese: 'これ、お願いします。', reading: 'これ、おねがいします。', romaji: 'Kore, onegai shimasu.', english: 'This one, please. (handing items at the register)', situation: 'convenience_store' },
  { id: 's32', japanese: 'いいえ、大丈夫です。', reading: 'いいえ、だいじょうぶです。', romaji: 'Iie, daijōbu desu.', english: "No, I'm fine. / No, thank you.", situation: 'convenience_store' },
  { id: 's33', japanese: 'はい、温めてください。', reading: 'はい、あたためてください。', romaji: 'Hai, atatamete kudasai.', english: 'Yes, please heat it up.', situation: 'convenience_store' },
  { id: 's34', japanese: 'いいえ、そのままで。', reading: 'いいえ、そのままで。', romaji: 'Iie, sono mama de.', english: 'No, leave it as is (no heating).', situation: 'convenience_store' },
  { id: 's35', japanese: '現金でお願いします。', reading: 'げんきんでおねがいします。', romaji: 'Genkin de onegai shimasu.', english: 'Cash, please.', situation: 'convenience_store' },
  { id: 's36', japanese: 'これでお願いします。', reading: 'これでおねがいします。', romaji: 'Kore de onegai shimasu.', english: 'With this, please. (handing money / a card)', situation: 'convenience_store' },
  { id: 's37', japanese: '領収書をお願いします。', reading: 'りょうしゅうしょをおねがいします。', romaji: 'Ryōshūsho o onegai shimasu.', english: 'A receipt, please. (official receipt)', situation: 'convenience_store' },
  { id: 's38', japanese: 'ポイントカードは持っていません。', reading: 'ぽいんとかーどはもっていません。', romaji: 'Pointo kādo wa motte imasen.', english: "I don't have a points card.", situation: 'convenience_store' },
  { id: 's39', japanese: 'ATMはどこですか？', reading: 'えーてぃーえむはどこですか？', romaji: 'Ē-tī-emu wa doko desu ka?', english: 'Where is the ATM?', situation: 'convenience_store' },
  { id: 's40', japanese: 'トイレはどこですか？', reading: 'といれはどこですか？', romaji: 'Toire wa doko desu ka?', english: 'Where is the restroom?', situation: 'convenience_store' },
  { id: 's41', japanese: 'Suicaにチャージしたいです。', reading: 'すいかにちゃーじしたいです。', romaji: 'Suica ni chāji shitai desu.', english: 'I want to charge my Suica.', situation: 'convenience_store' },
  { id: 's42', japanese: '傘は売っていますか？', reading: 'かさはうっていますか？', romaji: 'Kasa wa utte imasu ka?', english: 'Do you sell umbrellas?', situation: 'convenience_store' },
  { id: 's43', japanese: 'イートインはできますか？', reading: 'いーといんはできますか？', romaji: 'Ītoin wa dekimasu ka?', english: 'Can I eat in here?', situation: 'convenience_store' },
  { id: 's44', japanese: 'コピーをお願いします。', reading: 'こぴーをおねがいします。', romaji: 'Kopī o onegai shimasu.', english: "I'd like a photocopy, please.", situation: 'convenience_store' },
  { id: 's45', japanese: 'お箸はありますか？', reading: 'おはしはありますか？', romaji: 'Ohashi wa arimasu ka?', english: 'Do you have chopsticks?', situation: 'convenience_store' },

  // ==================== GREETINGS (30 items) ====================
  // --- Nouns ---
  { id: 'g1', japanese: '自己紹介', reading: 'じこしょうかい', romaji: 'Jiko shōkai', english: 'Self-introduction', situation: 'greetings' },
  { id: 'g2', japanese: '握手', reading: 'あくしゅ', romaji: 'Akushu', english: 'Handshake', situation: 'greetings' },
  { id: 'g3', japanese: 'お辞儀', reading: 'おじぎ', romaji: 'Ojigi', english: 'Bow (greeting)', situation: 'greetings' },
  { id: 'g4', japanese: '敬語', reading: 'けいご', romaji: 'Keigo', english: 'Honorific / polite language', situation: 'greetings' },
  { id: 'g5', japanese: '笑顔', reading: 'えがお', romaji: 'Egao', english: 'Smiling face / smile', situation: 'greetings' },
  // --- Verbs ---
  { id: 'g6', japanese: '挨拶する', reading: 'あいさつする', romaji: 'Aisatsu suru', english: 'To greet', situation: 'greetings' },
  { id: 'g7', japanese: '感謝する', reading: 'かんしゃする', romaji: 'Kansha suru', english: 'To appreciate / thank', situation: 'greetings' },
  { id: 'g8', japanese: '謝る', reading: 'あやまる', romaji: 'Ayamaru', english: 'To apologize', situation: 'greetings' },
  // --- Adjectives ---
  { id: 'g9', japanese: '丁寧な', reading: 'ていねいな', romaji: 'Teinei na', english: 'Polite / courteous', situation: 'greetings' },
  { id: 'g10', japanese: '親しい', reading: 'したしい', romaji: 'Shitashii', english: 'Close / intimate', situation: 'greetings' },
  { id: 'g11', japanese: '元気な', reading: 'げんきな', romaji: 'Genki na', english: 'Energetic / healthy', situation: 'greetings' },
  // --- Adverbs ---
  { id: 'g12', japanese: '初めて', reading: 'はじめて', romaji: 'Hajimete', english: 'For the first time', situation: 'greetings' },
  { id: 'g13', japanese: 'いつも', reading: 'いつも', romaji: 'Itsumo', english: 'Always', situation: 'greetings' },
  // --- Phrases ---
  { id: 'g14', japanese: 'はじめまして。', reading: 'はじめまして。', romaji: 'Hajimemashite.', english: 'Nice to meet you.', situation: 'greetings' },
  { id: 'g15', japanese: 'ありがとうございます。', reading: 'ありがとうございます。', romaji: 'Arigatō gozaimasu.', english: 'Thank you very much.', situation: 'greetings' },
  { id: 'g16', japanese: 'すみません。', reading: 'すみません。', romaji: 'Sumimasen.', english: 'Excuse me / Sorry.', situation: 'greetings' },
  { id: 'g17', japanese: 'お元気ですか？', reading: 'おげんきですか？', romaji: 'Ogenki desu ka?', english: 'How are you?', situation: 'greetings' },
  { id: 'g18', japanese: 'さようなら。', reading: 'さようなら。', romaji: 'Sayōnara.', english: 'Goodbye.', situation: 'greetings' },
  { id: 'g19', japanese: 'よろしくお願いします。', reading: 'よろしくおねがいします。', romaji: 'Yoroshiku onegai shimasu.', english: 'I look forward to working with you.', situation: 'greetings' },
  { id: 'g20', japanese: 'お疲れ様でした。', reading: 'おつかれさまでした。', romaji: 'Otsukaresama deshita.', english: 'Thank you for your hard work.', situation: 'greetings' },
  // --- Extra ---
  { id: 'g21', japanese: '名刺', reading: 'めいし', romaji: 'Meishi', english: 'Business card', situation: 'greetings' },
  { id: 'g22', japanese: '紹介する', reading: 'しょうかいする', romaji: 'Shōkai suru', english: 'To introduce', situation: 'greetings' },
  { id: 'g23', japanese: '礼儀正しい', reading: 'れいぎただしい', romaji: 'Reigitadashii', english: 'Polite / well-mannered', situation: 'greetings' },
  { id: 'g24', japanese: 'お久しぶりです。', reading: 'おひさしぶりです。', romaji: 'Ohisashiburi desu.', english: 'Long time no see.', situation: 'greetings' },
  { id: 'g25', japanese: '失礼します。', reading: 'しつれいします。', romaji: 'Shitsurei shimasu.', english: 'Excuse me (entering/leaving).', situation: 'greetings' },
  { id: 'g26', japanese: '挨拶を交わす', reading: 'あいさつをかわす', romaji: 'Aisatsu o kawasu', english: 'To exchange greetings', situation: 'greetings' },
  { id: 'g27', japanese: '呼ぶ', reading: 'よぶ', romaji: 'Yobu', english: 'To call (someone)', situation: 'greetings' },
  { id: 'g28', japanese: 'お邪魔します。', reading: 'おじゃまします。', romaji: 'Ojama shimasu.', english: 'Sorry to intrude (entering a home).', situation: 'greetings' },
  { id: 'g29', japanese: 'いってきます。', reading: 'いってきます。', romaji: 'Itte kimasu.', english: "I'm off (leaving home).", situation: 'greetings' },
  { id: 'g30', japanese: 'ただいま。', reading: 'ただいま。', romaji: 'Tadaima.', english: "I'm home.", situation: 'greetings' },

  // ==================== HOSPITAL (30 items) ====================
  // --- Nouns ---
  { id: 'h1', japanese: '医者', reading: 'いしゃ', romaji: 'Isha', english: 'Doctor', situation: 'hospital' },
  { id: 'h2', japanese: '処方箋', reading: 'しょほうせん', romaji: 'Shohōsen', english: 'Prescription', situation: 'hospital' },
  { id: 'h3', japanese: '体温計', reading: 'たいおんけい', romaji: 'Taionkei', english: 'Thermometer', situation: 'hospital' },
  { id: 'h4', japanese: '待合室', reading: 'まちあいしつ', romaji: 'Machiaishitsu', english: 'Waiting room', situation: 'hospital' },
  { id: 'h5', japanese: '注射', reading: 'ちゅうしゃ', romaji: 'Chūsha', english: 'Injection / shot', situation: 'hospital' },
  // --- Verbs ---
  { id: 'h6', japanese: '診察を受ける', reading: 'しんさつをうける', romaji: 'Shinsatsu o ukeru', english: 'To receive a medical exam', situation: 'hospital' },
  { id: 'h7', japanese: '我慢する', reading: 'がまんする', romaji: 'Gaman suru', english: 'To bear / endure', situation: 'hospital' },
  { id: 'h8', japanese: '休む', reading: 'やすむ', romaji: 'Yasumu', english: 'To rest / take a day off', situation: 'hospital' },
  // --- Adjectives ---
  { id: 'h9', japanese: '苦い', reading: 'にがい', romaji: 'Nigai', english: 'Bitter (taste)', situation: 'hospital' },
  { id: 'h10', japanese: 'だるい', reading: 'だるい', romaji: 'Darui', english: 'Sluggish / weary / languid', situation: 'hospital' },
  { id: 'h11', japanese: 'ひどい', reading: 'ひどい', romaji: 'Hidoi', english: 'Severe / terrible', situation: 'hospital' },
  // --- Adverbs ---
  { id: 'h12', japanese: 'ズキズキ', reading: 'ずきずき', romaji: 'Zukizuki', english: 'Throbbingly (painful)', situation: 'hospital' },
  { id: 'h13', japanese: 'じわじわ', reading: 'じわじわ', romaji: 'Jiwajiwa', english: 'Gradually / slowly but surely', situation: 'hospital' },
  // --- Phrases ---
  { id: 'h14', japanese: '気分が悪いです。', reading: 'きぶんがわるいです。', romaji: 'Kibun ga warui desu.', english: 'I feel sick.', situation: 'hospital' },
  { id: 'h15', japanese: '頭が痛いです。', reading: 'あたまがいたいです。', romaji: 'Atama ga itai desu.', english: 'I have a headache.', situation: 'hospital' },
  { id: 'h16', japanese: '熱があります。', reading: 'ねつがあります。', romaji: 'Netsu ga arimasu.', english: 'I have a fever.', situation: 'hospital' },
  { id: 'h17', japanese: '保険証は使えますか？', reading: 'ほけんしょうはつかえますか？', romaji: 'Hokenshō wa tsukaemasu ka?', english: 'Can I use health insurance?', situation: 'hospital' },
  { id: 'h18', japanese: '薬をください。', reading: 'くすりをください。', romaji: 'Kusuri o kudasai.', english: 'Please give me medicine.', situation: 'hospital' },
  { id: 'h19', japanese: 'お大事に。', reading: 'おだいじに。', romaji: 'Odaiji ni.', english: 'Take care. (You may hear this from staff)', situation: 'hospital' },
  { id: 'h20', japanese: 'ここが痛みます。', reading: 'ここがいたみます。', romaji: 'Koko ga itamimasu.', english: 'It hurts here.', situation: 'hospital' },
  // --- Extra ---
  { id: 'h21', japanese: '看護師', reading: 'かんごし', romaji: 'Kangoshi', english: 'Nurse', situation: 'hospital' },
  { id: 'h22', japanese: '診てもらう', reading: 'みてもらう', romaji: 'Mite morau', english: 'To have (a doctor) examine you', situation: 'hospital' },
  { id: 'h23', japanese: 'ヒリヒリ', reading: 'ひりひり', romaji: 'Hirihiri', english: 'Stinging / burning (pain)', situation: 'hospital' },
  { id: 'h24', japanese: '咳が出ます。', reading: 'せきがでます。', romaji: 'Seki ga demasu.', english: 'I have a cough.', situation: 'hospital' },
  { id: 'h25', japanese: '予約は必要ですか？', reading: 'よやくはひつようですか？', romaji: 'Yoyaku wa hitsuyō desu ka?', english: 'Do I need an appointment?', situation: 'hospital' },
  { id: 'h26', japanese: '薬', reading: 'くすり', romaji: 'Kusuri', english: 'Medicine', situation: 'hospital' },
  { id: 'h27', japanese: 'のどが痛いです。', reading: 'のどがいたいです。', romaji: 'Nodo ga itai desu.', english: 'I have a sore throat.', situation: 'hospital' },
  { id: 'h28', japanese: '待ち時間はどのくらいですか？', reading: 'まちじかんはどのくらいですか？', romaji: 'Machijikan wa dono kurai desu ka?', english: 'How long is the wait?', situation: 'hospital' },
  { id: 'h29', japanese: '吐き気がします。', reading: 'はきけがします。', romaji: 'Hakike ga shimasu.', english: 'I feel nauseous.', situation: 'hospital' },
  { id: 'h30', japanese: '検査結果はいつわかりますか？', reading: 'けんさけっかはいつわかりますか？', romaji: 'Kensa kekka wa itsu wakarimasu ka?', english: 'When will the test results be ready?', situation: 'hospital' },

  // ==================== TRAIN STATION (45 items) ====================
  // --- Nouns ---
  { id: 'a1', japanese: '改札口', reading: 'かいさつぐち', romaji: 'Kaisatsuguchi', english: 'Ticket gate', situation: 'train_station' },
  { id: 'a2', japanese: 'プラットホーム', reading: 'ぷらっとほーむ', romaji: 'Purattohōmu', english: 'Station platform', situation: 'train_station' },
  { id: 'a3', japanese: '特急電車', reading: 'とっきゅうでんしゃ', romaji: 'Tokkyū densha', english: 'Limited express train', situation: 'train_station' },
  { id: 'a4', japanese: '路線図', reading: 'ろせんず', romaji: 'Rosenzu', english: 'Route map', situation: 'train_station' },
  { id: 'a5', japanese: '忘れ物', reading: 'わすれもの', romaji: 'Wasuremono', english: 'Lost property', situation: 'train_station' },
  // --- Verbs ---
  { id: 'a6', japanese: '乗り換える', reading: 'のりかえる', romaji: 'Norikaeru', english: 'To transfer / change trains', situation: 'train_station' },
  { id: 'a7', japanese: '出発する', reading: 'しゅっぱつする', romaji: 'Shuppatsu suru', english: 'To depart', situation: 'train_station' },
  { id: 'a8', japanese: '遅れる', reading: 'おくれる', romaji: 'Okureru', english: 'To be delayed / late', situation: 'train_station' },
  // --- Adjectives ---
  { id: 'a9', japanese: '混雑した', reading: 'こんざつした', romaji: 'Konzatsu shita', english: 'Crowded / congested', situation: 'train_station' },
  { id: 'a10', japanese: '速い', reading: 'はやい', romaji: 'Hayai', english: 'Fast / rapid', situation: 'train_station' },
  { id: 'a11', japanese: '安全な', reading: 'あんぜんな', romaji: 'Anzen na', english: 'Safe', situation: 'train_station' },
  // --- Adverbs ---
  { id: 'a12', japanese: 'ぎりぎりで', reading: 'ぎりぎりで', romaji: 'Girigiri de', english: 'At the very last minute', situation: 'train_station' },
  { id: 'a13', japanese: '間もなく', reading: 'まもなく', romaji: 'Mamonaku', english: 'Shortly / in a moment', situation: 'train_station' },
  // --- Phrases ---
  { id: 'a14', japanese: '乗車手続きはどこですか？', reading: 'じょうしゃてつづきはどこですか？', romaji: 'Jōsha tetsuzuki wa doko desu ka?', english: 'Where is ticketing?', situation: 'train_station' },
  { id: 'a15', japanese: 'これは車内に持ち込めますか？', reading: 'これはしゃないにもちこめますか？', romaji: 'Kore wa shanai ni mochikomemasu ka?', english: 'Can I take this on board?', situation: 'train_station' },
  { id: 'a16', japanese: '切符をどうぞ。', reading: 'きっぷをどうぞ。', romaji: 'Kippu o dōzo.', english: 'Here is my ticket.', situation: 'train_station' },
  { id: 'a17', japanese: '荷物を預けたいです。', reading: 'にもつをあずけたいです。', romaji: 'Nimotsu o azuketai desu.', english: 'I would like to store my baggage / use a locker.', situation: 'train_station' },
  { id: 'a18', japanese: '私の席はどこですか？', reading: 'わたしのせきはどこですか？', romaji: 'Watashi no seki wa doko desu ka?', english: 'Where is my seat?', situation: 'train_station' },
  { id: 'a19', japanese: '何番線から出発しますか？', reading: 'なんばんせんからしゅっぱつしますか？', romaji: 'Nanbansen kara shuppatsu shimasu ka?', english: 'Which platform does it depart from?', situation: 'train_station' },
  { id: 'a20', japanese: '次の電車は何時ですか？', reading: 'つぎのでんしゃはなんじですか？', romaji: 'Tsugi no densha wa nanji desu ka?', english: 'What time is the next train?', situation: 'train_station' },
  // --- Extra ---
  { id: 'a21', japanese: '指定席', reading: 'していせき', romaji: 'Shiteiseki', english: 'Reserved seat', situation: 'train_station' },
  { id: 'a22', japanese: '座る', reading: 'すわる', romaji: 'Suwaru', english: 'To sit', situation: 'train_station' },
  { id: 'a23', japanese: '新幹線の切符を買いたいです。', reading: 'しんかんせんのきっぷをかいたいです。', romaji: 'Shinkansen no kippu o kaitai desu.', english: 'I would like to buy a Shinkansen ticket.', situation: 'train_station' },
  { id: 'a24', japanese: 'この電車は何駅停まりますか？', reading: 'このでんしゃはなんえきとまりますか？', romaji: 'Kono densha wa nan eki tomarimasu ka?', english: 'How many stops does this train make?', situation: 'train_station' },
  { id: 'a25', japanese: '自由席はありますか？', reading: 'じゆうせきはありますか？', romaji: 'Jiyūseki wa arimasu ka?', english: 'Are there unreserved seats?', situation: 'train_station' },
  { id: 'a26', japanese: '定期券', reading: 'ていきけん', romaji: 'Teikiken', english: 'Commuter pass', situation: 'train_station' },
  { id: 'a27', japanese: '買う', reading: 'かう', romaji: 'Kau', english: 'To buy', situation: 'train_station' },
  { id: 'a28', japanese: '優先席はどこですか？', reading: 'ゆうせんせきはどこですか？', romaji: 'Yūsenseki wa doko desu ka?', english: 'Where are the priority seats?', situation: 'train_station' },
  { id: 'a29', japanese: 'この座席は空いていますか？', reading: 'このざせきはあいていますか？', romaji: 'Kono zaseki wa aite imasu ka?', english: 'Is this seat available?', situation: 'train_station' },
  { id: 'a30', japanese: '終点はどこですか？', reading: 'しゅうてんはどこですか？', romaji: 'Shūten wa doko desu ka?', english: 'What is the final stop?', situation: 'train_station' },
  // --- Deeper: ticket window & daily riding ---
  { id: 'a31', japanese: '渋谷まで一枚ください。', reading: 'しぶやまでいちまいください。', romaji: 'Shibuya made ichimai kudasai.', english: 'One ticket to Shibuya, please. (swap the station name)', situation: 'train_station' },
  { id: 'a32', japanese: 'この電車は新宿行きですか？', reading: 'このでんしゃはしんじゅくいきですか？', romaji: 'Kono densha wa Shinjuku iki desu ka?', english: 'Is this train bound for Shinjuku?', situation: 'train_station' },
  { id: 'a33', japanese: '何番線ですか？', reading: 'なんばんせんですか？', romaji: 'Nan-bansen desu ka?', english: 'Which platform / track number?', situation: 'train_station' },
  { id: 'a34', japanese: '乗り換えはどこですか？', reading: 'のりかえはどこですか？', romaji: 'Norikae wa doko desu ka?', english: 'Where do I transfer?', situation: 'train_station' },
  { id: 'a35', japanese: '出口はどちらですか？', reading: 'でぐちはどちらですか？', romaji: 'Deguchi wa dochira desu ka?', english: 'Which way is the exit?', situation: 'train_station' },
  { id: 'a36', japanese: 'ICカード', reading: 'あいしーかーど', romaji: 'IC kādo', english: 'IC card (Suica, Pasmo, etc.)', situation: 'train_station' },
  { id: 'a37', japanese: '片道', reading: 'かたみち', romaji: 'Katamichi', english: 'One-way (ticket)', situation: 'train_station' },
  { id: 'a38', japanese: '往復', reading: 'おうふく', romaji: 'Ōfuku', english: 'Round-trip (ticket)', situation: 'train_station' },
  { id: 'a39', japanese: '窓口はどこですか？', reading: 'まどぐちはどこですか？', romaji: 'Madoguchi wa doko desu ka?', english: 'Where is the ticket window?', situation: 'train_station' },
  { id: 'a40', japanese: '駅員', reading: 'えきいん', romaji: 'Ekiin', english: 'Station staff', situation: 'train_station' },
  { id: 'a41', japanese: '各駅停車', reading: 'かくえきていしゃ', romaji: 'Kakueki teisha', english: 'Local train (stops at every station)', situation: 'train_station' },
  { id: 'a42', japanese: '快速', reading: 'かいそく', romaji: 'Kaisoku', english: 'Rapid / express-ish local service', situation: 'train_station' },
  { id: 'a43', japanese: '乗り過ごしました。', reading: 'のりすごしました。', romaji: 'Norisugoshimashita.', english: 'I missed my stop. / I rode past it.', situation: 'train_station' },
  { id: 'a44', japanese: 'チャージしたいです。', reading: 'ちゃーじしたいです。', romaji: 'Chāji shitai desu.', english: 'I want to top up (my IC card).', situation: 'train_station' },
  { id: 'a45', japanese: 'この改札で入れますか？', reading: 'このかいさつではいれますか？', romaji: 'Kono kaisatsu de hairemasu ka?', english: 'Can I enter through this gate?', situation: 'train_station' },

  // ==================== IZAKAYA (30 items) ====================
  // --- Nouns ---
  { id: 'i1', japanese: 'お通し', reading: 'おとおし', romaji: 'Otōshi', english: 'Table charge appetizer', situation: 'izakaya' },
  { id: 'i2', japanese: '冷奴', reading: 'ひややっこ', romaji: 'Hiyayakko', english: 'Chilled tofu', situation: 'izakaya' },
  { id: 'i3', japanese: 'ハイボール', reading: 'はいぼーる', romaji: 'Haibōru', english: 'Whiskey highball', situation: 'izakaya' },
  { id: 'i4', japanese: '割り勘', reading: 'わりかん', romaji: 'Warikan', english: 'Splitting the bill', situation: 'izakaya' },
  { id: 'i5', japanese: '枝豆', reading: 'えだまめ', romaji: 'Edamame', english: 'Boiled edamame beans', situation: 'izakaya' },
  // --- Verbs ---
  { id: 'i6', japanese: '乾杯する', reading: 'かんぱいする', romaji: 'Kanpai suru', english: 'To propose a toast / cheers', situation: 'izakaya' },
  { id: 'i7', japanese: '酔っ払う', reading: 'よっぱらう', romaji: 'Yopparau', english: 'To get drunk', situation: 'izakaya' },
  { id: 'i8', japanese: '注文をキャンセルする', reading: 'ちゅうもんをきゃんせるする', romaji: 'Chūmon o kyanseru suru', english: 'To cancel an order', situation: 'izakaya' },
  // --- Adjectives ---
  { id: 'i9', japanese: '賑やかな', reading: 'にぎやかな', romaji: 'Nigiyaka na', english: 'Lively / bustling / noisy', situation: 'izakaya' },
  { id: 'i10', japanese: 'スパイシーな', reading: 'すぱいしーな', romaji: 'Supaishī na', english: 'Spicy', situation: 'izakaya' },
  { id: 'i11', japanese: 'すっきりした', reading: 'すっきりした', romaji: 'Sukkiri shita', english: 'Refreshing / crisp (taste)', situation: 'izakaya' },
  // --- Adverbs ---
  { id: 'i12', japanese: 'とりあえず', reading: 'とりあえず', romaji: 'Toriaezu', english: 'For the time being / to start with', situation: 'izakaya' },
  { id: 'i13', japanese: 'どんどん', reading: 'どんどん', romaji: 'Dondon', english: 'Rapidly / one after another', situation: 'izakaya' },
  // --- Phrases ---
  { id: 'i14', japanese: '生ビールをお願いします。', reading: 'なまびーるをおねがいします。', romaji: 'Nama bīru o onegai shimasu.', english: 'Draft beer, please.', situation: 'izakaya' },
  { id: 'i15', japanese: 'おすすめは何ですか？', reading: 'おすすめはなんですか？', romaji: 'Osusume wa nan desu ka?', english: 'What do you recommend?', situation: 'izakaya' },
  { id: 'i16', japanese: '焼き鳥を盛り合わせで。', reading: 'やきとりをもりあわせで。', romaji: 'Yakitori o moriawase de.', english: 'Assorted Yakitori, please.', situation: 'izakaya' },
  { id: 'i17', japanese: 'とりあえずこれで。', reading: 'とりあえずこれで。', romaji: 'Toriaezu kore de.', english: "That's all for now.", situation: 'izakaya' },
  { id: 'i18', japanese: 'カンパイ！', reading: 'かんぱい！', romaji: 'Kanpai!', english: 'Cheers!', situation: 'izakaya' },
  { id: 'i19', japanese: 'ラストオーダーは何時ですか？', reading: 'らすとおーだーはなんじですか？', romaji: 'Rasuto ōdā wa nanji desu ka?', english: 'When is the last order?', situation: 'izakaya' },
  { id: 'i20', japanese: 'お会計、別々でお願いします。', reading: 'おかいけい、べつべつでおねがいします。', romaji: 'Okaikei, betsubetsu de onegai shimasu.', english: 'Separate bills, please.', situation: 'izakaya' },
  // --- Extra ---
  { id: 'i21', japanese: '出汁', reading: 'だし', romaji: 'Dashi', english: 'Broth / stock', situation: 'izakaya' },
  { id: 'i22', japanese: '頼む', reading: 'たのむ', romaji: 'Tanomu', english: 'To order / ask for', situation: 'izakaya' },
  { id: 'i23', japanese: 'もう一杯お願いします。', reading: 'もういっぱいおねがいします。', romaji: 'Mō ippai onegai shimasu.', english: 'One more drink, please.', situation: 'izakaya' },
  { id: 'i24', japanese: 'お通しは何ですか？', reading: 'おとおしはなんですか？', romaji: 'Otōshi wa nan desu ka?', english: 'What is the otōshi today?', situation: 'izakaya' },
  { id: 'i25', japanese: '席は空いていますか？', reading: 'せきはあいていますか？', romaji: 'Seki wa aite imasu ka?', english: 'Are there any seats available?', situation: 'izakaya' },
  { id: 'i26', japanese: '唐揚げ', reading: 'からあげ', romaji: 'Karaage', english: 'Fried chicken', situation: 'izakaya' },
  { id: 'i27', japanese: '注ぐ', reading: 'そそぐ', romaji: 'Sosogu', english: 'To pour (a drink)', situation: 'izakaya' },
  { id: 'i28', japanese: 'おかわりをお願いします。', reading: 'おかわりをおねがいします。', romaji: 'Okawari o onegai shimasu.', english: 'Another round, please.', situation: 'izakaya' },
  { id: 'i29', japanese: '禁煙席はありますか？', reading: 'きんえんせきはありますか？', romaji: "Kin'en seki wa arimasu ka?", english: 'Do you have non-smoking seats?', situation: 'izakaya' },
  { id: 'i30', japanese: '今日の割引はありますか？', reading: 'きょうのわりびきはありますか？', romaji: 'Kyō no waribiki wa arimasu ka?', english: 'Are there any discounts today?', situation: 'izakaya' },

  // ==================== SUSHI SHOP (30 items) ====================
  // --- Nouns ---
  { id: 'su1', japanese: '握り寿司', reading: 'にぎりずし', romaji: 'Nigirizushi', english: 'Hand-pressed sushi', situation: 'sushi_shop' },
  { id: 'su2', japanese: '刺身', reading: 'さしみ', romaji: 'Sashimi', english: 'Sliced raw fish', situation: 'sushi_shop' },
  { id: 'su3', japanese: '海苔', reading: 'のり', romaji: 'Nori', english: 'Seaweed', situation: 'sushi_shop' },
  { id: 'su4', japanese: '醤油', reading: 'しょうゆ', romaji: 'Shōyu', english: 'Soy sauce', situation: 'sushi_shop' },
  { id: 'su5', japanese: 'わさび', reading: 'わさび', romaji: 'Wasabi', english: 'Wasabi (Japanese horseradish)', situation: 'sushi_shop' },
  // --- Verbs ---
  { id: 'su6', japanese: '注文する', reading: 'ちゅうもんする', romaji: 'Chūmon suru', english: 'To order', situation: 'sushi_shop' },
  { id: 'su7', japanese: '握る', reading: 'にぎる', romaji: 'Nigiru', english: 'To shape / press (sushi)', situation: 'sushi_shop' },
  { id: 'su8', japanese: '召し上がる', reading: 'めしあがる', romaji: 'Meshiagaru', english: 'To eat (polite)', situation: 'sushi_shop' },
  // --- Adjectives ---
  { id: 'su9', japanese: '新鮮な', reading: 'しんせんな', romaji: 'Shinsen na', english: 'Fresh', situation: 'sushi_shop' },
  { id: 'su10', japanese: '脂ののった', reading: 'あぶらののった', romaji: 'Abura no notta', english: 'Fatty / rich (fish)', situation: 'sushi_shop' },
  { id: 'su11', japanese: '柔らかい', reading: 'やわらかい', romaji: 'Yawarakai', english: 'Soft / tender', situation: 'sushi_shop' },
  // --- Adverbs ---
  { id: 'su12', japanese: '丁寧に', reading: 'ていねいに', romaji: 'Teinei ni', english: 'Carefully / politely', situation: 'sushi_shop' },
  { id: 'su13', japanese: 'そのまま', reading: 'そのまま', romaji: 'Sono mama', english: 'As is / without change', situation: 'sushi_shop' },
  // --- Phrases ---
  { id: 'su14', japanese: 'カウンター席をお願いします。', reading: 'かうんたーせきをおねがいします。', romaji: 'Kauntā seki o onegai shimasu.', english: 'A counter seat, please.', situation: 'sushi_shop' },
  { id: 'su15', japanese: 'おすすめは何ですか？', reading: 'おすすめはなんですか？', romaji: 'Osusume wa nan desu ka?', english: 'What do you recommend?', situation: 'sushi_shop' },
  { id: 'su16', japanese: 'マグロを一貫お願いします。', reading: 'まぐろをいっかんおねがいします。', romaji: 'Maguro o ikkan onegai shimasu.', english: 'One piece of tuna, please.', situation: 'sushi_shop' },
  { id: 'su17', japanese: '醤油は少なめで。', reading: 'しょうゆはすくなめで。', romaji: 'Shōyu wa sukuname de.', english: 'Just a little soy sauce, please.', situation: 'sushi_shop' },
  { id: 'su18', japanese: 'わさび抜きでお願いします。', reading: 'わさびぬきでおねがいします。', romaji: 'Wasabi nuki de onegai shimasu.', english: 'Without wasabi, please.', situation: 'sushi_shop' },
  { id: 'su19', japanese: 'お会計をお願いします。', reading: 'おかいけいをおねがいします。', romaji: 'Okaikei o onegai shimasu.', english: 'Check, please.', situation: 'sushi_shop' },
  { id: 'su20', japanese: 'ごちそうさまでした。', reading: 'ごちそうさまでした。', romaji: 'Gochisōsama deshita.', english: 'Thank you for the delicious meal.', situation: 'sushi_shop' },
  // --- Extra ---
  { id: 'su21', japanese: '玉子', reading: 'たまご', romaji: 'Tamago', english: 'Sweet egg omelet (sushi)', situation: 'sushi_shop' },
  { id: 'su22', japanese: '試食する', reading: 'ししょくする', romaji: 'Shishoku suru', english: 'To taste / sample', situation: 'sushi_shop' },
  { id: 'su23', japanese: '今日のおすすめは？', reading: 'きょうのおすすめは？', romaji: 'Kyō no osusume wa?', english: "What's today's recommendation?", situation: 'sushi_shop' },
  { id: 'su24', japanese: '海苔は抜きで。', reading: 'のりはぬきで。', romaji: 'Nori wa nuki de.', english: 'Without seaweed, please.', situation: 'sushi_shop' },
  { id: 'su25', japanese: 'シャリ少なめでお願いします。', reading: 'しゃりすくなめでおねがいします。', romaji: 'Shari sukuname de onegai shimasu.', english: 'Less rice, please.', situation: 'sushi_shop' },
  { id: 'su26', japanese: 'サーモン', reading: 'さーもん', romaji: 'Sāmon', english: 'Salmon', situation: 'sushi_shop' },
  { id: 'su27', japanese: '回転寿司', reading: 'かいてんずし', romaji: 'Kaitenzushi', english: 'Conveyor belt sushi', situation: 'sushi_shop' },
  { id: 'su28', japanese: 'にぎり', reading: 'にぎり', romaji: 'Nigiri', english: 'Hand-pressed sushi (nigiri)', situation: 'sushi_shop' },
  { id: 'su29', japanese: 'お茶をお願いします。', reading: 'おちゃをおねがいします。', romaji: 'Ocha o onegai shimasu.', english: 'Tea, please.', situation: 'sushi_shop' },
  { id: 'su30', japanese: '会計はこちらですか？', reading: 'かいけいはこちらですか？', romaji: 'Kaikei wa kochira desu ka?', english: 'Is this where I pay?', situation: 'sushi_shop' },

  // ==================== KOBAN / POLICE BOX (30 items) ====================
  // --- Nouns ---
  { id: 'kb1', japanese: '交番所', reading: 'こうばんじょ', romaji: 'Kōbanjo', english: 'Police box building', situation: 'koban' },
  { id: 'kb2', japanese: '被害届', reading: 'ひがいとどけ', romaji: 'Higai todoke', english: 'Crime / incident report', situation: 'koban' },
  { id: 'kb3', japanese: '住所', reading: 'じゅうしょ', romaji: 'Jūsho', english: 'Address', situation: 'koban' },
  { id: 'kb4', japanese: '身分証明書', reading: 'みぶんしょうめいしょ', romaji: 'Mibun shōmeisho', english: 'Identification document', situation: 'koban' },
  { id: 'kb5', japanese: '警察官', reading: 'けいさつかん', romaji: 'Keisatsukan', english: 'Police officer', situation: 'koban' },
  // --- Verbs ---
  { id: 'kb6', japanese: '届ける', reading: 'とどける', romaji: 'Todokeru', english: 'To report / notify', situation: 'koban' },
  { id: 'kb7', japanese: '尋ねる', reading: 'たずねる', romaji: 'Tazuneru', english: 'To ask / inquire', situation: 'koban' },
  { id: 'kb8', japanese: '確認する', reading: 'かくにんする', romaji: 'Kakunin suru', english: 'To confirm / verify', situation: 'koban' },
  // --- Adjectives ---
  { id: 'kb9', japanese: '紛失した', reading: 'ふんしつした', romaji: 'Funshitsu shita', english: 'Lost (something)', situation: 'koban' },
  { id: 'kb10', japanese: '大切な', reading: 'たいせつな', romaji: 'Taisetsu na', english: 'Important / precious', situation: 'koban' },
  { id: 'kb11', japanese: '怪しい', reading: 'あやしい', romaji: 'Ayashii', english: 'Suspicious', situation: 'koban' },
  // --- Adverbs ---
  { id: 'kb12', japanese: '急いで', reading: 'いそいで', romaji: 'Isoide', english: 'In a hurry / quickly', situation: 'koban' },
  { id: 'kb13', japanese: '詳しく', reading: 'くわしく', romaji: 'Kuwashiku', english: 'In detail', situation: 'koban' },
  // --- Phrases ---
  { id: 'kb14', japanese: '財布をなくしました。', reading: 'さいふをなくしました。', romaji: 'Saifu o nakushimashita.', english: 'I lost my wallet.', situation: 'koban' },
  { id: 'kb15', japanese: '道に迷いました。', reading: 'みちにまよいました。', romaji: 'Michi ni mayoimashita.', english: 'I am lost.', situation: 'koban' },
  { id: 'kb16', japanese: '最寄りの交番はどこですか？', reading: 'もよりのこうばんはどこですか？', romaji: 'Moyori no kōban wa doko desu ka?', english: 'Where is the nearest police box?', situation: 'koban' },
  { id: 'kb17', japanese: '届出をお願いします。', reading: 'とどけでをおねがいします。', romaji: 'Todokede o onegai shimasu.', english: 'I would like to file a report, please.', situation: 'koban' },
  { id: 'kb18', japanese: 'パスポートを盗まれました。', reading: 'ぱすぽーとをぬすまれました。', romaji: 'Pasupōto o nusumaremashita.', english: 'My passport was stolen.', situation: 'koban' },
  { id: 'kb19', japanese: 'ここからホテルまでの道を教えてください。', reading: 'ここからほてるまでのみちをおしえてください。', romaji: 'Koko kara hoteru made no michi o oshiete kudasai.', english: 'Please tell me how to get to the hotel from here.', situation: 'koban' },
  { id: 'kb20', japanese: '助けてください。', reading: 'たすけてください。', romaji: 'Tasukete kudasai.', english: 'Please help me.', situation: 'koban' },
  // --- Extra ---
  { id: 'kb21', japanese: '通報', reading: 'つうほう', romaji: 'Tsūhō', english: 'Report / notification (to police)', situation: 'koban' },
  { id: 'kb22', japanese: '記入する', reading: 'きにゅうする', romaji: 'Kinyū suru', english: 'To fill in (a form)', situation: 'koban' },
  { id: 'kb23', japanese: '携帯電話を落としました。', reading: 'けいたいでんわをおとしました。', romaji: 'Keitai denwa o otoshimashita.', english: 'I dropped my cell phone.', situation: 'koban' },
  { id: 'kb24', japanese: '英語は話せますか？', reading: 'えいごははなせますか？', romaji: 'Eigo wa hanasemasu ka?', english: 'Do you speak English?', situation: 'koban' },
  { id: 'kb25', japanese: '届出書を書きたいです。', reading: 'とどけでしょをかきたいです。', romaji: 'Todokedesho o kakitai desu.', english: 'I would like to fill out a report form.', situation: 'koban' },
  { id: 'kb26', japanese: '緊急', reading: 'きんきゅう', romaji: 'Kinkyū', english: 'Emergency', situation: 'koban' },
  { id: 'kb27', japanese: '連絡する', reading: 'れんらくする', romaji: 'Renraku suru', english: 'To contact / get in touch', situation: 'koban' },
  { id: 'kb28', japanese: 'スマホを落としました。', reading: 'すまほをおとしました。', romaji: 'Sumaho o otoshimashita.', english: 'I dropped my smartphone.', situation: 'koban' },
  { id: 'kb29', japanese: '事故を見ました。', reading: 'じこをみました。', romaji: 'Jiko o mimashita.', english: 'I witnessed an accident.', situation: 'koban' },
  { id: 'kb30', japanese: '通訳はいますか？', reading: 'つうやくはいますか？', romaji: 'Tsūyaku wa imasu ka?', english: 'Is there an interpreter?', situation: 'koban' },

  // ==================== HOTEL (30 items) ====================
  // --- Nouns ---
  { id: 'ht1', japanese: 'フロント', reading: 'ふろんと', romaji: 'Furonto', english: 'Front desk / reception', situation: 'hotel' },
  { id: 'ht2', japanese: '客室', reading: 'きゃくしつ', romaji: 'Kyakushitsu', english: 'Guest room', situation: 'hotel' },
  { id: 'ht3', japanese: '鍵', reading: 'かぎ', romaji: 'Kagi', english: 'Key', situation: 'hotel' },
  { id: 'ht4', japanese: '荷物', reading: 'にもつ', romaji: 'Nimotsu', english: 'Luggage / baggage', situation: 'hotel' },
  { id: 'ht5', japanese: '朝食', reading: 'ちょうしょく', romaji: 'Chōshoku', english: 'Breakfast', situation: 'hotel' },
  // --- Verbs ---
  { id: 'ht6', japanese: 'チェックインする', reading: 'ちぇっくいんする', romaji: 'Chekkuin suru', english: 'To check in', situation: 'hotel' },
  { id: 'ht7', japanese: '予約する', reading: 'よやくする', romaji: 'Yoyaku suru', english: 'To make a reservation', situation: 'hotel' },
  { id: 'ht8', japanese: '荷物を預ける', reading: 'にもつをあずける', romaji: 'Nimotsu o azukeru', english: 'To leave luggage (at reception)', situation: 'hotel' },
  // --- Adjectives ---
  { id: 'ht9', japanese: '禁煙の', reading: 'きんえんの', romaji: "Kin'en no", english: 'Non-smoking', situation: 'hotel' },
  { id: 'ht10', japanese: '快適な', reading: 'かいてきな', romaji: 'Kaiteki na', english: 'Comfortable', situation: 'hotel' },
  { id: 'ht11', japanese: '空いている', reading: 'あいている', romaji: 'Aite iru', english: 'Available / vacant', situation: 'hotel' },
  // --- Adverbs ---
  { id: 'ht12', japanese: '早めに', reading: 'はやめに', romaji: 'Hayame ni', english: 'Early / ahead of time', situation: 'hotel' },
  { id: 'ht13', japanese: '一泊', reading: 'いっぱく', romaji: 'Ippaku', english: 'One night (stay)', situation: 'hotel' },
  // --- Phrases ---
  { id: 'ht14', japanese: '予約しています。', reading: 'よやくしています。', romaji: 'Yoyaku shite imasu.', english: 'I have a reservation.', situation: 'hotel' },
  { id: 'ht15', japanese: 'チェックアウトは何時ですか？', reading: 'ちぇっくあうとはなんじですか？', romaji: 'Chekkuauto wa nanji desu ka?', english: 'What time is check-out?', situation: 'hotel' },
  { id: 'ht16', japanese: 'Wi-Fiのパスワードを教えてください。', reading: 'わいふぁいのぱすわーどをおしえてください。', romaji: 'Waifai no pasuwādo o oshiete kudasai.', english: 'Please tell me the Wi-Fi password.', situation: 'hotel' },
  { id: 'ht17', japanese: 'タオルを追加でお願いします。', reading: 'たおるをついかでおねがいします。', romaji: 'Taoru o tsuika de onegai shimasu.', english: 'Extra towels, please.', situation: 'hotel' },
  { id: 'ht18', japanese: '朝食は何時からですか？', reading: 'ちょうしょくはなんじからですか？', romaji: 'Chōshoku wa nanji kara desu ka?', english: 'What time does breakfast start?', situation: 'hotel' },
  { id: 'ht19', japanese: '荷物を預かってもらえますか？', reading: 'にもつをあずかってもらえますか？', romaji: 'Nimotsu o azukatte moraemasu ka?', english: 'Could you keep my luggage for me?', situation: 'hotel' },
  { id: 'ht20', japanese: '部屋を清掃してください。', reading: 'へやをせいそうしてください。', romaji: 'Heya o seisō shite kudasai.', english: 'Please clean the room.', situation: 'hotel' },
  // --- Extra ---
  { id: 'ht21', japanese: '浴衣', reading: 'ゆかた', romaji: 'Yukata', english: 'Yukata (hotel robe)', situation: 'hotel' },
  { id: 'ht22', japanese: '延泊する', reading: 'えんはくする', romaji: 'Enpaku suru', english: 'To extend your stay', situation: 'hotel' },
  { id: 'ht23', japanese: 'エレベーターはどこですか？', reading: 'えれべーたーはどこですか？', romaji: 'Erebētā wa doko desu ka?', english: 'Where is the elevator?', situation: 'hotel' },
  { id: 'ht24', japanese: '静かな部屋をお願いします。', reading: 'しずかなへやをおねがいします。', romaji: 'Shizuka na heya o onegai shimasu.', english: 'A quiet room, please.', situation: 'hotel' },
  { id: 'ht25', japanese: 'ルームサービスはありますか？', reading: 'るーむさーびすはありますか？', romaji: 'Rūmu sābisu wa arimasu ka?', english: 'Do you have room service?', situation: 'hotel' },
  { id: 'ht26', japanese: 'アメニティ', reading: 'あめにてぃ', romaji: 'Ameniti', english: 'Amenities (toiletries, etc.)', situation: 'hotel' },
  { id: 'ht27', japanese: '変更する', reading: 'へんこうする', romaji: 'Henkō suru', english: 'To change (a reservation)', situation: 'hotel' },
  { id: 'ht28', japanese: '禁煙ルームをお願いします。', reading: 'きんえんるーむをおねがいします。', romaji: "Kin'en rūmu o onegai shimasu.", english: 'A non-smoking room, please.', situation: 'hotel' },
  { id: 'ht29', japanese: 'チェックアウトをお願いします。', reading: 'ちぇっくあうとをおねがいします。', romaji: 'Chekkuauto o onegai shimasu.', english: 'Check-out, please.', situation: 'hotel' },
  { id: 'ht30', japanese: '近くにコンビニはありますか？', reading: 'ちかくにこんびにはありますか？', romaji: 'Chikaku ni konbini wa arimasu ka?', english: 'Is there a convenience store nearby?', situation: 'hotel' },

  // ==================== ASKING FOR DIRECTIONS (30 phrases) ====================
  { id: 'dir1', japanese: 'すみません、道を聞いてもいいですか？', reading: 'すみません、みちをきいてもいいですか？', romaji: 'Sumimasen, michi o kiite mo ii desu ka?', english: 'Excuse me, may I ask for directions?', situation: 'asking_for_directions' },
  { id: 'dir2', japanese: '駅はどこですか？', reading: 'えきはどこですか？', romaji: 'Eki wa doko desu ka?', english: 'Where is the station?', situation: 'asking_for_directions' },
  { id: 'dir3', japanese: 'この辺にコンビニはありますか？', reading: 'このへんにこんびにはありますか？', romaji: 'Kono hen ni konbini wa arimasu ka?', english: 'Is there a convenience store around here?', situation: 'asking_for_directions' },
  { id: 'dir4', japanese: 'ここはどこですか？', reading: 'ここはどこですか？', romaji: 'Koko wa doko desu ka?', english: 'Where am I? / What is this place?', situation: 'asking_for_directions' },
  { id: 'dir5', japanese: '東京駅へはどうやって行きますか？', reading: 'とうきょうえきへはどうやっていきますか？', romaji: 'Tōkyō eki e wa dō yatte ikimasu ka?', english: 'How do I get to Tokyo Station?', situation: 'asking_for_directions' },
  { id: 'dir6', japanese: '近いですか？', reading: 'ちかいですか？', romaji: 'Chikai desu ka?', english: 'Is it close?', situation: 'asking_for_directions' },
  { id: 'dir7', japanese: '遠いですか？', reading: 'とおいですか？', romaji: 'Tōi desu ka?', english: 'Is it far?', situation: 'asking_for_directions' },
  { id: 'dir8', japanese: '歩いて何分くらいですか？', reading: 'あるいてなんぷんくらいですか？', romaji: 'Aruite nan-pun kurai desu ka?', english: 'About how many minutes on foot?', situation: 'asking_for_directions' },
  { id: 'dir9', japanese: 'この道で合っていますか？', reading: 'このみちであっていますか？', romaji: 'Kono michi de atte imasu ka?', english: 'Is this the right way?', situation: 'asking_for_directions' },
  { id: 'dir10', japanese: 'まっすぐ行ってください。', reading: 'まっすぐいってください。', romaji: 'Massugu itte kudasai.', english: 'Please go straight.', situation: 'asking_for_directions' },
  { id: 'dir11', japanese: '右に曲がってください。', reading: 'みぎにまがってください。', romaji: 'Migi ni magatte kudasai.', english: 'Please turn right.', situation: 'asking_for_directions' },
  { id: 'dir12', japanese: '左に曲がってください。', reading: 'ひだりにまがってください。', romaji: 'Hidari ni magatte kudasai.', english: 'Please turn left.', situation: 'asking_for_directions' },
  { id: 'dir13', japanese: '次の信号を右です。', reading: 'つぎのしんごうをみぎです。', romaji: 'Tsugi no shingō o migi desu.', english: 'Turn right at the next traffic light.', situation: 'asking_for_directions' },
  { id: 'dir14', japanese: '二つ目の角を左です。', reading: 'ふたつめのかどをひだりです。', romaji: 'Futatsume no kado o hidari desu.', english: 'Turn left at the second corner.', situation: 'asking_for_directions' },
  { id: 'dir15', japanese: '交差点を渡ってください。', reading: 'こうさてんをわたってください。', romaji: 'Kōsaten o watatte kudasai.', english: 'Please cross at the intersection.', situation: 'asking_for_directions' },
  { id: 'dir16', japanese: '橋を渡ってください。', reading: 'はしをわたってください。', romaji: 'Hashi o watatte kudasai.', english: 'Please cross the bridge.', situation: 'asking_for_directions' },
  { id: 'dir17', japanese: '反対方向です。', reading: 'はんたいほうこうです。', romaji: 'Hantai hōkō desu.', english: "It's the opposite direction.", situation: 'asking_for_directions' },
  { id: 'dir18', japanese: 'もう少しです。', reading: 'もうすこしです。', romaji: 'Mō sukoshi desu.', english: "You're almost there.", situation: 'asking_for_directions' },
  { id: 'dir19', japanese: 'あの建物の向こうです。', reading: 'あのたてもののむこうです。', romaji: 'Ano tatemono no mukō desu.', english: "It's beyond that building.", situation: 'asking_for_directions' },
  { id: 'dir20', japanese: 'もう一度お願いします。', reading: 'もういちどおねがいします。', romaji: 'Mō ichido onegai shimasu.', english: 'One more time, please.', situation: 'asking_for_directions' },
  { id: 'dir21', japanese: 'ゆっくり話してください。', reading: 'ゆっくりはなしてください。', romaji: 'Yukkuri hanashite kudasai.', english: 'Please speak slowly.', situation: 'asking_for_directions' },
  { id: 'dir22', japanese: '地図で見せてもらえますか？', reading: 'ちずでみせてもらえますか？', romaji: 'Chizu de misete moraemasu ka?', english: 'Could you show me on a map?', situation: 'asking_for_directions' },
  { id: 'dir23', japanese: 'スマホの地図を見てもいいですか？', reading: 'すまほのちずをみてもいいですか？', romaji: 'Sumaho no chizu o mite mo ii desu ka?', english: 'May I look at the map on my phone?', situation: 'asking_for_directions' },
  { id: 'dir24', japanese: 'トイレはどこですか？', reading: 'といれはどこですか？', romaji: 'Toire wa doko desu ka?', english: 'Where is the restroom?', situation: 'asking_for_directions' },
  { id: 'dir25', japanese: '出口はどちらですか？', reading: 'でぐちはどちらですか？', romaji: 'Deguchi wa dochira desu ka?', english: 'Which way is the exit?', situation: 'asking_for_directions' },
  { id: 'dir26', japanese: '入り口はどこですか？', reading: 'いりぐちはどこですか？', romaji: 'Iriguchi wa doko desu ka?', english: 'Where is the entrance?', situation: 'asking_for_directions' },
  { id: 'dir27', japanese: '行き止まりですか？', reading: 'いきどまりですか？', romaji: 'Ikidomari desu ka?', english: 'Is this a dead end?', situation: 'asking_for_directions' },
  { id: 'dir28', japanese: 'わかりました。ありがとうございます。', reading: 'わかりました。ありがとうございます。', romaji: 'Wakarimashita. Arigatō gozaimasu.', english: 'Got it. Thank you very much.', situation: 'asking_for_directions' },
  { id: 'dir29', japanese: 'すみません、もう一度いいですか？', reading: 'すみません、もういちどいいですか？', romaji: 'Sumimasen, mō ichido ii desu ka?', english: 'Sorry, could you say that again?', situation: 'asking_for_directions' },
  { id: 'dir30', japanese: '助かりました。ありがとうございます。', reading: 'たすかりました。ありがとうございます。', romaji: 'Tasukarimashita. Arigatō gozaimasu.', english: 'That helped a lot. Thank you.', situation: 'asking_for_directions' },

  // ==================== PREMIUM: HANGOVER (30 items) ====================
  // --- Nouns ---
  { id: 'hngo1', japanese: '飲みすぎ', reading: 'のみすぎ', romaji: 'Nomisugi', english: 'Drinking too much', situation: 'hangover' },
  { id: 'hngo2', japanese: '迎え酒', reading: 'むかえざけ', romaji: 'Mukaezake', english: 'Hair of the dog (drinking more to cure hangover)', situation: 'hangover' },
  { id: 'hngo3', japanese: '胃薬', reading: 'いぐすり', romaji: 'Igusuri', english: 'Stomach medicine', situation: 'hangover' },
  { id: 'hngo4', japanese: 'スポーツドリンク', reading: 'すぽーつどりんく', romaji: 'Supōtsu dorinku', english: 'Sports drink', situation: 'hangover' },
  { id: 'hngo5', japanese: '解熱剤', reading: 'げねつざい', romaji: 'Genetsuzai', english: 'Fever reducer / pain reliever', situation: 'hangover' },
  // --- Verbs ---
  { id: 'hngo6', japanese: '休む', reading: 'やすむ', romaji: 'Yasumu', english: 'To rest / take a day off', situation: 'hangover' },
  { id: 'hngo7', japanese: '吐く', reading: 'はく', romaji: 'Haku', english: 'To vomit / throw up', situation: 'hangover' },
  { id: 'hngo8', japanese: '回復する', reading: 'かいふくする', romaji: 'Kaifuku suru', english: 'To recover', situation: 'hangover' },
  // --- Adjectives ---
  { id: 'hngo9', japanese: 'だるい', reading: 'だるい', romaji: 'Darui', english: 'Sluggish / weary', situation: 'hangover' },
  { id: 'hngo10', japanese: 'むかむかする', reading: 'むかむかする', romaji: 'Mukamuka suru', english: 'Nauseous / queasy', situation: 'hangover' },
  { id: 'hngo11', japanese: 'ひどい', reading: 'ひどい', romaji: 'Hidoi', english: 'Terrible / severe', situation: 'hangover' },
  // --- Adverbs ---
  { id: 'hngo12', japanese: 'ゆっくり', reading: 'ゆっくり', romaji: 'Yukkuri', english: 'Slowly / at ease', situation: 'hangover' },
  { id: 'hngo13', japanese: '当分', reading: 'とうぶん', romaji: 'Tōbun', english: 'For a while / for the time being', situation: 'hangover' },
  // --- Phrases ---
  { id: 'hngo14', japanese: '頭がガンガンする。', reading: 'あたまががんがんする。', romaji: 'Atama ga gangan suru.', english: 'My head is pounding / throbbing.', situation: 'hangover' },
  { id: 'hngo15', japanese: 'お酒はもう当分いいです。', reading: 'おさけはもうとうぶんいいです。', romaji: 'Osake wa mō tōbun ii desu.', english: "I'm done with alcohol for a while.", situation: 'hangover' },
  { id: 'hngo16', japanese: '水をたくさん飲みます。', reading: 'みずをたくさんのみます。', romaji: 'Mizu o takusan nomimasu.', english: 'I will drink lots of water.', situation: 'hangover' },
  { id: 'hngo17', japanese: '今日は会社を休みます。', reading: 'きょうはかいしゃをやすみます。', romaji: 'Kyō wa kaisha o yasumimasu.', english: 'I am taking the day off from work today.', situation: 'hangover' },
  { id: 'hngo18', japanese: '昨夜飲みすぎました。', reading: 'さくやのみすぎました。', romaji: 'Sakuya nomisugimashita.', english: 'I drank too much last night.', situation: 'hangover' },
  { id: 'hngo19', japanese: '薬局はどこですか？', reading: 'やっきょくはどこですか？', romaji: 'Yakkyoku wa doko desu ka?', english: 'Where is the pharmacy?', situation: 'hangover' },
  { id: 'hngo20', japanese: 'お腹が痛いです。', reading: 'おなかがいたいです。', romaji: 'Onaka ga itai desu.', english: 'I have a stomachache.', situation: 'hangover' },
  // --- Extra ---
  { id: 'hngo21', japanese: '頭痛', reading: 'ずつう', romaji: 'Zutsū', english: 'Headache', situation: 'hangover' },
  { id: 'hngo22', japanese: '寝る', reading: 'ねる', romaji: 'Neru', english: 'To sleep / rest', situation: 'hangover' },
  { id: 'hngo23', japanese: 'フラフラ', reading: 'ふらふら', romaji: 'Furafura', english: 'Dizzy / unsteady on your feet', situation: 'hangover' },
  { id: 'hngo24', japanese: '今日は動けません。', reading: 'きょうはうごけません。', romaji: 'Kyō wa ugokemasen.', english: "I can't move today.", situation: 'hangover' },
  { id: 'hngo25', japanese: '水をください。', reading: 'みずをください。', romaji: 'Mizu o kudasai.', english: 'Water, please.', situation: 'hangover' },
  { id: 'hngo26', japanese: '電解質', reading: 'でんかしつ', romaji: 'Denkashitsu', english: 'Electrolytes', situation: 'hangover' },
  { id: 'hngo27', japanese: '吐き気', reading: 'はきけ', romaji: 'Hakike', english: 'Nausea', situation: 'hangover' },
  { id: 'hngo28', japanese: 'もう飲まないと誓います。', reading: 'もうのまないとちかいます。', romaji: 'Mō nomanai to chikaimasu.', english: 'I swear I will not drink again.', situation: 'hangover' },
  { id: 'hngo29', japanese: '横になっています。', reading: 'よこになっています。', romaji: 'Yoko ni natte imasu.', english: 'I am lying down.', situation: 'hangover' },
  { id: 'hngo30', japanese: '午後から出勤します。', reading: 'ごごからしゅっきんします。', romaji: 'Gogo kara shukkin shimasu.', english: 'I will go to work in the afternoon.', situation: 'hangover' },

  // ==================== PREMIUM: MISSED LAST TRAIN (30 items) ====================
  // --- Nouns ---
  { id: 'mlt1', japanese: '終電', reading: 'しゅうでん', romaji: 'Shūden', english: 'Last train', situation: 'missed_last_train' },
  { id: 'mlt2', japanese: 'タクシー乗り場', reading: 'たくしーのりば', romaji: 'Takushī noriba', english: 'Taxi stand', situation: 'missed_last_train' },
  { id: 'mlt3', japanese: 'カプセルホテル', reading: 'かぷせるほてる', romaji: 'Kapuseru hoteru', english: 'Capsule hotel', situation: 'missed_last_train' },
  { id: 'mlt4', japanese: 'ネットカフェ', reading: 'ねっとかふぇ', romaji: 'Netto kafe', english: 'Internet cafe', situation: 'missed_last_train' },
  { id: 'mlt5', japanese: '始発', reading: 'しはつ', romaji: 'Shihatsu', english: 'First train (of the day)', situation: 'missed_last_train' },
  // --- Verbs ---
  { id: 'mlt6', japanese: '泊まる', reading: 'とまる', romaji: 'Tomaru', english: 'To stay overnight', situation: 'missed_last_train' },
  { id: 'mlt7', japanese: '歩く', reading: 'あるく', romaji: 'Aruku', english: 'To walk', situation: 'missed_last_train' },
  { id: 'mlt8', japanese: '待つ', reading: 'まつ', romaji: 'Matsu', english: 'To wait', situation: 'missed_last_train' },
  // --- Adjectives ---
  { id: 'mlt9', japanese: '遅い', reading: 'おそい', romaji: 'Osoi', english: 'Late', situation: 'missed_last_train' },
  { id: 'mlt10', japanese: '眠い', reading: 'ねむい', romaji: 'Nemui', english: 'Sleepy', situation: 'missed_last_train' },
  { id: 'mlt11', japanese: '困った', reading: 'こまった', romaji: 'Komatta', english: 'In trouble / stuck', situation: 'missed_last_train' },
  // --- Adverbs ---
  { id: 'mlt12', japanese: '朝まで', reading: 'あさまで', romaji: 'Asa made', english: 'Until morning', situation: 'missed_last_train' },
  { id: 'mlt13', japanese: '仕方なく', reading: 'しかたなく', romaji: 'Shikatanaku', english: 'Reluctantly / with no choice', situation: 'missed_last_train' },
  // --- Phrases ---
  { id: 'mlt14', japanese: '朝までカラオケする。', reading: 'あさまでからおけする。', romaji: 'Asa made karaoke suru.', english: 'To sing karaoke until morning.', situation: 'missed_last_train' },
  { id: 'mlt15', japanese: '終電を逃してしまいました。', reading: 'しゅうでんをのがしてしまいました。', romaji: 'Shūden o nogashite shimaimashita.', english: 'I missed the last train.', situation: 'missed_last_train' },
  { id: 'mlt16', japanese: 'タクシーを呼んでください。', reading: 'たくしーをよんでください。', romaji: 'Takushī o yonde kudasai.', english: 'Please call a taxi.', situation: 'missed_last_train' },
  { id: 'mlt17', japanese: '一晩だけ泊まりたいです。', reading: 'いっばんだけとまりたいです。', romaji: 'Ippan dake tomaritai desu.', english: 'I would like to stay for just one night.', situation: 'missed_last_train' },
  { id: 'mlt18', japanese: '始発は何時ですか？', reading: 'しはつはなんじですか？', romaji: 'Shihatsu wa nanji desu ka?', english: 'What time is the first train?', situation: 'missed_last_train' },
  { id: 'mlt19', japanese: '最寄りのホテルはどこですか？', reading: 'もよりのほてるはどこですか？', romaji: 'Moyori no hoteru wa doko desu ka?', english: 'Where is the nearest hotel?', situation: 'missed_last_train' },
  { id: 'mlt20', japanese: 'ここから家までいくらですか？', reading: 'ここからいえまていくらですか？', romaji: 'Koko kara ie made ikura desu ka?', english: 'How much is it from here to my home?', situation: 'missed_last_train' },
  // --- Extra ---
  { id: 'mlt21', japanese: '夜行バス', reading: 'やこうばす', romaji: 'Yakō basu', english: 'Overnight bus', situation: 'missed_last_train' },
  { id: 'mlt22', japanese: '乗る', reading: 'のる', romaji: 'Noru', english: 'To get on / ride', situation: 'missed_last_train' },
  { id: 'mlt23', japanese: 'ここから歩いて何分ですか？', reading: 'ここからあるいてなんぷんですか？', romaji: 'Koko kara aruite nanpun desu ka?', english: 'How many minutes on foot from here?', situation: 'missed_last_train' },
  { id: 'mlt24', japanese: '24時間開いている店はありますか？', reading: '24じかんあいているみせはありますか？', romaji: 'Nijūyon jikan aite iru mise wa arimasu ka?', english: 'Is there a 24-hour store nearby?', situation: 'missed_last_train' },
  { id: 'mlt25', japanese: '朝の始発を待ちます。', reading: 'あさのしはつをまちます。', romaji: 'Asa no shihatsu o machimasu.', english: 'I will wait for the first train in the morning.', situation: 'missed_last_train' },
  { id: 'mlt26', japanese: '足', reading: 'あし', romaji: 'Ashi', english: 'Foot / leg', situation: 'missed_last_train' },
  { id: 'mlt27', japanese: '疲れた', reading: 'つかれた', romaji: 'Tsukareta', english: 'Tired / exhausted', situation: 'missed_last_train' },
  { id: 'mlt28', japanese: 'ここで一晩過ごせますか？', reading: 'ここでいっばんすごせますか？', romaji: 'Koko de ippan sugoemasu ka?', english: 'Can I stay here overnight?', situation: 'missed_last_train' },
  { id: 'mlt29', japanese: '充電できる場所はありますか？', reading: 'じゅうでんできるばしょはありますか？', romaji: 'Jūden dekiru basho wa arimasu ka?', english: 'Is there a place to charge my phone?', situation: 'missed_last_train' },
  { id: 'mlt30', japanese: '友達の家に泊まります。', reading: 'ともだちのいえにとまります。', romaji: 'Tomodachi no ie ni tomarimasu.', english: "I'm staying at a friend's place.", situation: 'missed_last_train' },

  // ==================== PREMIUM: FESTIVAL (30 items) ====================
  // --- Nouns ---
  { id: 'fest1', japanese: '夏祭り', reading: 'なつまつり', romaji: 'Natsumatsuri', english: 'Summer festival', situation: 'festival' },
  { id: 'fest2', japanese: '屋台', reading: 'やたい', romaji: 'Yatai', english: 'Food stall', situation: 'festival' },
  { id: 'fest3', japanese: '花火', reading: 'はなび', romaji: 'Hanabi', english: 'Fireworks', situation: 'festival' },
  { id: 'fest4', japanese: 'お神輿', reading: 'おみこし', romaji: 'Omikoshi', english: 'Portable shrine', situation: 'festival' },
  { id: 'fest5', japanese: '浴衣', reading: 'ゆかた', romaji: 'Yukata', english: 'Yukata (summer kimono)', situation: 'festival' },
  // --- Verbs ---
  { id: 'fest6', japanese: '参る', reading: 'まいる', romaji: 'Mairu', english: 'To visit (a shrine/festival, humble)', situation: 'festival' },
  { id: 'fest7', japanese: '買う', reading: 'かう', romaji: 'Kau', english: 'To buy', situation: 'festival' },
  { id: 'fest8', japanese: '踊る', reading: 'おどる', romaji: 'Odoru', english: 'To dance', situation: 'festival' },
  // --- Adjectives ---
  { id: 'fest9', japanese: '賑やかな', reading: 'にぎやかな', romaji: 'Nigiyaka na', english: 'Lively / bustling', situation: 'festival' },
  { id: 'fest10', japanese: '暑い', reading: 'あつい', romaji: 'Atsui', english: 'Hot (weather)', situation: 'festival' },
  { id: 'fest11', japanese: '楽しい', reading: 'たのしい', romaji: 'Tanoshii', english: 'Fun / enjoyable', situation: 'festival' },
  // --- Adverbs ---
  { id: 'fest12', japanese: 'たくさん', reading: 'たくさん', romaji: 'Takusan', english: 'A lot / many', situation: 'festival' },
  { id: 'fest13', japanese: '一緒に', reading: 'いっしょに', romaji: 'Issho ni', english: 'Together', situation: 'festival' },
  // --- Phrases ---
  { id: 'fest14', japanese: '浴衣を着て行きましょう！', reading: 'ゆかたをきていきましょう！', romaji: 'Yukata o kite ikimashō!', english: "Let's wear yukata and go!", situation: 'festival' },
  { id: 'fest15', japanese: '花火が始まります。', reading: 'はなびがはじまります。', romaji: 'Hanabi ga hajimarimasu.', english: 'The fireworks are starting.', situation: 'festival' },
  { id: 'fest16', japanese: '屋台の食べ物は何がおすすめですか？', reading: 'やたいのたべものはなにがおすすめですか？', romaji: 'Yatai no tabemono wa nani ga osusume desu ka?', english: 'What food at the stalls do you recommend?', situation: 'festival' },
  { id: 'fest17', japanese: '金魚すくいをやりたいです。', reading: 'きんぎょすくいをやりたいです。', romaji: 'Kingyo sukui o yaritai desu.', english: 'I want to try goldfish scooping.', situation: 'festival' },
  { id: 'fest18', japanese: '混んでいますね。', reading: 'こんでいますね。', romaji: 'Konde imasu ne.', english: "It's crowded, isn't it?", situation: 'festival' },
  { id: 'fest19', japanese: '終わるまで待ちましょう。', reading: 'おわるまでまちましょう。', romaji: 'Owaru made machimashō.', english: "Let's wait until it's over.", situation: 'festival' },
  { id: 'fest20', japanese: 'また来年も来よう。', reading: 'またらいねんもこよう。', romaji: 'Mata rainen mo koyō.', english: "Let's come again next year.", situation: 'festival' },
  // --- Extra ---
  { id: 'fest21', japanese: '盆踊り', reading: 'ぼんおどり', romaji: 'Bon odori', english: 'Bon dance', situation: 'festival' },
  { id: 'fest22', japanese: '縁日', reading: 'えんにち', romaji: 'Ennichi', english: 'Temple/shrine fair', situation: 'festival' },
  { id: 'fest23', japanese: 'ワイワイ', reading: 'わいわい', romaji: 'Waiwai', english: 'Noisy / lively (crowd chatter)', situation: 'festival' },
  { id: 'fest24', japanese: '写真を撮ってもいいですか？', reading: 'しゃしんをとってもいいですか？', romaji: 'Shashin o totte mo ii desu ka?', english: 'May I take a photo?', situation: 'festival' },
  { id: 'fest25', japanese: '屋台は何時までですか？', reading: 'やたいはなんじまでですか？', romaji: 'Yatai wa nanji made desu ka?', english: 'What time do the stalls close?', situation: 'festival' },
  { id: 'fest26', japanese: '提灯', reading: 'ちょうちん', romaji: 'Chōchin', english: 'Paper lantern', situation: 'festival' },
  { id: 'fest27', japanese: '浴衣を着る', reading: 'ゆかたをきる', romaji: 'Yukata o kiru', english: 'To wear a yukata', situation: 'festival' },
  { id: 'fest28', japanese: 'パチパチ', reading: 'ぱちぱち', romaji: 'Pachipachi', english: 'Crackling / clapping sound (fireworks)', situation: 'festival' },
  { id: 'fest29', japanese: 'りんご飴を買いたいです。', reading: 'りんごあめをかいたいです。', romaji: 'Ringo ame o kaitai desu.', english: 'I want to buy a candy apple.', situation: 'festival' },
  { id: 'fest30', japanese: '人が多すぎますね。', reading: 'ひとがおおすぎますね。', romaji: 'Hito ga ōsugimasu ne.', english: 'There are too many people, huh?', situation: 'festival' },

  // ==================== PREMIUM: RAINY DAY (30 items) ====================
  // --- Nouns ---
  { id: 'rain1', japanese: '土砂降り', reading: 'どしゃぶり', romaji: 'Doshaburi', english: 'Downpour / Heavy rain', situation: 'rainy_day' },
  { id: 'rain2', japanese: 'ビニール傘', reading: 'びにーるがさ', romaji: 'Binīru gasa', english: 'Plastic umbrella', situation: 'rainy_day' },
  { id: 'rain3', japanese: '雨宿り', reading: 'あまやどり', romaji: 'Amayadori', english: 'Taking shelter from the rain', situation: 'rainy_day' },
  { id: 'rain4', japanese: '長靴', reading: 'ながぐつ', romaji: 'Nagagutsu', english: 'Rain boots / Wellington boots', situation: 'rainy_day' },
  { id: 'rain5', japanese: 'レインコート', reading: 'れいんこーと', romaji: 'Rein kōto', english: 'Raincoat', situation: 'rainy_day' },
  // --- Verbs ---
  { id: 'rain6', japanese: 'ジメジメする', reading: 'じめじめする', romaji: 'Jimejime suru', english: 'To feel humid / damp', situation: 'rainy_day' },
  { id: 'rain7', japanese: '降る', reading: 'ふる', romaji: 'Furu', english: 'To fall (rain/snow)', situation: 'rainy_day' },
  { id: 'rain8', japanese: '濡れる', reading: 'ぬれる', romaji: 'Nureru', english: 'To get wet', situation: 'rainy_day' },
  // --- Adjectives ---
  { id: 'rain9', japanese: '蒸し暑い', reading: 'むしあつい', romaji: 'Mushiatsui', english: 'Hot and humid / muggy', situation: 'rainy_day' },
  { id: 'rain10', japanese: '大雨の', reading: 'おおあめの', romaji: 'Ōame no', english: 'Heavy rain (modifier)', situation: 'rainy_day' },
  { id: 'rain11', japanese: '湿った', reading: 'しめった', romaji: 'Shimetta', english: 'Damp / moist', situation: 'rainy_day' },
  // --- Adverbs ---
  { id: 'rain12', japanese: 'しとしと', reading: 'しとしと', romaji: 'Shitoshito', english: 'Gently / steadily (rain falling)', situation: 'rainy_day' },
  { id: 'rain13', japanese: 'ぽつぽつ', reading: 'ぽつぽつ', romaji: 'Potsupotsu', english: 'Drop by drop / sporadically', situation: 'rainy_day' },
  // --- Phrases ---
  { id: 'rain14', japanese: '雨が降りそうです。', reading: 'あめがふりそうです。', romaji: 'Ame ga furisō desu.', english: 'It looks like it is going to rain.', situation: 'rainy_day' },
  { id: 'rain15', japanese: '傘を貸してもらえますか？', reading: 'かさをかしてもらえますか？', romaji: 'Kasa o kashite moraemasu ka?', english: 'Can I borrow an umbrella?', situation: 'rainy_day' },
  { id: 'rain16', japanese: '雨が止むまで待ちましょう。', reading: 'あめがやむまでまちましょう。', romaji: 'Ame ga yamu made machimashō.', english: "Let's wait until the rain stops.", situation: 'rainy_day' },
  { id: 'rain17', japanese: '靴が濡れてしまいました。', reading: 'くつがぬれてしまいました。', romaji: 'Kutsu ga nurete shimaimashita.', english: 'My shoes got wet.', situation: 'rainy_day' },
  { id: 'rain18', japanese: '今日は雨ですね。', reading: 'きょうはあめですね。', romaji: 'Kyō wa ame desu ne.', english: "It's raining today, isn't it?", situation: 'rainy_day' },
  { id: 'rain19', japanese: '洗濯物が干せません。', reading: 'せんたくものがほせません。', romaji: 'Sentakumono ga hosen masen.', english: "I can't hang the laundry out to dry.", situation: 'rainy_day' },
  { id: 'rain20', japanese: '天気予報を見ましたか？', reading: 'てんきよほうをみましたか？', romaji: 'Tenki yohō o mimashita ka?', english: 'Did you check the weather forecast?', situation: 'rainy_day' },
  // --- Extra ---
  { id: 'rain21', japanese: '折りたたみ傘', reading: 'おりたたみがさ', romaji: 'Oritatami gasa', english: 'Folding umbrella', situation: 'rainy_day' },
  { id: 'rain22', japanese: '乾かす', reading: 'かわかす', romaji: 'Kawakasu', english: 'To dry (something)', situation: 'rainy_day' },
  { id: 'rain23', japanese: '雨が強くなってきました。', reading: 'あめがつよくなってきました。', romaji: 'Ame ga tsuyoku natte kimashita.', english: 'The rain is getting heavier.', situation: 'rainy_day' },
  { id: 'rain24', japanese: '傘を忘れました。', reading: 'かさをわすれました。', romaji: 'Kasa o wasuremashita.', english: 'I forgot my umbrella.', situation: 'rainy_day' },
  { id: 'rain25', japanese: '涼しい', reading: 'すずしい', romaji: 'Suzushii', english: 'Cool (weather)', situation: 'rainy_day' },
  { id: 'rain26', japanese: 'カッパ', reading: 'かっぱ', romaji: 'Kappa', english: 'Rain poncho / raincoat', situation: 'rainy_day' },
  { id: 'rain27', japanese: '止む', reading: 'やむ', romaji: 'Yamu', english: 'To stop (rain)', situation: 'rainy_day' },
  { id: 'rain28', japanese: 'ザーザー', reading: 'ざーざー', romaji: 'Zāzā', english: 'Pouring heavily (rain sound)', situation: 'rainy_day' },
  { id: 'rain29', japanese: '傘を持っていきましょう。', reading: 'かさをもっていきましょう。', romaji: 'Kasa o motte ikimashō.', english: "Let's bring an umbrella.", situation: 'rainy_day' },
  { id: 'rain30', japanese: '足元に気をつけて。', reading: 'あしもとにきをつけて。', romaji: 'Ashimoto ni ki o tsukete.', english: 'Watch your step.', situation: 'rainy_day' },

  // ==================== PREMIUM: SAUNA (30 items) ====================
  // --- Nouns ---
  { id: 'sa1', japanese: 'サウナ室', reading: 'さうなしつ', romaji: 'Saunashitsu', english: 'Sauna room', situation: 'sauna' },
  { id: 'sa2', japanese: 'ロウリュ', reading: 'ろうりゅ', romaji: 'Rōryu', english: 'Steam infusion (löyly)', situation: 'sauna' },
  { id: 'sa3', japanese: '水風呂', reading: 'みずぶろ', romaji: 'Mizuburo', english: 'Cold water bath', situation: 'sauna' },
  { id: 'sa4', japanese: 'サウナハット', reading: 'さうなはっと', romaji: 'Sauna hatto', english: 'Sauna hat', situation: 'sauna' },
  { id: 'sa5', japanese: '外気浴', reading: 'がいきよく', romaji: 'Gaikiyoku', english: 'Cool-down / outdoor air bath', situation: 'sauna' },
  // --- Verbs ---
  { id: 'sa6', japanese: '汗を流す', reading: 'あせをながす', romaji: 'Ase o nagasu', english: 'To sweat it out', situation: 'sauna' },
  { id: 'sa7', japanese: '整う', reading: 'ととのう', romaji: 'Totonou', english: 'To feel refreshed (after sauna)', situation: 'sauna' },
  { id: 'sa8', japanese: '入る', reading: 'はいる', romaji: 'Hairu', english: 'To enter (the sauna)', situation: 'sauna' },
  // --- Adjectives ---
  { id: 'sa9', japanese: '熱い', reading: 'あつい', romaji: 'Atsui', english: 'Hot', situation: 'sauna' },
  { id: 'sa10', japanese: '汗ばむ', reading: 'あせばむ', romaji: 'Asebamu', english: 'To be sweaty / perspiring', situation: 'sauna' },
  { id: 'sa11', japanese: '気持ちいい', reading: 'きもちいい', romaji: 'Kimochi ii', english: 'Feels good / pleasant', situation: 'sauna' },
  // --- Adverbs ---
  { id: 'sa12', japanese: 'じわじわ', reading: 'じわじわ', romaji: 'Jiwajiwa', english: 'Gradually / slowly', situation: 'sauna' },
  { id: 'sa13', japanese: '一気に', reading: 'いっきに', romaji: 'Ikki ni', english: 'All at once', situation: 'sauna' },
  // --- Phrases ---
  { id: 'sa14', japanese: 'サウナに入ってもいいですか？', reading: 'さうなにはいってもいいですか？', romaji: 'Sauna ni haitte mo ii desu ka?', english: 'May I use the sauna?', situation: 'sauna' },
  { id: 'sa15', japanese: 'ロウリュをお願いします。', reading: 'ろうりゅをおねがいします。', romaji: 'Rōryu o onegai shimasu.', english: 'Steam infusion, please.', situation: 'sauna' },
  { id: 'sa16', japanese: '水風呂は何度ですか？', reading: 'みずぶろはなんどですか？', romaji: 'Mizuburo wa nando desu ka?', english: 'How cold is the cold bath?', situation: 'sauna' },
  { id: 'sa17', japanese: 'タオルはありますか？', reading: 'たおるはありますか？', romaji: 'Taoru wa arimasu ka?', english: 'Do you have towels?', situation: 'sauna' },
  { id: 'sa18', japanese: '整いました。', reading: 'ととのいました。', romaji: 'Totonoimashita.', english: 'I feel refreshed.', situation: 'sauna' },
  { id: 'sa19', japanese: 'とても気持ちいいです。', reading: 'とてもきもちいいです。', romaji: 'Totemo kimochi ii desu.', english: 'It feels amazing.', situation: 'sauna' },
  { id: 'sa20', japanese: 'もう一度入りたいです。', reading: 'もういちどはいりたいです。', romaji: 'Mō ichido hairitai desu.', english: 'I want to go in one more time.', situation: 'sauna' },
  // --- Extra ---
  { id: 'sa21', japanese: '整い椅子', reading: 'ととのいいす', romaji: 'Totonoii su', english: 'Cool-down chair (after sauna)', situation: 'sauna' },
  { id: 'sa22', japanese: '流す', reading: 'ながす', romaji: 'Nagasu', english: 'To rinse off / wash away', situation: 'sauna' },
  { id: 'sa23', japanese: 'じっとり', reading: 'じっとり', romaji: 'Jittori', english: 'Damp / sweaty (onomatopoeia)', situation: 'sauna' },
  { id: 'sa24', japanese: 'サウナは何度ですか？', reading: 'さうなはなんどですか？', romaji: 'Sauna wa nando desu ka?', english: 'What temperature is the sauna?', situation: 'sauna' },
  { id: 'sa25', japanese: '静かな時間はありますか？', reading: 'しずかなじかんはありますか？', romaji: 'Shizuka na jikan wa arimasu ka?', english: 'Is there a quiet hours period?', situation: 'sauna' },
  { id: 'sa26', japanese: 'アウフグース', reading: 'あうふぐーす', romaji: 'Aufugūsu', english: 'Aufguss (sauna steam show)', situation: 'sauna' },
  { id: 'sa27', japanese: '汗をかく', reading: 'あせをかく', romaji: 'Ase o kaku', english: 'To sweat', situation: 'sauna' },
  { id: 'sa28', japanese: 'ポカポカ', reading: 'ぽかぽか', romaji: 'Pokapoka', english: 'Warm and cozy feeling', situation: 'sauna' },
  { id: 'sa29', japanese: 'セット数は何セットですか？', reading: 'せっとすうはなんせっとですか？', romaji: 'Setto-sū wa nan setto desu ka?', english: 'How many sauna rounds is the set?', situation: 'sauna' },
  { id: 'sa30', japanese: '外気浴はどこですか？', reading: 'がいきよくはどこですか？', romaji: 'Gaikiyoku wa doko desu ka?', english: 'Where is the outdoor cooling area?', situation: 'sauna' },

  // ==================== PREMIUM: DATE (30 items) ====================
  // --- Nouns ---
  { id: 'dt1', japanese: 'デート', reading: 'でーと', romaji: 'Dēto', english: 'Date (romantic outing)', situation: 'date' },
  { id: 'dt2', japanese: '夜景', reading: 'やけい', romaji: 'Yakei', english: 'Night view', situation: 'date' },
  { id: 'dt3', japanese: 'プレゼント', reading: 'ぷれぜんと', romaji: 'Purezento', english: 'Present / gift', situation: 'date' },
  { id: 'dt4', japanese: 'お誘い', reading: 'おさそい', romaji: 'Osasoi', english: 'Invitation', situation: 'date' },
  { id: 'dt5', japanese: '待ち合わせ', reading: 'まちあわせ', romaji: 'Machiawase', english: 'Meeting place / rendezvous', situation: 'date' },
  // --- Verbs ---
  { id: 'dt6', japanese: '誘う', reading: 'さそう', romaji: 'Sasou', english: 'To invite (someone out)', situation: 'date' },
  { id: 'dt7', japanese: '付き合う', reading: 'つきあう', romaji: 'Tsukiau', english: 'To go out with / date', situation: 'date' },
  { id: 'dt8', japanese: '乾杯する', reading: 'かんぱいする', romaji: 'Kanpai suru', english: 'To toast / cheers', situation: 'date' },
  // --- Adjectives ---
  { id: 'dt9', japanese: '素敵な', reading: 'すてきな', romaji: 'Suteki na', english: 'Lovely / wonderful', situation: 'date' },
  { id: 'dt10', japanese: '楽しい', reading: 'たのしい', romaji: 'Tanoshii', english: 'Fun / enjoyable', situation: 'date' },
  { id: 'dt11', japanese: '美味しい', reading: 'おいしい', romaji: 'Oishii', english: 'Delicious', situation: 'date' },
  // --- Adverbs ---
  { id: 'dt12', japanese: '一緒に', reading: 'いっしょに', romaji: 'Issho ni', english: 'Together', situation: 'date' },
  { id: 'dt13', japanese: 'ゆっくり', reading: 'ゆっくり', romaji: 'Yukkuri', english: 'Slowly / leisurely', situation: 'date' },
  // --- Phrases ---
  { id: 'dt14', japanese: '素敵な場所ですね。', reading: 'すてきなばしょですね。', romaji: 'Suteki na basho desu ne.', english: 'What a lovely place.', situation: 'date' },
  { id: 'dt15', japanese: '今度一緒に食事しませんか？', reading: 'こんどいっしょにしょくじしませんか？', romaji: 'Konndo issho ni shokuji shimasen ka?', english: 'Would you like to have a meal together sometime?', situation: 'date' },
  { id: 'dt16', japanese: '何時に会いましょうか？', reading: 'なんじにあいましょうか？', romaji: 'Nanji ni aimashō ka?', english: 'What time shall we meet?', situation: 'date' },
  { id: 'dt17', japanese: '駅の改札前で待ち合わせしましょう。', reading: 'えきのかいさつまえでまちあわせしましょう。', romaji: 'Eki no kaisatsumae de machiawase shimashō.', english: "Let's meet in front of the ticket gates at the station.", situation: 'date' },
  { id: 'dt18', japanese: '今日はおごります。', reading: 'きょうはおごります。', romaji: 'Kyō wa ogurimasu.', english: "Today is my treat.", situation: 'date' },
  { id: 'dt19', japanese: '割り勘にしましょう。', reading: 'わりかんにしましょう。', romaji: 'Warikan ni shimashō.', english: "Let's split the bill.", situation: 'date' },
  { id: 'dt20', japanese: 'また会いたいです。', reading: 'またあいたいです。', romaji: 'Mata aitai desu.', english: "I'd like to see you again.", situation: 'date' },
  // --- Extra ---
  { id: 'dt21', japanese: '花束', reading: 'はなたば', romaji: 'Hanataba', english: 'Bouquet of flowers', situation: 'date' },
  { id: 'dt22', japanese: '手をつなぐ', reading: 'てをつなぐ', romaji: 'Te o tsunagu', english: 'To hold hands', situation: 'date' },
  { id: 'dt23', japanese: 'ドキドキ', reading: 'どきどき', romaji: 'Dokidoki', english: 'Heart pounding (excited / nervous)', situation: 'date' },
  { id: 'dt24', japanese: 'お疲れ様でした。', reading: 'おつかれさまでした。', romaji: 'Otsukaresama deshita.', english: 'Thanks for your hard work today.', situation: 'date' },
  { id: 'dt25', japanese: 'おすすめの店を知っていますか？', reading: 'おすすめのみせをしっていますか？', romaji: 'Osusume no mise o shitte imasu ka?', english: 'Do you know a good restaurant?', situation: 'date' },
  { id: 'dt26', japanese: '静かな場所がいいです。', reading: 'しずかなばしょがいいです。', romaji: 'Shizuka na basho ga ii desu.', english: "I'd prefer a quiet place.", situation: 'date' },
  { id: 'dt27', japanese: '予約してあります。', reading: 'よやくしてあります。', romaji: 'Yoyaku shite arimasu.', english: 'I have a reservation.', situation: 'date' },
  { id: 'dt28', japanese: 'とても楽しいです。', reading: 'とてもたのしいです。', romaji: 'Totemo tanoshii desu.', english: "I'm having a great time.", situation: 'date' },
  { id: 'dt29', japanese: '次はどこに行きましょうか？', reading: 'つぎはどこにいきましょうか？', romaji: 'Tsugi wa doko ni ikimashō ka?', english: 'Where should we go next?', situation: 'date' },
  { id: 'dt30', japanese: 'お送りします。', reading: 'おおくりします。', romaji: 'Ookuri shimasu.', english: "I'll walk you home / see you off.", situation: 'date' },

  // ==================== PREMIUM: DON QUIJOTE (30 items) ====================
  // --- Nouns ---
  { id: 'dq1', japanese: '激安', reading: 'げきやす', romaji: 'Gekiyasu', english: 'Super cheap / bargain prices', situation: 'don_quijote' },
  { id: 'dq2', japanese: '免税', reading: 'めんぜい', romaji: 'Menzei', english: 'Tax-free', situation: 'don_quijote' },
  { id: 'dq3', japanese: 'レジ袋', reading: 'れじぶくろ', romaji: 'Reji bukuro', english: 'Plastic shopping bag', situation: 'don_quijote' },
  { id: 'dq4', japanese: 'ポイントカード', reading: 'ぽいんとかーど', romaji: 'Pointo kādo', english: 'Point / loyalty card', situation: 'don_quijote' },
  { id: 'dq5', japanese: 'お土産', reading: 'おみやげ', romaji: 'Omiyage', english: 'Souvenir / gift', situation: 'don_quijote' },
  // --- Verbs ---
  { id: 'dq6', japanese: '探す', reading: 'さがす', romaji: 'Sagasu', english: 'To search / look for', situation: 'don_quijote' },
  { id: 'dq7', japanese: '見つける', reading: 'みつける', romaji: 'Mitsukeru', english: 'To find', situation: 'don_quijote' },
  { id: 'dq8', japanese: '免税する', reading: 'めんぜいする', romaji: 'Menzei suru', english: 'To get tax exemption', situation: 'don_quijote' },
  // --- Adjectives ---
  { id: 'dq9', japanese: '安い', reading: 'やすい', romaji: 'Yasui', english: 'Cheap / inexpensive', situation: 'don_quijote' },
  { id: 'dq10', japanese: '派手な', reading: 'はでな', romaji: 'Hade na', english: 'Flashy / gaudy', situation: 'don_quijote' },
  { id: 'dq11', japanese: '深夜の', reading: 'しんやの', romaji: 'Shinya no', english: 'Late-night', situation: 'don_quijote' },
  // --- Adverbs ---
  { id: 'dq12', japanese: 'つい', reading: 'つい', romaji: 'Tsui', english: 'Unintentionally / before you know it', situation: 'don_quijote' },
  { id: 'dq13', japanese: '思わず', reading: 'おもわず', romaji: 'Omowazu', english: 'Unconsciously / without thinking', situation: 'don_quijote' },
  // --- Phrases ---
  { id: 'dq14', japanese: 'これはいくらですか？', reading: 'これはいくらですか？', romaji: 'Kore wa ikura desu ka?', english: 'How much is this?', situation: 'don_quijote' },
  { id: 'dq15', japanese: '免税はできますか？', reading: 'めんぜいはできますか？', romaji: 'Menzei wa dekimasu ka?', english: 'Can I get tax-free?', situation: 'don_quijote' },
  { id: 'dq16', japanese: 'ポイントカードは作れますか？', reading: 'ぽいんとかーどはつくれますか？', romaji: 'Pointo kādo wa tsukuremasu ka?', english: 'Can I get a point card?', situation: 'don_quijote' },
  { id: 'dq17', japanese: '袋をください。', reading: 'ふくろをください。', romaji: 'Fukuro o kudasai.', english: 'A bag, please.', situation: 'don_quijote' },
  { id: 'dq18', japanese: 'レシートをください。', reading: 'れしーとをください。', romaji: 'Reshīto o kudasai.', english: 'Receipt, please.', situation: 'don_quijote' },
  { id: 'dq19', japanese: '現金だけですか？', reading: 'げんきんだけですか？', romaji: 'Genkin dake desu ka?', english: 'Cash only?', situation: 'don_quijote' },
  { id: 'dq20', japanese: 'お会計をお願いします。', reading: 'おかいけいをおねがいします。', romaji: 'Okaikei o onegai shimasu.', english: 'Check, please.', situation: 'don_quijote' },
  // --- Extra ---
  { id: 'dq21', japanese: '品揃え', reading: 'しなぞろえ', romaji: "Shinazoro'e", english: 'Product lineup / assortment', situation: 'don_quijote' },
  { id: 'dq22', japanese: '比べる', reading: 'くらべる', romaji: 'Kuraberu', english: 'To compare', situation: 'don_quijote' },
  { id: 'dq23', japanese: 'どこにありますか？', reading: 'どこにありますか？', romaji: 'Doko ni arimasu ka?', english: 'Where is it located?', situation: 'don_quijote' },
  { id: 'dq24', japanese: 'これは日本限定ですか？', reading: 'これはにほんげんていですか？', romaji: 'Kore wa Nihon gentei desu ka?', english: 'Is this Japan-only?', situation: 'don_quijote' },
  { id: 'dq25', japanese: 'つい買ってしまいました。', reading: 'ついかってしまいました。', romaji: 'Tsui katte shimaimashita.', english: 'I ended up buying it on impulse.', situation: 'don_quijote' },
  { id: 'dq26', japanese: 'セール', reading: 'せーる', romaji: 'Sēru', english: 'Sale', situation: 'don_quijote' },
  { id: 'dq27', japanese: '試着する', reading: 'しちゃくする', romaji: 'Shichaku suru', english: 'To try on (clothes)', situation: 'don_quijote' },
  { id: 'dq28', japanese: '在庫を確認してください。', reading: 'ざいこをかくにんしてください。', romaji: 'Zaiko o kakunin shite kudasai.', english: 'Please check the stock.', situation: 'don_quijote' },
  { id: 'dq29', japanese: '他の色はありますか？', reading: 'ほかのいろはありますか？', romaji: 'Hoka no iro wa arimasu ka?', english: 'Do you have other colors?', situation: 'don_quijote' },
  { id: 'dq30', japanese: '閉店時間は何時ですか？', reading: 'へいてんじかんはなんじですか？', romaji: 'Heiten jikan wa nanji desu ka?', english: 'What time do you close?', situation: 'don_quijote' },

  // ==================== PREMIUM: PHARMACY (30 items) ====================
  // --- Nouns ---
  { id: 'ph1', japanese: '調剤薬局', reading: 'ちょうざいやっきょく', romaji: 'Chōzai yakkyoku', english: 'Dispensing pharmacy', situation: 'pharmacy' },
  { id: 'ph2', japanese: '処方箋', reading: 'しょほうせん', romaji: 'Shohōsen', english: 'Prescription', situation: 'pharmacy' },
  { id: 'ph3', japanese: '市販薬', reading: 'しはんやく', romaji: 'Shihanyaku', english: 'Over-the-counter medicine', situation: 'pharmacy' },
  { id: 'ph4', japanese: '風邪薬', reading: 'かぜぐすり', romaji: 'Kazegusuri', english: 'Cold medicine', situation: 'pharmacy' },
  { id: 'ph5', japanese: '目薬', reading: 'めぐすり', romaji: 'Megusuri', english: 'Eye drops', situation: 'pharmacy' },
  // --- Verbs ---
  { id: 'ph6', japanese: '相談する', reading: 'そうだんする', romaji: 'Sōdan suru', english: 'To consult / ask for advice', situation: 'pharmacy' },
  { id: 'ph7', japanese: '飲む', reading: 'のむ', romaji: 'Nomu', english: 'To take (medicine)', situation: 'pharmacy' },
  { id: 'ph8', japanese: '治る', reading: 'なおる', romaji: 'Naoru', english: 'To heal / get better', situation: 'pharmacy' },
  // --- Adjectives ---
  { id: 'ph9', japanese: '効く', reading: 'きく', romaji: 'Kiku', english: 'Effective (medicine works)', situation: 'pharmacy' },
  { id: 'ph10', japanese: '眠い', reading: 'ねむい', romaji: 'Nemui', english: 'Sleepy', situation: 'pharmacy' },
  { id: 'ph11', japanese: '痛い', reading: 'いたい', romaji: 'Itai', english: 'Painful / hurts', situation: 'pharmacy' },
  // --- Adverbs ---
  { id: 'ph12', japanese: '一日三回', reading: 'いちにちさんかい', romaji: 'Ichinichi sankai', english: 'Three times a day', situation: 'pharmacy' },
  { id: 'ph13', japanese: '食後', reading: 'しょくご', romaji: 'Shokugo', english: 'After meals', situation: 'pharmacy' },
  // --- Phrases ---
  { id: 'ph14', japanese: '風邪薬はありますか？', reading: 'かぜぐすりはありますか？', romaji: 'Kazegusuri wa arimasu ka?', english: 'Do you have cold medicine?', situation: 'pharmacy' },
  { id: 'ph15', japanese: '処方箋を持っています。', reading: 'しょほうせんをもっています。', romaji: 'Shohōsen o motte imasu.', english: 'I have a prescription.', situation: 'pharmacy' },
  { id: 'ph16', japanese: 'この薬の副作用は？', reading: 'このくすりのふくさようは？', romaji: 'Kono kusuri no fukusayō wa?', english: 'What are the side effects of this medicine?', situation: 'pharmacy' },
  { id: 'ph17', japanese: 'アレルギーがあります。', reading: 'あれるぎーがあります。', romaji: 'Arerugī ga arimasu.', english: 'I have allergies.', situation: 'pharmacy' },
  { id: 'ph18', japanese: '英語で説明してください。', reading: 'えいごでせつめいしてください。', romaji: 'Eigo de setsumei shite kudasai.', english: 'Please explain in English.', situation: 'pharmacy' },
  { id: 'ph19', japanese: 'これを飲んでもいいですか？', reading: 'これをのんでもいいですか？', romaji: 'Kore o nonde mo ii desu ka?', english: 'Is it okay to take this?', situation: 'pharmacy' },
  { id: 'ph20', japanese: 'お大事に。', reading: 'おだいじに。', romaji: 'Odaiji ni.', english: 'Take care of yourself.', situation: 'pharmacy' },
  // --- Extra ---
  { id: 'ph21', japanese: '湿布', reading: 'しっぷ', romaji: 'Shippu', english: 'Medicated patch / compress', situation: 'pharmacy' },
  { id: 'ph22', japanese: '塗る', reading: 'ぬる', romaji: 'Nuru', english: 'To apply (ointment/cream)', situation: 'pharmacy' },
  { id: 'ph23', japanese: '子供用の薬はありますか？', reading: 'こどもようのくすりはありますか？', romaji: 'Kodomoyō no kusuri wa arimasu ka?', english: "Do you have children's medicine?", situation: 'pharmacy' },
  { id: 'ph24', japanese: '用法用量を教えてください。', reading: 'ようほうようりょうをおしえてください。', romaji: 'Yōhō yōryō o oshiete kudasai.', english: 'Please explain the dosage and usage.', situation: 'pharmacy' },
  { id: 'ph25', japanese: '頭が痛いです。', reading: 'あたまがいたいです。', romaji: 'Atama ga itai desu.', english: 'I have a headache.', situation: 'pharmacy' },
  { id: 'ph26', japanese: '絆創膏', reading: 'ばんそうこう', romaji: 'Bansōkō', english: 'Bandage / adhesive bandage', situation: 'pharmacy' },
  { id: 'ph27', japanese: '飲み合わせ', reading: 'のみあわせ', romaji: 'Nomiawase', english: 'Drug interaction / compatibility', situation: 'pharmacy' },
  { id: 'ph28', japanese: 'のど飴', reading: 'のどあめ', romaji: 'Nodo ame', english: 'Throat lozenge / cough drop', situation: 'pharmacy' },
  { id: 'ph29', japanese: '症状を説明します。', reading: 'しょうじょうをせつめいします。', romaji: 'Shōjō o setsumei shimasu.', english: 'I will explain my symptoms.', situation: 'pharmacy' },
  { id: 'ph30', japanese: '妊娠中です。', reading: 'にんしんちゅうです。', romaji: 'Ninshin-chū desu.', english: 'I am pregnant.', situation: 'pharmacy' },

  // ==================== PREMIUM: COFFEE SHOP (30 items) ====================
  // --- Nouns ---
  { id: 'cf1', japanese: 'エスプレッソ', reading: 'えすぷれっそ', romaji: 'Esupuresso', english: 'Espresso', situation: 'coffee_shop' },
  { id: 'cf2', japanese: 'ラテ', reading: 'らて', romaji: 'Rate', english: 'Latte', situation: 'coffee_shop' },
  { id: 'cf3', japanese: 'テイクアウト', reading: 'ていくあうと', romaji: 'Teikuauto', english: 'Takeout', situation: 'coffee_shop' },
  { id: 'cf4', japanese: '豆', reading: 'まめ', romaji: 'Mame', english: 'Coffee beans', situation: 'coffee_shop' },
  { id: 'cf5', japanese: 'カウンター', reading: 'かうんたー', romaji: 'Kauntā', english: 'Counter', situation: 'coffee_shop' },
  // --- Verbs ---
  { id: 'cf6', japanese: '注文する', reading: 'ちゅうもんする', romaji: 'Chūmon suru', english: 'To order', situation: 'coffee_shop' },
  { id: 'cf7', japanese: '淹れる', reading: 'いれる', romaji: 'Ireru', english: 'To brew (coffee/tea)', situation: 'coffee_shop' },
  { id: 'cf8', japanese: '待つ', reading: 'まつ', romaji: 'Matsu', english: 'To wait', situation: 'coffee_shop' },
  // --- Adjectives ---
  { id: 'cf9', japanese: '苦い', reading: 'にがい', romaji: 'Nigai', english: 'Bitter', situation: 'coffee_shop' },
  { id: 'cf10', japanese: '温かい', reading: 'あたたかい', romaji: 'Atatakai', english: 'Warm / hot', situation: 'coffee_shop' },
  { id: 'cf11', japanese: '人気の', reading: 'にんきの', romaji: 'Ninki no', english: 'Popular', situation: 'coffee_shop' },
  // --- Adverbs ---
  { id: 'cf12', japanese: 'ホットで', reading: 'ほっとで', romaji: 'Hotto de', english: 'Hot (for drinks)', situation: 'coffee_shop' },
  { id: 'cf13', japanese: 'アイスで', reading: 'あいすで', romaji: 'Aisu de', english: 'Iced', situation: 'coffee_shop' },
  // --- Phrases ---
  { id: 'cf14', japanese: 'ラテを一つください。', reading: 'らてをひとつください。', romaji: 'Rate o hitotsu kudasai.', english: 'One latte, please.', situation: 'coffee_shop' },
  { id: 'cf15', japanese: '豆を100グラムください。', reading: 'まめを100ぐらむください。', romaji: 'Mame o hyaku guramu kudasai.', english: '100 grams of beans, please.', situation: 'coffee_shop' },
  { id: 'cf16', japanese: '店内でいただきます。', reading: 'てんないでいただきます。', romaji: 'Tennai de itadakimasu.', english: 'For here, please.', situation: 'coffee_shop' },
  { id: 'cf17', japanese: 'テイクアウトでお願いします。', reading: 'ていくあうとでおねがいします。', romaji: 'Teikuauto de onegai shimasu.', english: 'To go, please.', situation: 'coffee_shop' },
  { id: 'cf18', japanese: '砂糖は入れないでください。', reading: 'さとうはいれないでください。', romaji: 'Satō wa irenaide kudasai.', english: 'No sugar, please.', situation: 'coffee_shop' },
  { id: 'cf19', japanese: 'おすすめは何ですか？', reading: 'おすすめはなんですか？', romaji: 'Osusume wa nan desu ka?', english: 'What do you recommend?', situation: 'coffee_shop' },
  { id: 'cf20', japanese: 'とても美味しいです。', reading: 'とてもおいしいです。', romaji: 'Totemo oishii desu.', english: 'It is very delicious.', situation: 'coffee_shop' },
  // --- Extra ---
  { id: 'cf21', japanese: 'ミルク', reading: 'みるく', romaji: 'Miruku', english: 'Milk', situation: 'coffee_shop' },
  { id: 'cf22', japanese: '香ばしい', reading: 'こうばしい', romaji: 'Kōbashii', english: 'Fragrant / aromatic (roasted coffee)', situation: 'coffee_shop' },
  { id: 'cf23', japanese: 'サイズは何がありますか？', reading: 'さいずはなにがありますか？', romaji: 'Saizu wa nani ga arimasu ka?', english: 'What sizes do you have?', situation: 'coffee_shop' },
  { id: 'cf24', japanese: '豆は挽いてください。', reading: 'まめはひいてください。', romaji: 'Mame wa hiite kudasai.', english: 'Please grind the beans.', situation: 'coffee_shop' },
  { id: 'cf25', japanese: '席は空いていますか？', reading: 'せきはあいていますか？', romaji: 'Seki wa aite imasu ka?', english: 'Are there any seats available?', situation: 'coffee_shop' },
  { id: 'cf26', japanese: 'カプチーノ', reading: 'かぷちーの', romaji: 'Kapuchīno', english: 'Cappuccino', situation: 'coffee_shop' },
  { id: 'cf27', japanese: '深煎り', reading: 'ふかいり', romaji: 'Fukairi', english: 'Dark roast', situation: 'coffee_shop' },
  { id: 'cf28', japanese: 'モカをお願いします。', reading: 'もかをおねがいします。', romaji: 'Moka o onegai shimasu.', english: 'A mocha, please.', situation: 'coffee_shop' },
  { id: 'cf29', japanese: 'デカフェはありますか？', reading: 'でかふぇはありますか？', romaji: 'Dekafe wa arimasu ka?', english: 'Do you have decaf?', situation: 'coffee_shop' },
  { id: 'cf30', japanese: 'お代わりをお願いします。', reading: 'おかわりをおねがいします。', romaji: 'Okawari o onegai shimasu.', english: 'A refill, please.', situation: 'coffee_shop' },

  // ==================== PREMIUM: GYUDON SHOP (30 items) ====================
  // --- Nouns ---
  { id: 'gy1', japanese: '牛丼', reading: 'ぎゅうどん', romaji: 'Gyūdon', english: 'Beef bowl', situation: 'gyudon_shop' },
  { id: 'gy2', japanese: 'つゆ', reading: 'つゆ', romaji: 'Tsuyu', english: 'Broth / sauce', situation: 'gyudon_shop' },
  { id: 'gy3', japanese: 'ネギ', reading: 'ねぎ', romaji: 'Negi', english: 'Green onion', situation: 'gyudon_shop' },
  { id: 'gy4', japanese: '味噌汁', reading: 'みそしる', romaji: 'Misoshiru', english: 'Miso soup', situation: 'gyudon_shop' },
  { id: 'gy5', japanese: 'セット', reading: 'せっと', romaji: 'Setto', english: 'Set meal', situation: 'gyudon_shop' },
  // --- Verbs ---
  { id: 'gy6', japanese: 'かける', reading: 'かける', romaji: 'Kakeru', english: 'To pour (sauce)', situation: 'gyudon_shop' },
  { id: 'gy7', japanese: '混ぜる', reading: 'まぜる', romaji: 'Mazeru', english: 'To mix', situation: 'gyudon_shop' },
  { id: 'gy8', japanese: '並ぶ', reading: 'ならぶ', romaji: 'Narabu', english: 'To line up / stand in queue', situation: 'gyudon_shop' },
  // --- Adjectives ---
  { id: 'gy9', japanese: '甘い', reading: 'あまい', romaji: 'Amai', english: 'Sweet', situation: 'gyudon_shop' },
  { id: 'gy10', japanese: '大盛り', reading: 'おおもり', romaji: 'Ōmori', english: 'Large portion', situation: 'gyudon_shop' },
  { id: 'gy11', japanese: '並', reading: 'なみ', romaji: 'Nami', english: 'Regular size', situation: 'gyudon_shop' },
  // --- Adverbs ---
  { id: 'gy12', japanese: 'トッピングで', reading: 'とっぴんぐで', romaji: 'Toppingu de', english: 'With topping', situation: 'gyudon_shop' },
  { id: 'gy13', japanese: 'つけないで', reading: 'つけないで', romaji: 'Tsukenaide', english: 'Without (adding)', situation: 'gyudon_shop' },
  // --- Phrases ---
  { id: 'gy14', japanese: '牛丼並を一つください。', reading: 'ぎゅうどんなみをひとつください。', romaji: 'Gyūdon nami o hitotsu kudasai.', english: 'One regular beef bowl, please.', situation: 'gyudon_shop' },
  { id: 'gy15', japanese: '大盛りにしてください。', reading: 'おおもりにしてください。', romaji: 'Ōmori ni shite kudasai.', english: 'Make it a large portion, please.', situation: 'gyudon_shop' },
  { id: 'gy16', japanese: 'ネギ抜きでお願いします。', reading: 'ねぎぬきでおねがいします。', romaji: 'Negi nuki de onegai shimasu.', english: 'No green onion, please.', situation: 'gyudon_shop' },
  { id: 'gy17', japanese: '味噌汁もください。', reading: 'みそしるもください。', romaji: 'Misoshiru mo kudasai.', english: 'Miso soup as well, please.', situation: 'gyudon_shop' },
  { id: 'gy18', japanese: '持ち帰りでお願いします。', reading: 'もちかえりでおねがいします。', romaji: 'Mochikaeri de onegai shimasu.', english: 'To go, please.', situation: 'gyudon_shop' },
  { id: 'gy19', japanese: 'つゆダクでお願いします。', reading: 'つゆだくでおねがいします。', romaji: 'Tsuyudaku de onegai shimasu.', english: 'Extra sauce, please.', situation: 'gyudon_shop' },
  { id: 'gy20', japanese: 'ごちそうさまでした。', reading: 'ごちそうさまでした。', romaji: 'Gochisōsama deshita.', english: 'Thank you for the meal.', situation: 'gyudon_shop' },
  // --- Extra ---
  { id: 'gy21', japanese: '紅生姜', reading: 'べにしょうが', romaji: 'Benishōga', english: 'Pickled ginger (for gyūdon)', situation: 'gyudon_shop' },
  { id: 'gy22', japanese: '持ち帰る', reading: 'もちかえる', romaji: 'Mochikaeru', english: 'To take out / bring home', situation: 'gyudon_shop' },
  { id: 'gy23', japanese: 'もぐもぐ', reading: 'もぐもぐ', romaji: 'Mogumogu', english: 'Munching sound (eating)', situation: 'gyudon_shop' },
  { id: 'gy24', japanese: '玉子をトッピングで。', reading: 'たまごをとっぴんぐで。', romaji: 'Tamago o toppingu de.', english: 'With egg topping, please.', situation: 'gyudon_shop' },
  { id: 'gy25', japanese: '並でお願いします。', reading: 'なみでおねがいします。', romaji: 'Nami de onegai shimasu.', english: 'Regular size, please.', situation: 'gyudon_shop' },
  { id: 'gy26', japanese: '豚汁', reading: 'とんじる', romaji: 'Tonjiru', english: 'Pork miso soup', situation: 'gyudon_shop' },
  { id: 'gy27', japanese: '食べる', reading: 'たべる', romaji: 'Taberu', english: 'To eat', situation: 'gyudon_shop' },
  { id: 'gy28', japanese: '温かい', reading: 'あたたかい', romaji: 'Atatakai', english: 'Warm / hot', situation: 'gyudon_shop' },
  { id: 'gy29', japanese: 'テーブル席は空いていますか？', reading: 'てーぶるせきはあいていますか？', romaji: 'Tēburu seki wa aite imasu ka?', english: 'Are any table seats available?', situation: 'gyudon_shop' },
  { id: 'gy30', japanese: '特盛りでお願いします。', reading: 'とくもりでおねがいします。', romaji: 'Tokumori de onegai shimasu.', english: 'Extra-large portion, please.', situation: 'gyudon_shop' },

  // ==================== PREMIUM: TAXI (30 items) ====================
  // --- Nouns ---
  { id: 'tx1', japanese: 'タクシー乗り場', reading: 'たくしーのりば', romaji: 'Takushī noriba', english: 'Taxi stand', situation: 'taxi' },
  { id: 'tx2', japanese: 'メーター', reading: 'めーたー', romaji: 'Mētā', english: 'Meter', situation: 'taxi' },
  { id: 'tx3', japanese: '領収書', reading: 'りょうしゅうしょ', romaji: 'Ryōshūsho', english: 'Receipt', situation: 'taxi' },
  { id: 'tx4', japanese: '料金', reading: 'りょうきん', romaji: 'Ryōkin', english: 'Fare / fee', situation: 'taxi' },
  { id: 'tx5', japanese: '迎車', reading: 'えいしゃ', romaji: 'Eisha', english: 'Taxi pickup dispatch', situation: 'taxi' },
  // --- Verbs ---
  { id: 'tx6', japanese: '止める', reading: 'とめる', romaji: 'Tomeru', english: 'To stop (a taxi)', situation: 'taxi' },
  { id: 'tx7', japanese: '乗る', reading: 'のる', romaji: 'Noru', english: 'To get in / ride', situation: 'taxi' },
  { id: 'tx8', japanese: '降りる', reading: 'おりる', romaji: 'Oriru', english: 'To get off', situation: 'taxi' },
  // --- Adjectives ---
  { id: 'tx9', japanese: '混んでいる', reading: 'こんでいる', romaji: 'Konde iru', english: 'Crowded / congested', situation: 'taxi' },
  { id: 'tx10', japanese: '近い', reading: 'ちかい', romaji: 'Chikai', english: 'Near / close', situation: 'taxi' },
  { id: 'tx11', japanese: '遠い', reading: 'とおい', romaji: 'Tōi', english: 'Far', situation: 'taxi' },
  // --- Adverbs ---
  { id: 'tx12', japanese: 'あそこで', reading: 'あそこで', romaji: 'Asoko de', english: 'Over there', situation: 'taxi' },
  { id: 'tx13', japanese: 'すぐに', reading: 'すぐに', romaji: 'Sugu ni', english: 'Immediately / right away', situation: 'taxi' },
  // --- Phrases ---
  { id: 'tx14', japanese: 'ここまでお願いします。', reading: 'ここまでおねがいします。', romaji: 'Koko made onegai shimasu.', english: 'To here, please.', situation: 'taxi' },
  { id: 'tx15', japanese: 'メーターをお願いします。', reading: 'めーたーをおねがいします。', romaji: 'Mētā o onegai shimasu.', english: 'Meter, please.', situation: 'taxi' },
  { id: 'tx16', japanese: 'ここで降ろしてください。', reading: 'ここでおろしてください。', romaji: 'Koko de oroshite kudasai.', english: 'Please let me off here.', situation: 'taxi' },
  { id: 'tx17', japanese: '領収書をください。', reading: 'りょうしゅうしょをください。', romaji: 'Ryōshūsho o kudasai.', english: 'Receipt, please.', situation: 'taxi' },
  { id: 'tx18', japanese: '空港までいくらですか？', reading: 'くうこうまでいくらですか？', romaji: 'Kūkō made ikura desu ka?', english: 'How much to the airport?', situation: 'taxi' },
  { id: 'tx19', japanese: 'クレジットカードは使えますか？', reading: 'くれじっとかーどはつかえますか？', romaji: 'Kurejitto kādo wa tsukaemasu ka?', english: 'Can I use a credit card?', situation: 'taxi' },
  { id: 'tx20', japanese: 'ありがとうございました。', reading: 'ありがとうございました。', romaji: 'Arigatō gozaimashita.', english: 'Thank you very much.', situation: 'taxi' },
  // --- Extra ---
  { id: 'tx21', japanese: 'ナビ', reading: 'なび', romaji: 'Nabi', english: 'GPS navigation', situation: 'taxi' },
  { id: 'tx22', japanese: '案内する', reading: 'あんないする', romaji: 'Annai suru', english: 'To guide / give directions', situation: 'taxi' },
  { id: 'tx23', japanese: '右に曲がってください。', reading: 'みぎにまがってください。', romaji: 'Migi ni magatte kudasai.', english: 'Please turn right.', situation: 'taxi' },
  { id: 'tx24', japanese: '道が混んでいますね。', reading: 'みちがこんでいますね。', romaji: 'Michi ga konde imasu ne.', english: "The road is congested, isn't it?", situation: 'taxi' },
  { id: 'tx25', japanese: '急いでください。', reading: 'いそいでください。', romaji: 'Isoide kudasai.', english: 'Please hurry.', situation: 'taxi' },
  { id: 'tx26', japanese: '目的地', reading: 'もくてきち', romaji: 'Mokutekichi', english: 'Destination', situation: 'taxi' },
  { id: 'tx27', japanese: '道順', reading: 'みちじゅん', romaji: 'Michijun', english: 'Route / directions', situation: 'taxi' },
  { id: 'tx28', japanese: '左に曲がってください。', reading: 'ひだりにまがってください。', romaji: 'Hidari ni magatte kudasai.', english: 'Please turn left.', situation: 'taxi' },
  { id: 'tx29', japanese: 'ここで待っていてください。', reading: 'ここでまっていてください。', romaji: 'Koko de matte ite kudasai.', english: 'Please wait here.', situation: 'taxi' },
  { id: 'tx30', japanese: '迎車をお願いします。', reading: 'えいしゃをおねがいします。', romaji: 'Eisha o onegai shimasu.', english: 'A taxi pickup, please.', situation: 'taxi' },

  ...premiumTravelEssentialWords,
  ...premiumNewSituationWords,
  ...premiumExtraSituationWords,
  ...premiumBatch2SituationWords,
  ...premiumRyokanWords,
  ...premiumJapaneseTableWords,
  ...premiumSukiKiraiWords,
  ...premiumChouTsukauWords,
  ...hatsumodePackWords,
];
