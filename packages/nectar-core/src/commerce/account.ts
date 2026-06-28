export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  imageSrc: string;
  price: number;
  quantity: number;
  colorName: string;
  size: string;
  isPersonalized?: boolean;
  playerName?: string;
  playerNumber?: string;
  previewImageUrl?: string;
}

export interface Order {
  id: string;
  displayId: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

import { getDbUserById, getDbOrdersByUserId } from '../db/db';

export const MockAccountService = {
  getProfile: async (userId: string = 'real_usr_8f92a'): Promise<UserProfile> => {
    if (typeof window === 'undefined') {
      const user = await getDbUserById(userId);
      if (user) return user as any;
    }

    try {
      const res = await fetch(`/api/identity/users/${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("MockAccountService.getProfile fetch failed, returning client fallback");
    }

    return {
      id: userId,
      firstName: "Dev",
      lastName: "Karan",
      email: "demo@playr.in",
      phone: "+91 9998887776",
      memberSince: 2025
    };
  },
  
  getOrders: async (userId: string = 'real_usr_8f92a'): Promise<Order[]> => {
    if (typeof window === 'undefined') {
      return await getDbOrdersByUserId(userId) as any[];
    }

    try {
      const res = await fetch(`/api/identity/users/${userId}/orders`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("MockAccountService.getOrders fetch failed, returning empty client fallback");
    }

    return [];
  }
};
