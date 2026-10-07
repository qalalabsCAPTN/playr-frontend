import { NextRequest, NextResponse } from 'next/server';
import {
  getDbUserById,
  getDbOrdersByUserId,
  getDbShipmentByOrderId,
  getDbCmsData,
  getDbProducts,
  getDbProductBySlug,
  createDbLead,
  createDbSupportTicket,
  getDbUsers,
  getDbCommunityFeed,
  addDbCommunityFeedEntry,
  addDbAuditLog,
  getDbAuditLogs,
  updateDbUser,
  getDbSupportTickets,
  getDbLeads,
  getDbOrders,
  createDbCoupon,
  getDbCoupons,
  deleteDbCoupon,
  toggleDbCoupon,
  createDbBlog,
  getDbBlogs,
  deleteDbBlog,
  updateDbBlog,
  updateDbOrderStatus,
  updateDbProduct,
  updateDbSupportTicket,
  updateDbShipmentMilestones,
  getDbPersonalizations,
  getDbPersonalizationByOrderId,
  createDbPersonalization,
  updateDbPersonalization
} from '@playr/nectar-core';

function calculateXPState(userId: string, xp: number) {
  const bronze = { id: 'bronze', name: 'Bronze', minXP: 0, maxXP: 499, benefits: ['Early access to sale announcements'], badgeIcon: 'workspace_premium' };
  const silver = { id: 'silver', name: 'Silver', minXP: 500, maxXP: 1999, benefits: ['5% XP cashback on purchases', 'Early access to sales'], badgeIcon: 'military_tech' };
  const gold = { id: 'gold', name: 'Gold', minXP: 2000, maxXP: 4999, benefits: ['10% XP cashback', 'Free standard shipping', 'New drop early access'], badgeIcon: 'emoji_events' };
  const elite = { id: 'elite', name: 'Elite', minXP: 5000, maxXP: null, benefits: ['15% XP cashback', 'Free express shipping', 'Exclusive products', 'Priority support', 'Signed jerseys access'], badgeIcon: 'verified' };

  let currentTier: any = bronze;
  let nextTier: any = silver;
  let xpToNextTier: number | null = 500 - xp;
  let progressPercent = Math.min(100, Math.max(0, (xp / 500) * 100));

  if (xp >= 5000) {
    currentTier = elite;
    nextTier = null;
    xpToNextTier = null;
    progressPercent = 100;
  } else if (xp >= 2000) {
    currentTier = gold;
    nextTier = elite;
    xpToNextTier = 5000 - xp;
    progressPercent = Math.min(100, Math.max(0, ((xp - 2000) / 3000) * 100));
  } else if (xp >= 500) {
    currentTier = silver;
    nextTier = gold;
    xpToNextTier = 2000 - xp;
    progressPercent = Math.min(100, Math.max(0, ((xp - 500) / 1500) * 100));
  }

  return {
    userId,
    totalXP: xp,
    currentTier,
    nextTier,
    xpToNextTier,
    progressPercent
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path || [];
    const searchParams = req.nextUrl.searchParams;

    // 1. GET /api/identity/users/{userId}
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && !path[3]) {
      const user = await getDbUserById(path[2]);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(user);
    }

    // 1b. GET /api/identity/users/{userId}/audit-logs
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && path[3] === 'audit-logs') {
      const logs = await getDbAuditLogs();
      const filtered = logs.filter((l: any) => l.userId === path[2]);
      return NextResponse.json(filtered);
    }

    // 2. GET /api/identity/users/{userId}/orders
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && path[3] === 'orders') {
      const orders = await getDbOrdersByUserId(path[2]);
      return NextResponse.json(orders);
    }

    // 2b. GET /api/identity/users/{userId}/support-tickets
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && path[3] === 'support-tickets') {
      const tickets = await getDbSupportTickets();
      const filtered = tickets.filter((t: any) => t.userId === path[2]);
      return NextResponse.json(filtered);
    }

    // 3. GET /api/loyalty/users/{userId}/xp
    if (path[0] === 'loyalty' && path[1] === 'users' && path[2] && path[3] === 'xp') {
      const user = await getDbUserById(path[2]);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(calculateXPState(path[2], user.xp || 0));
    }

    // 4. GET /api/loyalty/users/{userId}/wallet
    if (path[0] === 'loyalty' && path[1] === 'users' && path[2] && path[3] === 'wallet') {
      const user = await getDbUserById(path[2]);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json({
        balance: user.walletBalance || 0,
        currency: 'INR',
        transactions: (user as any).walletTransactions || [
          { id: "wt_1", date: "2026-05-15T10:00:00Z", amount: 200, type: "credit", description: "Refund for PR-98112" },
          { id: "wt_2", date: "2026-05-01T10:00:00Z", amount: 300, type: "credit", description: "Promotional Credit" }
        ]
      });
    }

    // 5. GET /api/loyalty/users/{userId}/rewards
    if (path[0] === 'loyalty' && path[1] === 'users' && path[2] && path[3] === 'rewards') {
      const user = await getDbUserById(path[2]);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json({
        points: user.rewardsPoints || 0,
        tier: user.tier || 'bronze',
        nextTierPoints: user.tier === 'bronze' ? 500 : user.tier === 'silver' ? 2000 : user.tier === 'gold' ? 5000 : 10000,
        transactions: (user as any).rewardsTransactions || [
          { id: "rt_1", date: "2026-05-15T10:00:00Z", points: 80, type: "earned", description: "Order PR-99231" },
          { id: "rt_2", date: "2026-05-02T14:30:00Z", points: 130, type: "earned", description: "Order PR-99104" }
        ]
      });
    }

    // 6. GET /api/loyalty/challenges
    if (path[0] === 'loyalty' && path[1] === 'challenges') {
      const userId = searchParams.get('userId') || '';
      let ordersCount = 0;
      let reviewsCount = 0;
      let userXP = 0;
      let hasTopup = false;
      if (userId) {
        const user = await getDbUserById(userId);
        if (user) {
          userXP = user.xp || 0;
          const walletTxns = (user as any).walletTransactions || [];
          hasTopup = walletTxns.some((t: any) => t.type === 'credit' && t.amount >= 1000 && t.description.toLowerCase().includes('topup'));
        }
        const orders = await getDbOrdersByUserId(userId);
        ordersCount = orders.length;
        const logs = await getDbAuditLogs();
        reviewsCount = logs.filter((l: any) => l.userId === userId && l.action === 'write_review').length;
      }

      return NextResponse.json([
        { id: 'ch_first_purchase', title: 'First Purchase', description: 'Complete your first order and unlock Silver status bonus XP.', xpReward: 500, type: 'purchase', status: ordersCount >= 1 ? 'completed' : 'active', badgeIcon: 'shopping_bag', progressCurrent: ordersCount >= 1 ? 1 : 0, progressTotal: 1, isPersonalized: true },
        { id: 'ch_review', title: 'Leave a Review', description: 'Write an honest product review and help the community.', xpReward: 200, type: 'review', status: reviewsCount >= 1 ? 'completed' : 'active', badgeIcon: 'reviews', progressCurrent: reviewsCount >= 1 ? 1 : 0, progressTotal: 1, isPersonalized: true },
        { id: 'ch_refer_friend', title: 'Refer a Friend', description: 'Invite a teammate — you both unlock bonus XP.', xpReward: 1000, type: 'referral', status: 'active', badgeIcon: 'group_add', progressCurrent: 0, progressTotal: 1, isPersonalized: true },
        { id: 'ch_triple_purchase', title: '3-Order Streak', description: 'Complete 3 orders in a single season.', xpReward: 750, type: 'streak', status: ordersCount >= 3 ? 'completed' : 'active', progressCurrent: Math.min(3, ordersCount), progressTotal: 3, badgeIcon: 'local_fire_department', isPersonalized: true },
        { id: 'ch_elite_club', title: 'Join the Elite Club', description: 'Achieve Elite status on the playR XP loyalty program.', xpReward: 1000, type: 'milestone', status: userXP >= 5000 ? 'completed' : 'active', progressCurrent: userXP >= 5000 ? 1 : 0, progressTotal: 1, badgeIcon: 'workspace_premium', isPersonalized: true },
        { id: 'ch_wallet_topup', title: 'Wallet Power-Up', description: 'Top up your NECTAR wallet with ₹1000+ in a single transaction.', xpReward: 500, type: 'milestone', status: hasTopup ? 'completed' : 'active', progressCurrent: hasTopup ? 1 : 0, progressTotal: 1, badgeIcon: 'account_balance_wallet', isPersonalized: true },
        { id: 'ch_share_look', title: 'Share Your Look', description: 'Post your playR kit on social media and tag us.', xpReward: 300, type: 'social', status: 'upcoming', badgeIcon: 'share', isPersonalized: false },
        { id: 'ch_ipl_bundle', title: 'IPL Fan Bundle', description: 'Purchase any IPL official jersey + accessories in one order.', xpReward: 1500, type: 'milestone', status: 'active', badgeIcon: 'sports_cricket', isPersonalized: false }
      ]);
    }

    // 7. GET /api/loyalty/rewards
    if (path[0] === 'loyalty' && path[1] === 'rewards' && !path[2]) {
      return NextResponse.json([
        { id: 'rwd_5pct_off', title: '5% Off Your Next Order', description: 'Applies to your next checkout.', xpCost: 500, type: 'discount', value: '5% discount', isAvailable: true },
        { id: 'rwd_free_shipping', title: 'Free Standard Shipping', description: 'Free shipping on your next order.', xpCost: 400, type: 'free_shipping', value: 'Free standard shipping', isAvailable: true }
      ]);
    }

    // 8. GET /api/loyalty/leaderboard
    if (path[0] === 'loyalty' && path[1] === 'leaderboard') {
      const users = await getDbUsers();
      const currentUserId = searchParams.get('userId') || '';
      const sorted = [...users].sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0));
      const res = sorted.slice(0, 10).map((u: any, idx: number) => ({
        rank: idx + 1,
        userId: u.id,
        displayName: u.firstName + ' ' + u.lastName[0] + '.',
        totalXP: u.xp || 0,
        tierName: u.tier.charAt(0).toUpperCase() + u.tier.slice(1),
        isCurrentUser: u.id === currentUserId
      }));
      return NextResponse.json(res);
    }

    // 9. GET /api/logistics/shipments/{id}
    if (path[0] === 'logistics' && path[1] === 'shipments' && path[2]) {
      const shipment = await getDbShipmentByOrderId(path[2]);
      if (!shipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
      return NextResponse.json(shipment);
    }

    // 10. GET /api/cms/{pageId}
    if (path[0] === 'cms' && path[1]) {
      const data = await getDbCmsData(path[1]);
      if (!data) return NextResponse.json({ error: "CMS Page not found" }, { status: 404 });
      return NextResponse.json(data);
    }

    // 11. GET /api/products
    if (path[0] === 'products' && !path[1]) {
      const products = await getDbProducts();
      const { getDbPersonalizationTemplateByProductId } = require('@playr/nectar-core');
      const mapped = await Promise.all(products.map(async (p: any) => {
        const template = await getDbPersonalizationTemplateByProductId(p.id);
        return { ...p, personalizationTemplate: template };
      }));
      return NextResponse.json(mapped);
    }

    // GET /api/personalization-templates
    if (path[0] === 'personalization-templates' && !path[1]) {
      const { getDbPersonalizationTemplates } = require('@playr/nectar-core');
      const templates = await getDbPersonalizationTemplates();
      return NextResponse.json(templates);
    }

    // GET /api/personalization-templates/product/{productId}
    if (path[0] === 'personalization-templates' && path[1] === 'product' && path[2]) {
      const { getDbPersonalizationTemplateByProductId } = require('@playr/nectar-core');
      const template = await getDbPersonalizationTemplateByProductId(path[2]);
      return NextResponse.json(template);
    }

    // 12. GET /api/products/{slug}/reviews
    if (path[0] === 'products' && path[1] && path[2] === 'reviews') {
      const { getDbReviewsByProductId, getDbProductBySlug } = require('@playr/nectar-core');
      const product = await getDbProductBySlug(path[1]);
      const pId = product ? product.id : path[1];
      const reviews = await getDbReviewsByProductId(pId);
      return NextResponse.json(reviews);
    }

    // 13. GET /api/products/{slug}
    if (path[0] === 'products' && path[1] && !path[2]) {
      const product = await getDbProductBySlug(path[1]);
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      const { getDbPersonalizationTemplateByProductId } = require('@playr/nectar-core');
      const template = await getDbPersonalizationTemplateByProductId(product.id);
      return NextResponse.json({
        ...product,
        personalizationTemplate: template
      });
    }

    // 13. GET /api/community/feed
    if (path[0] === 'community' && path[1] === 'feed') {
      const feed = await getDbCommunityFeed();
      return NextResponse.json(feed);
    }

    // 14. GET /api/admin/audit-logs (CRM logs)
    if (path[0] === 'admin' && path[1] === 'audit-logs') {
      const logs = await getDbAuditLogs();
      return NextResponse.json(logs);
    }

    // 15. GET /api/admin/support-tickets
    if (path[0] === 'admin' && path[1] === 'support-tickets') {
      const tickets = await getDbSupportTickets();
      return NextResponse.json(tickets);
    }

    // 16. GET /api/admin/leads
    if (path[0] === 'admin' && path[1] === 'leads') {
      const leads = await getDbLeads();
      return NextResponse.json(leads);
    }

    // 17. GET /api/admin/orders
    if (path[0] === 'admin' && path[1] === 'orders') {
      const orders = await getDbOrders();
      return NextResponse.json(orders);
    }

    // 18. GET /api/admin/coupons
    if (path[0] === 'admin' && path[1] === 'coupons') {
      const coupons = await getDbCoupons();
      return NextResponse.json(coupons);
    }

    // 19. GET /api/admin/blogs
    if (path[0] === 'admin' && path[1] === 'blogs') {
      const blogs = await getDbBlogs();
      return NextResponse.json(blogs);
    }

    // 20. GET /api/coupons/validate
    if (path[0] === 'coupons' && path[1] === 'validate') {
      const { getDbCouponByCode } = require('@playr/nectar-core');
      const code = searchParams.get('code') || '';
      const coupon = await getDbCouponByCode(code);
      if (!coupon) return NextResponse.json({ error: "Invalid or inactive promo code" }, { status: 404 });
      return NextResponse.json(coupon);
    }

    // GET /api/orders/{orderId}
    if (path[0] === 'orders' && path[1] && !path[2]) {
      const orders = await getDbOrders();
      const order = orders.find((o: any) => o.displayId === path[1] || o.id === path[1]);
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json(order);
    }

    // GET /api/personalizations
    if (path[0] === 'personalizations' && !path[1]) {
      const list = await getDbPersonalizations();
      return NextResponse.json(list);
    }

    // GET /api/personalizations/order/{orderId}
    if (path[0] === 'personalizations' && path[1] === 'order' && path[2]) {
      const list = await getDbPersonalizationByOrderId(path[2]);
      return NextResponse.json(list);
    }

    return NextResponse.json({ error: "API Endpoint not found" }, { status: 404 });
  } catch (err: any) {
    console.error("API GET Error", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path || [];
    
    const contentType = req.headers.get('content-type') || '';
    let body: any = null;
    if (contentType.includes('application/json')) {
      body = await req.json();
    }

    // Register User
    if (path[0] === 'register') {
      const { createDbUser, getDbUserByEmail } = require('@playr/nectar-core');
      const existing = await getDbUserByEmail(body.email);
      if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
      const user = await createDbUser({
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || ''
      });
      return NextResponse.json({ success: true, user });
    }

    // Forgot Password
    if (path[0] === 'auth' && path[1] === 'forgot-password') {
      const { getDbUserByEmail, addDbAuditLog } = require('@playr/nectar-core');
      const user = await getDbUserByEmail(body.email);
      if (!user) {
        return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
      }
      await addDbAuditLog(user.id, 'forgot_password_request', `Requested password reset link / OTP`);
      
      const { sendOtpEmail } = require('@/lib/notifications/email');
      const otp = '123456';
      await sendOtpEmail(body.email, otp);

      return NextResponse.json({ success: true, message: "OTP sent successfully" });
    }

    // Verify OTP
    if (path[0] === 'auth' && path[1] === 'verify-otp') {
      const { getDbUserByEmail, addDbAuditLog } = require('@playr/nectar-core');
      const user = await getDbUserByEmail(body.email);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      
      if (body.otp !== '123456') { // Mock OTP verification
        return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
      }
      
      await addDbAuditLog(user.id, 'verify_otp_success', `Successfully verified OTP`);
      return NextResponse.json({ success: true });
    }

    // Edit Profile
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && path[3] === 'profile') {
      const { updateDbUser, addDbAuditLog } = require('@playr/nectar-core');
      const updated = await updateDbUser(path[2], {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || '',
        dob: body.dob || null,
        gender: body.gender || null,
        sportPreference: body.sportPreference || null,
        favCategory: body.favCategory || null,
        favTeam: body.favTeam || null,
        jerseySize: body.jerseySize || null,
        emailPromo: body.emailPromo !== undefined ? body.emailPromo : true,
        smsPromo: body.smsPromo !== undefined ? body.smsPromo : true,
        rewardsSummary: body.rewardsSummary !== undefined ? body.rewardsSummary : true,
        language: body.language || 'en',
        privacyProfileVisible: body.privacyProfileVisible !== undefined ? body.privacyProfileVisible : true,
        twoFactorEnabled: body.twoFactorEnabled !== undefined ? body.twoFactorEnabled : false
      });
      await addDbAuditLog(path[2], 'edit_profile', `Updated profile fields and preferences.`);
      return NextResponse.json({ success: true, user: updated });
    }

    // POST /api/identity/users/{userId}/support-tickets
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && path[3] === 'support-tickets') {
      const { createDbSupportTicket } = require('@playr/nectar-core');
      const ticket = await createDbSupportTicket({
        userId: path[2],
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        priority: body.priority || 'medium',
        status: 'open',
        replies: [
          { sender: body.email, text: body.message, timestamp: new Date().toISOString() }
        ]
      });
      return NextResponse.json({ success: true, ticket });
    }

    // Wallet Topup
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && path[3] === 'wallet' && path[4] === 'topup') {
      const { getDbUserById, updateDbUser, addDbAuditLog } = require('@playr/nectar-core');
      const user = await getDbUserById(path[2]);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const amount = Number(body.amount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ error: "Invalid topup amount" }, { status: 400 });
      }

      const newBalance = (user.walletBalance || 0) + amount;
      const defaultTxns = [
        { id: "wt_1", date: "2026-05-15T10:00:00Z", amount: 200, type: "credit", description: "Refund for PR-98112" },
        { id: "wt_2", date: "2026-05-01T10:00:00Z", amount: 300, type: "credit", description: "Promotional Credit" }
      ];
      const txns = (user as any).walletTransactions || defaultTxns;
      const newTxn = {
        id: `wt_${Math.random().toString(36).substring(2, 9)}`,
        date: new Date().toISOString(),
        amount,
        type: 'credit' as const,
        description: body.description || 'Wallet Topup (Simulation)'
      };
      const updatedTxns = [newTxn, ...txns];

      await updateDbUser(path[2], {
        walletBalance: newBalance,
        walletTransactions: updatedTxns
      });

      await addDbAuditLog(path[2], 'wallet_topup', `Topped up wallet with ₹${amount}.`);
      return NextResponse.json({ success: true, balance: newBalance, transactions: updatedTxns });
    }

    // Edit Addresses
    if (path[0] === 'identity' && path[1] === 'users' && path[2] && path[3] === 'addresses') {
      const { getDbUserById, updateDbUser, addDbAuditLog } = require('@playr/nectar-core');
      const user = await getDbUserById(path[2]);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      let addresses = user.addresses || [];
      if (body.action === 'add') {
        const newAddr = { id: `addr_${Math.random().toString(36).substring(2, 9)}`, label: body.label, address: body.address };
        addresses.push(newAddr);
      } else if (body.action === 'delete') {
        addresses = addresses.filter((a: any) => a.id !== body.id);
      } else if (body.action === 'edit') {
        addresses = addresses.map((a: any) => a.id === body.id ? { ...a, label: body.label, address: body.address } : a);
      }

      await updateDbUser(path[2], { addresses });
      await addDbAuditLog(path[2], 'edit_addresses', `Modified address book.`);
      return NextResponse.json({ success: true, addresses });
    }

    // 1. POST /api/contact
    if (path[0] === 'contact') {
      const lead = await createDbLead({
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        phone: body.phone || '',
        subject: body.subject || '',
        message: body.message,
        source: 'contact_form'
      });
      // also create ticket
      await createDbSupportTicket({
        userId: 'guest',
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        subject: body.subject || 'General Inquiry',
        message: body.message
      });
      return NextResponse.json({ success: true, lead });
    }

    // 2. POST /api/newsletter
    if (path[0] === 'newsletter') {
      const lead = await createDbLead({
        name: body.email.split('@')[0],
        email: body.email,
        source: 'newsletter'
      });
      return NextResponse.json({ success: true, lead });
    }

    // 3. POST /api/loyalty/rewards/{rewardId}/redeem
    if (path[0] === 'loyalty' && path[1] === 'rewards' && path[2] && path[3] === 'redeem') {
      const userId = body.userId;
      const user = await getDbUserById(userId);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      
      const rewardsList = [
        { id: 'rwd_5pct_off', title: '5% Off Your Next Order', cost: 500 },
        { id: 'rwd_free_shipping', title: 'Free Standard Shipping', cost: 400 }
      ];
      const reward = rewardsList.find(r => r.id === path[2]);
      if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });

      if (user.rewardsPoints < reward.cost) {
        return NextResponse.json({ error: "Insufficient rewards points" }, { status: 400 });
      }

      const updatedXP = user.xp - reward.cost;
      let newTier = 'bronze';
      if (updatedXP >= 5000) newTier = 'elite';
      else if (updatedXP >= 2000) newTier = 'gold';
      else if (updatedXP >= 500) newTier = 'silver';

      const defaultTxns = [
        { id: "rt_1", date: "2026-05-15T10:00:00Z", points: 80, type: "earned" as const, description: "Order PR-99231" },
        { id: "rt_2", date: "2026-05-02T14:30:00Z", points: 130, type: "earned" as const, description: "Order PR-99104" }
      ];
      const txns = (user as any).rewardsTransactions || defaultTxns;
      const newTxn = {
        id: `rt_${Math.random().toString(36).substring(2, 9)}`,
        date: new Date().toISOString(),
        points: reward.cost,
        type: 'redeemed' as const,
        description: `Redeemed ${reward.title}`
      };
      const updatedTxns = [newTxn, ...txns];

      await updateDbUser(userId, {
        rewardsPoints: user.rewardsPoints - reward.cost,
        xp: updatedXP,
        tier: newTier,
        rewardsTransactions: updatedTxns
      });

      await addDbAuditLog(userId, 'redeem_reward', `Redeemed ${reward.title} for ${reward.cost} XP.`);
      await addDbCommunityFeedEntry({
        userId,
        displayName: `${user.firstName} ${user.lastName[0]}.`,
        action: 'reward_redeem',
        metadata: { rewardTitle: reward.title, xpSpent: reward.cost }
      });

      return NextResponse.json({ success: true, rewardsPoints: user.rewardsPoints - reward.cost, rewardsTransactions: updatedTxns });
    }

    // 4. POST /api/admin/coupons (Add coupon)
    if (path[0] === 'admin' && path[1] === 'coupons' && !path[2]) {
      const coupon = await createDbCoupon(body);
      await addDbAuditLog('admin', 'create_coupon', `Created discount coupon code: ${coupon.code}`);
      return NextResponse.json(coupon);
    }

    // 5. POST /api/admin/coupons/{id}/toggle
    if (path[0] === 'admin' && path[1] === 'coupons' && path[2] && path[3] === 'toggle') {
      const coupon = await toggleDbCoupon(path[2], body.isActive);
      await addDbAuditLog('admin', 'toggle_coupon', `Toggled coupon ${path[2]} active state to ${body.isActive}`);
      return NextResponse.json(coupon);
    }

    // 6. POST /api/admin/coupons/{id}/delete
    if (path[0] === 'admin' && path[1] === 'coupons' && path[2] && path[3] === 'delete') {
      await deleteDbCoupon(path[2]);
      await addDbAuditLog('admin', 'delete_coupon', `Deleted coupon ID: ${path[2]}`);
      return NextResponse.json({ success: true });
    }

    // 7. POST /api/admin/blogs
    if (path[0] === 'admin' && path[1] === 'blogs' && !path[2]) {
      const blog = await createDbBlog(body);
      await addDbAuditLog('admin', 'create_blog', `Created blog post: ${blog.title}`);
      return NextResponse.json(blog);
    }

    // 8. POST /api/admin/blogs/{id}/update
    if (path[0] === 'admin' && path[1] === 'blogs' && path[2] && path[3] === 'update') {
      const blog = await updateDbBlog(path[2], body);
      await addDbAuditLog('admin', 'update_blog', `Updated blog post ID: ${path[2]}`);
      return NextResponse.json(blog);
    }

    // 9. POST /api/admin/blogs/{id}/delete
    if (path[0] === 'admin' && path[1] === 'blogs' && path[2] && path[3] === 'delete') {
      await deleteDbBlog(path[2]);
      await addDbAuditLog('admin', 'delete_blog', `Deleted blog post ID: ${path[2]}`);
      return NextResponse.json({ success: true });
    }

    // 10. POST /api/admin/orders/{id}/status
    if (path[0] === 'admin' && path[1] === 'orders' && path[2] && path[3] === 'status') {
      const order = await updateDbOrderStatus(path[2], body.status);
      await addDbAuditLog('admin', 'update_order_status', `Updated order ID ${path[2]} status to ${body.status}`);
      return NextResponse.json(order);
    }

    // POST /api/admin/orders/{id}/personalize
    if (path[0] === 'admin' && path[1] === 'orders' && path[2] && path[3] === 'personalize') {
      const { loadDbData, saveDbData, addDbAuditLog } = require('@playr/nectar-core');
      const db = loadDbData();
      const orderIdx = db.orders.findIndex((o: any) => o.id === path[2] || o.displayId === path[2]);
      if (orderIdx !== -1) {
        const order = db.orders[orderIdx];
        const itemIdx = order.items.findIndex((i: any) => i.id === body.itemId);
        if (itemIdx !== -1) {
          const item = order.items[itemIdx];
          
          // Update order item fields
          order.items[itemIdx] = {
            ...item,
            playerName: body.playerName,
            playerNumber: body.playerNumber,
            previewImageUrl: body.previewImageUrl,
            imageSrc: body.previewImageUrl
          };
          
          // Update personalization table record
          const persIdx = db.personalizations.findIndex((p: any) => p.orderId === order.displayId && p.productId === item.productId);
          if (persIdx !== -1) {
            const current = db.personalizations[persIdx];
            if (!current.versions) current.versions = [];
            current.versions.push({
              playerName: current.playerName,
              playerNumber: current.playerNumber,
              previewImageUrl: current.previewImageUrl,
              createdAt: current.updatedAt || new Date().toISOString()
            });
            db.personalizations[persIdx] = {
              ...current,
              playerName: body.playerName,
              playerNumber: body.playerNumber,
              previewImageUrl: body.previewImageUrl,
              updatedAt: new Date().toISOString()
            };
          }
          
          saveDbData(db);
          await addDbAuditLog('admin', 'edit_personalization', `Admin updated personalization for order: ${order.displayId}`);
          return NextResponse.json(order);
        }
      }
      return NextResponse.json({ error: "Order or item not found" }, { status: 404 });
    }

    // 11. POST /api/admin/products/{id}/update
    if (path[0] === 'admin' && path[1] === 'products' && path[2] && path[3] === 'update') {
      const product = await updateDbProduct(path[2], body);
      await addDbAuditLog('admin', 'update_product', `Updated product ID ${path[2]} details.`);
      return NextResponse.json(product);
    }

    // POST /api/admin/products/{id}/personalization-template
    if (path[0] === 'admin' && path[1] === 'products' && path[2] && path[3] === 'personalization-template') {
      const { updateDbPersonalizationTemplate, addDbAuditLog } = require('@playr/nectar-core');
      const template = await updateDbPersonalizationTemplate(path[2], body);
      await addDbAuditLog('admin', 'update_product_template', `Updated personalization template for product ID ${path[2]}.`);
      return NextResponse.json(template);
    }

    // 12. POST /api/admin/tickets/{id}/reply
    if (path[0] === 'admin' && path[1] === 'tickets' && path[2] && path[3] === 'reply') {
      const ticket = await getDbSupportTickets();
      const currentTicket = ticket.find((t: any) => t.id === path[2]);
      if (currentTicket) {
        const replies = [...currentTicket.replies, { sender: body.sender, text: body.text, timestamp: new Date().toISOString() }];
        const updated = await updateDbSupportTicket(path[2], { replies, status: body.status || 'in_progress' });
        await addDbAuditLog('admin', 'support_reply', `Replied to support ticket: ${path[2]}`);
        return NextResponse.json(updated);
      }
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // 13. POST /api/admin/shipments/{id}/milestones
    if (path[0] === 'admin' && path[1] === 'shipments' && path[2] && path[3] === 'milestones') {
      const shipment = await updateDbShipmentMilestones(path[2], body.milestones, body.currentStatus);
      await addDbAuditLog('admin', 'update_shipment', `Updated shipment tracking ID: ${path[2]}`);
      return NextResponse.json(shipment);
    }

    // POST /api/orders
    if (path[0] === 'orders' && !path[1]) {
      const { createDbOrder, updateDbUser, getDbUserById } = require('@playr/nectar-core');
      const result = await createDbOrder(body);

      // Auto-save personalization records
      const { createDbPersonalization } = require('@playr/nectar-core');
      for (const item of (body.items || [])) {
        if (item.isPersonalized) {
          await createDbPersonalization({
            orderId: result.order.displayId,
            productId: item.productId,
            customerId: body.userId || 'guest',
            productVariantId: item.variantId || 'default',
            playerName: item.playerName,
            playerNumber: item.playerNumber,
            previewImageUrl: item.previewImageUrl,
            status: 'placed'
          });
        }
      }
      
      // Update user wallet/loyalty points if they were deducted or if they earned points
      if (body.userId && body.userId !== 'guest') {
        const user = await getDbUserById(body.userId);
        if (user) {
          let walletBalance = user.walletBalance || 0;
          let rewardsPoints = user.rewardsPoints || 0;
          let xp = user.xp || 0;
          
          if (body.walletDeducted) {
            walletBalance -= body.walletDeducted;
          }
          if (body.rewardsDeducted) {
            rewardsPoints -= body.rewardsDeducted;
            xp -= body.rewardsDeducted;
          }
          
          // Earn points (e.g. 10% of total paid as points and XP)
          const earned = Math.round(body.total * 0.1);
          rewardsPoints += earned;
          xp += earned;
          
          let newTier = 'bronze';
          if (xp >= 5000) newTier = 'elite';
          else if (xp >= 2000) newTier = 'gold';
          else if (xp >= 500) newTier = 'silver';
          
          await updateDbUser(body.userId, {
            walletBalance,
            rewardsPoints,
            xp,
            tier: newTier
          });
        }
      }

      // Send order confirmation email via SMTP (StreetPlayR architecture)
      try {
        const customerEmail = body.shippingAddress?.email || body.email;
        if (customerEmail) {
          const { sendOrderConfirmationEmail } = require('@/lib/notifications/email');
          sendOrderConfirmationEmail(customerEmail, result.order.displayId, {
            items: (body.items || []).map((it: any) => ({
              title: it.title || it.name || 'playR Item',
              quantity: it.quantity || 1,
              price: it.price || 0,
            })),
            total: body.total,
          }).catch((err: any) => console.error('[playR] Order email failed:', err));
        }
      } catch (err) {
        console.error('[playR] Order confirmation email trigger error:', err);
      }

      return NextResponse.json(result);
    }

    // 14. POST /api/cms/{pageId}/update
    if (path[0] === 'cms' && path[1] && path[2] === 'update') {
      const db = require('@playr/nectar-core/src/db/db');
      const updated = await db.updateDbCmsData(path[1], body);
      await addDbAuditLog('admin', 'update_cms', `Visual CMS updated page content for page: ${path[1]}`);
      return NextResponse.json(updated);
    }

    // 15. POST /api/products/{slug}/reviews
    if (path[0] === 'products' && path[1] && path[2] === 'reviews') {
      const { createDbReview, getDbUserById, updateDbUser, addDbAuditLog, addDbCommunityFeedEntry, getDbProductBySlug } = require('@playr/nectar-core');
      const product = await getDbProductBySlug(path[1]);
      const pId = product ? product.id : path[1];
      const review = await createDbReview({
        productId: pId,
        userName: body.userName,
        rating: body.rating,
        comment: body.comment
      });
      
      if (body.userId) {
        const user = await getDbUserById(body.userId);
        if (user) {
          const newXP = (user.xp || 0) + 200;
          let newTier = user.tier;
          if (newXP >= 5000) newTier = 'elite';
          else if (newXP >= 2000) newTier = 'gold';
          else if (newXP >= 500) newTier = 'silver';
          
          await updateDbUser(body.userId, { 
            xp: newXP, 
            rewardsPoints: (user.rewardsPoints || 0) + 200,
            tier: newTier 
          });
          await addDbAuditLog(body.userId, 'write_review', `Left a product review, earned 200 XP.`);
          await addDbCommunityFeedEntry({
            userId: body.userId,
            displayName: `${user.firstName} ${user.lastName[0]}.`,
            action: 'challenge_complete',
            metadata: { challengeTitle: 'Leave a Review', xpEarned: 200 }
          });
        }
      }
      return NextResponse.json(review);
    }

    // POST /api/personalizations/upload
    if (path[0] === 'personalizations' && path[1] === 'upload') {
      try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
          return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.png`;
        const filePath = `personalization/${fileName}`;

        const { supabase } = require('@playr/nectar-core');
        if (supabase) {
          const { data, error } = await supabase.storage
            .from('personalizations')
            .upload(filePath, buffer, {
              contentType: 'image/png',
              upsert: true
            });

          if (!error && data) {
            const { data: urlData } = supabase.storage
              .from('personalizations')
              .getPublicUrl(filePath);

            return NextResponse.json({ url: urlData.publicUrl });
          } else {
            console.warn("Supabase upload error, falling back to local storage:", error);
          }
        }

        const fs = require('fs');
        const pathLib = require('path');
        const dirPath = pathLib.join(process.cwd(), 'public', 'personalization');
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(pathLib.join(dirPath, fileName), buffer);
        
        const localUrl = `/personalization/${fileName}`;
        return NextResponse.json({ url: localUrl });

      } catch (e: any) {
        console.error("Upload handler failed:", e);
        return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
      }
    }

    // POST /api/personalizations
    if (path[0] === 'personalizations' && !path[1]) {
      const record = await createDbPersonalization(body);
      return NextResponse.json(record);
    }

    // POST /api/personalizations/{id}/update
    if (path[0] === 'personalizations' && path[1] && path[2] === 'update') {
      const record = await updateDbPersonalization(path[1], body);
      return NextResponse.json(record);
    }

    return NextResponse.json({ error: "API Endpoint not found" }, { status: 404 });

  } catch (err: any) {
    console.error("API POST Error", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
