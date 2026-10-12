/**
 * Dev-mode Supabase stub — placeholder returned when env vars are missing.
 * Returns empty/null so the app can boot safely.
 */

let warned = false;

function warnOnce(label: string) {
  if (warned) return;
  warned = true;
  console.warn(
    `[Supabase Stub:${label}] Supabase env vars not configured — ` +
    'returning empty data. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for real data.'
  );
}

function stubResult(data: unknown = null) {
  return Promise.resolve({ data, error: null, count: null });
}

function createSubNode(promiseResult: Promise<any>): any {
  return new Proxy(() => {}, {
    apply() {
      return createSubNode(promiseResult);
    },
    get(_, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        const val = Reflect.get(promiseResult, prop);
        return typeof val === 'function' ? val.bind(promiseResult) : val;
      }
      return createSubNode(promiseResult);
    },
  });
}

export function createStubSupabase(label = 'default'): any {
  warnOnce(label);
  const result = stubResult(null);

  return new Proxy({}, {
    get(_, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return undefined;
      }
      return createSubNode(result);
    },
  });
}

export function createStubClient(label = 'default'): any {
  warnOnce(label);
  const clientResult = stubResult(null);
  const authResult = stubResult({ session: null, user: null });

  return new Proxy({}, {
    get(_, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return undefined;
      }
      if (prop === 'auth') {
        return createSubNode(authResult);
      }
      return createSubNode(clientResult);
    },
  });
}
