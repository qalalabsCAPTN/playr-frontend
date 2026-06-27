import { NectarTenantClient, nectarClient } from './tenant';
import { UserProfile, Order } from '../commerce/account';
import { getDbUserById, getDbOrdersByUserId } from '../db/db';

export class NectarIdentityAdapter {
  private client: NectarTenantClient;

  constructor(client: NectarTenantClient = nectarClient) {
    this.client = client;
  }

  async getProfile(userId: string): Promise<UserProfile> {
    if (typeof window === 'undefined') {
      const user = await getDbUserById(userId);
      if (user) return user;
    }

    try {
      return await this.client.get<UserProfile>(`/api/identity/users/${userId}`);
    } catch (e) {
      console.warn("NectarIdentityAdapter.getProfile failed, returning client fallback", e);
      const { DemoConfig } = await import('../demo/config');
      return DemoConfig.identity.getProfile();
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    if (typeof window === 'undefined') {
      return (await getDbOrdersByUserId(userId)) as Order[];
    }

    try {
      return await this.client.get<Order[]>(`/api/identity/users/${userId}/orders`);
    } catch (e) {
      console.warn("NectarIdentityAdapter.getOrders failed, returning empty client fallback", e);
      return [];
    }
  }
}

export const identityAdapter = new NectarIdentityAdapter();
