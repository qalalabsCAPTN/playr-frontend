"use client"

import React, { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams?.get("orderId") || ""
  
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found")
        return res.json()
      })
      .then((data) => {
        setOrder(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error loading order detail:", err)
        setError("Unable to retrieve order details.")
        setIsLoading(false)
      })
  }, [orderId])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-16 h-16 bg-surface-container rounded-full animate-pulse" />
        <div className="h-6 bg-surface-container rounded w-48 animate-pulse" />
        <div className="h-24 bg-surface-container rounded w-full max-w-lg animate-pulse" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-error text-4xl">error</span>
        </div>
        <h1 className="text-headline-lg font-headline-lg uppercase mb-2">Order Confirmed!</h1>
        <p className="text-body-md text-secondary max-w-md mb-8">
          Thank you for your purchase. We have received your order (ID: {orderId || "Pending"}), but could not retrieve the details in this view. A confirmation email has been dispatched.
        </p>
        <Link 
          href="/" 
          className="bg-black text-white px-8 py-4 rounded-full font-label-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const userEmail = order.shippingAddress?.email || "customer@playr.in"
  const xpEarned = Math.round(order.total * 0.1)

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-20 animate-fade-in">
      <div className="text-center flex flex-col items-center justify-center mb-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
        </div>
        <h1 className="text-headline-xl font-headline-xl uppercase tracking-tighter mb-2">Order Confirmed!</h1>
        <p className="text-body-md text-secondary max-w-md">
          Thank you for shopping with playR. Your order has been registered and is being processed.
        </p>
      </div>

      {/* Email Simulation Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex gap-3 text-left">
        <span className="material-symbols-outlined text-primary text-2xl shrink-0">mail</span>
        <div>
          <span className="font-bold text-xs uppercase text-primary tracking-widest block mb-0.5">[SIMULATION SUCCESS]</span>
          <p className="text-sm text-on-surface-variant">
            A confirmation receipt and dynamic invoice PDF have been simulated and dispatched to <strong className="text-on-surface">{userEmail}</strong>.
          </p>
        </div>
      </div>

      {/* Loyalty Reward XP Box */}
      {xpEarned > 0 && (
        <div className="bg-[#685f15]/10 border border-[#685f15]/20 rounded-xl p-4 mb-8 flex gap-3 text-left items-center justify-between">
          <div className="flex gap-3 items-center">
            <span className="material-symbols-outlined text-[#685f15] text-3xl">workspace_premium</span>
            <div>
              <h4 className="font-bold text-sm text-on-surface">Loyalty Rewards Credited</h4>
              <p className="text-xs text-secondary">Congratulations! You earned XP points on this order.</p>
            </div>
          </div>
          <span className="text-[#685f15] font-black text-xl whitespace-nowrap">+{xpEarned} XP</span>
        </div>
      )}

      {/* Invoice Summary */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-outline-variant/30 text-left">
          <div>
            <span className="text-xs text-outline font-bold uppercase tracking-wider block">Order ID</span>
            <span className="font-black text-lg text-zinc-950 uppercase">{order.displayId}</span>
          </div>
          <div>
            <span className="text-xs text-outline font-bold uppercase tracking-wider block">Estimated Delivery</span>
            <span className="font-bold text-body-md text-on-surface">
              {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-widest text-outline">Items Ordered</h3>
          <div className="divide-y divide-outline-variant/20">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="py-4 flex gap-4 items-center text-left">
                <div className="relative w-16 h-20 bg-surface-container rounded-lg overflow-hidden shrink-0">
                  <Image fill src={item.imageSrc} alt={item.title} className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-zinc-900 uppercase line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-outline">
                    Size: {item.size} | Color: {item.colorName || "Default"} | Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-black text-sm text-zinc-900">₹ {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="pt-4 border-t border-outline-variant/30 text-left">
          <h3 className="font-bold text-xs uppercase tracking-widest text-outline mb-2">Shipping Destination</h3>
          <p className="text-sm font-bold text-on-surface">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p className="text-sm text-secondary">
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
          </p>
          <p className="text-xs text-outline mt-1">Phone: {order.shippingAddress.phone}</p>
        </div>

        {/* Total Calculations */}
        <div className="pt-4 border-t border-outline-variant/30 space-y-2 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Subtotal</span>
            <span className="font-medium">₹ {(order.total + (order.discountDeducted || 0) + (order.walletDeducted || 0) + ((order.rewardsDeducted || 0) / 10)).toLocaleString()}</span>
          </div>
          {order.discountDeducted > 0 && (
            <div className="flex justify-between text-sm text-success font-medium">
              <span>Promo Discount ({order.couponCode || "COUPON"})</span>
              <span>- ₹ {order.discountDeducted.toLocaleString()}</span>
            </div>
          )}
          {order.walletDeducted > 0 && (
            <div className="flex justify-between text-sm text-primary font-medium">
              <span>Wallet Applied</span>
              <span>- ₹ {order.walletDeducted.toLocaleString()}</span>
            </div>
          )}
          {order.rewardsDeducted > 0 && (
            <div className="flex justify-between text-sm text-primary font-medium">
              <span>Loyalty Points Redeemed</span>
              <span>- ₹ {(order.rewardsDeducted / 10).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-outline-variant/30">
            <span>Amount Paid</span>
            <span>₹ {order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Link 
          href="/collections/top-wear"
          className="bg-black text-white px-8 py-4 rounded-full font-label-lg uppercase tracking-widest hover:opacity-90 transition-opacity text-center"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/account"
          className="bg-transparent border border-on-surface text-on-surface px-8 py-4 rounded-full font-label-lg uppercase tracking-widest hover:bg-surface-container transition-colors text-center"
        >
          View Order Status
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-16 h-16 bg-surface-container rounded-full animate-pulse" />
        <div className="h-6 bg-surface-container rounded w-48 animate-pulse" />
        <div className="h-24 bg-surface-container rounded w-full max-w-lg animate-pulse" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}
