import { tripPackDays } from '@/data/tripPack';
import { sampleWords, type WordCard } from '@/data/words';

export function getVoicevoxWordCard(cardId: string): WordCard | null {
  return sampleWords.find((card) => card.id === cardId) ?? null;
}

export function collectTripPackStaffReadings(): string[] {
  const readings = new Set<string>();
  for (const day of tripPackDays) {
    for (const roleplay of day.roleplays) {
      for (const turn of roleplay.turns) {
        const text = turn.staffReading?.trim();
        if (text) readings.add(text);
      }
    }
  }
  return [...readings].sort();
}

export const voicevoxWordCards = sampleWords;
