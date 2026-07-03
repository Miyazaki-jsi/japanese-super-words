import { NextResponse } from 'next/server';
import { isAdminApiAuthorized } from '@/lib/adminApiAuth';
import { runSyncTweetMetrics } from '@/lib/social/runSyncMetrics';

export async function POST() {
  if (!(await isAdminApiAuthorized())) {
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
