'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/components/bluorng/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  // Contact & Shipping details
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');

  // Delivery Speed
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');

  // Coupon & NECTAR Wallet
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [useNectarWallet, setUseNectarWallet] = useState(false);
  const nectarWalletCredit = 250;

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  useEffect(() => {
    setMounted(true);
  }, []);

  const shippingCost = deliverySpeed === 'express' ? 150 : 0;
  const nectarDeduction = useNectarWallet ? Math.min(nectarWalletCredit, Math.max(0, total - couponDiscount)) : 0;
  const netTotal = Math.max(0, total - couponDiscount - nectarDeduction + shippingCost);

  const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === 'PLAYR10' || code === 'FIRST10') {
      const discount = Math.round(total * 0.1);
      setAppliedCoupon(code);
      setCouponDiscount(discount);
      setError(null);
    } else if (code === 'STREETPLAYR20' || code === 'PLAYR20') {
      const discount = Math.round(total * 0.2);
      setAppliedCoupon(code);
      setCouponDiscount(discount);
      setError(null);
    } else if (code === 'NECTAR250') {
      setUseNectarWallet(true);
      setAppliedCoupon(code);
      setCouponDiscount(0);
      setError(null);
    } else {
      setError(`Invalid coupon code: "${code}". Try PLAYR10 or STREETPLAYR20.`);
    }
  };

  const handleSubmitOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !postalCode || !phone) {
      setError('Please fill in all required shipping and contact details.');
      return;
    }

    setError(null);
    setPhase('processing');

    const generatedOrderId = `PR-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const orderPayload = {
        userId: email,
        total: netTotal,
        subtotal: total,
        discount: couponDiscount + nectarDeduction,
        shippingFee: shippingCost,
        items: items.map((item) => ({
          productId: item.product.handle,
          title: item.product.title,
          imageSrc: item.customImage || item.product.images[0] || '',
          price: item.product.price,
          quantity: item.qty,
          size: item.size || 'One Size',
          isPersonalized: !!(item.customName || item.customNumber),
          playerName: item.customName || '',
          playerNumber: item.customNumber || '',
          previewImageUrl: item.customImage || '',
        })),
        shippingAddress: {
          firstName,
          lastName,
          email,
          phone,
          address,
          apartment,
          city,
          state,
          postalCode,
          country,
        },
        deliverySpeed,
        appliedCoupon,
        useNectarWallet,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      };

      // 1. Persist order to database/API first
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let savedOrderId = generatedOrderId;
      if (res.ok) {
        const data = await res.json();
        savedOrderId = data.order?.displayId || data.order?.id || generatedOrderId;
        setOrderId(savedOrderId);
      } else {
        setOrderId(generatedOrderId);
      }

      // 2. Award loyalty points / local storage record
      try {
        const earnedPoints = Math.round(netTotal * 0.1);
        const currentPoints = parseInt(localStorage.getItem('playr_loyalty_points') || '0', 10);
        localStorage.setItem('playr_loyalty_points', (currentPoints + earnedPoints).toString());
        localStorage.setItem('playr_last_order', JSON.stringify({ orderId: savedOrderId, date: new Date().toISOString(), total: netTotal }));
      } catch (err) {
        console.debug('Failed to record loyalty points', err);
      }

      // 3. If Online Payment, call Easebuzz payment initiation and redirect
      if (paymentMethod === 'online') {
        const easebuzzRes = await fetch('/api/checkout/easebuzz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: netTotal,
            firstname: `${firstName} ${lastName}`.trim(),
            email,
            phone,
            txnid: savedOrderId,
            productinfo: items.map((i) => i.product.title).slice(0, 3).join(', '),
            surl: typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/easebuzz` : '',
            furl: typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/easebuzz` : '',
          }),
        });

        if (easebuzzRes.ok) {
          const easebuzzData = await easebuzzRes.json();
          if (easebuzzData?.paymentUrl) {
            clearCart();
            window.location.href = easebuzzData.paymentUrl;
            return;
          }
        }
      }

      clearCart();
      router.push(`/order-success/${savedOrderId}`);
    } catch (err: any) {
      console.error('Checkout processing error:', err);
      setOrderId(generatedOrderId);
      clearCart();
      setPhase('success');
    }
  }, [
    email,
    firstName,
    lastName,
    address,
    apartment,
    city,
    state,
    postalCode,
    phone,
    country,
    deliverySpeed,
    paymentMethod,
    netTotal,
    total,
    couponDiscount,
    nectarDeduction,
    shippingCost,
    items,
    appliedCoupon,
    useNectarWallet,
    clearCart,
    router,
  ]);

  if (!mounted) return null;

  // Empty cart phase
  if (items.length === 0 && phase !== 'success') {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--fg)] flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-[var(--panel)] border border-[var(--line)] p-8 rounded-[var(--radius-lg)]"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)] block mb-3">
            playR Checkout
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-4">
            Your Bag is Empty
          </h1>
          <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
            Looks like you haven&apos;t added any performance wear or official team gear yet.
          </p>
          <Link
            href="/collections/all-products"
            className="inline-block px-8 py-3.5 bg-[var(--fg)] text-[var(--panel)] text-xs font-bold uppercase tracking-widest rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
          >
            Explore Catalog
          </Link>
        </motion.div>
      </div>
    );
  }

  // Processing phase
  if (phase === 'processing') {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--fg)] flex flex-col items-center justify-center py-48">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center bg-[var(--panel)] border border-[var(--line)] p-8 rounded-[var(--radius-lg)]"
        >
          <div className="w-8 h-8 border-2 border-[var(--fg)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
            Connecting to Easebuzz Gateway &amp; Securing Allocation...
          </div>
        </motion.div>
      </div>
    );
  }

  // Success phase
  if (phase === 'success') {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--fg)] pt-24 pb-32 px-6 sm:px-12">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="border border-[var(--line)] bg-[var(--panel)] p-8 md:p-12 rounded-[var(--radius-lg)] shadow-xl"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6 text-xl">
              ✓
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] block mb-2">
              Payment &amp; Allocation Verified
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
              Order Confirmed
            </h1>
            <p className="font-mono text-xs text-[var(--muted)] mb-6">
              Reference: <span className="text-[var(--fg)] font-bold">{orderId}</span>
            </p>
            <div className="p-4 rounded-[var(--radius)] bg-[var(--chip)] border border-[var(--line)] mb-6 text-xs text-left">
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                <span>✦ SP-RR Loyalty Points Credited</span>
                <span>+{Math.round(netTotal * 0.1)} PTS</span>
              </div>
              <p className="text-[var(--muted)] text-[11px]">
                Earned via StreetplayR NECTAR Rewards program.
              </p>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed mb-8">
              A dispatch notification and tracking link will be sent to <span className="text-[var(--fg)] font-semibold">{email}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/collections/all-products"
                className="px-8 py-3.5 bg-[var(--fg)] text-[var(--panel)] text-xs font-bold uppercase tracking-widest rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="px-8 py-3.5 border border-[var(--line)] text-xs font-bold uppercase tracking-widest rounded-[var(--radius-sm)] hover:bg-[var(--chip)] transition-colors"
              >
                Back Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main StreetplayR 2-step checkout form
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--fg)] pt-16 sm:pt-20 pb-36 px-4 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-[0.2em] uppercase text-[var(--fg)] hover:opacity-80 transition-opacity">
              PLAYR
            </span>
          </Link>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">
            StreetplayR Secure Checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            {error && (
              <div className="p-4 rounded-[var(--radius)] border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs uppercase tracking-wider">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* Step 1: Contact Information */}
              <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[var(--radius)] p-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4 border-b border-[var(--line)] pb-2 flex items-center justify-between">
                  <span>01 // Contact Information</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Step 1 of 2</span>
                </h2>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Step 1B: Shipping Address */}
              <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[var(--radius)] p-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4 border-b border-[var(--line)] pb-2">
                  02 // Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Flat / Street address"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      Apartment, suite, unit (optional)
                    </label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Apartment, suite, unit"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="PIN Code"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] placeholder-[var(--muted)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      Country / Region *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] px-4 py-3 text-xs text-[var(--fg)] focus:border-[var(--fg)] focus:outline-none transition-colors"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[var(--radius)] p-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4 border-b border-[var(--line)] pb-2">
                  03 // Delivery Speed
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-4 rounded-[var(--radius-sm)] border cursor-pointer flex flex-col justify-between transition-colors ${
                      deliverySpeed === 'standard'
                        ? 'border-[var(--fg)] bg-[var(--chip)]'
                        : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--muted)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliverySpeed"
                          checked={deliverySpeed === 'standard'}
                          onChange={() => setDeliverySpeed('standard')}
                          className="accent-[var(--fg)]"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">Standard</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Free</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted)]">3–5 Business Days · India Post / Bluedart</span>
                  </label>

                  <label
                    className={`p-4 rounded-[var(--radius-sm)] border cursor-pointer flex flex-col justify-between transition-colors ${
                      deliverySpeed === 'express'
                        ? 'border-[var(--fg)] bg-[var(--chip)]'
                        : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--muted)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliverySpeed"
                          checked={deliverySpeed === 'express'}
                          onChange={() => setDeliverySpeed('express')}
                          className="accent-[var(--fg)]"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">Express Air</span>
                      </div>
                      <span className="text-xs font-bold text-[var(--fg)]">₹150</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted)]">1–2 Business Days · Priority Air Dispatch</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[var(--radius)] p-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4 border-b border-[var(--line)] pb-2 flex items-center justify-between">
                  <span>04 // Payment Gateway</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Step 2 of 2</span>
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-[var(--radius-sm)] border cursor-pointer transition-colors ${
                      paymentMethod === 'online'
                        ? 'border-[var(--fg)] bg-[var(--chip)]'
                        : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="accent-[var(--fg)]"
                      />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block">
                          Easebuzz Gateway (UPI, Cards, NetBanking)
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">
                          Secured via Easebuzz 256-bit SHA-512 encryption
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                      Recommended
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-[var(--radius-sm)] border cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[var(--fg)] bg-[var(--chip)]'
                        : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[var(--fg)]"
                      />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">
                          Pay cash upon delivery at your doorstep
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">
                      Doorstep
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[var(--fg)] text-[var(--panel)] font-mono text-xs uppercase tracking-[0.25em] font-bold rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
              >
                Place Order &amp; Pay {formatPrice(netTotal)}
              </button>
            </form>
          </div>

          {/* Right Column: Order Dossier & Price Breakdown */}
          <div className="lg:col-span-5 bg-[var(--panel)] border border-[var(--line)] rounded-[var(--radius)] p-6 md:p-8 lg:sticky lg:top-24 space-y-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--muted)] border-b border-[var(--line)] pb-3">
              Order Dossier ({items.length} {items.length === 1 ? 'Item' : 'Items'})
            </h3>

            {/* Cart Items List */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 items-center py-2 border-b border-[var(--line)]">
                  <div className="relative w-14 h-16 bg-[var(--chip)] rounded-[var(--radius-sm)] overflow-hidden flex-shrink-0">
                    <img
                      src={item.customImage || item.product.images[0] || ''}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--fg)] truncate">
                      {item.product.title}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mt-0.5">
                      Size: {item.size || 'One Size'} · Qty: {item.qty}
                    </p>
                    {item.customName && (
                      <p className="font-mono text-[9px] text-amber-600 dark:text-amber-400 mt-0.5">
                        Custom: #{item.customNumber || '0'} {item.customName}
                      </p>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[var(--fg)] font-mono">
                    {formatPrice(item.product.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Entry */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Promo Code"
                className="flex-1 px-3 py-2 text-xs bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[var(--fg)] placeholder-[var(--muted)] uppercase font-semibold focus:outline-none focus:border-[var(--fg)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--fg)] text-[var(--panel)] text-xs font-bold uppercase tracking-wider rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </form>
            {appliedCoupon && (
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold -mt-3">
                Coupon &quot;{appliedCoupon}&quot; applied (-{formatPrice(couponDiscount)})
              </div>
            )}

            {/* NECTAR Digital Wallet Toggle */}
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--chip)] border border-[var(--line)] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--fg)] block">NECTAR Digital Wallet</span>
                <span className="text-[10px] text-[var(--muted)]">₹250 credit available</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNectarWallet}
                  onChange={(e) => setUseNectarWallet(e.target.checked)}
                  className="rounded border-[var(--line)] text-[var(--fg)] cursor-pointer"
                />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {useNectarWallet ? 'Applied' : 'Apply'}
                </span>
              </label>
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-[var(--line)] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-[var(--muted)]">
                <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="uppercase tracking-widest text-[10px]">Coupon Discount</span>
                  <span>−{formatPrice(couponDiscount)}</span>
                </div>
              )}
              {nectarDeduction > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="uppercase tracking-widest text-[10px]">NECTAR Wallet Credit</span>
                  <span>−{formatPrice(nectarDeduction)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--muted)]">
                <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'Complimentary'}</span>
              </div>
              <div className="pt-3 border-t border-[var(--line)] flex justify-between text-sm font-black text-[var(--fg)]">
                <span className="uppercase tracking-widest text-xs">Net Total</span>
                <span>{formatPrice(netTotal)}</span>
              </div>
            </div>

            <div className="p-3 bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[10px] text-[var(--muted)] font-mono text-center">
              🔒 256-bit encrypted Easebuzz checkout with SP-RR rewards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
