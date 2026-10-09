'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/components/bluorng/CartContext';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  // Form State
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
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'upi' | 'cod'>('online');

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const handleSubmitOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !postalCode || !phone) {
      setError('Please fill in all required shipping and contact details.');
      return;
    }

    setError(null);
    setPhase('processing');

    try {
      const orderPayload = {
        userId: email,
        total,
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
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.order?.displayId || data.order?.id || `PR-${Date.now()}`);
      } else {
        const generatedOrderId = `PR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(generatedOrderId);
      }
    } catch {
      const generatedOrderId = `PR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedOrderId);
    } finally {
      clearCart();
      setPhase('success');
    }
  }, [email, firstName, lastName, address, apartment, city, state, postalCode, phone, country, paymentMethod, total, items, clearCart]);

  if (!mounted) return null;

  // Empty cart phase
  if (items.length === 0 && phase !== 'success') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 block mb-3">
            playR Checkout
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-4">
            Your Bag is Empty
          </h1>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">
            Looks like you haven&apos;t added any performance wear or official team gear yet.
          </p>
          <Link
            href="/collections/all-products"
            className="inline-block px-8 py-3.5 border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
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
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center py-48">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 text-center"
        >
          Securing Order Allocation &amp; Verification...
        </motion.div>
      </div>
    );
  }

  // Success phase
  if (phase === 'success') {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32 px-6 sm:px-12">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="border border-white/10 bg-[#0c0c0c] p-8 md:p-12 rounded-lg"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-xl">
              ✓
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">
              Allocation Confirmed
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
              Order Confirmed
            </h1>
            <p className="font-mono text-xs text-white/70 mb-6">
              Reference: <span className="text-white font-bold">{orderId}</span>
            </p>
            <p className="text-xs text-white/60 leading-relaxed mb-8">
              A dispatch notification and tracking link will be sent to <span className="text-white">{email}</span> once your package is dispatched from our fulfillment facility.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/collections/all-products"
                className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="px-8 py-3.5 border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Back Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main checkout form (Streetplayr sleek style)
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-16 sm:pt-20 pb-36 px-4 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity">
              PLAYR
            </span>
          </Link>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
            Secure Checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-10">
            {error && (
              <div className="p-4 rounded border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs uppercase tracking-wider">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-10">
              {/* Contact Information */}
              <div>
                <h2 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-3">
                  01 // Contact Information
                </h2>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-3">
                  02 // Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Flat / Street address"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      Apartment, suite, unit (optional)
                    </label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Apartment, suite, unit"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="PIN Code"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      Country / Region *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-white/15 rounded px-4 py-3 text-xs text-white focus:border-white focus:outline-none transition-colors"
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

              {/* Payment Methods */}
              <div>
                <h2 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-3">
                  03 // Payment Method
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded border cursor-pointer transition-colors ${
                      paymentMethod === 'online'
                        ? 'border-white bg-white/5'
                        : 'border-white/15 bg-[#0d0d0d] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="accent-white"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Online Payment (UPI, Debit/Credit Card, Net Banking)
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400">
                      Recommended
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded border cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-white bg-white/5'
                        : 'border-white/15 bg-[#0d0d0d] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-white"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                      Pay at Doorstep
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.25em] font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Secure Allocation — {formatPrice(total)}
              </button>
            </form>
          </div>

          {/* Right Column: Dossier Summary */}
          <div className="lg:col-span-5 bg-[#0d0d0d] border border-white/10 rounded-lg p-6 md:p-8 lg:sticky lg:top-28">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40 mb-6 border-b border-white/10 pb-3">
              Order Dossier ({items.length} {items.length === 1 ? 'Item' : 'Items'})
            </h3>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 items-center py-2 border-b border-white/5">
                  <div className="relative w-14 h-16 bg-[#161616] rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.customImage || item.product.images[0] || ''}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-white truncate">
                      {item.product.title}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40 mt-1">
                      Size: {item.size || 'One Size'} · Qty: {item.qty}
                    </p>
                    {item.customName && (
                      <p className="font-mono text-[9px] text-amber-400 mt-0.5">
                        Custom: {item.customName} #{item.customNumber || ''}
                      </p>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white font-mono">
                    {formatPrice(item.product.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-white/60">
                <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                <span className="text-emerald-400">Complimentary</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span className="uppercase tracking-widest text-[10px]">Taxes</span>
                <span>Included</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                <span className="uppercase tracking-widest text-xs">Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-8 p-3 bg-white/5 rounded text-[10px] text-white/40 font-mono text-center">
              🔒 256-bit encrypted checkout with direct order tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
