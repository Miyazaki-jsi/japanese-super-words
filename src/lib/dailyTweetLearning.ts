import type { TweetTemplateId } from '@/lib/dailyTweetTemplates';
import { TWEET_TEMPLATES } from '@/lib/dailyTweetTemplates';
import { getTemplatePerformance, type TemplatePerformance } from '@/lib/xTweetStore';

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Score templates by engagement (likes weighted, with impression rate if available). */
export function scoreTemplate(stat: TemplatePerformance): number {
  const likes = stat.avgLikes ?? 0;
  const impressions = stat.avgImpressions ?? 0;
  const posts = stat.posts ?? 0;

  const engagementRate = impressions > 0 ? (likes / impressions) * 100 : 0;
  const base = likes * 2 + engagementRate * 5;

  // Slight boost for more data (confidence)
  return base + Math.min(posts, 10) * 0.1;
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

  // 20% explore: try underused templates
  const exploreBucket = hashString(`${seed}:explore`) % 100;
  if (exploreBucket < 20) {
    const underused = ids.filter(
      (id) => !withData.find((s) => s.templateId === id && s.posts >= 3),
    );
    if (underused.length > 0) {
      return underused[hashString(`${seed}:underused`) % underused.length];
    }
  }

  const scored = withData
    .map((s) => ({ id: s.templateId as TweetTemplateId, score: scoreTemplate(s) }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3);
  const weights = top.map((t) => Math.max(t.score, 0.5));
  const total = weights.reduce((a, b) => a + b, 0);
  let pick = hashString(`${seed}:weighted`) % total;

  for (let i = 0; i < top.length; i++) {
    pick -= weights[i];
    if (pick < 0) return top[i].id;
  }

  return top[0]?.id ?? ids[0];
}

export async function pickTemplateIdForDay(seed: string): Promise<TweetTemplateId> {
  const stats = await getTemplatePerformance();
  return pickTemplateIdFromStats(seed, stats);
}
