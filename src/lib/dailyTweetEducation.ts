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
  /** Concrete mini-scenario learners can picture */
  scenarioStory: string;
  /** One-line “save this” takeaway */
  rememberThis: string;
  /** Common learner trap (textbook / translation mindset) */
  textbookTrap?: string;
  /** What actually works on the ground in Japan */
  nativeTip: string;
};

const WHEN_TO_USE: Partial<Record<SituationId, string>> = {
  ramen_shop:
    'At the ticket machine or counter — when you know your order (or you can point at the menu photo).',
  convenience_store:
    'At checkout: paying, asking for heat, a bag, chopsticks, or “no receipt.”',
  train_station:
    'Ticket gates, platforms, and the station office window when something goes wrong.',
  izakaya:
    'Calling staff over, ordering drinks/food, and asking for the bill at the end.',
  hotel:
    'Check-in, Wi‑Fi questions, checkout time, and small requests at the front desk.',
  airport_immigration:
    'Immigration and customs — short, calm answers beat long explanations.',
  taxi: 'Getting in, giving a destination, or asking for a receipt at the end.',
  onsen: 'Reception, locker questions, and asking about rules before you assume.',
  pharmacy: 'Describing symptoms or asking for OTC medicine at the counter.',
  lost_emergency:
    'Police box (koban), station staff, or hotel front desk when something is lost or urgent.',
  koban: 'Reporting lost items, theft, or asking for directions — officers help tourists often.',
  sushi_shop: 'Counter seating — keep orders short and polite; staff move fast.',
  hospital: 'Reception and describing what hurts or when it started.',
  coffee_shop: 'Ordering at the counter, asking about sizes, milk, or take-out.',
  gyudon_shop: 'Ticket machine or counter — customize size and toppings quickly.',
  date: 'Reservations, ordering together, and small polite lines that sound natural.',
  coin_locker: 'Finding a locker, paying, and asking how long you can store bags.',
  vending_machine: 'When the machine eats your money or the drink gets stuck.',
  kaiten_sushi: 'Ordering from the belt, asking for something not on the belt, paying.',
  post_office: 'Sending a package home, buying stamps, or asking about delivery time.',
  shinkansen: 'Reserved seats, platform numbers, and asking where to line up.',
  theme_park: 'Queues, ride questions, and asking staff for help with tickets.',
  allergies_dietary:
    'Restaurants and convenience stores — say it clearly before you order.',
  missed_last_train: 'Capsule hotels, manga cafes, or asking station staff for options.',
  rainy_day: 'Buying umbrellas, asking if a place is open, or changing plans.',
};

const CULTURE_NOTES: Partial<Record<SituationId, string>> = {
  ramen_shop:
    'Many ramen shops are fast-paced. Short phrase + pointing at the menu is totally normal.',
  convenience_store:
    'Cashiers speak quickly — one clear sentence beats a perfect paragraph.',
  izakaya: 'Say「すみません」first to get attention — it is the unspoken rule.',
  onsen: 'When in doubt, ask at reception. Guessing wrong is more awkward than asking.',
  airport_immigration: 'Officers hear the same questions daily. Calm + short = smooth.',
  koban: 'Koban officers help tourists all the time. You do not need perfect grammar.',
  train_station: 'Station staff are used to confused travelers — show your ticket/phone map.',
  sushi_shop: 'Counter sushi is interactive. Short requests keep the flow comfortable.',
  coin_locker: 'Lockers fill up near big stations — ask「空いてますか」before you hunt around.',
  vending_machine: 'Staff at nearby shops often help when a machine fails — ask politely.',
};

const SCENARIO_STORIES: Partial<Record<SituationId, string>> = {
  ramen_shop:
    'You walk into a ramen shop. Ticket machine. Menu photos. A line behind you.',
  convenience_store:
    'You grab onigiri and a drink. The cashier is ready — you have about 3 seconds to speak.',
  train_station:
    'Your IC card did not tap. The gate beeps. People are waiting behind you.',
  izakaya:
    'The place is loud. You need to call staff over without waving like a tourist.',
  hotel:
    'Late check-in. You are tired. You need Wi‑Fi and maybe a late checkout.',
  lost_emergency:
    'Your wallet is gone. You are stressed. You need help now, not perfect Japanese.',
  airport_immigration:
    '“Purpose of visit?” You want to answer clearly without freezing up.',
  taxi:
    'You get in. The driver asks where to go. GPS is loading…',
  onsen:
    'First time. You are not sure about towels, tattoos, or where to go.',
  pharmacy:
    'Your throat hurts. You need medicine but the labels are all Japanese.',
  coffee_shop:
    'You want oat milk, size M, to go — in one smooth order.',
  kaiten_sushi:
    'Nothing on the belt looks right. You want to order something specific.',
  coin_locker:
    'You have 2 hours before check-in. You need a locker, fast.',
  allergies_dietary:
    'You need to explain “no shellfish” before they start cooking.',
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

function buildScenarioStory(card: WordCard, sceneEn: string): string {
  const preset = SCENARIO_STORIES[card.situation];
  if (preset) return preset;

  return `You are in a ${sceneEn.toLowerCase()} situation during your Japan trip — and you need the right line, fast.`;
}

function buildRememberThis(card: WordCard, sceneEn: string): string {
  const jp = card.japanese;

  if (jp.includes('お願いします')) {
    return 'In shops, お願いします is your polite “please” — soft, natural, never awkward.';
  }
  if (jp.includes('ください')) {
    return 'ください = “please give me…” — direct and totally normal when you know what you want.';
  }
  if (jp.includes('すみません')) {
    return 'すみません gets attention politely — use it before you ask for help.';
  }
  if (jp.includes('ですか') || jp.includes('ますか')) {
    return 'Add ですか / ますか to turn a phrase into a question — staff will help you.';
  }
  if (jp.includes('ありません') || jp.includes('ない')) {
    return 'Negative forms like this help you explain limits (allergies, no cash, etc.).';
  }
  if (jp.length <= 8) {
    return `Short words like「${jp}」work in context — Japan runs on practical fragments, not essays.`;
  }

  return `Save「${jp}」for ${sceneEn.toLowerCase()} — you will use lines like this more than textbook drills.`;
}

function buildTextbookTrap(card: WordCard): string | undefined {
  const jp = card.japanese;

  if (jp.includes('お願いします')) {
    return 'Trap: building a long English-style sentence. Fix: item + お願いします (or point + これ、お願いします).';
  }
  if (jp.includes('ください')) {
    return 'Trap: “Can I possibly have…” in perfect grammar. Fix: noun + をください — done.';
  }
  if (jp.includes('ですか')) {
    return 'Trap: explaining everything in English first. Fix: one Japanese question — staff meet you halfway.';
  }
  if (card.english.toLowerCase().includes('where')) {
    return 'Trap: “Where is…” in full textbook form. Fix: show a map/photo + short Japanese question.';
  }
  if (card.situation === 'airport_immigration') {
    return 'Trap: over-explaining your life story. Fix: one short answer that matches the question.';
  }
  if (card.situation === 'lost_emergency') {
    return 'Trap: panicking in English only. Fix: key word + すみません + show your passport/phone.';
  }

  return undefined;
}

function buildNativeTip(card: WordCard, sceneEn: string): string {
  const culture = CULTURE_NOTES[card.situation];
  if (culture) return culture;

  const jp = card.japanese;
  if (jp.includes('お願いします') || jp.includes('ください')) {
    return `In ${sceneEn.toLowerCase()}, staff hear short requests all day — yours will sound natural.`;
  }
  if (jp.includes('すみません')) {
    return 'すみません first, then your request. That rhythm is what natives expect.';
  }

  return `Locals keep it short in ${sceneEn.toLowerCase()}. Match that energy and you are golden.`;
}

function buildWhyBullets(card: WordCard): string[] {
  const bullets: string[] = [];
  const jp = card.japanese;

  if (jp.includes('お願いします')) {
    bullets.push('お願いします = polite default in shops (soft, not stiff).');
  }
  if (jp.includes('ください')) {
    bullets.push('ください = direct request when you know what you need.');
  }
  if (jp.includes('ですか') || jp.includes('ますか')) {
    bullets.push('ですか / ますか makes it a question — perfect for staff.');
  }
  if (jp.includes('を')) {
    bullets.push('を marks the object (what you want / what you are talking about).');
  }
  if (jp.includes('に')) {
    bullets.push('に often marks destination or time — watch for it in travel phrases.');
  }
  if (jp.endsWith('です。') && !jp.includes('ですか')) {
    bullets.push('です ending = safe polite statement (hotel, immigration, forms).');
  }
  if (jp.includes('ない') || jp.includes('ありません')) {
    bullets.push('Negative form helps with allergies, sold-out items, or “I do not have…”.');
  }

  bullets.push(`Real meaning: ${card.english}`);

  if (card.reading !== card.japanese) {
    bullets.push(`Reading: ${card.reading}`);
  }

  return bullets.slice(0, 5);
}

function buildMistakeNote(card: WordCard): string | undefined {
  const jp = card.japanese;
  const trap = buildTextbookTrap(card);
  if (trap) return trap;

  if (jp.includes('お願いします')) {
    return 'Learners overthink ordering. Locals use a short line + pointing. Same result, less stress.';
  }
  if (jp.includes('ですか') || jp.includes('ますか')) {
    return 'You do not need perfect grammar — one clear question is enough to get help in Japan.';
  }
  if (jp.length <= 12 && !jp.includes('？')) {
    return 'Single-word panic? In context, a short noun/verb like this is how real interactions start.';
  }

  const alt = findAlternatePhrase(card);
  if (alt && alt.english !== card.english) {
    return `Pair it with:「${alt.japanese}」(${alt.english}) — same scene, another line locals use.`;
  }

  return undefined;
}

export function buildEducationContext(card: WordCard): EducationContext {
  const sceneEn = getSituationLabel(card.situation).en;
  const alt = findAlternatePhrase(card);

  return {
    sceneEn,
    whenToUse:
      WHEN_TO_USE[card.situation] ??
      `In everyday ${sceneEn.toLowerCase()} moments during your Japan trip.`,
    whyBullets: buildWhyBullets(card),
    mistakeNote: buildMistakeNote(card),
    cultureNote: CULTURE_NOTES[card.situation],
    relatedPhrase: alt ? `「${alt.japanese}」(${alt.english})` : undefined,
    scenarioStory: buildScenarioStory(card, sceneEn),
    rememberThis: buildRememberThis(card, sceneEn),
    textbookTrap: buildTextbookTrap(card),
    nativeTip: buildNativeTip(card, sceneEn),
  };
}
