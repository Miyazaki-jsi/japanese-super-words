import { NextResponse } from 'next/server';
import {
  buildDailyTweetText,
  getAppBaseUrl,
  pickDailyPhrase,
} from '@/lib/dailyTweet';
import { isXTwitterConfigured, postTweet } from '@/lib/xTwitter';
import { saveTweetPost } from '@/lib/xTweetStore';

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
  const { text, link, templateId, charCount } = await buildDailyTweetText(
    card,
    appBaseUrl,
  );

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
      templateId,
      link,
      text,
      charCount,
    });
  }

  try {
    const tweet = await postTweet(text);
    const stored = await saveTweetPost({
      tweetId: tweet.id,
      cardId: card.id,
      templateId,
      situation: card.situation,
      charCount,
      tweetText: text,
    });

    return NextResponse.json({
      ok: true,
      dryRun: false,
      posted: true,
      stored,
      tweetId: tweet.id,
      templateId,
      card: { id: card.id, situation: card.situation },
      link,
      text,
      charCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tweet failed';
    console.error('[daily-tweet]', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
