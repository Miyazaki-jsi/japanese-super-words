import type { SocialTemplateId } from './types';

export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://japanese-super-words.vercel.app';

export const X_PROFILE_URL = 'https://x.com/miyazaki_jsi';

export const TWEET_MAX_LENGTH = 280;

export const DEFAULT_TEMPLATE_SCORE = 1;

export const TEMPLATE_DEFINITIONS: {
  id: SocialTemplateId;
  name: string;
  description: string;
}[] = [
  {
    id: 'save_card',
    name: 'Save card',
    description: 'Bookmark-style phrase card learners want to save',
  },
  {
    id: 'phrase_note',
    name: 'Phrase note',
    description: 'Japanese + reading + English with a when-to-use hint',
  },
  {
    id: 'quick_tip',
    name: 'Quick tip',
    description: 'Short actionable tip for travelers',
  },
  {
    id: 'situation_bite',
    name: 'Situation bite',
    description: 'Scene-first mini lesson tied to a real Japan moment',
  },
];

export const SCENE_TIPS: Partial<Record<string, string>> = {
  ramen_shop: 'Use at a ramen shop when ordering or asking for water.',
  convenience_store: 'Perfect at konbini checkout or when heating food.',
  greetings: 'Your daily opener — shops, hotels, anywhere polite.',
  hospital: 'Explain symptoms or ask for medicine at a clinic.',
  train_station: 'Ask staff about platforms, tickets, or transfers.',
  izakaya: 'Order drinks and food at a casual izakaya.',
  sushi_shop: 'Ordering and asking for recommendations at sushi.',
  koban: 'Report lost items or ask for directions.',
  hotel: 'Check-in, Wi-Fi, luggage, and room requests.',
  coin_locker: 'Store bags before hotel check-in.',
  vending_machine: 'Buying drinks from a Japanese vending machine.',
  trash_carry_out: 'Japan has few trash cans — know this phrase.',
  kaiten_sushi: 'Returning plates and ordering at conveyor sushi.',
  onsen: 'Ask about tattoos, bathing rules, or day-use entry.',
  lost_emergency: 'When something is lost or you need help fast.',
  shinkansen: 'Buying tickets and finding your platform.',
  airport_immigration: 'Immigration and arrival questions.',
};

export const SCENE_EMOJI: Partial<Record<string, string>> = {
  ramen_shop: '🍜',
  convenience_store: '🏪',
  greetings: '👋',
  hospital: '🏥',
  train_station: '🚉',
  izakaya: '🍶',
  sushi_shop: '🍣',
  koban: '👮',
  hotel: '🏨',
  coin_locker: '🧳',
  vending_machine: '🥤',
  trash_carry_out: '♻️',
  kaiten_sushi: '🍣',
  onsen: '♨️',
  lost_emergency: '🆘',
  shinkansen: '🚄',
  airport_immigration: '✈️',
  taxi: '🚕',
  pharmacy: '💊',
};
