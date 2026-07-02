import { NextResponse } from 'next/server';
import {
  buildDailyTweetText,
  getAppBaseUrl,
  pickDailyPhrase,
} from '@/lib/dailyTweet';
import { isXTwitterConfigured, postTweet } from '@/lib/xTwitter';

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preview = searchParams.get('preview') === '1';

  if (!preview && !authorizeCron(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = process.env.TWITTER_DRY_RUN === '1' || preview;
  const card = pickDailyPhrase();
  const appBaseUrl = getAppBaseUrl();
  const { text, link } = buildDailyTweetText(card, appBaseUrl);

  if (dryRun || !isXTwitterConfigured()) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      posted: false,
      reason: dryRun
        ? 'preview or TWITTER_DRY_RUN'
        : 'X API credentials not configured',
      card: {
        id: card.id,
        situation: card.situation,
        japanese: card.japanese,
        english: card.english,
      },
      link,
      text,
      charCount: text.length,
    });
  }

  try {
    const tweet = await postTweet(text);
    return NextResponse.json({
      ok: true,
      dryRun: false,
      posted: true,
      tweetId: tweet.id,
      card: { id: card.id, situation: card.situation },
      link,
      text,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tweet failed';
    console.error('[daily-tweet]', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
