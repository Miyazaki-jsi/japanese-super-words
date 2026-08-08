import type { SituationId } from './words';

export type SituationLabel = { ja: string; en: string; reading: string };

export const SITUATION_LABELS: Record<SituationId, SituationLabel> = {
  ramen_shop: { ja: 'ラーメン屋', en: 'Ramen Shop', reading: 'らーめんや' },
  convenience_store: { ja: 'コンビニ', en: 'Convenience Store', reading: 'こんびに' },
  greetings: { ja: '挨拶', en: 'Greetings', reading: 'あいさつ' },
  hospital: { ja: '病院', en: 'Hospital', reading: 'びょういん' },
  train_station: { ja: '駅', en: 'Train Station', reading: 'えき' },
  izakaya: { ja: '居酒屋', en: 'Izakaya', reading: 'いざかや' },
  sushi_shop: { ja: '寿司屋', en: 'Sushi Shop', reading: 'すしや' },
  koban: { ja: '交番', en: 'Police Box', reading: 'こうばん' },
  hotel: { ja: 'ホテル', en: 'Hotel', reading: 'ほてる' },
  hangover: { ja: '二日酔い', en: 'Hangover', reading: 'ふつかよい' },
  missed_last_train: { ja: '終電逃した時', en: 'Missed Last Train', reading: 'しゅうでんのがしたとき' },
  festival: { ja: '祭り', en: 'Festival', reading: 'まつり' },
  rainy_day: { ja: '雨の日', en: 'Rainy Day', reading: 'あめのひ' },
  late_night_bar: { ja: 'バー・夜', en: 'Late-Night Bar', reading: 'ばーよる' },
  date: { ja: 'デート', en: 'Date', reading: 'でーと' },
  sauna: { ja: 'サウナ', en: 'Sauna', reading: 'さうな' },
  don_quijote: { ja: 'ドン・キホーテ', en: 'Don Quijote', reading: 'どんきほーて' },
  pharmacy: { ja: '薬局', en: 'Pharmacy', reading: 'やっきょく' },
  coffee_shop: { ja: 'コーヒー店', en: 'Coffee Shop', reading: 'こーひーてん' },
  gyudon_shop: { ja: '牛丼屋', en: 'Gyudon Shop', reading: 'ぎゅうどんや' },
  taxi: { ja: 'タクシー', en: 'Taxi', reading: 'たくしー' },
  coin_laundry: { ja: 'コインランドリー', en: 'Coin Laundry', reading: 'こいんらんどりー' },
  luggage_shipping: { ja: '荷物配送', en: 'Luggage Shipping', reading: 'にもつはいそう' },
  sim_card: { ja: 'SIM・eSIM', en: 'SIM & eSIM', reading: 'しみ' },
  airport_immigration: { ja: '空港・入国', en: 'Airport & Immigration', reading: 'くうこうにゅうこく' },
  ticket_machine: { ja: '券売機・IC', en: 'Ticket Machines & IC', reading: 'けんばいき' },
  onsen: { ja: '温泉・銭湯', en: 'Onsen / Public Bath', reading: 'おんせんせんとう' },
  karaoke: { ja: 'カラオケ', en: 'Karaoke', reading: 'からおけ' },
  allergies_dietary: { ja: 'アレルギー・食事', en: 'Allergies & Dietary', reading: 'あれるぎーしょくじ' },
  lost_emergency: { ja: '迷子・緊急', en: 'Lost & Emergency', reading: 'まいごきんきゅう' },
  shrine_temple: { ja: '神社・お寺', en: 'Shrine & Temple', reading: 'じんじゃおてら' },
  restaurant_reservation: { ja: '予約・順番待ち', en: 'Reservation & Queue', reading: 'よやくじゅんばんまち' },
  highway_bus: { ja: '高速バス', en: 'Highway Bus', reading: 'こうそくばす' },
  disaster_evacuation: { ja: '災害・避難', en: 'Disaster & Evacuation', reading: 'さいがいひなん' },
  theme_park: { ja: 'テーマパーク', en: 'Theme Park', reading: 'てーまぱーく' },
  atm_payments: { ja: 'お金・支払い', en: 'ATM & Payments', reading: 'おかねしはらい' },
  shinkansen: { ja: '新幹線', en: 'Shinkansen', reading: 'しんかんせん' },
  hatsumode: { ja: '初詣', en: 'New Year Shrine', reading: 'はつもうで' },
  depachika: { ja: 'デパ地下', en: 'Depachika Food Hall', reading: 'でぱちか' },
  game_center: { ja: 'ゲームセンター', en: 'Game Center', reading: 'げーむせんたー' },
  coin_locker: { ja: 'コインロッカー', en: 'Coin Locker', reading: 'こいんろっかー' },
  vending_machine: { ja: '自販機', en: 'Vending Machines', reading: 'じはんき' },
  tourist_information: { ja: '観光案内所', en: 'Tourist Information', reading: 'かんこうあんないじょ' },
  trash_carry_out: { ja: 'ゴミ・持ち帰り', en: 'Trash & Carry-Out', reading: 'ごみもちかえり' },
  kaiten_sushi: { ja: '回転寿司', en: 'Conveyor Belt Sushi', reading: 'かいてんずし' },
  post_office: { ja: '郵便局', en: 'Post Office', reading: 'ゆうびんきょく' },
  cabaret_club: { ja: 'キャバクラ', en: 'Cabaret Club', reading: 'きゃばくら' },
  tachinomi: { ja: '立ち飲み', en: 'Standing Bar', reading: 'たちのみ' },
  photo_etiquette: { ja: '撮影マナー', en: 'Photo Etiquette', reading: 'さつえいまなー' },
  ryokan: { ja: '旅館', en: 'Ryokan', reading: 'りょかん' },
  japanese_table: { ja: '日本人の食卓', en: 'Japanese Dinner Table', reading: 'にほんじんのしょくたく' },
  suki_kirai: { ja: 'すき？きらい？', en: 'Like or Dislike?', reading: 'すき？きらい？' },
  asking_for_directions: { ja: '道を尋ねる', en: 'Asking for Directions', reading: 'みちをたずねる' },
};

export function getSituationLabel(id: SituationId | string): SituationLabel {
  const found = SITUATION_LABELS[id as SituationId];
  if (found) return found;
  return { ja: id, en: id, reading: id };
}

export function getSituationReading(id: SituationId | string): string {
  return getSituationLabel(id).reading;
}
