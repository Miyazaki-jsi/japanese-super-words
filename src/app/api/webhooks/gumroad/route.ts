import { NextResponse } from 'next/server';
import {
  inferTierFromGumroadProduct,
  storeGumroadPurchase,
} from '@/lib/analyticsServer';

function parseFormBody(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string') out[key] = value;
  });
  return out;
}

function parseUrlParams(raw: string | undefined): Record<string, unknown> {
  if (!raw?.trim()) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return { raw };
  }
}

function parsePriceCents(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value)) return undefined;
  return Math.round(value);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let fields: Record<string, string>;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      fields = parseFormBody(await request.formData());
    } else if (contentType.includes('multipart/form-data')) {
      fields = parseFormBody(await request.formData());
    } else {
      const json = (await request.json()) as Record<string, unknown>;
      fields = Object.fromEntries(
        Object.entries(json).filter(([, value]) => typeof value === 'string')
      ) as Record<string, string>;
    }

    const resourceName = fields.resource_name ?? fields.event ?? 'sale';
    const sellerId = process.env.GUMROAD_SELLER_ID?.trim();
    if (sellerId && fields.seller_id && fields.seller_id !== sellerId) {
      return NextResponse.json({ ok: false, error: 'seller mismatch' }, { status: 403 });
    }

    const saleId = fields.sale_id ?? fields.id;
    if (!saleId) {
      return NextResponse.json({ ok: true, ignored: true, reason: 'missing sale_id' });
    }

    const refunded =
      fields.refunded === 'true' ||
      resourceName === 'refund' ||
      fields.resource_name === 'refund';

    const productId = fields.product_id ?? fields.product_permalink;
    const productName = fields.product_name ?? fields.product;
    const tier = inferTierFromGumroadProduct(productId, productName);

    const stored = await storeGumroadPurchase({
      saleId,
      productId,
      productName,
      email: fields.email,
      priceCents: parsePriceCents(fields.price),
      currency: fields.currency?.toLowerCase(),
      tier,
      urlParams: parseUrlParams(fields.url_params),
      purchasedAt: fields.sale_timestamp ?? fields.timestamp ?? new Date().toISOString(),
      refunded,
    });

    if (process.env.NODE_ENV === 'development' || stored) {
      console.info('[gumroad webhook]', resourceName, {
        saleId,
        productName,
        tier,
        refunded,
      });
    }

    return NextResponse.json({ ok: true, stored });
  } catch (error) {
    console.error('[gumroad webhook] failed', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Gumroad webhook endpoint' });
}
