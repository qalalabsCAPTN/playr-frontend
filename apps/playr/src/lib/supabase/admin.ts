import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createStubSupabase } from './stub';

/**
 * Admin Supabase client — uses SUPABASE_SERVICE_ROLE_KEY for privileged operations.
 * Never expose to browser client bundle.
 */
export function createAdminClient(): SupabaseClient<any, any, any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sayxtpglwjiinnrftifq.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || process.env.NEXT_PHASE === 'phase-action-build') {
    return createStubSupabase('admin');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
