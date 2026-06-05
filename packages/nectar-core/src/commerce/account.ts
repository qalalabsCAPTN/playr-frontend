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
}

export interface Order {
  id: string;
  displayId: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export const MockAccountService = {
  getProfile: async (): Promise<UserProfile> => {
    return {
      id: "usr_1",
      firstName: "Arjun",
      lastName: "Sharma",
      email: "arjun.sharma@example.com",
      phone: "+91 9876543210",
      memberSince: 2024
    };
  },
  
  getOrders: async (): Promise<Order[]> => {
    return [
      {
        id: "ord_1",
        displayId: "PR-99231",
        date: "2024-05-15T10:00:00Z",
        status: "delivered",
        total: 799,
        items: [
          {
            id: "item_1",
            productId: "prod_1",
            title: "Basico Polo Tshirt",
            imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0",
            price: 799,
            quantity: 1,
            colorName: "Navy",
            size: "M"
          }
        ]
      },
      {
        id: "ord_2",
        displayId: "PR-99104",
        date: "2024-05-02T14:30:00Z",
        status: "delivered",
        total: 1299,
        items: [
          {
            id: "item_2",
            productId: "prod_2",
            title: "Accu-Run Lower",
            imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI",
            price: 1299,
            quantity: 1,
            colorName: "Black",
            size: "L"
          }
        ]
      }
    ];
  }
};
