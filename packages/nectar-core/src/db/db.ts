import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client if env is present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = supabaseUrl && supabaseKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Local JSON File DB config - statically analyzable to prevent Next.js node-file-trace from bundling the whole project
function getDbFilePath(): string {
  if (typeof window !== 'undefined') {
    return 'db_store.json';
  }
  return process.env.VERCEL
    ? path.resolve(process.cwd(), '..', '..', 'db_store.json')
    : fs.existsSync(path.resolve(process.cwd(), 'db_store.json'))
      ? path.resolve(process.cwd(), 'db_store.json')
      : path.join('c:', 'Users', 'pc', 'Desktop', 'playR', 'db_store.json');
}

// Default Seed Data
const DEFAULT_PRODUCTS = [
  {
    id: 'prod_pro_tee',
    slug: 'pro-training-tee',
    title: 'Pro Training Tee',
    description: 'Born from a passion for sports and engineered with cutting-edge fabric technology. Elite training apparel engineered for maximum mobility.',
    category: 'Men',
    price: 1299,
    compareAtPrice: 1599,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI'
    ],
    variants: [{ id: 'var-1', sku: 'PR-PRO-TEE-M', price: 1299, inventory: 85 }],
    colors: [{ name: 'Navy', hex: '#000080' }, { name: 'Carbon Gray', hex: '#333333' }],
    sizes: ['S', 'M', 'L', 'XL'],
    specifications: ['AERODRY Breathable Tech', 'Flatlock Ergonomic Seams', 'UV Protection Index 50+'],
    materialAndCare: { material: '100% Recycled Technical Polyester', care: 'Machine wash cold. Tumble dry low.' }
  },
  {
    id: 'prod_csk_jersey',
    slug: 'csk-match-jersey',
    title: 'CSK Match Jersey 2026',
    description: 'Experience the same premium specifications as the professional players on the field. Personalizable with custom player name and number.',
    category: 'Club',
    price: 1799,
    compareAtPrice: 2199,
    badge: '18% OFF',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA'
    ],
    variants: [{ id: 'var-2', sku: 'PR-CSK-JER-L', price: 1799, inventory: 40 }],
    colors: [{ name: 'CSK Yellow', hex: '#FFFF00' }],
    sizes: ['M', 'L', 'XL'],
    specifications: ['Official Licensed Merchandise', 'Sublimated High Definition Logo print', 'Athletic Fit'],
    materialAndCare: { material: '100% Interlock Mesh Polyester', care: 'Do not iron on prints. Hand wash suggested.' }
  },
  {
    id: 'prod_shorts',
    slug: 'performance-shorts',
    title: 'Aero Performance Shorts',
    description: 'Engineered lightweight athletic shorts featuring dynamic stretch and sweat-wicking materials.',
    category: 'Men',
    price: 1499,
    compareAtPrice: 1799,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI'
    ],
    variants: [{ id: 'var-3', sku: 'PR-SHORTS-L', price: 1499, inventory: 60 }],
    colors: [{ name: 'Deep Black', hex: '#1a1a1a' }],
    sizes: ['M', 'L', 'XL'],
    specifications: ['Dynamic Stretch Tech', 'Rear zipper pocket', 'Internal drawcord'],
    materialAndCare: { material: '88% Nylon, 12% Spandex', care: 'Machine wash warm.' }
  },
  {
    id: 'prod_rr_jersey',
    slug: 'rr-match-jersey',
    title: 'RR Match Jersey 2026',
    description: 'The official player edition Rajasthan Royals match jersey. Designed with AERODRY moisture management tech to handle intense play sessions.',
    category: 'Club',
    price: 1799,
    compareAtPrice: 2199,
    badge: 'NEW',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA'
    ],
    variants: [{ id: 'var-4', sku: 'PR-RR-JER-M', price: 1799, inventory: 50 }],
    colors: [{ name: 'Royal Pink', hex: '#FF69B4' }],
    sizes: ['S', 'M', 'L', 'XL'],
    specifications: ['Official RR merchandise', 'Dynamic stretch dry-tech fabric', 'UV 40+ protection'],
    materialAndCare: { material: '100% Technical Polyester', care: 'Gentle hand wash inside out.' }
  },
  {
    id: 'prod_mi_jersey',
    slug: 'mi-match-jersey',
    title: 'MI Match Jersey 2026',
    description: 'Celebrate the spirit of the game with the all-new Mumbai Indians fan wear. Engineered with breathable fabrics and gold accents.',
    category: 'Club',
    price: 1799,
    compareAtPrice: 2199,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA'
    ],
    variants: [{ id: 'var-5', sku: 'PR-MI-JER-L', price: 1799, inventory: 45 }],
    colors: [{ name: 'Cobalt Blue', hex: '#0000FF' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    specifications: ['Official MI merchandise', 'Sublimated high-definition graphics', 'Athletic Fit'],
    materialAndCare: { material: '100% Recycled Polyester', care: 'Machine wash cold.' }
  },
  {
    id: 'prod_premium_polo',
    slug: 'premium-performance-polo',
    title: 'Basico Performance Polo',
    description: 'Clean aesthetics combined with technical performance. Ideal for golf, tennis, pickleball, or styled streetwear.',
    category: 'Men',
    price: 1599,
    compareAtPrice: 1999,
    badge: 'POPULAR',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0'
    ],
    variants: [{ id: 'var-6', sku: 'PR-PMPOLO-M', price: 1599, inventory: 60 }],
    colors: [{ name: 'Deep Navy', hex: '#111e38' }, { name: 'Frost White', hex: '#f4f6f9' }],
    sizes: ['S', 'M', 'L', 'XL'],
    specifications: ['Anti-odor silver yarn technology', 'Ribbed knit collar with 3-button placket', 'Laser-cut hem vents'],
    materialAndCare: { material: '92% Polyester, 8% Elastane', care: 'Machine wash cold. Do not bleach.' }
  },
  {
    id: 'prod_pickleball_paddle',
    slug: 'pro-spike-paddle',
    title: 'Pro Spike Pickleball Paddle',
    description: 'Dominate the court with tournament-grade carbon fiber grit surface paddles, offering optimal spin and power.',
    category: 'Accessories',
    price: 3499,
    compareAtPrice: 3999,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI'
    ],
    variants: [{ id: 'var-7', sku: 'PR-PADDLE-PB', price: 3499, inventory: 25 }],
    colors: [{ name: 'Volt Yellow', hex: '#ccff00' }],
    sizes: ['OS'],
    specifications: ['Raw carbon fiber face', 'Honeycomb polypropylene core', 'Aero-cushioned grip wrap'],
    materialAndCare: { material: 'Toray T700 Carbon Fiber', care: 'Clean with damp cloth. Store in cover.' }
  },
  {
    id: 'prod_cricket_kitbag',
    slug: 'champ-cricket-kitbag',
    title: 'playR Champ Cricket Kitbag',
    description: 'Spacious wheelie gear bag built for active cricket players. Multiple compartments for bats, protective pads, and footwear.',
    category: 'Accessories',
    price: 2999,
    compareAtPrice: 3499,
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI'
    ],
    variants: [{ id: 'var-8', sku: 'PR-KITBAG-CR', price: 2999, inventory: 30 }],
    colors: [{ name: 'Stealth Black', hex: '#000000' }],
    sizes: ['OS'],
    specifications: ['1680D heavy duty water-resistant nylon', 'Tractor wheels for easy transit', 'Thermo-insulated bat sleeve'],
    materialAndCare: { material: 'Heavy Duty 1680D Polyester', care: 'Wipe down with dry cloth.' }
  }
];

const DEFAULT_COUPONS = [
  { id: 'c1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, isActive: true },
  { id: 'c2', code: 'PLAYR500', discountType: 'fixed', discountValue: 500, isActive: true }
];

const DEFAULT_USERS = [
  {
    id: 'real_usr_8f92a',
    email: 'user@playr.in',
    password: 'password',
    firstName: 'Aayush',
    lastName: 'Singh',
    phone: '+91 9876543210',
    memberSince: 2024,
    walletBalance: 500,
    rewardsPoints: 1250,
    tier: 'silver',
    xp: 1250,
    addresses: [
      { id: 'addr_1', label: 'Home', address: 'B-12, Green Park Extension, Near Hauz Khas Metro Station, New Delhi, Delhi - 110016, India' }
    ]
  },
  {
    id: 'admin_usr_2911b',
    email: 'admin@playr.in',
    password: 'adminpassword',
    firstName: 'System',
    lastName: 'Admin',
    phone: '+91 9999999999',
    memberSince: 2023,
    walletBalance: 0,
    rewardsPoints: 0,
    tier: 'elite',
    xp: 10000,
    addresses: []
  },
  {
    id: 'demo_usr_qa123',
    email: 'demo@playr.in',
    password: 'Demo@123',
    firstName: 'Dev',
    lastName: 'Karan',
    phone: '+91 9998887776',
    memberSince: 2025,
    walletBalance: 2450,
    rewardsPoints: 4200,
    tier: 'elite',
    xp: 5420,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
    dob: '1995-08-15',
    gender: 'Male',
    sportPreference: 'Cricket',
    favCategory: 'Men',
    favTeam: 'CSK',
    jerseySize: 'L',
    emailPromo: true,
    smsPromo: true,
    rewardsSummary: true,
    language: 'en',
    privacyProfileVisible: true,
    twoFactorEnabled: false,
    addresses: [
      { id: 'demo_addr_1', label: 'Home', address: 'B-12, Green Park Extension, Near Hauz Khas Metro Station, New Delhi, Delhi - 110016, India' },
      { id: 'demo_addr_2', label: 'Office', address: 'Plot 4, Institutional Area, Sector 32, Gurgaon, Haryana - 122001, India' },
      { id: 'demo_addr_3', label: 'Sports Club', address: 'DDA Sports Complex, Saket, New Delhi, Delhi - 110017, India' }
    ],
    referrals: [
      { email: 'kabir.singh@gmail.com', joinedAt: '2026-03-10T12:00:00Z', status: 'Completed First Purchase (+1000 XP)' },
      { email: 'rohan.verma@yahoo.com', joinedAt: '2026-06-20T15:30:00Z', status: 'Registered (Pending Purchase)' }
    ],
    walletTransactions: [
      { id: "wt_d1", date: "2026-06-25T10:00:00Z", amount: 1299, type: "debit", description: "Payment for Order PR-55102" },
      { id: "wt_d2", date: "2026-06-15T14:30:00Z", amount: 1500, type: "credit", description: "Topup via Razorpay" },
      { id: "wt_d3", date: "2026-06-10T09:00:00Z", amount: 1499, type: "debit", description: "Payment for Order PR-55098" },
      { id: "wt_d4", date: "2026-05-20T11:15:00Z", amount: 200, type: "credit", description: "Referral Bonus XP Cashback" },
      { id: "wt_d5", date: "2026-05-01T10:00:00Z", amount: 1000, type: "credit", description: "Elite Anniversary Reward" }
    ],
    rewardsTransactions: [
      { id: "rt_d1", date: "2026-06-25T10:00:00Z", points: 130, type: "earned", description: "Order PR-55102" },
      { id: "rt_d2", date: "2026-06-22T12:00:00Z", points: 200, type: "earned", description: "Review for Pro Training Tee" },
      { id: "rt_d3", date: "2026-06-15T09:00:00Z", points: 1000, type: "earned", description: "Referral: kabir.singh@gmail.com" },
      { id: "rt_d4", date: "2026-05-15T15:00:00Z", points: 500, type: "redeemed", description: "Redeemed 5% Off Coupon" }
    ]
  },
  { id: 'user_lb_1', email: 'rohit@playr.in', password: 'password', firstName: 'Rohit', lastName: 'Sharma', phone: '+91 9991112223', memberSince: 2023, walletBalance: 120, rewardsPoints: 8500, tier: 'elite', xp: 8500, addresses: [] },
  { id: 'user_lb_2', email: 'kavitha@playr.in', password: 'password', firstName: 'Kavitha', lastName: 'Krishnan', phone: '+91 9991112224', memberSince: 2023, walletBalance: 400, rewardsPoints: 7200, tier: 'elite', xp: 7200, addresses: [] },
  { id: 'user_lb_3', email: 'fan99@playr.in', password: 'password', firstName: 'Playr', lastName: 'Fan', phone: '+91 9991112225', memberSince: 2024, walletBalance: 50, rewardsPoints: 4900, tier: 'gold', xp: 4900, addresses: [] },
  { id: 'user_lb_4', email: 'arjunx@playr.in', password: 'password', firstName: 'Arjun', lastName: 'Xavier', phone: '+91 9991112226', memberSince: 2024, walletBalance: 180, rewardsPoints: 3800, tier: 'gold', xp: 3800, addresses: [] },
  { id: 'user_lb_5', email: 'nehash@playr.in', password: 'password', firstName: 'Neha', lastName: 'Sharma', phone: '+91 9991112227', memberSince: 2024, walletBalance: 290, rewardsPoints: 2900, tier: 'gold', xp: 2900, addresses: [] },
  { id: 'user_lb_6', email: 'meena@playr.in', password: 'password', firstName: 'Meenakshi', lastName: 'Bose', phone: '+91 9991112228', memberSince: 2024, walletBalance: 0, rewardsPoints: 2100, tier: 'gold', xp: 2100, addresses: [] },
  { id: 'user_lb_7', email: 'nikhil@playr.in', password: 'password', firstName: 'Nikhil', lastName: 'Verma', phone: '+91 9991112229', memberSince: 2025, walletBalance: 50, rewardsPoints: 950, tier: 'silver', xp: 950, addresses: [] },
  { id: 'user_lb_8', email: 'jerseyteam@playr.in', password: 'password', firstName: 'Team', lastName: 'Jersey', phone: '+91 9991112230', memberSince: 2025, walletBalance: 10, rewardsPoints: 450, tier: 'bronze', xp: 450, addresses: [] }
];

const DEFAULT_LEADS = [
  {
    id: 'ld_1',
    name: 'Karan Mehra',
    email: 'karan.m@gmail.com',
    phone: '+91 9112233445',
    status: 'new',
    source: 'contact_form',
    assignedTo: 'admin@playr.in',
    timeline: [{ date: '2026-06-26T10:00:00Z', note: 'Lead created via contact form submission' }],
    notes: 'Interested in cricket kit bulk purchase for corporate tournament.',
    createdAt: '2026-06-26T10:00:00Z'
  },
  {
    id: 'ld_2',
    name: 'Neha Sharma',
    email: 'neha.sharma@yahoo.com',
    phone: '+91 9888877777',
    status: 'qualified',
    source: 'newsletter',
    assignedTo: 'admin@playr.in',
    timeline: [{ date: '2026-06-25T14:30:00Z', note: 'Signed up for performance newsletter' }],
    notes: 'Subscribed subscriber.',
    createdAt: '2026-06-25T14:30:00Z'
  }
];

const DEFAULT_TICKETS = [
  {
    id: 'tkt_1',
    userId: 'real_usr_8f92a',
    name: 'Aayush Singh',
    email: 'user@playr.in',
    subject: 'Refund request for Order PR-99231',
    message: 'I want to return my Basico Polo Tshirt as it doesn\'t fit me. Please process my wallet refund.',
    status: 'open',
    priority: 'high',
    replies: [
      { sender: 'user@playr.in', text: 'I want to return my Basico Polo Tshirt as it doesn\'t fit me. Please process my wallet refund.', timestamp: '2026-06-26T11:00:00Z' }
    ],
    createdAt: '2026-06-26T11:00:00Z'
  },
  {
    id: 'tkt_d1',
    userId: 'demo_usr_qa123',
    name: 'Dev Karan',
    email: 'demo@playr.in',
    subject: 'Sizing replacement for RR Match Jersey',
    message: 'Hi, I ordered size M of RR Match Jersey but it feels a bit tight around the shoulders. I\'d like to replace it with size L.',
    status: 'resolved',
    priority: 'medium',
    replies: [
      { sender: 'demo@playr.in', text: 'Hi, I ordered size M of RR Match Jersey but it feels a bit tight around the shoulders. I\'d like to replace it with size L.', timestamp: '2026-06-20T10:00:00Z' },
      { sender: 'admin@playr.in', text: 'Hi Dev, we have approved your exchange request. A pickup has been scheduled for your address, and once it is received, we will ship out the size L jersey.', timestamp: '2026-06-21T09:00:00Z' },
      { sender: 'demo@playr.in', text: 'Thank you! Sizing exchange completed successfully. Size L fits perfectly.', timestamp: '2026-06-24T12:00:00Z' }
    ],
    createdAt: '2026-06-20T10:00:00Z'
  },
  {
    id: 'tkt_d2',
    userId: 'demo_usr_qa123',
    name: 'Dev Karan',
    email: 'demo@playr.in',
    subject: 'Razorpay wallet credit issue',
    message: 'I topped up ₹1500 but it took a few minutes to reflect in my NECTAR wallet. Just wanted to report this.',
    status: 'closed',
    priority: 'low',
    replies: [
      { sender: 'demo@playr.in', text: 'I topped up ₹1500 but it took a few minutes to reflect in my NECTAR wallet. Just wanted to report this.', timestamp: '2026-06-15T14:30:00Z' },
      { sender: 'admin@playr.in', text: 'Hello Dev, sometimes Razorpay takes 1-2 minutes to post webhook events in high traffic. The issue is now resolved, and your wallet balance has been credited. Let us know if you need anything else!', timestamp: '2026-06-15T14:40:00Z' }
    ],
    createdAt: '2026-06-15T14:30:00Z'
  },
  {
    id: 'tkt_d3',
    userId: 'demo_usr_qa123',
    name: 'Dev Karan',
    email: 'demo@playr.in',
    subject: 'Personalization printing on CSK jersey',
    message: 'Can I add player number 7 and DHONI name on the back of my CSK match jersey?',
    status: 'open',
    priority: 'high',
    replies: [
      { sender: 'demo@playr.in', text: 'Can I add player number 7 and DHONI name on the back of my CSK match jersey?', timestamp: '2026-06-26T15:00:00Z' }
    ],
    createdAt: '2026-06-26T15:00:00Z'
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'ord_1',
    displayId: 'PR-99231',
    userId: 'real_usr_8f92a',
    date: '2026-05-15T10:00:00Z',
    status: 'delivered',
    total: 1299,
    items: [
      { id: 'item_1', productId: 'prod_pro_tee', title: 'Pro Training Tee', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0', price: 1299, quantity: 1, colorName: 'Navy', size: 'M' }
    ],
    shippingAddress: { firstName: 'Aayush', lastName: 'Singh', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9876543210' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d1',
    displayId: 'PR-55102',
    userId: 'demo_usr_qa123',
    date: '2026-06-25T10:00:00Z',
    status: 'delivered',
    total: 1299,
    items: [
      { id: 'item_d1', productId: 'prod_pro_tee', title: 'Pro Training Tee', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0', price: 1299, quantity: 1, colorName: 'Navy', size: 'L' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d2',
    displayId: 'PR-55101',
    userId: 'demo_usr_qa123',
    date: '2026-06-20T11:00:00Z',
    status: 'shipped',
    total: 1799,
    items: [
      { id: 'item_d2', productId: 'prod_csk_jersey', title: 'CSK Match Jersey 2026', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA', price: 1799, quantity: 1, colorName: 'CSK Yellow', size: 'L' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9998887776' },
    paymentMethod: 'wallet',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d3',
    displayId: 'PR-55100',
    userId: 'demo_usr_qa123',
    date: '2026-06-18T16:20:00Z',
    status: 'processing',
    total: 1499,
    items: [
      { id: 'item_d3', productId: 'prod_shorts', title: 'Aero Performance Shorts', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI', price: 1499, quantity: 1, colorName: 'Deep Black', size: 'L' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'Plot 4, Institutional Area, Sector 32, Gurgaon, Haryana - 122001', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d4',
    displayId: 'PR-55099',
    userId: 'demo_usr_qa123',
    date: '2026-06-10T09:00:00Z',
    status: 'delivered',
    total: 3098,
    items: [
      { id: 'item_d4_1', productId: 'prod_pro_tee', title: 'Pro Training Tee', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0', price: 1299, quantity: 1, colorName: 'Navy', size: 'L' },
      { id: 'item_d4_2', productId: 'prod_rr_jersey', title: 'RR Match Jersey 2026', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA', price: 1799, quantity: 1, colorName: 'Royal Pink', size: 'L' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d5',
    displayId: 'PR-55098',
    userId: 'demo_usr_qa123',
    date: '2026-05-15T14:30:00Z',
    status: 'delivered',
    total: 3499,
    items: [
      { id: 'item_d5', productId: 'prod_pickleball_paddle', title: 'Pro Spike Pickleball Paddle', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI', price: 3499, quantity: 1, colorName: 'Volt Yellow', size: 'OS' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'Plot 4, Institutional Area, Sector 32, Gurgaon, Haryana - 122001', phone: '+91 9998887776' },
    paymentMethod: 'wallet',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d6',
    displayId: 'PR-55097',
    userId: 'demo_usr_qa123',
    date: '2026-04-12T10:00:00Z',
    status: 'cancelled',
    total: 1599,
    items: [
      { id: 'item_d6', productId: 'prod_premium_polo', title: 'Basico Performance Polo', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0', price: 1599, quantity: 1, colorName: 'Deep Navy', size: 'M' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'refunded'
  },
  {
    id: 'ord_d7',
    displayId: 'PR-55096',
    userId: 'demo_usr_qa123',
    date: '2026-03-08T11:00:00Z',
    status: 'delivered',
    total: 2999,
    items: [
      { id: 'item_d7', productId: 'prod_cricket_kitbag', title: 'playR Champ Cricket Kitbag', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI', price: 2999, quantity: 1, colorName: 'Stealth Black', size: 'OS' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'DDA Sports Complex, Saket, New Delhi - 110017', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d8',
    displayId: 'PR-55095',
    userId: 'demo_usr_qa123',
    date: '2026-02-14T17:00:00Z',
    status: 'delivered',
    total: 1799,
    items: [
      { id: 'item_d8', productId: 'prod_rr_jersey', title: 'RR Match Jersey 2026', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA', price: 1799, quantity: 1, colorName: 'Royal Pink', size: 'M' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d9',
    displayId: 'PR-55094',
    userId: 'demo_usr_qa123',
    date: '2026-01-20T12:00:00Z',
    status: 'delivered',
    total: 3098,
    items: [
      { id: 'item_d9_1', productId: 'prod_premium_polo', title: 'Basico Performance Polo', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0', price: 1599, quantity: 1, colorName: 'Frost White', size: 'L' },
      { id: 'item_d9_2', productId: 'prod_shorts', title: 'Aero Performance Shorts', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI', price: 1499, quantity: 1, colorName: 'Deep Black', size: 'L' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'Plot 4, Institutional Area, Sector 32, Gurgaon, Haryana - 122001', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d10',
    displayId: 'PR-55093',
    userId: 'demo_usr_qa123',
    date: '2025-12-05T10:00:00Z',
    status: 'delivered',
    total: 1799,
    items: [
      { id: 'item_d10', productId: 'prod_mi_jersey', title: 'MI Match Jersey 2026', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA', price: 1799, quantity: 1, colorName: 'Cobalt Blue', size: 'XL' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_d11',
    displayId: 'PR-55092',
    userId: 'demo_usr_qa123',
    date: '2025-10-18T15:00:00Z',
    status: 'delivered',
    total: 1299,
    items: [
      { id: 'item_d11', productId: 'prod_pro_tee', title: 'Pro Training Tee', imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0', price: 1299, quantity: 1, colorName: 'Carbon Gray', size: 'L' }
    ],
    shippingAddress: { firstName: 'Dev', lastName: 'Karan', address: 'B-12, Green Park Extension, New Delhi - 110016', phone: '+91 9998887776' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid'
  }
];

const DEFAULT_SHIPMENTS = [
  {
    id: 'TRK-12345',
    orderId: 'PR-99231',
    carrier: 'FedEx Express Priority',
    estimatedDelivery: '2026-05-20T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-05-15T10:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-05-15T12:00:00Z', location: 'playR Head Office', description: 'Order confirmed and ready for dispatch', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-05-16T09:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Item securely packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-05-16T14:15:00Z', location: 'FedEx Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2026-05-17T23:30:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit - Arrived at Facility', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2026-05-20T08:30:00Z', location: 'Hauz Khas Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2026-05-20T14:50:00Z', location: 'Green Park Extension, New Delhi', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55102',
    orderId: 'PR-55102',
    carrier: 'FedEx Express Priority',
    estimatedDelivery: '2026-06-28T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-06-25T10:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-06-25T12:00:00Z', location: 'playR Head Office', description: 'Order confirmed and ready for dispatch', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-06-26T09:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Item securely packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-06-26T14:15:00Z', location: 'FedEx Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2026-06-27T11:30:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit - Arrived at Facility', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2026-06-28T08:30:00Z', location: 'Hauz Khas Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2026-06-28T14:50:00Z', location: 'Green Park Extension, New Delhi', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55101',
    orderId: 'PR-55101',
    carrier: 'Delhivery Surface Premium',
    estimatedDelivery: '2026-06-27T18:00:00Z',
    currentStatus: 'Shipped',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-06-20T11:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-06-20T13:00:00Z', location: 'playR Head Office', description: 'Order confirmed and ready for dispatch', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-06-21T10:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Item securely packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-06-22T15:30:00Z', location: 'Delhivery Hub, Mumbai', description: 'In Transit - Dispatched from Facility', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '', location: '', description: 'Pending transport routing', isCompleted: false },
      { id: 'm6', status: 'Out For Delivery', date: '', location: '', description: 'Pending local delivery', isCompleted: false },
      { id: 'm7', status: 'Delivered', date: '', location: '', description: 'Pending final handover', isCompleted: false }
    ]
  },
  {
    id: 'TRK-D55100',
    orderId: 'PR-55100',
    carrier: 'Delhivery Surface Premium',
    estimatedDelivery: '2026-06-24T18:00:00Z',
    currentStatus: 'Ordered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-06-18T16:20:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '', location: 'playR Head Office', description: 'Order confirmed and ready for dispatch', isCompleted: false },
      { id: 'm3', status: 'Packed', date: '', location: '', description: 'Pending packaging', isCompleted: false },
      { id: 'm4', status: 'Shipped', date: '', location: '', description: 'Pending dispatch', isCompleted: false },
      { id: 'm5', status: 'In Transit', date: '', location: '', description: 'Pending transport routing', isCompleted: false },
      { id: 'm6', status: 'Out For Delivery', date: '', location: '', description: 'Pending local delivery', isCompleted: false },
      { id: 'm7', status: 'Delivered', date: '', location: '', description: 'Pending final handover', isCompleted: false }
    ]
  },
  {
    id: 'TRK-D55099',
    orderId: 'PR-55099',
    carrier: 'FedEx Express Priority',
    estimatedDelivery: '2026-06-15T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-06-10T09:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-06-10T11:00:00Z', location: 'playR Head Office', description: 'Order confirmed', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-06-11T09:00:00Z', location: 'Warehouse, Mumbai', description: 'Item securely packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-06-11T14:00:00Z', location: 'FedEx Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2026-06-12T10:00:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2026-06-14T08:30:00Z', location: 'Hauz Khas Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2026-06-14T14:50:00Z', location: 'Green Park Extension, New Delhi', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55098',
    orderId: 'PR-55098',
    carrier: 'FedEx Express Priority',
    estimatedDelivery: '2026-05-20T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-05-15T14:30:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-05-15T16:00:00Z', location: 'playR Head Office', description: 'Order confirmed', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-05-16T09:00:00Z', location: 'Warehouse, Mumbai', description: 'Item securely packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-05-16T14:00:00Z', location: 'FedEx Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2026-05-17T11:00:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2026-05-19T08:30:00Z', location: 'Gurgaon Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2026-05-19T13:40:00Z', location: 'Institutional Area, Gurgaon', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55096',
    orderId: 'PR-55096',
    carrier: 'Delhivery Surface Premium',
    estimatedDelivery: '2026-03-13T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-03-08T11:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-03-08T13:00:00Z', location: 'playR Head Office', description: 'Order confirmed', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-03-09T09:00:00Z', location: 'Warehouse, Mumbai', description: 'Item packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-03-09T14:00:00Z', location: 'Delhivery Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2026-03-10T18:00:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2026-03-12T09:00:00Z', location: 'Saket Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2026-03-12T15:30:00Z', location: 'Saket, New Delhi', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55095',
    orderId: 'PR-55095',
    carrier: 'Delhivery Surface Premium',
    estimatedDelivery: '2026-02-19T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-02-14T17:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-02-14T18:00:00Z', location: 'playR Head Office', description: 'Order confirmed', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-02-15T09:00:00Z', location: 'Warehouse, Mumbai', description: 'Item packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-02-15T14:00:00Z', location: 'Delhivery Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2026-02-16T12:00:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2026-02-18T08:30:00Z', location: 'Hauz Khas Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2026-02-18T14:50:00Z', location: 'Green Park Extension, New Delhi', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55094',
    orderId: 'PR-55094',
    carrier: 'FedEx Express Priority',
    estimatedDelivery: '2026-01-25T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2026-01-20T12:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2026-01-20T14:00:00Z', location: 'playR Head Office', description: 'Order confirmed', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2026-01-21T09:00:00Z', location: 'Warehouse, Mumbai', description: 'Item packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2026-01-21T14:00:00Z', location: 'FedEx Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2026-01-22T10:00:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2026-01-24T08:30:00Z', location: 'Gurgaon Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2026-01-24T14:50:00Z', location: 'Institutional Area, Gurgaon', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55093',
    orderId: 'PR-55093',
    carrier: 'FedEx Express Priority',
    estimatedDelivery: '2025-12-10T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2025-12-05T10:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2025-12-05T12:00:00Z', location: 'playR Head Office', description: 'Order confirmed', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2025-12-06T09:00:00Z', location: 'Warehouse, Mumbai', description: 'Item packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2025-12-06T14:00:00Z', location: 'FedEx Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2025-12-07T11:00:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2025-12-09T08:30:00Z', location: 'Hauz Khas Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2025-12-09T14:50:00Z', location: 'Green Park Extension, New Delhi', description: 'Delivered successfully', isCompleted: true }
    ]
  },
  {
    id: 'TRK-D55092',
    orderId: 'PR-55092',
    carrier: 'Delhivery Surface Premium',
    estimatedDelivery: '2025-10-23T18:00:00Z',
    currentStatus: 'Delivered',
    milestones: [
      { id: 'm1', status: 'Ordered', date: '2025-10-18T15:00:00Z', location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed', date: '2025-10-18T16:00:00Z', location: 'playR Head Office', description: 'Order confirmed', isCompleted: true },
      { id: 'm3', status: 'Packed', date: '2025-10-19T09:00:00Z', location: 'Warehouse, Mumbai', description: 'Item packed', isCompleted: true },
      { id: 'm4', status: 'Shipped', date: '2025-10-19T14:00:00Z', location: 'Delhivery Hub, Mumbai', description: 'Shipped', isCompleted: true },
      { id: 'm5', status: 'In Transit', date: '2025-10-20T12:00:00Z', location: 'Sort Facility, New Delhi', description: 'In Transit', isCompleted: true },
      { id: 'm6', status: 'Out For Delivery', date: '2025-10-22T08:30:00Z', location: 'Hauz Khas Delivery Center', description: 'Out For Delivery', isCompleted: true },
      { id: 'm7', status: 'Delivered', date: '2025-10-22T14:50:00Z', location: 'Green Park Extension, New Delhi', description: 'Delivered successfully', isCompleted: true }
    ]
  }
];

const DEFAULT_CMS = {
  homepage: {
    hero: {
      heading1: "LIMITLESS",
      heading2: "PERFORMANCE",
      description: "Born from a passion for sports and engineered with cutting-edge fabric technology. playR is the bridge between elite athletic performance and everyday lifestyle.",
      primaryCta: { label: "Shop The New Drop", href: "/collections/premium-polos" },
      secondaryCta: { label: "Explore Teamwear", href: "/b2b" }
    },
    brandStory: {
      heading: "From the Pitch to the Streets.",
      description1: "Born from a passion for sports and engineered with cutting-edge fabric technology. playR is the bridge between elite athletic performance and everyday lifestyle.",
      description2: "As the official merchandise partner for top-tier franchises across the globe, we understand what it takes to perform under pressure."
    }
  },
  about: {
    hero: {
      id: "hero-about-1",
      badge: "Luminous Performance",
      heading1: "LIMITLESS",
      heading2: "PERFORMANCE",
      description: "Designed for the elite, engineered for the athlete. We define the intersection of technical innovation and modern athletic lifestyle.",
      primaryCta: { label: "Explore The Core", href: "#" }
    },
    brandStory: {
      id: "story-about-1",
      heading: "Our Journey",
      timeline: [
        { year: "2021", title: "The Inception", description: "November 2021 marked the launch of playR Apparel, debuting as the Kitting & Clothing Partner for Bihar Cricket Association (BCA)." },
        { year: "2023", title: "Global Partnerships", description: "Strategic expansion with Chennai Super Kings (CSK) as Exclusive Global Player Wear Merchandise Partner and entry into the Rajasthan Royals fold." },
        { year: "2025", title: "Omni-Channel Future", description: "Scaling across Quick Commerce, Pickleball Associations, and expanding our footprint to USA, Middle East, and beyond." }
      ],
      vision: {
        heading: "VISION",
        description: "To inspire and empower individuals to lead healthier, more meaningful lives through sports, providing apparel, equipment, and accessories that enrich and enhance everyday life."
      },
      mission: {
        heading: "MISSION",
        description1: "To foster a global community that embraces an active lifestyle while staying true to authenticity and innovation.",
        description2: "Crafting value and performance-driven products that seamlessly integrate comfort and style for the elite player."
      },
      coreValues: [
        { title: "Player First", description: "Equip the player with the right tools to excel in their field, prioritizing performance above all else.", icon: "sports_handball" },
        { title: "LET'S PLAY", description: "Encourage a healthier, meaningful life through sports, making elite performance accessible to every aspiring athlete.", icon: "celebration" },
        { title: "Omni-Channel", description: "Value-driven offerings and accessibility across markets, ensuring playR is where the athlete is.", icon: "hub" }
      ],
      partners: ['MI', 'CSK', 'RR', 'PBKS', 'KKR', 'GT']
    }
  },
  media: {
    hero: {
      id: "hero-media-1",
      badge: "Official Announcement",
      heading1: "playR Official Kitting Partner for Chennai Super Kings",
      description: "OCTOBER 24, 2024",
      primaryCta: { label: "Read the Story", href: "#" }
    },
    media: {
      id: "media-hub-1",
      headline: "Latest Headlines",
      mainArticle: {
        category: "Merchandise",
        title: "playR x Mumbai Indians: Official Merchandise Launch",
        description: "Celebrate the spirit of the game with the all-new Mumbai Indians fan gear, designed for maximum performance and ultimate comfort.",
        link: "#"
      },
      sidebarArticle: {
        category: "New Arrival",
        title: "New Pickleball Collection Release: Pro Series 2024",
        description: "Engineered for speed, our latest Pickleball range brings professional-grade gear to enthusiasts worldwide.",
        link: "#"
      },
      articles: [
        { category: "Global Footprint", title: "Expansion into International Markets: playR UAE & UK", description: "Taking Indian sports excellence to the world. We are officially live in the United Kingdom and United Arab Emirates.", link: "#" },
        { category: "Partnerships", title: "playR x Rajasthan Royals: Exclusive Player Wear", description: "Engineered with AERODRY technology for the desert heat.", link: "#" },
        { category: "Community", title: "The Future of Athletic Lifestyle Gear", description: "How playR is bridging the gap between field performance and street style.", link: "#" }
      ]
    }
  }
};

const DEFAULT_BLOGS = [
  { id: 'b_1', title: 'The Technology Behind playR AERODRY fabric', slug: 'technology-behind-aerodry', content: 'Our patented AERODRY fabrics are engineered specifically for high heat performance...', excerpt: 'Discover the innovation and yarn science behind the industry-leading playR cricket gear.', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070', createdAt: '2026-06-20T10:00:00Z', published: true }
];

const DEFAULT_REVIEWS = [
  { id: 'rev_1', productId: 'prod_pro_tee', userName: 'Arjun S.', rating: 5, comment: 'Amazing fitting and fabric quality is absolutely premium! Wicks sweat in seconds.', createdAt: '2026-06-25T11:00:00Z' },
  { id: 'rev_2', productId: 'prod_csk_jersey', userName: 'Kavitha K.', rating: 5, comment: 'Official match quality is unmatched. The print is crisp and fits beautifully.', createdAt: '2026-06-24T15:00:00Z' },
  { id: 'rev_3', productId: 'prod_rr_jersey', userName: 'Dev Karan', rating: 5, comment: 'Excellent fit and feel! AERODRY technology keeps me cool during high-intensity training.', createdAt: '2026-06-22T12:00:00Z' },
  { id: 'rev_4', productId: 'prod_premium_polo', userName: 'Rohit Sharma', rating: 4, comment: 'Very clean styling. Great for golf or casual Friday office wear.', createdAt: '2026-06-18T10:00:00Z' },
  { id: 'rev_5', productId: 'prod_pickleball_paddle', userName: 'Neha Sharma', rating: 5, comment: 'The Toray carbon fiber face gives amazing spin control. Honeycomb core is very solid.', createdAt: '2026-05-20T16:00:00Z' }
];

const DEFAULT_AUDIT_LOGS = [
  { id: 'log_1', userId: 'system', action: 'database_initialize', details: 'Initialized local database engine with fallback seed data.', timestamp: '2026-06-15T00:00:00Z' },
  { id: 'log_d1', userId: 'demo_usr_qa123', action: 'user_register', details: 'Registered user email: demo@playr.in', timestamp: '2025-10-01T09:00:00Z' },
  { id: 'log_d2', userId: 'demo_usr_qa123', action: 'edit_profile', details: 'Completed profile fields and sport preferences.', timestamp: '2025-10-02T10:30:00Z' },
  { id: 'log_d3', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55092', timestamp: '2025-10-18T15:00:00Z' },
  { id: 'log_d4', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55093', timestamp: '2025-12-05T10:00:00Z' },
  { id: 'log_d5', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55094', timestamp: '2026-01-20T12:00:00Z' },
  { id: 'log_d6', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55095', timestamp: '2026-02-14T17:00:00Z' },
  { id: 'log_d7', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55096', timestamp: '2026-03-08T11:00:00Z' },
  { id: 'log_d8', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55097', timestamp: '2026-04-12T10:00:00Z' },
  { id: 'log_d9', userId: 'demo_usr_qa123', action: 'wallet_credit', details: 'Elite Anniversary Reward of ₹1000 credited.', timestamp: '2026-05-01T10:00:00Z' },
  { id: 'log_d10', userId: 'demo_usr_qa123', action: 'redeem_reward', details: 'Redeemed 5% Off Coupon for 500 XP.', timestamp: '2026-05-15T15:00:00Z' },
  { id: 'log_d11', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55098', timestamp: '2026-05-15T14:30:00Z' },
  { id: 'log_d12', userId: 'demo_usr_qa123', action: 'wallet_topup', details: 'Topped up wallet with ₹1500 via Razorpay.', timestamp: '2026-06-15T14:30:00Z' },
  { id: 'log_d13', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55099', timestamp: '2026-06-10T09:00:00Z' },
  { id: 'log_d14', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55100', timestamp: '2026-06-18T16:20:00Z' },
  { id: 'log_d15', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55101', timestamp: '2026-06-20T11:00:00Z' },
  { id: 'log_d16', userId: 'demo_usr_qa123', action: 'write_review', details: 'Left a product review for RR Match Jersey 2026.', timestamp: '2026-06-22T12:00:00Z' },
  { id: 'log_d17', userId: 'demo_usr_qa123', action: 'create_order', details: 'Created order display ID: PR-55102', timestamp: '2026-06-25T10:00:00Z' }
];

const DEFAULT_COMMUNITY_FEED = [
  { id: 'feed_1', userId: 'demo_usr_qa123', displayName: 'Dev Karan', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256', action: 'challenge_complete', metadata: { challengeTitle: 'Leave a Review', xpEarned: 200 }, createdAt: '2 mins ago' },
  { id: 'feed_2', userId: 'real_usr_8f92a', displayName: 'Aayush Singh', avatarUrl: null, action: 'tier_up', metadata: { newTier: 'Silver Member' }, createdAt: '15 mins ago' },
  { id: 'feed_3', userId: 'demo_usr_qa123', displayName: 'Dev Karan', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256', action: 'tier_up', metadata: { newTier: 'Elite Member' }, createdAt: '1 hour ago' },
  { id: 'feed_4', userId: 'user_lb_2', displayName: 'Kavitha Krishnan', avatarUrl: null, action: 'reward_redeem', metadata: { rewardTitle: 'Free Standard Shipping', xpSpent: 400 }, createdAt: '3 hours ago' },
  { id: 'feed_5', userId: 'user_lb_1', displayName: 'Rohit Sharma', avatarUrl: null, action: 'challenge_complete', metadata: { challengeTitle: '3-Order Streak', xpEarned: 750 }, createdAt: '1 day ago' }
];

const INITIAL_DB_STATE = {
  products: DEFAULT_PRODUCTS,
  coupons: DEFAULT_COUPONS,
  users: DEFAULT_USERS,
  leads: DEFAULT_LEADS,
  tickets: DEFAULT_TICKETS,
  orders: DEFAULT_ORDERS,
  shipments: DEFAULT_SHIPMENTS,
  cms: DEFAULT_CMS,
  blogs: DEFAULT_BLOGS,
  reviews: DEFAULT_REVIEWS,
  audit_logs: DEFAULT_AUDIT_LOGS,
  community_feed: DEFAULT_COMMUNITY_FEED
};

// Memory cache for DB state to prevent read/write cycles and support read-only platforms
let memoryDbState: typeof INITIAL_DB_STATE | null = null;

// Initialize database
function loadDbData(): typeof INITIAL_DB_STATE {
  if (memoryDbState) {
    return memoryDbState;
  }

  const isReadOnlyEnv = !!process.env.VERCEL;
  const dbPath = getDbFilePath();

  if (!fs.existsSync(dbPath)) {
    if (isReadOnlyEnv) {
      memoryDbState = INITIAL_DB_STATE;
      return INITIAL_DB_STATE;
    }
    try {
      fs.writeFileSync(dbPath, JSON.stringify(INITIAL_DB_STATE, null, 2));
    } catch (e) {
      console.warn("Failed to write db_store.json in read-only environment, using memory fallback", e);
    }
    memoryDbState = INITIAL_DB_STATE;
    return INITIAL_DB_STATE;
  }

  try {
    const content = fs.readFileSync(dbPath, 'utf-8');
    memoryDbState = JSON.parse(content);
    return memoryDbState!;
  } catch (e) {
    console.error("Failed to parse db_store.json, resetting to defaults", e);
    if (!isReadOnlyEnv) {
      try {
        fs.writeFileSync(dbPath, JSON.stringify(INITIAL_DB_STATE, null, 2));
      } catch (err) {}
    }
    memoryDbState = INITIAL_DB_STATE;
    return INITIAL_DB_STATE;
  }
}

function saveDbData(data: typeof INITIAL_DB_STATE) {
  memoryDbState = data;
  if (process.env.VERCEL) {
    // Return early in read-only Vercel environment
    return;
  }
  try {
    fs.writeFileSync(getDbFilePath(), JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to write db_store.json", e);
  }
}

// System DB functions
export async function getDbUsers() {
  const db = loadDbData();
  return db.users;
}

export async function getDbUserByEmail(email: string) {
  const users = await getDbUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getDbUserById(id: string) {
  const users = await getDbUsers();
  return users.find(u => u.id === id) || null;
}

export async function createDbUser(user: any) {
  const db = loadDbData();
  const newUser = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    walletBalance: 0,
    rewardsPoints: 0,
    tier: 'bronze',
    xp: 0,
    addresses: [],
    memberSince: new Date().getFullYear(),
    ...user
  };
  db.users.push(newUser);
  saveDbData(db);
  await addDbAuditLog(newUser.id, 'user_register', `Registered user email: ${newUser.email}`);
  return newUser;
}

export async function updateDbUser(userId: string, updates: any) {
  const db = loadDbData();
  const idx = db.users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...updates };
    saveDbData(db);
    return db.users[idx];
  }
  return null;
}

export async function getDbOrders() {
  const db = loadDbData();
  return db.orders;
}

export async function getDbOrdersByUserId(userId: string) {
  const orders = await getDbOrders();
  return orders.filter(o => o.userId === userId);
}

export async function createDbOrder(order: any) {
  const db = loadDbData();
  const newOrder = {
    id: `ord_${Math.random().toString(36).substring(2, 9)}`,
    displayId: `PR-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString(),
    status: 'processing',
    paymentStatus: 'pending',
    ...order
  };
  db.orders.push(newOrder);

  // Auto-generate Shipment milestone
  const newShipment = {
    id: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    orderId: newOrder.displayId,
    carrier: 'Delhivery Surface Premium',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    currentStatus: 'Ordered' as const,
    milestones: [
      { id: 'm1', status: 'Ordered' as const, date: newOrder.date, location: 'Warehouse, Mumbai Distribution Center', description: 'Order Processed', isCompleted: true },
      { id: 'm2', status: 'Confirmed' as const, date: '', location: 'playR Head Office', description: 'Order confirmed and ready for dispatch', isCompleted: false },
      { id: 'm3', status: 'Packed' as const, date: '', location: 'Warehouse, Mumbai', description: 'Pending packaging', isCompleted: false },
      { id: 'm4', status: 'Shipped' as const, date: '', location: '', description: 'Pending dispatch', isCompleted: false },
      { id: 'm5', status: 'In Transit' as const, date: '', location: '', description: 'Pending transport routing', isCompleted: false },
      { id: 'm6', status: 'Out For Delivery' as const, date: '', location: '', description: 'Pending local delivery', isCompleted: false },
      { id: 'm7', status: 'Delivered' as const, date: '', location: '', description: 'Pending final handover', isCompleted: false }
    ]
  };
  db.shipments.push(newShipment);
  saveDbData(db);

  await addDbAuditLog(order.userId, 'create_order', `Created order display ID: ${newOrder.displayId}`);
  return { order: newOrder, shipment: newShipment };
}

export async function updateDbOrderStatus(orderId: string, status: any) {
  const db = loadDbData();
  const idx = db.orders.findIndex(o => o.id === orderId || o.displayId === orderId);
  if (idx !== -1) {
    db.orders[idx].status = status;
    
    // Also update shipment current status
    const dispId = db.orders[idx].displayId;
    const shipIdx = db.shipments.findIndex(s => s.orderId === dispId);
    if (shipIdx !== -1) {
      db.shipments[shipIdx].currentStatus = status === 'processing' ? 'Ordered' : status === 'shipped' ? 'Shipped' : status === 'delivered' ? 'Delivered' : 'Ordered';
      // Mark matching milestone complete
      db.shipments[shipIdx].milestones = db.shipments[shipIdx].milestones.map((m: any) => {
        if (m.status.toLowerCase() === status.toLowerCase() || 
            (status === 'processing' && m.status === 'Ordered') ||
            (status === 'shipped' && m.status === 'Shipped') ||
            (status === 'delivered' && m.status === 'Delivered')) {
          return { ...m, isCompleted: true, date: new Date().toISOString() };
        }
        return m;
      });
    }
    saveDbData(db);
    return db.orders[idx];
  }
  return null;
}

export async function getDbShipmentByOrderId(orderId: string) {
  const db = loadDbData();
  return db.shipments.find(s => s.orderId === orderId || s.id === orderId) || null;
}

export async function updateDbShipmentMilestones(shipmentId: string, milestones: any[], currentStatus: any) {
  const db = loadDbData();
  const idx = db.shipments.findIndex(s => s.id === shipmentId);
  if (idx !== -1) {
    db.shipments[idx].milestones = milestones;
    db.shipments[idx].currentStatus = currentStatus;
    saveDbData(db);
    return db.shipments[idx];
  }
  return null;
}

export async function getDbLeads() {
  const db = loadDbData();
  return db.leads;
}

export async function createDbLead(lead: any) {
  const db = loadDbData();
  const newLead = {
    id: `ld_${Math.random().toString(36).substring(2, 9)}`,
    status: 'new',
    createdAt: new Date().toISOString(),
    timeline: [{ date: new Date().toISOString(), note: 'Lead created' }],
    notes: '',
    assignedTo: 'admin@playr.in',
    ...lead
  };
  db.leads.push(newLead);
  saveDbData(db);
  return newLead;
}

export async function updateDbLead(leadId: string, updates: any) {
  const db = loadDbData();
  const idx = db.leads.findIndex(l => l.id === leadId);
  if (idx !== -1) {
    db.leads[idx] = { ...db.leads[idx], ...updates };
    saveDbData(db);
    return db.leads[idx];
  }
  return null;
}

export async function getDbSupportTickets() {
  const db = loadDbData();
  return db.tickets;
}

export async function createDbSupportTicket(ticket: any) {
  const db = loadDbData();
  const newTicket = {
    id: `tkt_${Math.random().toString(36).substring(2, 9)}`,
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    replies: [{ sender: ticket.email, text: ticket.message, timestamp: new Date().toISOString() }],
    ...ticket
  };
  db.tickets.push(newTicket);
  saveDbData(db);
  return newTicket;
}

export async function updateDbSupportTicket(ticketId: string, updates: any) {
  const db = loadDbData();
  const idx = db.tickets.findIndex(t => t.id === ticketId);
  if (idx !== -1) {
    db.tickets[idx] = { ...db.tickets[idx], ...updates };
    saveDbData(db);
    return db.tickets[idx];
  }
  return null;
}

export async function getDbProducts() {
  const db = loadDbData();
  return db.products;
}

export async function getDbProductBySlug(slug: string) {
  const products = await getDbProducts();
  return products.find(p => p.slug === slug || p.id === slug) || null;
}

export async function updateDbProduct(productId: string, updates: any) {
  const db = loadDbData();
  const idx = db.products.findIndex(p => p.id === productId);
  if (idx !== -1) {
    db.products[idx] = { ...db.products[idx], ...updates };
    saveDbData(db);
    return db.products[idx];
  }
  return null;
}

export async function getDbCoupons() {
  const db = loadDbData();
  return db.coupons;
}

export async function getDbCouponByCode(code: string) {
  const coupons = await getDbCoupons();
  return coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive) || null;
}

export async function createDbCoupon(coupon: any) {
  const db = loadDbData();
  const newCoupon = {
    id: `c_${Math.random().toString(36).substring(2, 9)}`,
    isActive: true,
    ...coupon
  };
  db.coupons.push(newCoupon);
  saveDbData(db);
  return newCoupon;
}

export async function toggleDbCoupon(couponId: string, isActive: boolean) {
  const db = loadDbData();
  const idx = db.coupons.findIndex(c => c.id === couponId);
  if (idx !== -1) {
    db.coupons[idx].isActive = isActive;
    saveDbData(db);
    return db.coupons[idx];
  }
  return null;
}

export async function deleteDbCoupon(couponId: string) {
  const db = loadDbData();
  db.coupons = db.coupons.filter(c => c.id !== couponId);
  saveDbData(db);
  return true;
}

export async function getDbCmsData(pageId: string) {
  const db = loadDbData();
  return db.cms[pageId as keyof typeof db.cms] || null;
}

export async function updateDbCmsData(pageId: string, content: any) {
  const db = loadDbData();
  db.cms[pageId as keyof typeof db.cms] = content;
  saveDbData(db);
  return db.cms[pageId as keyof typeof db.cms];
}

export async function getDbBlogs() {
  const db = loadDbData();
  return db.blogs;
}

export async function createDbBlog(blog: any) {
  const db = loadDbData();
  const newBlog = {
    id: `b_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    published: true,
    ...blog
  };
  db.blogs.push(newBlog);
  saveDbData(db);
  return newBlog;
}

export async function updateDbBlog(blogId: string, updates: any) {
  const db = loadDbData();
  const idx = db.blogs.findIndex(b => b.id === blogId);
  if (idx !== -1) {
    db.blogs[idx] = { ...db.blogs[idx], ...updates };
    saveDbData(db);
    return db.blogs[idx];
  }
  return null;
}

export async function deleteDbBlog(blogId: string) {
  const db = loadDbData();
  db.blogs = db.blogs.filter(b => b.id !== blogId);
  saveDbData(db);
  return true;
}

export async function getDbReviewsByProductId(productId: string) {
  const db = loadDbData();
  return db.reviews.filter(r => r.productId === productId);
}

export async function createDbReview(review: any) {
  const db = loadDbData();
  const newReview = {
    id: `rev_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...review
  };
  db.reviews.push(newReview);
  saveDbData(db);
  return newReview;
}

export async function getDbAuditLogs() {
  const db = loadDbData();
  return db.audit_logs;
}

export async function addDbAuditLog(userId: string, action: string, details: string) {
  const db = loadDbData();
  const newLog = {
    id: `log_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  db.audit_logs.push(newLog);
  saveDbData(db);
  return newLog;
}

export async function getDbCommunityFeed() {
  const db = loadDbData();
  return db.community_feed;
}

export async function addDbCommunityFeedEntry(entry: any) {
  const db = loadDbData();
  const newEntry = {
    id: `feed_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: 'Just now',
    ...entry
  };
  db.community_feed.unshift(newEntry);
  if (db.community_feed.length > 20) {
    db.community_feed.pop();
  }
  saveDbData(db);
  return newEntry;
}
