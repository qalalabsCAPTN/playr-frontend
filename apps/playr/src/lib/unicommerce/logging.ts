import { recordEvent } from '@/lib/orchestration/events';

export class UnicommerceLogger {
  private static context = 'unicommerce-integration';

  static async info(action: string, message: string, resourceId = 'system', metadata: Record<string, any> = {}): Promise<void> {
    console.log(`[Unicommerce][INFO] ${action}: ${message}`, metadata);
    await recordEvent({
      domain: 'fulfillment',
      severity: 'info',
      action: `unicommerce.${action}`,
      resourceType: 'unicommerce',
      resourceId,
      message,
      metadata: { ...metadata, context: this.context },
    });
  }

  static async warn(action: string, message: string, resourceId = 'system', metadata: Record<string, any> = {}): Promise<void> {
    console.warn(`[Unicommerce][WARN] ${action}: ${message}`, metadata);
    await recordEvent({
      domain: 'fulfillment',
      severity: 'warning',
      action: `unicommerce.${action}`,
      resourceType: 'unicommerce',
      resourceId,
      message,
      metadata: { ...metadata, context: this.context },
    });
  }

  static async error(action: string, message: string, error: any, resourceId = 'system', metadata: Record<string, any> = {}): Promise<void> {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[Unicommerce][ERROR] ${action}: ${message} (${errorMsg})`, metadata);
    await recordEvent({
      domain: 'fulfillment',
      severity: 'error',
      action: `unicommerce.${action}`,
      resourceType: 'unicommerce',
      resourceId,
      message: `${message}: ${errorMsg}`,
      metadata: { ...metadata, error: errorMsg, context: this.context },
    });
  }
}
