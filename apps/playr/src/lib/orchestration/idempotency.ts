/* eslint-disable no-unused-vars */
import { createAdminClient } from '@/lib/supabase/admin';

const IDEMPOTENCY_TABLE = 'idempotency_keys';

export async function idempotencyGuard(
  key: string,
  options: { ttl?: number } = {}
): Promise<{
  canProceed: boolean;
  existingData: unknown;
  complete(data?: unknown): Promise<void>;
  fail(error?: string): Promise<void>;
}> {
  const ttl = options.ttl ?? 3600;
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      canProceed: true,
      existingData: null,
      complete: async () => {},
      fail: async () => {},
    };
  }

  try {
    const { data: existing, error: insertError } = await admin
      .from(IDEMPOTENCY_TABLE)
      .upsert(
        {
          key,
          status: 'processing',
          data: null,
          expires_at: expiresAt,
        },
        {
          onConflict: 'key',
          ignoreDuplicates: true,
        }
      )
      .select('*')
      .single();

    if (insertError?.message?.includes('duplicate') || !existing || existing.status !== 'processing') {
      const { data: record } = await admin
        .from(IDEMPOTENCY_TABLE)
        .select('*')
        .eq('key', key)
        .single();

      if (record && record.status === 'completed') {
        return {
          canProceed: false,
          existingData: record.data,
          complete: async () => {},
          fail: async () => {},
        };
      }
    }
  } catch {
    // If table doesn't exist, proceed gracefully
  }

  return {
    canProceed: true,
    existingData: null,
    complete: async (data?: unknown) => {
      try {
        await admin
          .from(IDEMPOTENCY_TABLE)
          .update({ status: 'completed', data: data ?? null })
          .eq('key', key);
      } catch {
        // Idempotency update is best effort
      }
    },
    fail: async (error?: string) => {
      try {
        await admin
          .from(IDEMPOTENCY_TABLE)
          .update({ status: 'failed', data: { error } })
          .eq('key', key);
      } catch {
        // Idempotency update is best effort
      }
    },
  };
}
