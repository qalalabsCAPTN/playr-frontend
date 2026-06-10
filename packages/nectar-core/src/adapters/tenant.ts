export class NectarTenantClient {
  private baseUrl: string;
  private brandId: string;
  private defaultTimeoutMs: number = 8000;
  private maxRetries: number = 3;

  constructor(options?: { baseUrl?: string; brandId?: string }) {
    this.baseUrl = options?.baseUrl || process.env.NEXT_PUBLIC_NECTAR_API_URL || 'https://api.nectar.local';
    this.brandId = options?.brandId || process.env.NEXT_PUBLIC_BRAND_ID || 'playr';
  }

  private async fetchWithRetry(url: string, options: RequestInit = {}, retries: number = this.maxRetries): Promise<Response> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.defaultTimeoutMs);

      const response = await globalThis.fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok && response.status >= 500 && retries > 0) {
        throw new Error(`Server error: ${response.status}`);
      }

      return response;
    } catch (error: any) {
      if (retries > 0 && (error.name === 'AbortError' || error.message.includes('Server error'))) {
        const backoff = (this.maxRetries - retries + 1) * 1000;
        await new Promise(res => setTimeout(res, backoff));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers || {});
    headers.set('x-brand-id', this.brandId);
    
    // Auto-inject JSON headers if we have a body and no content-type is set
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    return this.fetchWithRetry(url, { ...options, headers });
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await this.fetch(endpoint, { ...options, method: 'GET' });
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
    }
    return response.json();
  }
}

export const nectarClient = new NectarTenantClient();
