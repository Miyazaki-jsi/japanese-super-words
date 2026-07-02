import { TwitterApi } from 'twitter-api-v2';

export function isXTwitterConfigured(): boolean {
  return Boolean(
    process.env.TWITTER_API_KEY?.trim() &&
      process.env.TWITTER_API_SECRET?.trim() &&
      process.env.TWITTER_ACCESS_TOKEN?.trim() &&
      process.env.TWITTER_ACCESS_TOKEN_SECRET?.trim(),
  );
}

function getClient(): TwitterApi {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!.trim(),
    appSecret: process.env.TWITTER_API_SECRET!.trim(),
    accessToken: process.env.TWITTER_ACCESS_TOKEN!.trim(),
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!.trim(),
  });
}

export async function postTweet(text: string): Promise<{ id: string; text: string }> {
  if (!isXTwitterConfigured()) {
    throw new Error('X (Twitter) API credentials are not configured.');
  }

  const { data } = await getClient().v2.tweet(text);
  if (!data.id) {
    throw new Error('Tweet posted but no id returned.');
  }

  return { id: data.id, text: data.text ?? text };
}

export type TweetPublicMetrics = {
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
};

export async function fetchTweetMetrics(tweetId: string): Promise<TweetPublicMetrics | null> {
  if (!isXTwitterConfigured()) return null;

  try {
    const { data } = await getClient().v2.singleTweet(tweetId, {
      'tweet.fields': ['public_metrics'],
    });

    const m = data.public_metrics;
    if (!m) return null;

    return {
      likes: m.like_count ?? 0,
      retweets: m.retweet_count ?? 0,
      replies: m.reply_count ?? 0,
      impressions: m.impression_count ?? 0,
    };
  } catch (error) {
    console.error('[x-tweet] metrics fetch failed', tweetId, error);
    return null;
  }
}
