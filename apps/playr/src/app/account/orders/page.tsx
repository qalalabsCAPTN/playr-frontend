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
    <section className="flex flex-col gap-stack-md">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-headline-md text-headline-md uppercase tracking-tight">Order History</h3>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border-2 border-on-surface overflow-hidden">
        {orders.length > 0 ? (
          <div className="divide-y-2 divide-surface-variant">
            {orders.map(order => (
              <Link href={`/account/orders/${order.id}`} key={order.id} className="p-6 flex gap-6 hover:bg-surface-container transition-colors group block">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-onyx-gray bg-parchment-base shrink-0">
                  <Image fill alt={order.items[0].title} className="object-cover" src={order.items[0].imageSrc} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-headline-md text-body-lg">{order.items[0].title} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}</h4>
                      <span className="font-label-bold text-primary">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="font-body-md text-onyx-gray">Order #{order.displayId} • {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-action-yellow'}`}></span>
                      <span className="font-label-bold text-[12px] uppercase">{order.status}</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-secondary opacity-50 mb-4">inventory_2</span>
            <h4 className="font-headline-sm text-headline-sm mb-2">No orders yet</h4>
            <p className="text-secondary mb-6">When you place an order, it will appear here.</p>
            <Link href="/" className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-bold uppercase tracking-widest hover:opacity-90">Start Shopping</Link>
          </div>
        )}
      </div>
    </section>
  )
}
