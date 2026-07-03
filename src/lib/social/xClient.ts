import crypto from 'node:crypto';
import { explainXApiError } from './xErrors';

export const X_API_BASE = 'https://api.x.com';

export type XPostResult =
  | { ok: true; dryRun: true; tweetId?: undefined }
  | { ok: true; dryRun: false; tweetId: string }
  | { ok: false; dryRun: boolean; error: string };

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? '';
}

export function isXApiConfigured(): boolean {
  return Boolean(
    readEnv('X_API_KEY') &&
      readEnv('X_API_SECRET') &&
      readEnv('X_ACCESS_TOKEN') &&
      readEnv('X_ACCESS_TOKEN_SECRET')
  );
}

export function isXAutoPostEnabled(): boolean {
  if (readEnv('X_AUTO_POST') === 'false') return false;
  if (readEnv('X_AUTO_POST') === 'true') return true;
  return isXApiConfigured();
}

function percentEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function buildOAuth1Header(method: string, url: string): string {
  const apiKey = readEnv('X_API_KEY');
  const apiSecret = readEnv('X_API_SECRET');
  const accessToken = readEnv('X_ACCESS_TOKEN');
  const accessSecret = readEnv('X_ACCESS_TOKEN_SECRET');

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(oauthParams[key])}`)
    .join('&');

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join('&');

  const signingKey = `${percentEncode(apiSecret)}&${percentEncode(accessSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');

  const headerParams: Record<string, string> = { ...oauthParams, oauth_signature: signature };
  const headerValue = Object.keys(headerParams)
    .sort()
    .map((key) => `${percentEncode(key)}="${percentEncode(headerParams[key])}"`)
    .join(', ');

  return `OAuth ${headerValue}`;
}

export async function postTweet(text: string): Promise<XPostResult> {
  if (!isXApiConfigured() || !isXAutoPostEnabled()) {
    return { ok: true, dryRun: true };
  }

  const url = `${X_API_BASE}/2/tweets`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: buildOAuth1Header('POST', url),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const payload = (await response.json()) as {
      data?: { id?: string };
      detail?: string;
      title?: string;
      errors?: { detail?: string }[];
    };

    if (!response.ok) {
      const raw =
        payload.detail ||
        payload.title ||
        payload.errors?.[0]?.detail ||
        `X API error (${response.status})`;
      const help = explainXApiError(raw);
      return { ok: false, dryRun: false, error: `${help.title}: ${help.message}` };
    }

    const tweetId = payload.data?.id;
    if (!tweetId) {
      return { ok: false, dryRun: false, error: 'X API returned no tweet id' };
    }

    return { ok: true, dryRun: false, tweetId };
  } catch (error) {
    return {
      ok: false,
      dryRun: false,
      error: error instanceof Error ? error.message : 'Failed to post tweet',
    };
  }
}

export async function fetchTweetMetrics(tweetId: string): Promise<{
  impressions: number;
  likes: number;
  reposts: number;
  replies: number;
  bookmarks: number;
} | null> {
  if (!isXApiConfigured()) return null;

  const params = new URLSearchParams({
    'tweet.fields': 'public_metrics',
  });
  const tweetPath = `${X_API_BASE}/2/tweets/${tweetId}`;
  const url = `${tweetPath}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: buildOAuth1Header('GET', tweetPath),
      },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      data?: {
        public_metrics?: {
          impression_count?: number;
          like_count?: number;
          retweet_count?: number;
          reply_count?: number;
          bookmark_count?: number;
        };
      };
    };

    const metrics = payload.data?.public_metrics;
    if (!metrics) return null;

    return {
      impressions: metrics.impression_count ?? 0,
      likes: metrics.like_count ?? 0,
      reposts: metrics.retweet_count ?? 0,
      replies: metrics.reply_count ?? 0,
      bookmarks: metrics.bookmark_count ?? 0,
    };
  } catch {
    return null;
  }
}
