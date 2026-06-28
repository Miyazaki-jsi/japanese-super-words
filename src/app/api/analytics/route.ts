import { NextResponse } from 'next/server';
import { storeAnalyticsEvent } from '@/lib/analyticsServer';

const MONETIZATION_EVENTS = new Set([
  'unlock_modal_shown',
  'unlock_modal_open',
  'gumroad_click',
  'unlock_success',
  'unlock_failed',
  'day1_complete_unlock_flow',
]);

function sanitizeProps(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const props: Record<string, unknown> = {};
  for (const [key, propValue] of Object.entries(value)) {
    if (key === 'event' || key === 'ts' || key === 'visitorId') continue;
    if (
      typeof propValue === 'string' ||
      typeof propValue === 'number' ||
      typeof propValue === 'boolean' ||
      propValue === null
    ) {
      props[key] = propValue;
    }
  }
  return props;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = typeof body.event === 'string' ? body.event : 'unknown';
    const props = sanitizeProps(body);
    const visitorId = typeof body.visitorId === 'string' ? body.visitorId : undefined;
    const ts = typeof body.ts === 'number' ? body.ts : undefined;

    if (process.env.NODE_ENV === 'development' || MONETIZATION_EVENTS.has(event)) {
      console.info('[analytics]', event, { ...props, visitorId, ts });
    }

    void storeAnalyticsEvent({ event, props, visitorId, ts });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
