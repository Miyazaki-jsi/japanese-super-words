import type { SituationId } from '@/data/words';
import type { TweetTemplateId } from '@/lib/dailyTweetTemplates';
import { TWEET_TEMPLATES } from '@/lib/dailyTweetTemplates';
import {
  getSituationPerformance,
  getTemplatePerformance,
  type SituationPerformance,
  type TemplatePerformance,
} from '@/lib/xTweetStore';

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Score by engagement (likes + engagement rate). */
export function scorePerformance(stat: {
  avgLikes?: number;
  avgImpressions?: number;
  posts?: number;
}): number {
  const likes = stat.avgLikes ?? 0;
  const impressions = stat.avgImpressions ?? 0;
  const posts = stat.posts ?? 0;

  const engagementRate = impressions > 0 ? (likes / impressions) * 100 : 0;
  const base = likes * 2 + engagementRate * 5;

  return base + Math.min(posts, 10) * 0.1;
}

function weightedPick<T extends string>(
  seed: string,
  items: { id: T; score: number }[],
  exploreRate = 0.2,
): T {
  if (items.length === 0) throw new Error('weightedPick: empty items');

  const exploreBucket = hashString(`${seed}:explore`) % 100;
  if (exploreBucket < exploreRate * 100) {
    const lowData = items.filter((i) => i.score <= 1);
    if (lowData.length > 0) {
      return lowData[hashString(`${seed}:underused`) % lowData.length].id;
    }
  }

  const weights = items.map((i) => Math.max(i.score, 0.5));
  const total = weights.reduce((a, b) => a + b, 0);
  let pick = hashString(`${seed}:weighted`) % total;

  for (let i = 0; i < items.length; i++) {
    pick -= weights[i];
    if (pick < 0) return items[i].id;
  }

  return items[items.length - 1].id;
}

export function pickTemplateIdFromStats(
  seed: string,
  stats: TemplatePerformance[],
): TweetTemplateId {
  const ids = TWEET_TEMPLATES.map((t) => t.id);
  const withData = stats.filter((s) => s.posts > 0);

  if (withData.length === 0) {
    return ids[hashString(`${seed}:template`) % ids.length];
  }

  const scored = withData
    .map((s) => ({
      id: s.templateId as TweetTemplateId,
      score: scorePerformance(s),
    }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 4);
  return weightedPick(`${seed}:template`, top, 0.2);
}

export function pickSituationFromStats(
  seed: string,
  eligibleSituations: SituationId[],
  stats: SituationPerformance[],
): SituationId {
  if (eligibleSituations.length === 0) {
    throw new Error('pickSituationFromStats: no eligible situations');
  }

  const withData = stats.filter(
    (s) => s.posts > 0 && eligibleSituations.includes(s.situation as SituationId),
  );

  if (withData.length === 0) {
    return eligibleSituations[hashString(`${seed}:situation`) % eligibleSituations.length];
  }

  const scored = withData
    .map((s) => ({
      id: s.situation as SituationId,
      score: scorePerformance(s),
    }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 6);
  const missing = eligibleSituations.filter((id) => !top.find((t) => t.id === id));
  const pool = [
    ...top,
    ...missing.map((id) => ({ id, score: 0.5 })),
  ];

  return weightedPick(`${seed}:situation`, pool, 0.2);
}

export async function pickTemplateIdForDay(seed: string): Promise<TweetTemplateId> {
  const stats = await getTemplatePerformance();
  return pickTemplateIdFromStats(seed, stats);
}

export async function pickSituationForDay(
  seed: string,
  eligibleSituations: SituationId[],
): Promise<SituationId> {
  const stats = await getSituationPerformance();
  return pickSituationFromStats(seed, eligibleSituations, stats);
}

/** @deprecated use scorePerformance */
export const scoreTemplate = scorePerformance;
