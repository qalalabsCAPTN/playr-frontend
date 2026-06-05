"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useCommerce } from "@/components/commerce/CommerceProvider"
import { CheckoutProvider, useCheckout } from "@/components/commerce/CheckoutProvider"

function CheckoutForm() {
  const { cartItems, cartSubtotal } = useCommerce()
  const { 
    email, setEmail, 
    savedAddresses, selectedAddressId, setSelectedAddressId,
    shippingAddress, setShippingAddress, 
    useSameForBilling, setUseSameForBilling,
    billingAddress, setBillingAddress,
    shippingMethod, setShippingMethod,
    paymentMethod, setPaymentMethod,
    walletBalance, applyWallet, setApplyWallet,
    rewardsPoints, applyRewards, setApplyRewards,
    isProcessing, error, submitCheckout 
  } = useCheckout()

  // Calculate actual total based on checkout state
  const shippingCost = shippingMethod === 'express' ? 150 : 0;
  let finalTotal = cartSubtotal + shippingCost;
  if (applyWallet) finalTotal -= Math.min(walletBalance, finalTotal);
  if (applyRewards) finalTotal -= Math.min(rewardsPoints / 10, finalTotal);

  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-label-md font-label-md">1</div>
          <span className="text-label-md font-label-md uppercase tracking-wider">Cart</span>
        </div>
        <div className="w-12 h-[2px] bg-secondary"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-label-md font-label-md">2</div>
          <span className="text-label-md font-label-md uppercase tracking-wider font-bold">Checkout</span>
        </div>
        <div className="w-12 h-[2px] bg-outline-variant"></div>
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center text-on-surface text-label-md font-label-md">3</div>
          <span className="text-label-md font-label-md uppercase tracking-wider">Success</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Checkout Forms */}
        <div className="md:col-span-7 space-y-10">
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl font-label-md border border-error/20">
              {error}
            </div>
          )}

          {/* Express Checkout */}
          <section className="space-y-6">
            <h2 className="text-label-lg font-label-lg uppercase tracking-widest text-secondary flex items-center gap-2">
              Express Checkout
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-black text-white h-12 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                <span className="font-bold text-lg italic">GPay</span>
              </button>
              <button className="bg-black text-white h-12 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                <span className="font-bold text-lg">Apple Pay</span>
              </button>
            </div>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-secondary/20"></div>
              <span className="flex-shrink mx-4 text-label-md font-label-md text-secondary uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-secondary/20"></div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-headline-sm font-headline-sm">Contact</h2>
              <span className="text-label-md font-label-md text-secondary">Have an account? <Link href="/account" className="underline">Log in</Link></span>
            </div>
            <div>
              <input 
                className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all focus:border-[#5c5c5b]" 
                placeholder="Email Address" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="space-y-6 transition-transform">
            <h2 className="text-headline-sm font-headline-sm">Shipping</h2>
            
            {/* Address Manager */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-label-md font-label-md uppercase text-secondary">Saved Addresses</p>
                {savedAddresses.map((addr, idx) => {
                  const id = `saved-${idx}`;
                  return (
                    <label key={id} className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === id ? 'border-primary bg-primary/5' : 'border-secondary/20 bg-surface-container-low hover:bg-surface-container'}`}>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="savedAddress" 
                          className="w-4 h-4 text-primary focus:ring-primary mr-4"
                          checked={selectedAddressId === id}
                          onChange={() => {
                            setSelectedAddressId(id);
                            setShippingAddress(addr);
                          }}
                        />
                        <span className="font-bold">{addr.firstName} {addr.lastName}</span>
                      </div>
                      <p className="text-label-md text-secondary ml-8 mt-1">{addr.address}, {addr.city}, {addr.state} {addr.pinCode}</p>
                    </label>
                  )
                })}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === null ? 'border-primary bg-primary/5' : 'border-secondary/20 bg-surface-container-low hover:bg-surface-container'}`}>
                  <input 
                    type="radio" 
                    name="savedAddress" 
                    className="w-4 h-4 text-primary focus:ring-primary mr-4"
                    checked={selectedAddressId === null}
                    onChange={() => setSelectedAddressId(null)}
                  />
                  <span className="font-bold">Use a different address</span>
                </label>
              </div>
            )}

            {selectedAddressId === null && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="First Name" 
                    type="text"
                    value={shippingAddress.firstName || ""}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="Last Name" 
                    type="text"
                    value={shippingAddress.lastName || ""}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <input 
                  className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                  placeholder="Address" 
                  type="text"
                  value={shippingAddress.address || ""}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="City" 
                    type="text"
                    value={shippingAddress.city || ""}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  />
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="State" 
                    type="text"
                    value={shippingAddress.state || ""}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  />
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="PIN Code" 
                    type="text"
                    value={shippingAddress.pinCode || ""}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, pinCode: e.target.value }))}
                  />
                </div>
                <input 
                  className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                  placeholder="Phone" 
                  type="tel"
                  value={shippingAddress.phone || ""}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            )}
          </section>

          {/* Shipping Method */}
          <section className="space-y-6">
            <h2 className="text-headline-sm font-headline-sm">Shipping Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex flex-col justify-between p-4 border-2 rounded-xl cursor-pointer group transition-all ${shippingMethod === 'standard' ? 'border-secondary bg-white/50' : 'border-secondary/20 bg-surface-container-low hover:bg-surface-container'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      className="w-4 h-4 text-secondary focus:ring-secondary mr-3"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                    />
                    <span className="font-bold">Standard</span>
                  </div>
                  <span className="font-bold">Free</span>
                </div>
                <span className="text-label-md text-secondary ml-7">3-5 business days</span>
              </label>
              
              <label className={`flex flex-col justify-between p-4 border-2 rounded-xl cursor-pointer group transition-all ${shippingMethod === 'express' ? 'border-secondary bg-white/50' : 'border-secondary/20 bg-surface-container-low hover:bg-surface-container'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      className="w-4 h-4 text-secondary focus:ring-secondary mr-3"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <span className="font-bold">Express</span>
                  </div>
                  <span className="font-bold">₹150</span>
                </div>
                <span className="text-label-md text-secondary ml-7">1-2 business days</span>
              </label>
            </div>
            {/* Delivery Estimates */}
            <p className="text-label-md font-label-md text-secondary uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              Estimated Delivery: {shippingMethod === 'express' ? 'Tomorrow - 2 Days' : '3 - 5 Days'}
            </p>
          </section>

          {/* Billing Address */}
          <section className="space-y-6">
            <h2 className="text-headline-sm font-headline-sm">Billing Address</h2>
            <label className="flex items-center p-4 border border-secondary/20 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-secondary focus:ring-secondary mr-4 rounded"
                checked={useSameForBilling}
                onChange={(e) => setUseSameForBilling(e.target.checked)}
              />
              <span className="font-bold">Same as shipping address</span>
            </label>

            {!useSameForBilling && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="First Name" type="text"
                    value={billingAddress.firstName || ""}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="Last Name" type="text"
                    value={billingAddress.lastName || ""}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <input 
                  className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                  placeholder="Address" type="text"
                  value={billingAddress.address || ""}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="City" type="text"
                    value={billingAddress.city || ""}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                  />
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="State" type="text"
                    value={billingAddress.state || ""}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                  />
                  <input 
                    className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/50 outline-none transition-all" 
                    placeholder="PIN Code" type="text"
                    value={billingAddress.pinCode || ""}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, pinCode: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Payment Methods */}
          <section className="space-y-6">
            <h2 className="text-headline-sm font-headline-sm">Payment</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-secondary rounded-xl bg-white/50 cursor-pointer group">
                <input 
                  checked={paymentMethod === 'credit_card'} 
                  onChange={() => setPaymentMethod('credit_card')}
                  className="w-4 h-4 text-secondary focus:ring-secondary mr-4" 
                  name="payment" 
                  type="radio" 
                />
                <div className="flex-grow">
                  <span className="font-bold">Credit Card</span>
                  <div className="flex gap-2 mt-2">
                    <div className="w-8 h-5 bg-secondary-container rounded-sm"></div>
                    <div className="w-8 h-5 bg-secondary-container rounded-sm"></div>
                    <div className="w-8 h-5 bg-secondary-container rounded-sm"></div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary">lock</span>
              </label>

              {paymentMethod === 'credit_card' && (
                <div className="bg-surface-container p-6 rounded-xl border border-secondary/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="md:col-span-2 w-full bg-white border border-secondary/30 rounded-lg px-4 py-3 text-body-md outline-none focus:border-[#5c5c5b]" placeholder="Card number" type="text" />
                  <input className="w-full bg-white border border-secondary/30 rounded-lg px-4 py-3 text-body-md outline-none focus:border-[#5c5c5b]" placeholder="Expiration date (MM / YY)" type="text" />
                  <input className="w-full bg-white border border-secondary/30 rounded-lg px-4 py-3 text-body-md outline-none focus:border-[#5c5c5b]" placeholder="Security code" type="text" />
                </div>
              )}

              <label className="flex items-center p-4 border border-secondary/20 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors group">
                <input 
                  checked={paymentMethod === 'upi'} 
                  onChange={() => setPaymentMethod('upi')}
                  className="w-4 h-4 text-secondary focus:ring-secondary mr-4" 
                  name="payment" 
                  type="radio" 
                />
                <span className="font-bold">UPI / NetBanking</span>
              </label>
              
              <label className="flex items-center p-4 border border-secondary/20 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors group">
                <input 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-secondary focus:ring-secondary mr-4" 
                  name="payment" 
                  type="radio" 
                />
                <span className="font-bold">Cash on Delivery (COD)</span>
              </label>
              
              <label className="flex items-center p-4 border border-secondary/20 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors group">
                <input 
                  checked={paymentMethod === 'razorpay'} 
                  onChange={() => setPaymentMethod('razorpay')}
                  className="w-4 h-4 text-secondary focus:ring-secondary mr-4" 
                  name="payment" 
                  type="radio" 
                />
                <span className="font-bold">Razorpay</span>
              </label>
              
              <label className="flex items-center p-4 border border-secondary/20 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors group">
                <input 
                  checked={paymentMethod === 'ccavenue'} 
                  onChange={() => setPaymentMethod('ccavenue')}
                  className="w-4 h-4 text-secondary focus:ring-secondary mr-4" 
                  name="payment" 
                  type="radio" 
                />
                <span className="font-bold">CCAvenue</span>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Summary */}
        <aside className="md:col-span-5 sticky top-24">
          <div className="p-8 rounded-2xl border border-secondary/10 space-y-8" style={{ backgroundColor: "#867b5d" }}>
            <h3 className="text-headline-sm font-headline-sm text-white">Order Summary</h3>
            
            {/* Products */}
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                    <Image fill alt={item.title} className="object-cover" src={item.imageSrc} />
                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h4 className="text-label-lg font-label-lg text-white">{item.title}</h4>
                    <p className="text-label-md font-label-md text-white/80">{item.colorName} / {item.size}</p>
                  </div>
                  <div className="text-label-lg font-label-lg self-center text-white">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-secondary/10 pt-6">
              <div className="flex gap-2">
                <input className="flex-grow bg-surface-container border border-secondary/30 rounded-xl px-4 py-3 text-body-md outline-none" placeholder="Discount code" type="text" />
                <button className="bg-secondary text-on-secondary px-6 rounded-xl font-label-lg hover:bg-secondary/90 transition-colors uppercase tracking-wider">Apply</button>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex justify-between text-body-md">
                <span className="text-white">Subtotal</span>
                <span className="font-bold text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-white">Shipping</span>
                <span className={`font-bold ${shippingMethod === 'standard' ? 'text-primary-container bg-primary/10 px-2 py-0.5 rounded text-sm' : 'text-white'}`}>
                  {shippingMethod === 'standard' ? 'FREE' : '₹150.00'}
                </span>
              </div>

              {/* Wallet Redemption */}
              <div className="pt-4 border-t border-secondary/20">
                <label className="flex items-start cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mt-1 mr-3 rounded focus:ring-primary text-primary"
                    checked={applyWallet}
                    onChange={(e) => setApplyWallet(e.target.checked)}
                  />
                  <div>
                    <span className="text-white font-bold block">Apply Wallet Balance</span>
                    <span className="text-white/70 text-sm">Available: ₹{walletBalance}</span>
                  </div>
                </label>
              </div>

              {/* Rewards Redemption */}
              <div className="pt-2 pb-2 border-b border-secondary/20">
                <label className="flex items-start cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mt-1 mr-3 rounded focus:ring-primary text-primary"
                    checked={applyRewards}
                    onChange={(e) => setApplyRewards(e.target.checked)}
                  />
                  <div>
                    <span className="text-white font-bold block">Redeem NECTAR Rewards</span>
                    <span className="text-white/70 text-sm">{rewardsPoints} Points (Value: ₹{rewardsPoints / 10})</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-between items-end pt-4">
                <span className="text-headline-sm font-headline-sm text-white">Total</span>
                <div className="text-right">
                  <span className="text-label-md font-label-md block text-white/80">Including taxes</span>
                  <span className="text-headline-md font-headline-md text-white">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={submitCheckout}
              disabled={isProcessing}
              className="w-full bg-primary-container text-on-primary-container py-5 rounded-xl text-headline-sm font-headline-sm hover:opacity-90 transition-opacity uppercase tracking-tighter shadow-sm disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Complete Purchase"}
            </button>
            <div className="flex items-center justify-center gap-2 text-label-md font-label-md text-white/60">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Secure SSL encrypted checkout</span>
            </div>
          </div>
          
          {/* Assistance / Trust Badges */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/30 rounded-xl border border-secondary/20">
              <span className="material-symbols-outlined text-secondary">local_shipping</span>
              <div className="text-[11px] leading-tight">
                <span className="font-bold block uppercase">Fast Shipping</span>
                <span className="text-secondary">3-5 business days</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/30 rounded-xl border border-secondary/20">
              <span className="material-symbols-outlined text-secondary">history</span>
              <div className="text-[11px] leading-tight">
                <span className="font-bold block uppercase">Easy Returns</span>
                <span className="text-secondary">30-day policy</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutForm />
    </CheckoutProvider>
  )
}
