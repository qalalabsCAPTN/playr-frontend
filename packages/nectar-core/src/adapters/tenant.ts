export class NectarTenantClient {
  private baseUrl: string;
  private brandId: string;

  constructor(options?: { baseUrl?: string; brandId?: string }) {
    this.baseUrl = options?.baseUrl || process.env.NEXT_PUBLIC_NECTAR_API_URL || 'https://api.nectar.local';
    this.brandId = options?.brandId || process.env.NEXT_PUBLIC_BRAND_ID || 'playr';
  }

  async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers || {});
    headers.set('x-brand-id', this.brandId);
    
    // Auto-inject JSON headers if we have a body and no content-type is set
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    return globalThis.fetch(url, {
      ...options,
      headers
    });
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await this.fetch(endpoint, { ...options, method: 'GET' });
    if (!response.ok) throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
    return response.json();
  }

  async post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
    return response.json();
  }
}

export const nectarClient = new NectarTenantClient();
