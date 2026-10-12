import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { createStubClient } from './stub';

export function createClient(): SupabaseClient<any, any, any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sayxtpglwjiinnrftifq.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || (url && url.includes('mockproject'))) {
    return createStubClient('browser');
  }

  return createSupabaseClient(url, key);
}
