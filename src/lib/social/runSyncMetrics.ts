import {
  getLatestMetricsForPost,
  isSocialDbConfigured,
  listPostsNeedingMetrics,
  upsertPostMetrics,
} from './socialDb';
import { fetchTweetMetrics, isXApiConfigured } from './xClient';

export async function runSyncTweetMetrics(): Promise<{
  ok: boolean;
  synced: number;
  message: string;
}> {
  if (!isSocialDbConfigured()) {
    return {
      ok: false,
      synced: 0,
      message: 'Supabase is not configured.',
    };
  }

  const posts = await listPostsNeedingMetrics(14);
  if (posts.length === 0) {
    return { ok: true, synced: 0, message: 'No posted tweets to sync.' };
  }

  if (!isXApiConfigured()) {
    return {
      ok: true,
      synced: 0,
      message:
        'X API keys not set yet. Add likes manually in /admin/social, or configure X API for automatic sync.',
    };
  }

  let synced = 0;

  for (const post of posts) {
    if (!post.xTweetId) continue;

    const latest = await getLatestMetricsForPost(post.id);
    const remote = await fetchTweetMetrics(post.xTweetId);
    if (!remote) continue;

    const unchanged =
      latest &&
      latest.likes === remote.likes &&
      latest.reposts === remote.reposts &&
      latest.replies === remote.replies &&
      latest.bookmarks === remote.bookmarks &&
      latest.impressions === remote.impressions;

    if (unchanged) continue;

    await upsertPostMetrics({
      socialPostId: post.id,
      impressions: remote.impressions,
      likes: remote.likes,
      reposts: remote.reposts,
      replies: remote.replies,
      bookmarks: remote.bookmarks,
    });
    synced += 1;
  }

  return {
    ok: true,
    synced,
    message: synced > 0 ? `Synced metrics for ${synced} tweet(s).` : 'Metrics already up to date.',
  };
}
