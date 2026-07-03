export const ATTRIBUTION_STORAGE_KEY = 'japanese-super-words-attribution';
export const YOUTUBE_BANNER_DISMISSED_KEY = 'japanese-super-words-youtube-banner-dismissed';

export type AppAttribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  video?: string;
  fromYoutube: boolean;
  fromX: boolean;
  capturedAt: number;
};

function parseFromX(params: URLSearchParams): boolean {
  const source = params.get('utm_source')?.toLowerCase();
  return source === 'x' || source === 'twitter';
}

function parseFromYoutube(params: URLSearchParams): boolean {
  const from = params.get('from')?.toLowerCase();
  if (from === 'youtube' || from === 'yt') return true;
  const source = params.get('utm_source')?.toLowerCase();
  return source === 'youtube' || source === 'yt';
}

export function captureAttributionFromUrl(search = ''): AppAttribution | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(search || window.location.search);
  const hasParams =
    params.has('from') ||
    params.has('utm_source') ||
    params.has('utm_medium') ||
    params.has('utm_campaign') ||
    params.has('video');

  if (!hasParams) return readAttribution();

  const attribution: AppAttribution = {
    source: params.get('utm_source') ?? (parseFromYoutube(params) ? 'youtube' : undefined),
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    video: params.get('video') ?? undefined,
    fromYoutube: parseFromYoutube(params),
    fromX: parseFromX(params),
    capturedAt: Date.now(),
  };

  try {
    localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    /* ignore */
  }

  return attribution;
}

export function readAttribution(): AppAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    return normalizeAttribution(JSON.parse(raw) as Partial<AppAttribution>);
  } catch {
    return null;
  }
}

function normalizeAttribution(raw: Partial<AppAttribution> | null): AppAttribution | null {
  if (!raw || typeof raw.capturedAt !== 'number') return null;
  return {
    source: raw.source,
    medium: raw.medium,
    campaign: raw.campaign,
    video: raw.video,
    fromYoutube: raw.fromYoutube === true,
    fromX: raw.fromX === true,
    capturedAt: raw.capturedAt,
  };
}

export function isFromYoutube(): boolean {
  return readAttribution()?.fromYoutube === true;
}

export function getAttributionProps(): Record<string, string> {
  const a = readAttribution();
  if (!a) return {};
  const props: Record<string, string> = {};
  if (a.source) props.source = a.source;
  if (a.medium) props.medium = a.medium;
  if (a.campaign) props.campaign = a.campaign;
  if (a.video) props.video = a.video;
  if (a.fromYoutube) props.fromYoutube = 'true';
  if (a.fromX) props.fromX = 'true';
  return props;
}
