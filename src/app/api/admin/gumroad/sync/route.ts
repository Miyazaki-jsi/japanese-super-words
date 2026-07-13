import { NextResponse } from 'next/server';
import { isAdminApiAuthorized } from '@/lib/adminApiAuth';
import { syncGumroadPurchases } from '@/lib/gumroadSync';

export async function POST() {
  if (!(await isAdminApiAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncGumroadPurchases();
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        synced: 0,
        skipped: 0,
        totalFetched: 0,
        message: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  }
}
