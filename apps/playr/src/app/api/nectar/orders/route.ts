import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { data: orders } = await admin
      .from('orders')
      .select('id, order_number, grand_total, status, payment_status, created_at')
      .or(`customer_id.eq.${userId},notes.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({ orders: orders || [] });
  } catch (err: any) {
    return NextResponse.json({ orders: [], error: err?.message }, { status: 200 });
  }
}
