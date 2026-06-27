type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

const MAX_STORED = 40;
const STORAGE_KEY = 'japanese-super-words-analytics-log';

export function trackEvent(event: string, props?: AnalyticsProps): void {
  if (typeof window === 'undefined') return;

  const payload = { event, ...props, ts: Date.now() };

  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', payload);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const prev = raw ? (JSON.parse(raw) as unknown[]) : [];
    const next = [...prev, payload].slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }

  if (typeof window.plausible === 'function') {
    window.plausible(event, { props: props as Record<string, string> | undefined });
  }

  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* non-blocking */
  });
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}
