import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CartItem } from '@/store/cartStore';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ORG_ID = '00000000-0000-0000-0000-000000000001';
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'playr';

export type CartSchemaKind = 'crm' | 'legacy' | 'unknown';

export type CartSyncResult = {
  success: boolean;
  skipped?: boolean;
  schema?: CartSchemaKind;
  reason?: string;
  error?: unknown;
};

function dedupeItems(items: CartItem[]): CartItem[] {
  return items.reduce((acc, current) => {
    const x = acc.find((item) => item.id === current.id);
    if (!x) return acc.concat([current]);
    x.quantity += current.quantity;
    return acc;
  }, [] as CartItem[]);
}

let _cachedSchema: CartSchemaKind | null = null;

export async function detectCartSchema(force = false): Promise<CartSchemaKind> {
  if (!force && _cachedSchema) return _cachedSchema;

  try {
    const admin = createAdminClient();

    const crm = await admin.from('cart_items').select('cart_id, variant_id').limit(1);
    if (!crm.error) {
      _cachedSchema = 'crm';
      return 'crm';
    }

    const legacy = await admin.from('cart_items').select('user_id, product_id').limit(1);
    if (!legacy.error) {
      _cachedSchema = 'legacy';
      return 'legacy';
    }
  } catch (e) {
    console.warn('[CartService] schema probe failed:', e);
  }

  _cachedSchema = 'unknown';
  return 'unknown';
}

async function resolveCustomerId(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  email?: string | null
): Promise<string | null> {
  if (!email) return null;

  const { data: existing } = await admin
    .from('customers')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: profile } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .maybeSingle();

  const name = (profile?.full_name as string | undefined)?.split(' ') ?? ['', ''];
  const { data: created } = await admin
    .from('customers')
    .insert({
      organization_id: ORG_ID,
      brand_id: BRAND_ID,
      email,
      first_name: name[0] ?? '',
      last_name: name.slice(1).join(' ') ?? '',
    })
    .select('id')
    .single();

  return created?.id ?? null;
}

async function syncCrmCart(
  userId: string,
  items: CartItem[],
  email?: string | null
): Promise<CartSyncResult> {
  const admin = createAdminClient();
  const customerId = await resolveCustomerId(admin, userId, email);
  if (!customerId) {
    return {
      success: true,
      skipped: true,
      schema: 'crm',
      reason: 'no_customer',
    };
  }

  const uniqueItems = dedupeItems(items);

  let { data: cart } = await admin
    .from('carts')
    .select('id')
    .eq('customer_id', customerId)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!cart) {
    const { data: created, error: createErr } = await admin
      .from('carts')
      .insert({
        organization_id: ORG_ID,
        brand_id: BRAND_ID,
        customer_id: customerId,
        status: 'active',
        item_count: 0,
        subtotal: 0,
        currency: 'INR',
        metadata: { source: 'playr', auth_user_id: userId },
      })
      .select('id')
      .single();

    if (createErr || !created) {
      return {
        success: true,
        skipped: true,
        schema: 'crm',
        reason: createErr?.message ?? 'cart_create_failed',
      };
    }
    cart = created;
  }

  await admin.from('cart_items').delete().eq('cart_id', cart.id);

  if (uniqueItems.length > 0) {
    const rows = uniqueItems.map((item) => ({
      cart_id: cart!.id,
      variant_id: UUID_RE.test(item.id) ? item.id : null,
      quantity: item.quantity,
      unit_price: item.price,
      currency: 'INR',
    }));

    await admin.from('cart_items').insert(rows);
  }

  const subtotal = uniqueItems.reduce((s, i) => s + i.price * i.quantity, 0);
  await admin
    .from('carts')
    .update({
      item_count: uniqueItems.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cart.id);

  return { success: true, schema: 'crm' };
}

async function syncLegacyCart(
  userId: string,
  items: CartItem[]
): Promise<CartSyncResult> {
  const supabase = await createClient();
  const uniqueItems = dedupeItems(items);

  await supabase.from('cart_items').delete().eq('user_id', userId);

  if (uniqueItems.length > 0) {
    const toInsert = uniqueItems.map((item) => ({
      user_id: userId,
      product_id: item.productId,
      variant_id: item.id,
      quantity: item.quantity,
      metadata: {
        color: item.color,
        size: item.size,
        name: item.name,
        price: item.price,
        image: item.image,
        variantId: item.id,
      },
    }));

    const { error } = await supabase.from('cart_items').insert(toInsert);
    if (error) {
      return {
        success: true,
        skipped: true,
        schema: 'legacy',
        reason: error.message,
      };
    }
  }

  return { success: true, schema: 'legacy' };
}

async function getLegacyCart(userId: string): Promise<CartItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

  return data.map((item: any) => ({
    id:
      item.metadata?.variantId ||
      item.variant_id ||
      `${item.product_id}-${item.metadata?.color ?? 'default'}-${item.metadata?.size ?? ''}`,
    productId: item.product_id,
    name: item.metadata?.name ?? 'Product',
    price: Number(item.metadata?.price ?? 0),
    quantity: item.quantity,
    color: item.metadata?.color ?? 'default',
    size: item.metadata?.size ?? '',
    image: item.metadata?.image ?? '',
  }));
}

export const CartService = {
  detectCartSchema,

  async syncCart(
    userId: string,
    items: CartItem[],
    email?: string | null
  ): Promise<CartSyncResult> {
    try {
      const schema = await detectCartSchema();

      if (schema === 'crm') {
        return await syncCrmCart(userId, items, email);
      }
      if (schema === 'legacy') {
        return await syncLegacyCart(userId, items);
      }

      return {
        success: true,
        skipped: true,
        schema: 'unknown',
        reason: 'schema_unknown',
      };
    } catch (error) {
      console.error('Cart sync error (soft):', error);
      return { success: true, skipped: true, error, reason: 'exception' };
    }
  },

  async getCart(userId: string, _email?: string | null): Promise<CartItem[]> {
    try {
      const schema = await detectCartSchema();
      if (schema === 'legacy') return await getLegacyCart(userId);
      return [];
    } catch (e) {
      console.error('CartService.getCart error:', e);
      return [];
    }
  },
};
