import type { SituationId } from './words';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Beef,
  Building2,
  Bus,
  CarTaxiFront,
  CloudRain,
  Coffee,
  CreditCard,
  Droplets,
  FerrisWheel,
  Flame,
  Gamepad2,
  GlassWater,
  Heart,
  Luggage,
  MapPin,
  Mic2,
  PartyPopper,
  Pill,
  PlaneLanding,
  ShieldAlert,
  Shirt,
  ShoppingBag,
  Smartphone,
  Store,
  Ticket,
  Train,
  TrainFront,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';

export type PremiumSituationCategoryId = 'traveler_essentials' | 'daily_life' | 'fun_nightlife';

export type PremiumSituationMeta = {
  id: SituationId;
  title: string;
  enTitle: string;
  icon: LucideIcon;
  category: PremiumSituationCategoryId;
  sortOrder: number;
  previewPhraseJa: string;
  previewPhraseEn: string;
};


export const premiumSituationCategories: {
  id: PremiumSituationCategoryId;
  title: string;
  enTitle: string;
  description: string;
  descriptionJa: string;
}[] = [
  {
    id: 'traveler_essentials',
    title: '旅行者の必須',
    enTitle: 'Traveler Essentials',
    description: 'Airport, transit, safety & culture',
    descriptionJa: '空港・交通・安全・文化',
  },
  {
    id: 'daily_life',
    title: '日常生活',
    enTitle: 'Daily Life',
    description: 'Shops, food, weather & errands',
    descriptionJa: '買い物・食事・天気・用事',
  },
  {
    id: 'fun_nightlife',
    title: '楽しみ・ナイト',
    enTitle: 'Fun & Nightlife',
    description: 'Dates, festivals & after dark',
    descriptionJa: 'デート・祭り・夜の楽しみ',
  },
];

export const allPremiumSituations: PremiumSituationMeta[] = [
  // Traveler Essentials (8)
  {
    id: 'airport_immigration',
    title: '空港・入国',
    enTitle: 'Airport & Immigration',
    icon: PlaneLanding,
    category: 'traveler_essentials',
    sortOrder: 1,
    previewPhraseJa: '観光です。',
    previewPhraseEn: 'I am here for tourism.',
  },
  {
    id: 'ticket_machine',
    title: '券売機・IC',
    enTitle: 'Ticket Machines & IC',
    icon: Ticket,
    category: 'traveler_essentials',
    sortOrder: 2,
    previewPhraseJa: '使い方がわかりません。',
    previewPhraseEn: "I don't know how to use this.",
  },
  {
    id: 'shinkansen',
    title: '新幹線',
    enTitle: 'Shinkansen',
    icon: Train,
    category: 'traveler_essentials',
    sortOrder: 3,
    previewPhraseJa: '指定席をお願いします。',
    previewPhraseEn: 'A reserved seat, please.',
  },
  {
    id: 'highway_bus',
    title: '高速バス',
    enTitle: 'Highway Bus',
    icon: Bus,
    category: 'traveler_essentials',
    sortOrder: 4,
    previewPhraseJa: '東京までのバスはどこですか？',
    previewPhraseEn: 'Where is the bus to Tokyo?',
  },
  {
    id: 'allergies_dietary',
    title: 'アレルギー・食事制限',
    enTitle: 'Allergies & Dietary',
    icon: AlertTriangle,
    category: 'traveler_essentials',
    sortOrder: 5,
    previewPhraseJa: '小麦アレルギーです。',
    previewPhraseEn: 'I have a wheat allergy.',
  },
  {
    id: 'lost_emergency',
    title: '迷子・緊急時',
    enTitle: 'Lost & Emergency',
    icon: MapPin,
    category: 'traveler_essentials',
    sortOrder: 6,
    previewPhraseJa: '財布をなくしました。',
    previewPhraseEn: 'I lost my wallet.',
  },
  {
    id: 'disaster_evacuation',
    title: '災害・避難',
    enTitle: 'Disaster & Evacuation',
    icon: ShieldAlert,
    category: 'traveler_essentials',
    sortOrder: 7,
    previewPhraseJa: '避難所はどこですか？',
    previewPhraseEn: 'Where is the evacuation shelter?',
  },
  {
    id: 'luggage_shipping',
    title: '荷物配送',
    enTitle: 'Luggage Shipping',
    icon: Luggage,
    category: 'traveler_essentials',
    sortOrder: 8,
    previewPhraseJa: 'ホテルまで送れますか？',
    previewPhraseEn: 'Can you ship it to my hotel?',
  },
  {
    id: 'sim_card',
    title: 'SIM・eSIM',
    enTitle: 'SIM & eSIM',
    icon: Smartphone,
    category: 'traveler_essentials',
    sortOrder: 9,
    previewPhraseJa: 'データだけのプランはありますか？',
    previewPhraseEn: 'Do you have a data-only plan?',
  },
  {
    id: 'shrine_temple',
    title: '神社・お寺',
    enTitle: 'Shrine & Temple',
    icon: Building2,
    category: 'traveler_essentials',
    sortOrder: 10,
    previewPhraseJa: '写真を撮ってもいいですか？',
    previewPhraseEn: 'May I take photos?',
  },
  {
    id: 'onsen',
    title: '温泉・銭湯',
    enTitle: 'Onsen / Public Bath',
    icon: Droplets,
    category: 'traveler_essentials',
    sortOrder: 11,
    previewPhraseJa: 'タトゥーがあります。',
    previewPhraseEn: 'I have tattoos.',
  },
  {
    id: 'atm_payments',
    title: 'お金・支払い',
    enTitle: 'ATM & Payments',
    icon: CreditCard,
    category: 'traveler_essentials',
    sortOrder: 12,
    previewPhraseJa: 'ATMはどこですか？',
    previewPhraseEn: 'Where is the ATM?',
  },

  // Daily Life (9)
  {
    id: 'pharmacy',
    title: '薬局',
    enTitle: 'Pharmacy',
    icon: Pill,
    category: 'daily_life',
    sortOrder: 1,
    previewPhraseJa: '頭が痛いです。',
    previewPhraseEn: 'I have a headache.',
  },
  {
    id: 'restaurant_reservation',
    title: '予約・順番待ち',
    enTitle: 'Reservation & Queue',
    icon: UtensilsCrossed,
    category: 'daily_life',
    sortOrder: 2,
    previewPhraseJa: '予約しています。',
    previewPhraseEn: 'I have a reservation.',
  },
  {
    id: 'taxi',
    title: 'タクシー',
    enTitle: 'Taxi',
    icon: CarTaxiFront,
    category: 'daily_life',
    sortOrder: 3,
    previewPhraseJa: 'ここまでお願いします。',
    previewPhraseEn: 'To here, please.',
  },
  {
    id: 'don_quijote',
    title: 'ドン・キホーテ',
    enTitle: 'Don Quijote',
    icon: Store,
    category: 'daily_life',
    sortOrder: 4,
    previewPhraseJa: '免税はできますか？',
    previewPhraseEn: 'Can I get tax-free?',
  },
  {
    id: 'coin_laundry',
    title: 'コインランドリー',
    enTitle: 'Coin Laundry',
    icon: Shirt,
    category: 'daily_life',
    sortOrder: 5,
    previewPhraseJa: '使い方を教えてください。',
    previewPhraseEn: 'Please show me how to use it.',
  },
  {
    id: 'coffee_shop',
    title: 'コーヒー店',
    enTitle: 'Coffee Shop',
    icon: Coffee,
    category: 'daily_life',
    sortOrder: 6,
    previewPhraseJa: 'ホットコーヒーをください。',
    previewPhraseEn: 'A hot coffee, please.',
  },
  {
    id: 'gyudon_shop',
    title: '牛丼屋',
    enTitle: 'Gyudon Shop',
    icon: Beef,
    category: 'daily_life',
    sortOrder: 7,
    previewPhraseJa: '牛丼を一つください。',
    previewPhraseEn: 'One beef bowl, please.',
  },
  {
    id: 'rainy_day',
    title: '雨の日',
    enTitle: 'Rainy Day',
    icon: CloudRain,
    category: 'daily_life',
    sortOrder: 8,
    previewPhraseJa: '傘を貸してもらえますか？',
    previewPhraseEn: 'Can I borrow an umbrella?',
  },
  {
    id: 'depachika',
    title: 'デパ地下',
    enTitle: 'Depachika Food Hall',
    icon: ShoppingBag,
    category: 'daily_life',
    sortOrder: 9,
    previewPhraseJa: '試食はできますか？',
    previewPhraseEn: 'Can I try a sample?',
  },

  // Fun & Nightlife (9)
  {
    id: 'missed_last_train',
    title: '終電逃した時',
    enTitle: 'Missed the Last Train',
    icon: TrainFront,
    category: 'fun_nightlife',
    sortOrder: 1,
    previewPhraseJa: '終電を逃してしまいました。',
    previewPhraseEn: 'I missed the last train.',
  },
  {
    id: 'theme_park',
    title: 'テーマパーク',
    enTitle: 'Theme Park',
    icon: FerrisWheel,
    category: 'fun_nightlife',
    sortOrder: 2,
    previewPhraseJa: '整理券はどこでもらえますか？',
    previewPhraseEn: 'Where can I get a timed ticket?',
  },
  {
    id: 'festival',
    title: '祭り',
    enTitle: 'Festival',
    icon: PartyPopper,
    category: 'fun_nightlife',
    sortOrder: 3,
    previewPhraseJa: '浴衣を着てもいいですか？',
    previewPhraseEn: 'Can I wear a yukata?',
  },
  {
    id: 'karaoke',
    title: 'カラオケ',
    enTitle: 'Karaoke',
    icon: Mic2,
    category: 'fun_nightlife',
    sortOrder: 4,
    previewPhraseJa: '二時間お願いします。',
    previewPhraseEn: 'Two hours, please.',
  },
  {
    id: 'sauna',
    title: 'サウナ',
    enTitle: 'Sauna',
    icon: Flame,
    category: 'fun_nightlife',
    sortOrder: 5,
    previewPhraseJa: '整いました。',
    previewPhraseEn: 'I feel refreshed.',
  },
  {
    id: 'date',
    title: 'デート',
    enTitle: 'Date',
    icon: Heart,
    category: 'fun_nightlife',
    sortOrder: 6,
    previewPhraseJa: '素敵な場所ですね。',
    previewPhraseEn: 'What a lovely place.',
  },
  {
    id: 'late_night_bar',
    title: 'バー・夜',
    enTitle: 'Late-Night Bar',
    icon: GlassWater,
    category: 'fun_nightlife',
    sortOrder: 7,
    previewPhraseJa: '締めの一杯をお願いします。',
    previewPhraseEn: 'One last drink, please.',
  },
  {
    id: 'hangover',
    title: '二日酔い',
    enTitle: 'Hangover',
    icon: Wine,
    category: 'fun_nightlife',
    sortOrder: 8,
    previewPhraseJa: '頭がガンガンする。',
    previewPhraseEn: 'My head is pounding.',
  },
  {
    id: 'game_center',
    title: 'ゲームセンター',
    enTitle: 'Game Center',
    icon: Gamepad2,
    category: 'fun_nightlife',
    sortOrder: 9,
    previewPhraseJa: '取れそうなので、位置を直してもらえますか？',
    previewPhraseEn: 'It looks grabbable—can you reposition it?',
  },
];

/** Headline scene names for Pro marketing copy */
export const PREMIUM_SCENE_HIGHLIGHTS = [
  'Airport',
  'Shinkansen',
  'Theme park',
  'Last train',
  'Don Quijote',
  'Emergencies',
] as const;

export const PREMIUM_SITUATION_COUNT = allPremiumSituations.length;
export const PREMIUM_PHRASE_COUNT = PREMIUM_SITUATION_COUNT * 30;

export function getPremiumSituationsByCategory(categoryId: PremiumSituationCategoryId): PremiumSituationMeta[] {
  return allPremiumSituations
    .filter((s) => s.category === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
