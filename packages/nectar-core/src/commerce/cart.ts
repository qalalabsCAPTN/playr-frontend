export interface CartItem {
  id: string; // unique line item id
  productId: string;
  variantId: string;
  title: string;
  price: number;
  imageSrc: string;
  colorName: string;
  size: string;
  quantity: number;
  isPersonalized?: boolean;
  playerName?: string;
  playerNumber?: string;
  previewImageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  total: number;
  estimatedShipping: number | 'calculated_at_checkout';
}

export const MockCartService = {
  calculateSubtotal: (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};
