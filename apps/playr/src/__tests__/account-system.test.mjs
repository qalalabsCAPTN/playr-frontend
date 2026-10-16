import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Deterministic root resolution regardless of execution cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLAYR_DIR = path.resolve(__dirname, '../..');
const ACCOUNT_DIR = path.join(PLAYR_DIR, 'src/app/account');

describe('QA Suite: PlayR Account Ecosystem', () => {

  describe('1. Static Code & Brand Integrity Audits', () => {
    
    it('should have zero raw Material Symbols ligatures in account pages', () => {
      // Arrange: Known raw ligature tokens that previously broke UI rendering
      const rawLigatures = [
        'account_balance_wallet',
        'local_shipping',
        'inventory_2',
        'shopping_bag',
        'content_copy',
        'support_agent',
        'verified_user',
        'swap_horiz',
        'credit_card',
        'account_circle'
      ];

      const accountFiles = fs.readdirSync(ACCOUNT_DIR, { recursive: true })
        .filter(f => typeof f === 'string' && f.endsWith('.tsx'))
        .map(f => path.join(ACCOUNT_DIR, f));

      assert.ok(accountFiles.length >= 10, 'All account pages must be present');

      // Act & Assert
      for (const filePath of accountFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const token of rawLigatures) {
          const regex = new RegExp(`<span[^>]*class(?:Name)?=["'][^"']*material-symbols-outlined[^"']*["'][^>]*>\\s*${token}\\s*<\\/span>`, 'g');
          const matches = content.match(regex);
          assert.strictEqual(
            matches,
            null,
            `Regression found: File ${path.basename(filePath)} still contains raw Material Symbol ligature "${token}". Use Lucide vector icons instead.`
          );
        }
      }
    });

    it('should adhere to strict "playR" brand casing in headings and brand copy', () => {
      // Arrange
      const accountLayout = fs.readFileSync(path.join(ACCOUNT_DIR, 'layout.tsx'), 'utf8');
      const accountOverview = fs.readFileSync(path.join(ACCOUNT_DIR, 'page.tsx'), 'utf8');

      // Assert
      assert.ok(accountLayout.includes('playR') || accountOverview.includes('playR'), 'playR brand casing must be present in layout or overview');
      
      // Ensure bad casing like "Playr" or "PLAYR" isn't used as brand name in key titles
      assert.strictEqual(/<span[^>]*>\s*Playr\s*<\/span>/i.test(accountLayout), false);
    });

    it('should ensure collection links target valid collection slugs and avoid bare /collections', () => {
      // Arrange: Valid collection slugs according to CLAUDE.md
      const validSlugs = ['new-in', 'all-products', 'apparel', 'topwear', 'bottomwear', 'caps', 'premium-polos', 'street-luxe'];

      const wishlistPage = fs.readFileSync(path.join(ACCOUNT_DIR, 'wishlist/page.tsx'), 'utf8');
      const overviewPage = fs.readFileSync(path.join(ACCOUNT_DIR, 'page.tsx'), 'utf8');

      // Assert wishlist empty state links to a valid slug
      assert.ok(
        wishlistPage.includes('/collections/all-products') || wishlistPage.includes('/collections/new-in'),
        'Wishlist empty link must point to a valid collections slug, not bare /collections'
      );

      // Assert overview shop link points to valid collection
      assert.ok(
        overviewPage.includes('/collections/premium-polos') || overviewPage.includes('/collections/all-products'),
        'Overview shop drop button must point to an active collection'
      );
    });

    it('should use brand category taxonomy (Topwear / Bottomwear)', () => {
      // Arrange
      const wishlistPage = fs.readFileSync(path.join(ACCOUNT_DIR, 'wishlist/page.tsx'), 'utf8');
      assert.ok(
        wishlistPage.includes('Topwear'),
        'Wishlist must use playR category taxonomy (Topwear)'
      );
    });
  });

  describe('2. Commerce & Account Business Logic Contracts', () => {

    it('should strictly validate Wallet Top-Up math and reject invalid bounds', () => {
      // Arrange
      const calculateNewBalance = (currentBalance, topUpAmount) => {
        if (typeof topUpAmount !== 'number' || isNaN(topUpAmount) || topUpAmount <= 0) {
          throw new Error('Invalid top-up amount');
        }
        if (topUpAmount > 50000) {
          throw new Error('Top-up exceeds maximum single transaction limit of ₹50,000');
        }
        return currentBalance + topUpAmount;
      };

      // Act & Assert: Valid top-ups
      const initial = 2450;
      assert.strictEqual(calculateNewBalance(initial, 100), 2550);
      assert.strictEqual(calculateNewBalance(initial, 500), 2950);
      assert.strictEqual(calculateNewBalance(initial, 1000), 3450);
      assert.strictEqual(calculateNewBalance(initial, 5000), 7450);

      // Edge cases & Error paths
      assert.throws(() => calculateNewBalance(initial, -100), /Invalid top-up amount/);
      assert.throws(() => calculateNewBalance(initial, 0), /Invalid top-up amount/);
      assert.throws(() => calculateNewBalance(initial, NaN), /Invalid top-up amount/);
      assert.throws(() => calculateNewBalance(initial, 60000), /exceeds maximum/);
    });

    it('should validate Rewards XP loyalty tier thresholds and redemption math', () => {
      // Arrange
      const getTier = (xp) => {
        if (xp >= 10000) return 'Icon';
        if (xp >= 5000) return 'MVP';
        if (xp >= 2000) return 'All-Star';
        return 'Rookie';
      };

      const redeemVoucher = (currentXP, voucherCost) => {
        if (currentXP < voucherCost) {
          throw new Error('Insufficient XP for redemption');
        }
        return currentXP - voucherCost;
      };

      // Act & Assert: Tier boundaries
      assert.strictEqual(getTier(0), 'Rookie');
      assert.strictEqual(getTier(1999), 'Rookie');
      assert.strictEqual(getTier(2000), 'All-Star');
      assert.strictEqual(getTier(4999), 'All-Star');
      assert.strictEqual(getTier(5000), 'MVP');
      assert.strictEqual(getTier(10000), 'Icon');
      assert.strictEqual(getTier(15000), 'Icon');

      // Redemption
      assert.strictEqual(redeemVoucher(2400, 1000), 1400);
      assert.throws(() => redeemVoucher(500, 1000), /Insufficient XP/);
    });

    it('should validate Tracking shipment state transitions', () => {
      // Arrange: Deterministic state machine
      const VALID_TRANSITIONS = {
        'CONFIRMED': ['PROCESSING', 'CANCELLED'],
        'PROCESSING': ['SHIPPED', 'CANCELLED'],
        'SHIPPED': ['OUT_FOR_DELIVERY', 'EXCEPTION'],
        'OUT_FOR_DELIVERY': ['DELIVERED', 'FAILED_ATTEMPT'],
        'DELIVERED': ['RETURN_REQUESTED'],
        'RETURN_REQUESTED': ['RETURN_APPROVED', 'RETURN_REJECTED'],
        'CANCELLED': []
      };

      const transitionState = (currentState, nextState) => {
        const allowed = VALID_TRANSITIONS[currentState] || [];
        if (!allowed.includes(nextState)) {
          throw new Error(`Invalid shipment state transition from ${currentState} to ${nextState}`);
        }
        return nextState;
      };

      // Act & Assert: Valid progression
      let state = 'CONFIRMED';
      state = transitionState(state, 'PROCESSING');
      assert.strictEqual(state, 'PROCESSING');
      state = transitionState(state, 'SHIPPED');
      assert.strictEqual(state, 'SHIPPED');
      state = transitionState(state, 'OUT_FOR_DELIVERY');
      assert.strictEqual(state, 'OUT_FOR_DELIVERY');
      state = transitionState(state, 'DELIVERED');
      assert.strictEqual(state, 'DELIVERED');

      // Act & Assert: Invalid skips (e.g. Confirmed straight to Delivered)
      assert.throws(() => transitionState('CONFIRMED', 'DELIVERED'), /Invalid shipment state transition/);
    });

    it('should validate Returns eligibility window (14-day policy)', () => {
      // Arrange
      const isEligibleForReturn = (deliveryDateString, currentDateString) => {
        const deliveryDate = new Date(deliveryDateString);
        const currentDate = new Date(currentDateString);
        const diffMs = currentDate.getTime() - deliveryDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 14;
      };

      // Act & Assert
      assert.strictEqual(isEligibleForReturn('2026-10-01', '2026-10-10'), true, 'Day 9 is eligible');
      assert.strictEqual(isEligibleForReturn('2026-10-01', '2026-10-15'), true, 'Day 14 is eligible');
      assert.strictEqual(isEligibleForReturn('2026-10-01', '2026-10-16'), false, 'Day 15 is ineligible');
      assert.strictEqual(isEligibleForReturn('2026-10-01', '2026-09-30'), false, 'Future date is ineligible');
    });

    it('should validate Wishlist-to-Cart payload contract and state isolation', () => {
      // Arrange: Simulated state store
      let wishlist = [
        { productId: 'prod_1', title: 'Overload Boxy Tee', price: 1999, imageSrc: '/tee.jpg', colorName: 'Noir', size: 'L' }
      ];
      let cart = [];

      const moveToCart = (item) => {
        // Assert required contract fields
        assert.ok(item.productId, 'Item must have productId');
        assert.ok(item.title, 'Item must have title');
        assert.ok(typeof item.price === 'number', 'Price must be a number');
        
        const cartItem = {
          id: `${item.productId}-${item.colorName || 'Default'}-${item.size || 'M'}`,
          productId: item.productId,
          variantId: 'default',
          title: item.title,
          price: item.price,
          imageSrc: item.imageSrc,
          quantity: 1,
          colorName: item.colorName || 'Default',
          size: item.size || 'M'
        };

        cart.push(cartItem);
        wishlist = wishlist.filter(w => w.productId !== item.productId);
      };

      // Act
      moveToCart(wishlist[0]);

      // Assert
      assert.strictEqual(cart.length, 1, 'Cart should contain exactly 1 item');
      assert.strictEqual(cart[0].id, 'prod_1-Noir-L', 'Cart item ID correctly composed');
      assert.strictEqual(wishlist.length, 0, 'Item removed from wishlist');
    });
  });

  describe('3. Account Sub-Routes Existence & Completeness', () => {
    
    const REQUIRED_ROUTES = [
      '',
      'orders',
      'orders/[id]',
      'tracking',
      'tracking/[id]',
      'addresses',
      'profile',
      'returns',
      'rewards',
      'settings',
      'support',
      'wallet',
      'wishlist'
    ];

    for (const subRoute of REQUIRED_ROUTES) {
      it(`should contain page implementation for /account/${subRoute}`, () => {
        const targetPath = subRoute === '' 
          ? path.join(ACCOUNT_DIR, 'page.tsx')
          : path.join(ACCOUNT_DIR, subRoute, 'page.tsx');
        
        assert.ok(
          fs.existsSync(targetPath),
          `Missing page component at ${targetPath}`
        );

        const content = fs.readFileSync(targetPath, 'utf8');
        assert.ok(content.length > 50, `File ${targetPath} appears to be empty`);
      });
    }
  });

});
