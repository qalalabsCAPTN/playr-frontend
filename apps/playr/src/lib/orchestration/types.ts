/**
 * Shared Orchestration Types for playR
 */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'fulfilling'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentEventType =
  | 'payment_intent.created'
  | 'payment_intent.processing'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'payment_intent.canceled'
  | 'payment_intent.expired'
  | 'charge.refunded'
  | 'charge.disputed';

export type PaymentProvider = 'easebuzz' | 'razorpay' | 'cod' | 'nectar';

export type EventDomain = 'order' | 'payment' | 'inventory' | 'fulfillment' | 'loyalty' | 'system';
export type EventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface OrchestrationResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface OperationalEvent {
  id?: string;
  domain: EventDomain;
  severity: EventSeverity;
  action: string;
  actorId?: string;
  resourceType: string;
  resourceId: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}
