export type WowPrompt = {
  id: string;
  hook: string;
  prompt: string;
  cta: string;
};

/** Rotate weekly on Wednesdays. Add new entries anytime. */
export const WOW_PROMPTS: WowPrompt[] = [
  {
    id: 'wow_konbini_roast',
    hook: 'ChatGPT as a konbini clerk who ROASTS your Japanese politeness.',
    prompt: `You are a tired Japanese convenience store clerk in Tokyo.
I am a foreign customer. Reply ONLY in simple Japanese (N5–N4).
After each of my lines, add one English line in brackets that scores my politeness from 1–10 and tells me the more natural phrase.
Start by asking if I want the food heated. Stay in character.`,
    cta: 'Would you survive a real konbini with this?',
  },
  {
    id: 'wow_last_train',
    hook: 'Missed the last train in Japanese — AI traps you until you ask for help correctly.',
    prompt: `Simulate a rainy night in Shibuya. I just missed the last train.
Speak only as locals I meet (staff, taxi driver, police box officer), in natural spoken Japanese.
Never switch to English unless I type "HINT".
My goal: get home. Give short choices only when I'm stuck.
If I use rude or textbook Japanese, make the local slightly confused or cold.
Start now: I'm outside the station, soaked.`,
    cta: 'How many turns until you’d tap HINT?',
  },
  {
    id: 'wow_diary_triple',
    hook: 'Paste your English diary — get the Japanese a REAL person would think, not textbook.',
    prompt: `I will paste a short English diary about my day.
Rewrite it THREE ways in Japanese:
1) What a Japanese friend would actually say in LINE (casual)
2) What I'd write in a work chat (polite)
3) The "too textbook" version learners usually say (and mark ❌ why it sounds weird)
Keep each under 4 sentences. Then give me 5 words to steal for tomorrow.`,
    cta: 'Which version do you sound like right now — 1, 2, or ❌?',
  },
  {
    id: 'wow_onsen_guard',
    hook: 'Break an onsen rule and the AI bathhouse staff gets mad — in Japanese only.',
    prompt: `You are strict onsen staff in Japan. Speak only natural Japanese (with short English gloss in brackets after each line).
I am a foreign guest about to enter. Quiz me on rules (tattoos, washing, towel in water, hair).
If I break a rule, react firmly but kindly and make me fix it before I can continue.
Start at the entrance.`,
    cta: 'Which onsen rule would you fail first?',
  },
  {
    id: 'wow_omakase_live',
    hook: 'Say「おまかせ」at a sushi counter — AI narrates what happens in Japanese only.',
    prompt: `You are a sushi chef. I only said「おまかせ」.
Describe each piece you serve in simple spoken Japanese first, then one short English line.
Ask me how it tastes after every 2 pieces. Stay in character. Start serving now.`,
    cta: 'Would you really say おまかせ?',
  },
  {
    id: 'wow_kid_japanese',
    hook: 'AI may ONLY use kid-level Japanese — hard words get rewritten until a child gets it.',
    prompt: `Explain Japanese travel tips to me, but you may ONLY use Japanese a 7-year-old would understand.
If I use difficult words, rewrite my sentence in kid Japanese and continue.
No romaji unless I ask. Start with: how to buy a train ticket.`,
    cta: 'Can you keep a whole chat in kid Japanese?',
  },
];

export function japanWeekdayFromDateString(isoDate: string): number {
  const date = new Date(`${isoDate}T12:00:00+09:00`);
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 0;
}

/** Wednesday in Japan */
export function isWowPromptDay(isoDate: string): boolean {
  return japanWeekdayFromDateString(isoDate) === 3;
}

/** ISO-like week index for stable rotation */
export function weekIndexFromDateString(isoDate: string): number {
  const date = new Date(`${isoDate}T12:00:00+09:00`);
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNum = new Date(utc).getUTCDay() || 7;
  const thursday = new Date(utc);
  thursday.setUTCDate(new Date(utc).getUTCDate() + 4 - dayNum);
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  return Math.ceil(((thursday.getTime() - yearStart) / 86400000 + 1) / 7);
}

export function pickWowPromptForDate(isoDate: string): WowPrompt {
  const index = weekIndexFromDateString(isoDate) % WOW_PROMPTS.length;
  return WOW_PROMPTS[index] ?? WOW_PROMPTS[0];
}

export function renderWowPromptThread(prompt: WowPrompt): { parent: string; reply: string } {
  const parent = `${prompt.hook}

↓ Copy the full prompt from the reply

${prompt.cta}

#日本語学習 #Japanese`;

  const reply = `Copy into ChatGPT / Claude:

${prompt.prompt}`;

  return { parent, reply };
}
