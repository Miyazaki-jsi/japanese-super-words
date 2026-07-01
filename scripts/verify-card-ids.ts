/**
 * Fail if sampleWords contains duplicate card IDs (breaks VOICEVOX API lookup).
 * Usage: npx tsx scripts/verify-card-ids.ts
 */
import { sampleWords } from '../src/data/words';

const byId = new Map<string, string[]>();

for (const card of sampleWords) {
  const situations = byId.get(card.id) ?? [];
  situations.push(card.situation);
  byId.set(card.id, situations);
}

const duplicates = [...byId.entries()].filter(([, situations]) => situations.length > 1);

if (duplicates.length > 0) {
  console.error('Duplicate card IDs found:');
  for (const [id, situations] of duplicates) {
    console.error(`  ${id}: ${situations.join(', ')}`);
  }
  process.exit(1);
}

console.log(`OK — ${sampleWords.length} cards, all IDs unique.`);
