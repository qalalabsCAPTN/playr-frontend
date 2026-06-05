import { NectarTenantClient, nectarClient } from './tenant';

export interface PurchaseCompletedPayload {
  orderId: string;
  userId: string;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  timestamp: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export class NectarEventPublisher {
  private client: NectarTenantClient;

  constructor(client: NectarTenantClient = nectarClient) {
    this.client = client;
  }

  async emitPurchaseCompleted(payload: PurchaseCompletedPayload): Promise<void> {
    try {
      await this.client.post('/api/events/purchase.completed', payload);
      console.log(`[NECTAR EVENT] purchase.completed emitted for order ${payload.orderId}`);
    } catch (e) {
      console.error(`[NECTAR EVENT ERROR] Failed to emit purchase.completed for order ${payload.orderId}`, e);
      // In a real system we would implement retry logic or DLQ
      // For now we don't throw to prevent breaking the UX if event ingestion is down
    }
  }
}

export const eventPublisher = new NectarEventPublisher();
