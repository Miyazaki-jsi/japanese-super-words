import { getSupabaseAdmin, isAnalyticsDbConfigured } from '@/lib/supabaseServer';
import { TEMPLATE_DEFINITIONS } from './constants';
import { blendTemplateScore, computeEngagementScore, getDefaultTemplateScores } from './socialLearning';
import type {
  GeneratedTweet,
  SocialPost,
  SocialPostMetrics,
  SocialPostStatus,
  SocialTemplate,
  SocialTemplateId,
} from './types';

function mapTemplate(row: Record<string, unknown>): SocialTemplate {
  return {
    id: row.id as SocialTemplateId,
    name: String(row.name),
    description: String(row.description),
    score: Number(row.score),
    useCount: Number(row.use_count),
    lastUsedAt: row.last_used_at ? String(row.last_used_at) : null,
  };
}

function mapPost(row: Record<string, unknown>): SocialPost {
  return {
    id: Number(row.id),
    status: row.status as SocialPostStatus,
    templateId: row.template_id as SocialTemplateId,
    wordId: String(row.word_id),
    situation: String(row.situation),
    tweetText: String(row.tweet_text),
    linkUrl: String(row.link_url),
    xTweetId: row.x_tweet_id ? String(row.x_tweet_id) : null,
    postedAt: row.posted_at ? String(row.posted_at) : null,
    scheduledFor: String(row.scheduled_for),
    errorMessage: row.error_message ? String(row.error_message) : null,
    createdAt: String(row.created_at),
  };
}

function mapMetrics(row: Record<string, unknown>): SocialPostMetrics {
  return {
    id: Number(row.id),
    socialPostId: Number(row.social_post_id),
    fetchedAt: String(row.fetched_at),
    impressions: Number(row.impressions ?? 0),
    likes: Number(row.likes ?? 0),
    reposts: Number(row.reposts ?? 0),
    replies: Number(row.replies ?? 0),
    bookmarks: Number(row.bookmarks ?? 0),
    urlClicks: Number(row.url_clicks ?? 0),
  };
}

export function isSocialDbConfigured(): boolean {
  return isAnalyticsDbConfigured();
}

export async function ensureSocialTemplatesSeeded(): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;

  const defaults = getDefaultTemplateScores();
  const rows = TEMPLATE_DEFINITIONS.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    score: defaults[template.id],
  }));

  await db.from('social_templates').upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
}

export async function getSocialTemplates(): Promise<SocialTemplate[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  await ensureSocialTemplatesSeeded();
  const { data, error } = await db.from('social_templates').select('*').order('score', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapTemplate(row as Record<string, unknown>));
}

export async function getRecentWordIds(limitDays = 45): Promise<string[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const since = new Date();
  since.setDate(since.getDate() - limitDays);

  const { data, error } = await db
    .from('social_posts')
    .select('word_id')
    .gte('created_at', since.toISOString());

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => String((row as { word_id: string }).word_id));
}

export async function getPostForDate(scheduledFor: string): Promise<SocialPost | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db
    .from('social_posts')
    .select('*')
    .eq('scheduled_for', scheduledFor)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPost(data as Record<string, unknown>) : null;
}

export async function createSocialPost(input: {
  generated: GeneratedTweet;
  scheduledFor: string;
  status: SocialPostStatus;
  xTweetId?: string | null;
  postedAt?: string | null;
  errorMessage?: string | null;
}): Promise<SocialPost> {
  const db = getSupabaseAdmin();
  if (!db) throw new Error('Supabase is not configured');

  const { data, error } = await db
    .from('social_posts')
    .insert({
      status: input.status,
      template_id: input.generated.templateId,
      word_id: input.generated.wordId,
      situation: input.generated.situation,
      tweet_text: input.generated.tweetText,
      link_url: input.generated.linkUrl,
      x_tweet_id: input.xTweetId ?? null,
      posted_at: input.postedAt ?? null,
      scheduled_for: input.scheduledFor,
      error_message: input.errorMessage ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  const { data: template } = await db
    .from('social_templates')
    .select('use_count')
    .eq('id', input.generated.templateId)
    .maybeSingle();
  const current = Number((template as { use_count?: number } | null)?.use_count ?? 0);
  await db
    .from('social_templates')
    .update({ use_count: current + 1, last_used_at: new Date().toISOString() })
    .eq('id', input.generated.templateId);

  return mapPost(data as Record<string, unknown>);
}

export async function deleteSocialPost(postId: number): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) throw new Error('Supabase is not configured');

  const { error } = await db.from('social_posts').delete().eq('id', postId);
  if (error) throw new Error(error.message);
}

export async function updateSocialPostStatus(
  postId: number,
  patch: Partial<{
    status: SocialPostStatus;
    xTweetId: string | null;
    postedAt: string | null;
    errorMessage: string | null;
  }>
): Promise<SocialPost> {
  const db = getSupabaseAdmin();
  if (!db) throw new Error('Supabase is not configured');

  const { data, error } = await db
    .from('social_posts')
    .update({
      status: patch.status,
      x_tweet_id: patch.xTweetId,
      posted_at: patch.postedAt,
      error_message: patch.errorMessage,
    })
    .eq('id', postId)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapPost(data as Record<string, unknown>);
}

export async function getSocialPostById(postId: number): Promise<SocialPost | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db.from('social_posts').select('*').eq('id', postId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapPost(data as Record<string, unknown>) : null;
}

export async function listRecentSocialPosts(limit = 14): Promise<SocialPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const { data, error } = await db
    .from('social_posts')
    .select('*')
    .order('scheduled_for', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapPost(row as Record<string, unknown>));
}

export async function getLatestMetricsForPost(postId: number): Promise<SocialPostMetrics | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db
    .from('social_post_metrics')
    .select('*')
    .eq('social_post_id', postId)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapMetrics(data as Record<string, unknown>) : null;
}

export async function upsertPostMetrics(input: {
  socialPostId: number;
  impressions?: number;
  likes?: number;
  reposts?: number;
  replies?: number;
  bookmarks?: number;
  urlClicks?: number;
}): Promise<SocialPostMetrics> {
  const db = getSupabaseAdmin();
  if (!db) throw new Error('Supabase is not configured');

  const { data, error } = await db
    .from('social_post_metrics')
    .insert({
      social_post_id: input.socialPostId,
      impressions: input.impressions ?? 0,
      likes: input.likes ?? 0,
      reposts: input.reposts ?? 0,
      replies: input.replies ?? 0,
      bookmarks: input.bookmarks ?? 0,
      url_clicks: input.urlClicks ?? 0,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  const metrics = mapMetrics(data as Record<string, unknown>);

  const { data: post } = await db
    .from('social_posts')
    .select('template_id')
    .eq('id', input.socialPostId)
    .maybeSingle();

  if (post) {
    const templateId = String((post as { template_id: string }).template_id) as SocialTemplateId;
    const { data: template } = await db
      .from('social_templates')
      .select('score')
      .eq('id', templateId)
      .maybeSingle();

    const currentScore = Number((template as { score?: number } | null)?.score ?? 1);
    const engagement = computeEngagementScore(metrics);
    const nextScore = blendTemplateScore(currentScore, engagement);

    await db.from('social_templates').update({ score: nextScore }).eq('id', templateId);
  }

  return metrics;
}

export async function listPostsNeedingMetrics(days = 7): Promise<SocialPost[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await db
    .from('social_posts')
    .select('*')
    .eq('status', 'posted')
    .gte('posted_at', since.toISOString())
    .order('posted_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapPost(row as Record<string, unknown>));
}
