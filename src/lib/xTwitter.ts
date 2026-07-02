import { TwitterApi } from 'twitter-api-v2';

export function isXTwitterConfigured(): boolean {
  return Boolean(
    process.env.TWITTER_API_KEY?.trim() &&
      process.env.TWITTER_API_SECRET?.trim() &&
      process.env.TWITTER_ACCESS_TOKEN?.trim() &&
      process.env.TWITTER_ACCESS_TOKEN_SECRET?.trim(),
  );
}

export async function postTweet(text: string): Promise<{ id: string; text: string }> {
  if (!isXTwitterConfigured()) {
    throw new Error('X (Twitter) API credentials are not configured.');
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!.trim(),
    appSecret: process.env.TWITTER_API_SECRET!.trim(),
    accessToken: process.env.TWITTER_ACCESS_TOKEN!.trim(),
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!.trim(),
  });

  const { data } = await client.v2.tweet(text);
  if (!data.id) {
    throw new Error('Tweet posted but no id returned.');
  }

  return { id: data.id, text: data.text ?? text };
}
