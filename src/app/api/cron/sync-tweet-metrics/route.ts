import { NextResponse } from 'next/server';
import { verifyCronRequest } from '@/lib/social/cronAuth';
import { runSyncTweetMetrics } from '@/lib/social/runSyncMetrics';

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runSyncTweetMetrics();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        synced: 0,
        message: error instanceof Error ? error.message : 'Failed to sync metrics',
      },
      { status: 500 }
    );
  }
}
