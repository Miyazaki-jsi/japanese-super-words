import { NextResponse } from 'next/server';
import { verifyCronRequest } from '@/lib/social/cronAuth';
import { runDailyTweet } from '@/lib/social/runDailyTweet';

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runDailyTweet();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to run daily tweet',
      },
      { status: 500 }
    );
  }
}
