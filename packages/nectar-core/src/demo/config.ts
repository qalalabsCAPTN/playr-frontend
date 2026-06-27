export const DemoConfig = {
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',

  identity: {
    getProfile: () => ({
      id: "demo_usr_1",
      firstName: "Aayush",
      lastName: "Singh",
      email: "aayush.singh@example.com",
      phone: "+91 9876543210",
      memberSince: new Date().getFullYear()
    }),
    getOrders: () => [
      {
        id: "ord_1",
        displayId: "PR-99231",
        date: "2024-05-15T10:00:00Z",
        status: "delivered" as const,
        total: 799,
        items: [
          {
            id: "item_1",
            productId: "prod_1",
            title: "Performance Polo",
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
        status: "delivered" as const,
        total: 1299,
        items: [
          {
            id: "item_2",
            productId: "prod_2",
            title: "Aero Performance Shorts",
            imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI",
            price: 1299,
            quantity: 1,
            colorName: "Black",
            size: "L"
          }
        ]
      }
    ]
  },

  loyalty: {
    getWalletBalance: () => ({
      balance: 500, 
      currency: 'INR',
      transactions: [
        { id: "wt_1", date: "2024-05-15T10:00:00Z", amount: 200, type: "credit" as const, description: "Refund for PR-98112" },
        { id: "wt_2", date: "2024-05-01T10:00:00Z", amount: 300, type: "credit" as const, description: "Promotional Credit" }
      ]
    }),
    getRewardsPoints: () => ({
      points: 1250, 
      tier: 'silver' as const,
      nextTierPoints: 1500,
      transactions: [
        { id: "rt_1", date: "2024-05-15T10:00:00Z", points: 80, type: "earned" as const, description: "Order PR-99231" },
        { id: "rt_2", date: "2024-05-02T14:30:00Z", points: 130, type: "earned" as const, description: "Order PR-99104" }
      ]
    })
  },

  catalog: {
    getFallbackProducts: () => [
      {
        id: 'demo-1',
        slug: 'pro-training-tee',
        title: 'Pro Training Tee',
        description: 'Elite training apparel.',
        category: 'Men',
        price: 1299,
        imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0',
        gallery: [],
        variants: [],
        colors: [{ name: 'Navy', hex: '#000080' }],
        sizes: ['S', 'M', 'L'],
        specifications: [],
        materialAndCare: { material: '', care: '' },
        loyaltyPoints: 100
      },
      {
        id: 'demo-2',
        slug: 'csk-match-jersey',
        title: 'CSK Match Jersey 2026',
        description: 'Official replica.',
        category: 'Club',
        price: 1799,
        imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA',
        gallery: [],
        variants: [],
        colors: [{ name: 'Yellow', hex: '#FFFF00' }],
        sizes: ['M', 'L', 'XL'],
        specifications: [],
        materialAndCare: { material: '', care: '' },
        loyaltyPoints: 150
      }
    ],
    getTrendingProducts: () => [
      { 
        id: '1', 
        slug: 'pro-training-tee', 
        title: 'Pro Training Tee', 
        price: 1299, 
        category: 'Men',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0'
      },
      { 
        id: '2', 
        slug: 'csk-match-jersey', 
        title: 'CSK Match Jersey 2026', 
        price: 1799, 
        category: 'Club',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA'
      },
      { 
        id: '3', 
        slug: 'performance-shorts', 
        title: 'Aero Performance Shorts', 
        price: 1499, 
        category: 'Men',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI'
      },
      { 
        id: '4', 
        slug: 'women-training-tight', 
        title: 'Flex Training Tights', 
        price: 1899, 
        category: 'Women',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHnQtwR5L8FTSM8nZwnXrNkfFKKiHIQQEvWKMaSXEx2yp3s340yuJxw-nQHhIXUgm8mEgSGP_FhdoAgZsmVLv5mTaVp20sszZuAs6i70rclHJO8TWhQUokwfxWswqCkEIMo-j1C6b23j2FcsSBWUbSokWjV089O-4BcWpqaQVpy5VAgbiJiiKRmFquF-6ixcZAB5MkdX6d3IQJ3axJ6K5OVUI-5atLSvwOfx-o99FMJlXRdyPcRw7FojB5YgMAVzRCr1NtXbYf4HE'
      }
    ]
  },

  community: {
    getFeed: () => [
      {
        id: "f1",
        userId: "usr_1",
        displayName: "Aayush Singh",
        avatarUrl: null,
        action: "purchase" as const,
        metadata: { productTitle: "Performance Polo", productSlug: "performance-polo", xpEarned: 150 },
        createdAt: "10 mins ago"
      },
      {
        id: "f2",
        userId: "usr_2",
        displayName: "Karan M.",
        avatarUrl: null,
        action: "challenge_complete" as const,
        metadata: { challengeTitle: "Weekend Warrior", xpEarned: 500 },
        createdAt: "1 hour ago"
      },
      {
        id: "f3",
        userId: "usr_3",
        displayName: "Neha S.",
        avatarUrl: null,
        action: "tier_up" as const,
        metadata: { newTier: "Elite Tier Member" },
        createdAt: "2 hours ago"
      },
      {
        id: "f4",
        userId: "usr_1",
        displayName: "Aayush Singh",
        avatarUrl: null,
        action: "review" as const,
        metadata: { productTitle: "Pro Grip Gloves", xpEarned: 50 },
        createdAt: "1 day ago"
      }
    ]
  },

  logistics: {
    getShipment: (id: string) => ({
      id: 'TRK-12345',
      orderId: id.startsWith('PR-') ? id : 'PR-882931',
      carrier: 'FedEx Express Priority',
      estimatedDelivery: '2024-10-24T18:00:00Z',
      currentStatus: 'In Transit' as const,
      milestones: [
        {
          id: 'm1',
          status: 'Ordered' as const,
          date: '2024-10-18T09:42:00Z',
          location: 'Warehouse, Mumbai Distribution Center',
          description: 'Order Processed',
          isCompleted: true
        },
        {
          id: 'm2',
          status: 'Shipped' as const,
          date: '2024-10-20T14:15:00Z',
          location: 'Carrier: FedEx Express Priority',
          description: 'Shipped',
          isCompleted: true
        },
        {
          id: 'm3',
          status: 'In Transit' as const,
          date: '2024-10-21T23:30:00Z',
          location: 'Sort Facility, New Delhi',
          description: 'In Transit - Arrived at Facility',
          isCompleted: true
        },
        {
          id: 'm4',
          status: 'Out For Delivery' as const,
          date: '',
          location: '',
          description: 'Pending',
          isCompleted: false
        },
        {
          id: 'm5',
          status: 'Delivered' as const,
          date: '',
          location: '',
          description: 'Pending',
          isCompleted: false
        }
      ]
    })
  }
};
