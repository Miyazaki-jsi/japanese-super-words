import { NextResponse } from 'next/server';

const MONETIZATION_EVENTS = new Set([
  'unlock_modal_shown',
  'unlock_modal_open',
  'gumroad_click',
  'unlock_success',
  'unlock_failed',
  'day1_complete_unlock_flow',
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = typeof body.event === 'string' ? body.event : 'unknown';

    if (process.env.NODE_ENV === 'development' || MONETIZATION_EVENTS.has(event)) {
      console.info('[analytics]', event, body);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
