import { NextResponse } from 'next/server';
import { isAdminApiAuthorized } from '@/lib/adminApiAuth';
import { runDailyTweet } from '@/lib/social/runDailyTweet';

export async function POST(request: Request) {
  if (!(await isAdminApiAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      force?: boolean;
      scheduledFor?: string;
    };

    const result = await runDailyTweet({
      force: body.force === true,
      scheduledFor: typeof body.scheduledFor === 'string' ? body.scheduledFor : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to generate tweet',
      },
      { status: 500 }
    );
  }
}
