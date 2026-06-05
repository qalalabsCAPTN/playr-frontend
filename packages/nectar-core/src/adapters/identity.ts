import { NectarTenantClient, nectarClient } from './tenant';
import { UserProfile, Order } from '../commerce/account';

export class NectarIdentityAdapter {
  private client: NectarTenantClient;

  constructor(client: NectarTenantClient = nectarClient) {
    this.client = client;
  }

  async getProfile(userId: string): Promise<UserProfile> {
    try {
      return await this.client.get<UserProfile>(`/api/identity/users/${userId}`);
    } catch (e) {
      console.warn("NectarIdentityAdapter.getProfile failed, returning fallback for dev", e);
      // Fallback for development since we don't have a live NECTAR backend yet
      return {
        id: userId,
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+91 9876543210",
        memberSince: new Date().getFullYear()
      };
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    try {
      return await this.client.get<Order[]>(`/api/identity/users/${userId}/orders`);
    } catch (e) {
      console.warn("NectarIdentityAdapter.getOrders failed, returning fallback for dev", e);
      return [];
    }
  }
}

export const identityAdapter = new NectarIdentityAdapter();
