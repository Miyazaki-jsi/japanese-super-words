import {
  inferTierFromGumroadProduct,
  storeGumroadPurchase,
} from '@/lib/analyticsServer';
import { isAnalyticsDbConfigured } from '@/lib/supabaseServer';

type GumroadSale = {
  id?: string;
  email?: string;
  seller_id?: string;
  product_id?: string;
  product_name?: string;
  price?: number;
  currency?: string;
  sale_timestamp?: string;
  timestamp?: string;
  created_at?: string;
  refunded?: boolean;
  partially_refunded?: boolean;
  chargedback?: boolean;
  url_params?: Record<string, unknown> | string;
};

type GumroadSalesResponse = {
  success?: boolean;
  sales?: GumroadSale[];
  next_page_key?: string | null;
  message?: string;
};

export type GumroadSyncResult = {
  ok: boolean;
  synced: number;
  skipped: number;
  totalFetched: number;
  message: string;
};

function parseUrlParams(raw: GumroadSale['url_params']): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return { raw };
  }
}

function isSaleRefunded(sale: GumroadSale): boolean {
  return sale.refunded === true || sale.partially_refunded === true || sale.chargedback === true;
}

async function fetchGumroadSalesPage(
  accessToken: string,
  pageKey?: string
): Promise<GumroadSalesResponse> {
  const params = new URLSearchParams({ access_token: accessToken });
  if (pageKey) params.set('page_key', pageKey);

  const res = await fetch(`https://api.gumroad.com/v2/sales?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Gumroad sales API failed (${res.status})`);
  }

  const data = (await res.json()) as GumroadSalesResponse;
  if (!data.success) {
    throw new Error(data.message ?? 'Gumroad sales API returned success=false');
  }

  return data;
}

/** Pull sales from Gumroad API and upsert into Supabase (backfill + manual sync). */
export async function syncGumroadPurchases(): Promise<GumroadSyncResult> {
  const accessToken = process.env.GUMROAD_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    return {
      ok: false,
      synced: 0,
      skipped: 0,
      totalFetched: 0,
      message:
        'GUMROAD_ACCESS_TOKEN が未設定です。Gumroad → Settings → Advanced でトークンを取得し、Vercel に追加してください。',
    };
  }

  if (!isAnalyticsDbConfigured()) {
    return {
      ok: false,
      synced: 0,
      skipped: 0,
      totalFetched: 0,
      message: 'Supabase が未設定のため購入データを保存できません。',
    };
  }

  let pageKey: string | undefined;
  let synced = 0;
  let skipped = 0;
  let totalFetched = 0;

  do {
    const page = await fetchGumroadSalesPage(accessToken, pageKey);
    const sales = page.sales ?? [];

    for (const sale of sales) {
      totalFetched += 1;
      const saleId = sale.id?.trim();
      if (!saleId) {
        skipped += 1;
        continue;
      }

      const productId = sale.product_id;
      const productName = sale.product_name;
      const stored = await storeGumroadPurchase({
        saleId,
        productId,
        productName,
        email: sale.email,
        priceCents: typeof sale.price === 'number' ? Math.round(sale.price) : undefined,
        currency: sale.currency?.toLowerCase(),
        tier: inferTierFromGumroadProduct(productId, productName),
        urlParams: parseUrlParams(sale.url_params),
        purchasedAt:
          sale.sale_timestamp ?? sale.timestamp ?? sale.created_at ?? new Date().toISOString(),
        refunded: isSaleRefunded(sale),
      });

      if (stored) synced += 1;
      else skipped += 1;
    }

    pageKey = page.next_page_key ?? undefined;
  } while (pageKey);

  return {
    ok: true,
    synced,
    skipped,
    totalFetched,
    message:
      synced > 0
        ? `Gumroad から ${synced} 件の購入を同期しました。`
        : totalFetched > 0
          ? `${totalFetched} 件を取得しましたが、新規保存はありませんでした。`
          : 'Gumroad に購入データがありませんでした。',
  };
}

export function isGumroadAccessTokenConfigured(): boolean {
  return Boolean(process.env.GUMROAD_ACCESS_TOKEN?.trim());
}
