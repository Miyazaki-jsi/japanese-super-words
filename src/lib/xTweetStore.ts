import { getSupabaseAdmin, isAnalyticsDbConfigured } from '@/lib/supabaseServer';
import type { TweetTemplateId } from '@/lib/dailyTweetTemplates';

export type TweetPostRecord = {
  tweetId: string;
  cardId: string;
  templateId: TweetTemplateId;
  situation: string;
  charCount: number;
  tweetText: string;
};

export type TemplatePerformance = {
  templateId: string;
  posts: number;
  avgLikes: number;
  avgImpressions: number;
};

export type SituationPerformance = {
  situation: string;
  posts: number;
  avgLikes: number;
  avgImpressions: number;
};

export async function saveTweetPost(record: TweetPostRecord): Promise<boolean> {
  if (!isAnalyticsDbConfigured()) return false;

  const db = getSupabaseAdmin();
  if (!db) return false;

  const { error } = await db.from('x_daily_tweets').upsert(
    {
      tweet_id: record.tweetId,
      card_id: record.cardId,
      template_id: record.templateId,
      situation: record.situation,
      char_count: record.charCount,
      tweet_text: record.tweetText,
      posted_at: new Date().toISOString(),
    },
    { onConflict: 'tweet_id' },
  );

  if (error) {
    console.error('[x-tweet] save failed', error.message);
    return false;
  }

  return true;
}

export async function listTweetsNeedingMetrics(
  limit = 20,
): Promise<{ tweetId: string }[]> {
  if (!isAnalyticsDbConfigured()) return [];

  const db = getSupabaseAdmin();
  if (!db) return [];

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 14);

  const { data, error } = await db
    .from('x_daily_tweets')
    .select('tweet_id, metrics_synced_at, posted_at')
    .gte('posted_at', since.toISOString())
    .order('posted_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const staleMs = 6 * 60 * 60 * 1000;
  const now = Date.now();

  return data
    .filter((row) => {
      if (!row.metrics_synced_at) return true;
      return now - new Date(row.metrics_synced_at).getTime() > staleMs;
    })
    .map((row) => ({ tweetId: row.tweet_id as string }));
}

export async function updateTweetMetrics(
  tweetId: string,
  metrics: { likes: number; retweets: number; replies: number; impressions: number },
): Promise<void> {
  if (!isAnalyticsDbConfigured()) return;

  const db = getSupabaseAdmin();
  if (!db) return;

  const { error } = await db
    .from('x_daily_tweets')
    .update({
      likes: metrics.likes,
      retweets: metrics.retweets,
      replies: metrics.replies,
      impressions: metrics.impressions,
      metrics_synced_at: new Date().toISOString(),
    })
    .eq('tweet_id', tweetId);

  if (error) {
    console.error('[x-tweet] metrics update failed', tweetId, error.message);
  }
}

export async function getTemplatePerformance(): Promise<TemplatePerformance[]> {
  if (!isAnalyticsDbConfigured()) return [];

  const db = getSupabaseAdmin();
  if (!db) return [];

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 90);

  const { data, error } = await db
    .from('x_daily_tweets')
    .select('template_id, likes, impressions')
    .gte('posted_at', since.toISOString());

  if (error || !data) return [];

  const byTemplate = new Map<string, { likes: number[]; impressions: number[] }>();

  for (const row of data) {
    const id = row.template_id as string;
    if (!byTemplate.has(id)) byTemplate.set(id, { likes: [], impressions: [] });
    const bucket = byTemplate.get(id)!;
    bucket.likes.push(row.likes ?? 0);
    bucket.impressions.push(row.impressions ?? 0);
  }

  return [...byTemplate.entries()].map(([templateId, bucket]) => ({
    templateId,
    posts: bucket.likes.length,
    avgLikes: avg(bucket.likes),
    avgImpressions: avg(bucket.impressions),
  }));
}

export async function getSituationPerformance(): Promise<SituationPerformance[]> {
  if (!isAnalyticsDbConfigured()) return [];

  const db = getSupabaseAdmin();
  if (!db) return [];

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 90);

  const { data, error } = await db
    .from('x_daily_tweets')
    .select('situation, likes, impressions')
    .gte('posted_at', since.toISOString());

  if (error || !data) return [];

  const bySituation = new Map<string, { likes: number[]; impressions: number[] }>();

  for (const row of data) {
    const id = row.situation as string;
    if (!bySituation.has(id)) bySituation.set(id, { likes: [], impressions: [] });
    const bucket = bySituation.get(id)!;
    bucket.likes.push(row.likes ?? 0);
    bucket.impressions.push(row.impressions ?? 0);
  }

  return [...bySituation.entries()].map(([situation, bucket]) => ({
    situation,
    posts: bucket.likes.length,
    avgLikes: avg(bucket.likes),
    avgImpressions: avg(bucket.impressions),
  }));
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
