import { NextResponse } from 'next/server';
import type { UnlockGrant } from '@/lib/verifyUnlockCodes';
import { verifyUnlockCodeOnServer } from '@/lib/verifyUnlockCodes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code : '';

    if (!code.trim()) {
      return NextResponse.json(
        { error: 'Please enter your unlock code.' },
        { status: 400 }
      );
    }

    if (code.length > 64) {
      return NextResponse.json({ error: 'Invalid unlock code.' }, { status: 400 });
    }

    const grant: UnlockGrant | null = await verifyUnlockCodeOnServer(code);

    if (!grant) {
      return NextResponse.json({ error: 'Invalid unlock code.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, tier: grant.tier });
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
