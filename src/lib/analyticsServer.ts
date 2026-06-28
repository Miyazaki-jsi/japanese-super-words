import { getSupabaseAdmin, isAnalyticsDbConfigured } from '@/lib/supabaseServer';

export type AnalyticsEventInput = {
  event: string;
  props?: Record<string, unknown>;
  visitorId?: string;
  ts?: number;
};

export type GumroadPurchaseInput = {
  saleId: string;
  productId?: string;
  productName?: string;
  email?: string;
  priceCents?: number;
  currency?: string;
  tier?: string;
  urlParams?: Record<string, unknown>;
  purchasedAt?: string;
  refunded?: boolean;
};

export type AdminStats = {
  configured: boolean;
  periodDays: number;
  since: string;
  visitors: number;
  introCompletes: number;
  day1Completes: number;
  unlockModalShown: number;
  gumroadClicks: number;
  unlockSuccesses: number;
  purchases: number;
  revenueCents: number;
  revenueCurrency: string;
  youtubeVisitors: number;
  topVideos: { video: string; count: number }[];
  topSources: { source: string; count: number }[];
  purchasesByTier: { tier: string; count: number }[];
  recentPurchases: {
    saleId: string;
    productName: string | null;
    tier: string | null;
    priceCents: number | null;
    currency: string | null;
    purchasedAt: string | null;
  }[];
  dailyVisitors: { date: string; count: number }[];
};

const FUNNEL_EVENTS = [
  'unlock_modal_shown',
  'gumroad_click',
  'unlock_success',
] as const;

export async function storeAnalyticsEvent(input: AnalyticsEventInput): Promise<void> {
  if (!isAnalyticsDbConfigured()) return;

  const db = getSupabaseAdmin();
  if (!db) return;

  const createdAt = input.ts ? new Date(input.ts).toISOString() : new Date().toISOString();

  const { error } = await db.from('analytics_events').insert({
    event: input.event,
    props: input.props ?? {},
    visitor_id: input.visitorId ?? null,
    created_at: createdAt,
  });

  if (error) {
    console.error('[analytics] store failed', error.message);
  }
}

export async function storeGumroadPurchase(input: GumroadPurchaseInput): Promise<boolean> {
  if (!isAnalyticsDbConfigured()) return false;

  const db = getSupabaseAdmin();
  if (!db) return false;

  const { error } = await db.from('gumroad_purchases').upsert(
    {
      sale_id: input.saleId,
      product_id: input.productId ?? null,
      product_name: input.productName ?? null,
      email: input.email ?? null,
      price_cents: input.priceCents ?? null,
      currency: input.currency ?? null,
      tier: input.tier ?? null,
      url_params: input.urlParams ?? {},
      purchased_at: input.purchasedAt ?? null,
      refunded: input.refunded ?? false,
    },
    { onConflict: 'sale_id' }
  );

  if (error) {
    console.error('[gumroad] store failed', error.message);
    return false;
  }

  return true;
}

function parseCodeList(envValue: string | undefined): Set<string> {
  if (!envValue?.trim()) return new Set();
  return new Set(
    envValue
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

export function inferTierFromGumroadProduct(
  productId?: string,
  productName?: string
): string | undefined {
  const tripIds = parseCodeList(process.env.GUMROAD_TRIP_PRODUCT_IDS);
  const proIds = parseCodeList(process.env.GUMROAD_PRO_PRODUCT_IDS);

  if (productId) {
    if (proIds.has(productId)) return 'pro';
    if (tripIds.has(productId)) return 'trip';
  }

  const name = productName?.toLowerCase() ?? '';
  if (/pro|premium|japan pro/.test(name)) return 'pro';
  if (/trip|course|pack/.test(name)) return 'trip';

  return undefined;
}

function countDistinctVisitors(
  rows: { visitor_id: string | null; created_at: string; props: Record<string, unknown> | null }[],
  sinceMs: number
): number {
  const ids = new Set<string>();
  for (const row of rows) {
    if (new Date(row.created_at).getTime() < sinceMs) continue;
    if (row.visitor_id) ids.add(row.visitor_id);
  }
  return ids.size;
}

function countEvents(
  rows: { event: string; created_at: string }[],
  eventName: string,
  sinceMs: number
): number {
  return rows.filter(
    (row) => row.event === eventName && new Date(row.created_at).getTime() >= sinceMs
  ).length;
}

function countYoutubeVisitors(
  rows: { visitor_id: string | null; created_at: string; props: Record<string, unknown> | null }[],
  sinceMs: number
): number {
  const ids = new Set<string>();
  for (const row of rows) {
    if (new Date(row.created_at).getTime() < sinceMs) continue;
    if (!row.visitor_id) continue;
    const props = row.props ?? {};
    const fromYoutube =
      props.fromYoutube === true ||
      props.fromYoutube === 'true' ||
      props.source === 'youtube' ||
      props.source === 'yt';
    if (fromYoutube) ids.add(row.visitor_id);
  }
  return ids.size;
}

function topPropValues(
  rows: { visitor_id: string | null; created_at: string; props: Record<string, unknown> | null }[],
  key: string,
  sinceMs: number,
  limit = 8
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (new Date(row.created_at).getTime() < sinceMs) continue;
    const value = row.props?.[key];
    if (typeof value !== 'string' || !value.trim()) continue;
    const label = value.trim();
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function dailyVisitorCounts(
  rows: { visitor_id: string | null; created_at: string }[],
  sinceMs: number
): { date: string; count: number }[] {
  const byDay = new Map<string, Set<string>>();

  for (const row of rows) {
    if (!row.visitor_id) continue;
    const ts = new Date(row.created_at).getTime();
    if (ts < sinceMs) continue;
    const date = row.created_at.slice(0, 10);
    if (!byDay.has(date)) byDay.set(date, new Set());
    byDay.get(date)!.add(row.visitor_id);
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, ids]) => ({ date, count: ids.size }));
}

export async function getAdminStats(periodDays = 30): Promise<AdminStats> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (periodDays - 1));
  const sinceIso = since.toISOString();
  const sinceMs = since.getTime();

  const empty: AdminStats = {
    configured: isAnalyticsDbConfigured(),
    periodDays,
    since: sinceIso,
    visitors: 0,
    introCompletes: 0,
    day1Completes: 0,
    unlockModalShown: 0,
    gumroadClicks: 0,
    unlockSuccesses: 0,
    purchases: 0,
    revenueCents: 0,
    revenueCurrency: 'usd',
    youtubeVisitors: 0,
    topVideos: [],
    topSources: [],
    purchasesByTier: [],
    recentPurchases: [],
    dailyVisitors: [],
  };

  const db = getSupabaseAdmin();
  if (!db) return empty;

  const [eventsRes, purchasesRes, recentPurchasesRes] = await Promise.all([
    db
      .from('analytics_events')
      .select('event, visitor_id, props, created_at')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false })
      .limit(10000),
    db
      .from('gumroad_purchases')
      .select('tier, price_cents, currency, refunded, purchased_at')
      .gte('purchased_at', sinceIso)
      .eq('refunded', false),
    db
      .from('gumroad_purchases')
      .select('sale_id, product_name, tier, price_cents, currency, purchased_at, refunded')
      .order('purchased_at', { ascending: false })
      .limit(12),
  ]);

  if (eventsRes.error) {
    console.error('[analytics] stats events failed', eventsRes.error.message);
    return empty;
  }

  const eventRows = eventsRes.data ?? [];
  const purchaseRows = (purchasesRes.data ?? []).filter((row) => !row.refunded);

  const tierCounts = new Map<string, number>();
  let revenueCents = 0;
  let revenueCurrency = 'usd';

  for (const row of purchaseRows) {
    const tier = row.tier ?? 'unknown';
    tierCounts.set(tier, (tierCounts.get(tier) ?? 0) + 1);
    if (typeof row.price_cents === 'number') revenueCents += row.price_cents;
    if (row.currency) revenueCurrency = row.currency;
  }

  return {
    configured: true,
    periodDays,
    since: sinceIso,
    visitors: countDistinctVisitors(eventRows, sinceMs),
    introCompletes: countEvents(eventRows, 'intro_complete', sinceMs),
    day1Completes: countEvents(eventRows, 'day1_completed', sinceMs),
    unlockModalShown: countEvents(eventRows, 'unlock_modal_shown', sinceMs),
    gumroadClicks: countEvents(eventRows, 'gumroad_click', sinceMs),
    unlockSuccesses: countEvents(eventRows, 'unlock_success', sinceMs),
    purchases: purchaseRows.length,
    revenueCents,
    revenueCurrency,
    youtubeVisitors: countYoutubeVisitors(eventRows, sinceMs),
    topVideos: topPropValues(eventRows, 'video', sinceMs).map(({ label, count }) => ({
      video: label,
      count,
    })),
    topSources: topPropValues(eventRows, 'source', sinceMs).map(({ label, count }) => ({
      source: label,
      count,
    })),
    purchasesByTier: [...tierCounts.entries()].map(([tier, count]) => ({ tier, count })),
    recentPurchases: (recentPurchasesRes.data ?? [])
      .filter((row) => !row.refunded)
      .map((row) => ({
        saleId: row.sale_id,
        productName: row.product_name,
        tier: row.tier,
        priceCents: row.price_cents,
        currency: row.currency,
        purchasedAt: row.purchased_at,
      })),
    dailyVisitors: dailyVisitorCounts(eventRows, sinceMs),
  };
}

export { FUNNEL_EVENTS };
