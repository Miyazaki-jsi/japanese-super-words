import type { SituationId } from './words';

export type SituationLabel = { ja: string; en: string };

export const SITUATION_LABELS: Record<SituationId, SituationLabel> = {
  ramen_shop: { ja: 'ラーメン屋', en: 'Ramen Shop' },
  convenience_store: { ja: 'コンビニ', en: 'Convenience Store' },
  greetings: { ja: '挨拶', en: 'Greetings' },
  hospital: { ja: '病院', en: 'Hospital' },
  train_station: { ja: '駅', en: 'Train Station' },
  izakaya: { ja: '居酒屋', en: 'Izakaya' },
  sushi_shop: { ja: '寿司屋', en: 'Sushi Shop' },
  koban: { ja: '交番', en: 'Police Box' },
  hotel: { ja: 'ホテル', en: 'Hotel' },
  hangover: { ja: '二日酔い', en: 'Hangover' },
  missed_last_train: { ja: '終電逃した時', en: 'Missed Last Train' },
  festival: { ja: '祭り', en: 'Festival' },
  rainy_day: { ja: '雨の日', en: 'Rainy Day' },
  late_night_bar: { ja: 'バー・夜', en: 'Late-Night Bar' },
  date: { ja: 'デート', en: 'Date' },
  sauna: { ja: 'サウナ', en: 'Sauna' },
  don_quijote: { ja: 'ドン・キホーテ', en: 'Don Quijote' },
  pharmacy: { ja: '薬局', en: 'Pharmacy' },
  coffee_shop: { ja: 'コーヒー店', en: 'Coffee Shop' },
  gyudon_shop: { ja: '牛丼屋', en: 'Gyudon Shop' },
  taxi: { ja: 'タクシー', en: 'Taxi' },
  coin_laundry: { ja: 'コインランドリー', en: 'Coin Laundry' },
  luggage_shipping: { ja: '荷物配送', en: 'Luggage Shipping' },
  sim_card: { ja: 'SIM・eSIM', en: 'SIM & eSIM' },
  airport_immigration: { ja: '空港・入国', en: 'Airport & Immigration' },
  ticket_machine: { ja: '券売機・IC', en: 'Ticket Machines & IC' },
  onsen: { ja: '温泉・銭湯', en: 'Onsen / Public Bath' },
  karaoke: { ja: 'カラオケ', en: 'Karaoke' },
  allergies_dietary: { ja: 'アレルギー・食事', en: 'Allergies & Dietary' },
  lost_emergency: { ja: '迷子・緊急', en: 'Lost & Emergency' },
  shrine_temple: { ja: '神社・お寺', en: 'Shrine & Temple' },
  restaurant_reservation: { ja: '予約・順番待ち', en: 'Reservation & Queue' },
  highway_bus: { ja: '高速バス', en: 'Highway Bus' },
  disaster_evacuation: { ja: '災害・避難', en: 'Disaster & Evacuation' },
  theme_park: { ja: 'テーマパーク', en: 'Theme Park' },
  atm_payments: { ja: 'お金・支払い', en: 'ATM & Payments' },
  shinkansen: { ja: '新幹線', en: 'Shinkansen' },
  hatsumode: { ja: '初詣', en: 'New Year Shrine' },
  depachika: { ja: 'デパ地下', en: 'Depachika Food Hall' },
  game_center: { ja: 'ゲームセンター', en: 'Game Center' },
  coin_locker: { ja: 'コインロッカー', en: 'Coin Locker' },
  vending_machine: { ja: '自販機', en: 'Vending Machines' },
  tourist_information: { ja: '観光案内所', en: 'Tourist Information' },
  trash_carry_out: { ja: 'ゴミ・持ち帰り', en: 'Trash & Carry-Out' },
  kaiten_sushi: { ja: '回転寿司', en: 'Conveyor Belt Sushi' },
  post_office: { ja: '郵便局', en: 'Post Office' },
  cabaret_club: { ja: 'キャバクラ', en: 'Cabaret Club' },
  tachinomi: { ja: '立ち飲み', en: 'Standing Bar' },
  photo_etiquette: { ja: '撮影マナー', en: 'Photo Etiquette' },
};

export function getSituationLabel(id: SituationId | string): SituationLabel {
  const found = SITUATION_LABELS[id as SituationId];
  if (found) return found;
  return { ja: id, en: id };
}
