export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  imageSrc: string;
  category: string;
}

export interface WishlistState {
  items: WishlistItem[];
}
