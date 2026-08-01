import {
  buildTweet,
  buildWowPromptTweet,
  pickWordForTweet,
  shouldIncludeAppLink,
  type WowGeneratedTweet,
} from './socialContent';
import { pickTemplateId } from './socialLearning';
import {
  createSocialPost,
  deleteSocialPost,
  ensureSocialTemplatesSeeded,
  getPostForDate,
  getRecentWordIds,
  getSocialTemplates,
  getTotalSocialPostCount,
  isSocialDbConfigured,
} from './socialDb';
import type { DailyTweetResult, GeneratedTweet } from './types';
import { isXAutoPostEnabled, postTweet } from './xClient';
import { isWowPromptDay } from './wowPrompts';

import { isAutoPostDayJapan, todayJapanDate } from './japanDate';

async function publishGenerated(
  generated: GeneratedTweet,
  scheduledFor: string,
  threadReply?: string
): Promise<DailyTweetResult> {
  const parentText = threadReply
    ? generated.tweetText.split('\n---\nREPLY:\n')[0]?.trim() ?? generated.tweetText
    : generated.tweetText;

  const postResult = await postTweet(parentText);
  const now = new Date().toISOString();

  if (postResult.ok && postResult.dryRun) {
    const post = await createSocialPost({
      generated,
      scheduledFor,
      status: 'draft',
    });

    return {
      ok: true,
      dryRun: true,
      post,
      message:
        'Draft tweet created. Copy it from /admin/social, or set X API keys + X_AUTO_POST=true for automatic posting.',
    };
  }

  if (!postResult.ok) {
    const post = await createSocialPost({
      generated,
      scheduledFor,
      status: 'failed',
      errorMessage: postResult.displayError ?? postResult.error,
    });

    return {
      ok: false,
      dryRun: false,
      post,
      message: postResult.displayError ?? postResult.error,
    };
  }

  if (threadReply) {
    const replyResult = await postTweet(threadReply, postResult.tweetId);
    if (!replyResult.ok) {
      const post = await createSocialPost({
        generated,
        scheduledFor,
        status: 'failed',
        xTweetId: postResult.tweetId,
        postedAt: now,
        errorMessage: replyResult.displayError ?? replyResult.error,
      });
      return {
        ok: false,
        dryRun: false,
        post,
        message: `Parent posted, reply failed: ${replyResult.displayError ?? replyResult.error}`,
      };
    }
  }

  const post = await createSocialPost({
    generated,
    scheduledFor,
    status: 'posted',
    xTweetId: postResult.tweetId,
    postedAt: now,
  });

  return {
    ok: true,
    dryRun: false,
    post,
    message: threadReply
      ? `Posted wow-prompt thread to X (${postResult.tweetId}).`
      : `Posted to X (${postResult.tweetId}).`,
  };
}

export async function runDailyTweet(options?: {
  scheduledFor?: string;
  force?: boolean;
}): Promise<DailyTweetResult> {
  if (!isSocialDbConfigured()) {
    return {
      ok: false,
      dryRun: true,
      message: 'Supabase is not configured. Run the social SQL in supabase/schema.sql first.',
    };
  }

  // Cron: Mon/Wed/Fri only (Japan). Admin force can still generate any day.
  if (!options?.force && !isAutoPostDayJapan()) {
    return {
      ok: true,
      dryRun: !isXAutoPostEnabled(),
      message: 'Skipped: auto-post runs Mon/Wed/Fri (Japan time) only.',
    };
  }

  const scheduledFor = options?.scheduledFor ?? todayJapanDate();
  await ensureSocialTemplatesSeeded();

  const existing = await getPostForDate(scheduledFor);
  if (existing && !options?.force) {
    return {
      ok: true,
      dryRun: !isXAutoPostEnabled(),
      post: existing,
      message: 'Tweet for this date already exists.',
    };
  }

  if (existing && options?.force) {
    if (existing.status === 'posted') {
      return {
        ok: false,
        dryRun: !isXAutoPostEnabled(),
        post: existing,
        message: 'Already posted for this date. Cannot regenerate.',
      };
    }
    await deleteSocialPost(existing.id);
  }

  const templates = await getSocialTemplates();
  const templateId = pickTemplateId(templates);

  // Wednesday = wow AI prompt thread; Mon/Fri = short phrase
  if (isWowPromptDay(scheduledFor)) {
    const generated: WowGeneratedTweet = buildWowPromptTweet(scheduledFor, templateId);
    return publishGenerated(generated, scheduledFor, generated.threadReply);
  }

  const recentWordIds = await getRecentWordIds();
  const word = pickWordForTweet(recentWordIds);
  const postCount = await getTotalSocialPostCount();
  const includeLink = shouldIncludeAppLink(postCount);
  const generated = buildTweet(templateId, word, { includeLink });

  return publishGenerated(generated, scheduledFor);
}
