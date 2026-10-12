import { createAdminClient } from '@/lib/supabase/admin';

export async function syncSprrBalanceFromNectar(userId: string): Promise<{
  balance: number;
  source: 'nectar' | 'cache' | 'fallback';
  synced: boolean;
}> {
  const nectarUrl =
    process.env.NECTAR_API_URL ||
    process.env.NEXT_PUBLIC_NECTAR_API_URL ||
    'https://nectar-api-1081952187019.asia-south1.run.app';

  const token =
    process.env.NECTAR_SIGNING_SECRET ||
    process.env.PLATFORM_TOKEN_PLAYR ||
    process.env.PLATFORM_TOKEN_STREETPLAYR;

  try {
    const res = await fetch(`${nectarUrl.replace(/\/$/, '')}/v1/wallet/${encodeURIComponent(userId)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Nectar-Platform': process.env.NEXT_PUBLIC_BRAND_ID || 'playr',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      const balance = typeof data.balance === 'number' ? data.balance : (data.points ?? 0);

      // Cache balance in Supabase customer/profile record if available
      try {
        const admin = createAdminClient();
        await admin
          .from('profiles')
          .update({ loyalty_points: balance, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch {
        // Profile update is optional
      }

      return { balance, source: 'nectar', synced: true };
    }
  } catch (err: any) {
    console.warn('[nectar] Could not sync balance from remote API:', err?.message);
  }

  // Fallback to locally stored profile loyalty points
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('loyalty_points')
      .eq('id', userId)
      .maybeSingle();

    if (profile && typeof profile.loyalty_points === 'number') {
      return { balance: profile.loyalty_points, source: 'cache', synced: false };
    }
  } catch {
    // Local profile check is optional
  }

  return { balance: 0, source: 'fallback', synced: false };
}
