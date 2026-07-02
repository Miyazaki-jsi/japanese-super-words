import { NextResponse } from 'next/server';
import { fetchTweetMetrics } from '@/lib/xTwitter';
import {
  listTweetsNeedingMetrics,
  updateTweetMetrics,
} from '@/lib/xTweetStore';

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

/** Sync likes/impressions for recent posts → feeds template learning. */
export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const pending = await listTweetsNeedingMetrics(30);
  const results: { tweetId: string; ok: boolean; likes?: number }[] = [];

  for (const { tweetId } of pending) {
    const metrics = await fetchTweetMetrics(tweetId);
    if (!metrics) {
      results.push({ tweetId, ok: false });
      continue;
    }

    await updateTweetMetrics(tweetId, metrics);
    results.push({ tweetId, ok: true, likes: metrics.likes });
  }

  return NextResponse.json({
    ok: true,
    synced: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
