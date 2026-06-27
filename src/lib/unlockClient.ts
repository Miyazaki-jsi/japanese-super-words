import type { UnlockTier } from '@/data/monetization';

type UnlockResult = { ok: true; tier: UnlockTier } | { ok: false; error: string };

export async function verifyUnlockCode(code: string): Promise<UnlockResult> {
  const res = await fetch('/api/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      ok: false,
      error: typeof data.error === 'string' ? data.error : 'Invalid unlock code.',
    };
  }

  if (data.tier === 'trip' || data.tier === 'pro') {
    return { ok: true, tier: data.tier };
  }

  return { ok: false, error: 'Invalid unlock code.' };
}
