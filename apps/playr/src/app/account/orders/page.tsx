"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAccount } from "@/components/account/AccountProvider"

export default function OrdersPage() {
  const { orders, isLoading } = useAccount()

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface">Order History</h1>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden">
              <div className="bg-surface-container/50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-outline-variant/30">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Order Placed</p>
                    <p className="text-sm font-medium text-on-surface">{new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total</p>
                    <p className="text-sm font-medium text-on-surface">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Order #</p>
                    <p className="text-sm font-medium text-on-surface">{order.displayId}</p>
                  </div>
                </div>
                <Link href={`/account/orders/${order.id}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-on-surface transition-colors">
                  View Details
                </Link>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className={`w-2.5 h-2.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-action-yellow'}`}></span>
                  <span className="font-bold text-sm uppercase tracking-wider text-on-surface">{order.status}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/20">
                    <Image fill alt={order.items[0].title} className="object-cover" src={order.items[0].imageSrc} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-on-surface mb-2">{order.items[0].title}</h4>
                    {order.items.length > 1 && (
                      <p className="text-sm text-on-surface-variant font-medium">+{order.items.length - 1} more items</p>
                    )}
                    <div className="mt-4 flex gap-3">
                      <Link href={`/account/tracking/${order.id}`} className="bg-on-surface text-background px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
                        Track Package
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-16 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">inventory_2</span>
            <h4 className="font-black text-2xl uppercase tracking-tighter text-on-surface mb-2">No orders yet</h4>
            <p className="text-on-surface-variant font-medium mb-8">When you place an order, it will appear here.</p>
            <Link href="/collections" className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
