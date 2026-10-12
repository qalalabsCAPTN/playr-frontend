/**
 * Environment-based configuration for the Unicommerce (Uniware) integration.
 */

import type { UnicommerceConfig } from './types';

export function normalizeUnicommerceApiUrl(raw: string | undefined | null): string {
  const trimmed = String(raw ?? '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return `${parsed.protocol}//${parsed.host}${parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '')}`;
  } catch {
    return '';
  }
}

export function buildUnicommerceSoapUrl(apiUrl: string, facilityCode?: string): string {
  const base = normalizeUnicommerceApiUrl(apiUrl) || 'https://playr.unicommerce.com';
  const endpoint = new URL('services/soap/', `${base}/`);
  endpoint.searchParams.set('version', '1.9');
  if (facilityCode) endpoint.searchParams.set('facility', facilityCode);
  return endpoint.toString();
}

export function isUnicommerceLiveConfigured(config?: UnicommerceConfig): boolean {
  const c = config ?? getUnicommerceConfig();
  return Boolean(normalizeUnicommerceApiUrl(c.apiUrl) && c.username && c.password);
}

export function getUnicommerceConfig(): UnicommerceConfig {
  const isDemoMode = process.env.DEMO_INVENTORY_MODE === 'true';

  const apiUrl = normalizeUnicommerceApiUrl(process.env.UNICOMMERCE_API_URL) || 'https://playr.unicommerce.com';
  const clientId = process.env.UNICOMMERCE_CLIENT_ID || 'my-trusted-client';
  const username = process.env.UNICOMMERCE_USERNAME || 'streetplayr';
  const password = process.env.UNICOMMERCE_PASSWORD || '';
  const facilityCode = process.env.UNICOMMERCE_FACILITY_CODE || 'playR_Delhi';
  const webhookSecret = process.env.UNICOMMERCE_WEBHOOK_SECRET || '';
  const transportMode = (process.env.UNICOMMERCE_TRANSPORT_MODE === 'REST' ? 'REST' : 'SOAP') as 'REST' | 'SOAP';

  return {
    apiUrl,
    clientId,
    username,
    password,
    facilityCode,
    webhookSecret,
    isDemoMode,
    transportMode,
  };
}
