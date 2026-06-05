export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
}

export type PaymentMethod = 'credit_card' | 'upi' | 'cod' | 'razorpay' | 'ccavenue';
export type ShippingMethod = 'standard' | 'express';

export interface CheckoutState {
  email: string;
  shippingAddress: ShippingAddress | null;
  useSameForBilling: boolean;
  billingAddress: ShippingAddress | null;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  promoCode: string | null;
  appliedWallet: number;
  appliedRewards: number;
  isProcessing: boolean;
  error: string | null;
}

export const MockCheckoutService = {
  calculateShipping: (method: ShippingMethod): number => {
    return method === 'express' ? 150 : 0;
  },
  validateAddress: (address: ShippingAddress): boolean => {
    return Object.values(address).every(val => val.trim().length > 0);
  },
  processPayment: async (method: PaymentMethod, amount: number): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
  }
};
