import { NextResponse } from 'next/server';
import { uniwareChannelApiKeyOk } from '@/lib/unicommerce/channel-auth';
import { UnicommerceLogger } from '@/lib/unicommerce/logging';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const apiKey =
    request.headers.get('apiKey') ||
    request.headers.get('apikey') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim() ||
    '';

  if (!uniwareChannelApiKeyOk(apiKey) && process.env.NODE_ENV === 'production') {
    await UnicommerceLogger.warn(
      'channel.update_inventory_unauthorized',
      'Uniware /updateInventory rejected: missing or invalid apiKey'
    );
    return NextResponse.json({ status: 'FAILED', failedProductList: [] }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: 'FAILED', failedProductList: [{ productId: '', variantId: '', message: 'Malformed JSON' }] },
      { status: 400 }
    );
  }

  const items = Array.isArray(body) ? body : body.inventoryList || body.items || [];
  const admin = createAdminClient();
  let written = 0;
  const failed: any[] = [];

  for (const item of items) {
    const sku = item.sku || item.itemTypeSKU || item.itemSKU;
    const qty = parseInt(String(item.quantity ?? item.inventory ?? item.available ?? 0), 10);
    if (!sku) continue;

    try {
      await admin
        .from('variants')
        .update({ inventory_quantity: isNaN(qty) ? 0 : qty })
        .eq('sku', sku);
      written++;
    } catch (err: any) {
      failed.push({ productId: sku, variantId: sku, message: err?.message || 'Update failed' });
    }
  }

  await UnicommerceLogger.info(
    'channel.update_inventory',
    `Uniware inventory push: ${written} written, ${failed.length} failed`,
    'inventory',
    { count: items.length }
  );

  return NextResponse.json({
    status: failed.length === 0 ? 'SUCCESS' : written > 0 ? 'PARTIAL_SUCCESS' : 'FAILED',
    failedProductList: failed,
  });
}
