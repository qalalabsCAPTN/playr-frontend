/**
 * Unicommerce (Uniware) Types for playR
 */

export interface UnicommerceConfig {
  apiUrl: string;
  clientId: string;
  username: string;
  password: string;
  facilityCode: string;
  webhookSecret: string;
  isDemoMode: boolean;
  transportMode: 'REST' | 'SOAP';
}

export interface UniwareOrderItem {
  sku: string;
  name?: string;
  price: number;
  quantity: number;
  taxAmount?: number;
  discountAmount?: number;
}

export interface UniwareAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone?: string;
  email?: string;
}

export interface UniwareOrderCreateRequest {
  id: string;
  displayCode: string;
  createdAt: string;
  currency: string;
  paymentMethod: 'COD' | 'PREPAID';
  shippingAddress: UniwareAddress;
  billingAddress?: UniwareAddress;
  items: UniwareOrderItem[];
  grandTotal?: number;
}

export interface UniwareOrderCreateResponse {
  successful: boolean;
  code?: string;
  message?: string;
  errors?: Array<{ code: string; message: string }>;
  saleOrderDTO?: {
    code: string;
    displayOrderCode: string;
    status: string;
  };
}

export interface UniwareInventorySnapshot {
  sku: string;
  available: number;
  reserved: number;
  total: number;
  facilityCode: string;
}
