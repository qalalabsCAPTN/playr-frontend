import { getUnicommerceConfig } from './config';
import { UnicommerceLogger } from './logging';
import { UnicommerceOrderService } from './orders';
import { UnicommerceWebhookService } from './webhooks';
import { soapRequest } from './soapClient';

export class UnicommerceService {
  public static readonly config = getUnicommerceConfig();
  public static readonly logger = UnicommerceLogger;
  public static readonly orders = new UnicommerceOrderService();
  public static readonly webhooks = new UnicommerceWebhookService();

  public static async checkConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const config = getUnicommerceConfig();
      if (config.isDemoMode || !config.password) {
        return { success: true, message: 'Connected in Demo/Mock mode' };
      }

      // Probe check with GetItemTypeRequest or facility ping
      const probeSku = process.env.UNICOMMERCE_PROBE_SKU || 'PR-PRO-TEE-M';
      await soapRequest(
        'GetItemTypeRequest',
        `<ser:GetItemTypeRequest><ser:SkuCode>${probeSku}</ser:SkuCode></ser:GetItemTypeRequest>`
      );
      return { success: true, message: `SOAP Connection successful (${probeSku})` };
    } catch (err: any) {
      return { success: false, message: `Connection test failed: ${err.message}` };
    }
  }
}

export * from './types';
export { getUnicommerceConfig, buildUnicommerceSoapUrl } from './config';
export { UnicommerceLogger } from './logging';
export { forwardPaidOrderToUnicommerce } from './forward';
