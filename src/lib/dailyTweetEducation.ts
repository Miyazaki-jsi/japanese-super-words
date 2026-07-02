import type { WordCard, SituationId } from '@/data/words';
import { getSituationLabel } from '@/data/situationLabels';
import { sampleWords } from '@/data/words';

export type EducationContext = {
  sceneEn: string;
  whenToUse: string;
  whyBullets: string[];
  mistakeNote?: string;
  cultureNote?: string;
  relatedPhrase?: string;
};

const WHEN_TO_USE: Partial<Record<SituationId, string>> = {
  ramen_shop: 'At the counter when you know what you want (or you can point at the menu).',
  convenience_store: 'At checkout, asking prices, or requesting heat / a bag.',
  train_station: 'Ticket machines, platforms, and station staff windows.',
  izakaya: 'Ordering drinks and food, calling staff, paying at the end.',
  hotel: 'Check-in, asking about Wi‑Fi, checkout, and small requests.',
  airport_immigration: 'Immigration and customs — short, clear answers work best.',
  taxi: 'Getting in, giving a destination, or asking for a receipt.',
  onsen: 'Reception, locker questions, and asking about rules.',
  pharmacy: 'Describing symptoms or asking for OTC medicine.',
  lost_emergency: 'Police box (koban), station staff, or hotel front desk.',
  koban: 'Reporting lost items, theft, or asking for directions.',
  sushi_shop: 'Counter seating — keep it short and polite.',
  hospital: 'Reception and describing what hurts.',
};

const CULTURE_NOTES: Partial<Record<SituationId, string>> = {
  ramen_shop: 'Many ramen shops are fast-paced. Short phrases + pointing is normal.',
  convenience_store: 'Cashiers often speak quickly — one clear sentence is enough.',
  izakaya: 'Calling “すみません” first is the unspoken rule before ordering.',
  onsen: 'Asking before you assume is always better than guessing.',
  airport_immigration: 'Calm, short answers beat long explanations.',
  koban: 'Koban officers help tourists often — simple Japanese is totally fine.',
};

function findAlternatePhrase(card: WordCard): WordCard | undefined {
  const siblings = sampleWords.filter(
    (w) => w.situation === card.situation && w.id !== card.id,
  );
  if (siblings.length === 0) return undefined;
  return siblings[Math.abs(hash(card.id)) % siblings.length];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function buildWhyBullets(card: WordCard): string[] {
  const bullets: string[] = [];
  const jp = card.japanese;

  if (jp.includes('お願いします')) {
    bullets.push('お願いします is the “polite default” in shops — soft, natural, not stiff.');
  }
  if (jp.includes('ください')) {
    bullets.push('ください is a direct request — great when you know exactly what you need.');
  }
  if (jp.includes('ですか') || jp.includes('ますか')) {
    bullets.push('ですか / ますか turns it into a question — perfect for staff interactions.');
  }
  if (jp.includes('を')) {
    bullets.push('を marks the object (what you want / what you’re talking about).');
  }
  if (jp.endsWith('です。') && !jp.includes('ですか')) {
    bullets.push('Ending with です is a safe, polite statement (useful at immigration/hotel).');
  }
  if (card.english.length < 40) {
    bullets.push(`Meaning: ${card.english}`);
  }
  if (bullets.length === 0) {
    bullets.push('Short, practical, and common in real conversations — not textbook filler.');
  }

  return bullets.slice(0, 4);
}

function buildMistakeNote(card: WordCard): string | undefined {
  const jp = card.japanese;

  if (jp.includes('お願いします')) {
    return 'Many learners overthink ordering and try long sentences. Locals often use a short line like this + pointing.';
  }
  if (jp.includes('ですか') || jp.includes('ますか')) {
    return 'You don’t need perfect grammar — one clear question is enough to get help in Japan.';
  }
  if (jp.length <= 12 && !jp.includes('？')) {
    return 'Single-word panic? In context, a short noun/verb like this is how real interactions start.';
  }

  const alt = findAlternatePhrase(card);
  if (alt && alt.english !== card.english) {
    return `Related phrase learners also save: 「${alt.japanese}」 (${alt.english})`;
  }

  return undefined;
}

export function buildEducationContext(card: WordCard): EducationContext {
  const sceneEn = getSituationLabel(card.situation).en;

  return {
    sceneEn,
    whenToUse:
      WHEN_TO_USE[card.situation] ??
      `In everyday ${sceneEn.toLowerCase()} situations during your Japan trip.`,
    whyBullets: buildWhyBullets(card),
    mistakeNote: buildMistakeNote(card),
    cultureNote: CULTURE_NOTES[card.situation],
  };
}
