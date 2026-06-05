"use client"

import React, { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAccount } from "@/components/account/AccountProvider"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { orders, isLoading } = useAccount()
  
  if (isLoading) return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>
  
  const order = orders.find(o => o.id === resolvedParams.id)

  if (!order) {
    return (
      <div className="p-12 text-center bg-surface-container-lowest rounded-xl border-2 border-on-surface">
        <h2 className="font-headline-md mb-2">Order Not Found</h2>
        <Link href="/account/orders" className="text-primary underline font-label-bold">Back to Orders</Link>
      </div>
    )
  }

  return (
    <div className="space-y-stack-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/account/orders" className="text-secondary hover:text-primary font-label-bold flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Orders
          </Link>
          <h2 className="font-headline-lg text-headline-lg uppercase tracking-tight">Order #{order.displayId}</h2>
          <p className="text-secondary font-body-md mt-1">Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <button className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-full font-label-bold uppercase tracking-widest flex items-center gap-2 hover:bg-secondary-container transition-colors w-fit">
          <span className="material-symbols-outlined">download</span>
          Invoice
        </button>
      </div>

      {/* Order Status Timeline */}
      <section className="bg-surface-container-lowest p-8 rounded-xl border-2 border-on-surface">
        <h3 className="font-headline-md mb-6 uppercase">Tracking Status</h3>
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-secondary-container -translate-x-1/2"></div>
          
          <div className="relative flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 z-10">
            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-surface-container-lowest">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div className="sm:text-center">
                <span className="font-label-bold block uppercase">Order Placed</span>
                <span className="text-label-sm text-secondary">May 15, 10:00 AM</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-surface-container-lowest">
                <span className="material-symbols-outlined text-sm">inventory_2</span>
              </div>
              <div className="sm:text-center">
                <span className="font-label-bold block uppercase">Processing</span>
                <span className="text-label-sm text-secondary">May 15, 02:30 PM</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary'}`}>
                <span className="material-symbols-outlined text-sm">local_shipping</span>
              </div>
              <div className="sm:text-center">
                <span className="font-label-bold block uppercase">Shipped</span>
                <span className="text-label-sm text-secondary">{order.status === 'delivered' ? 'May 16, 09:00 AM' : 'Pending'}</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest ${order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-surface-container text-secondary'}`}>
                <span className="material-symbols-outlined text-sm">home</span>
              </div>
              <div className="sm:text-center">
                <span className="font-label-bold block uppercase">Delivered</span>
                <span className="text-label-sm text-secondary">{order.status === 'delivered' ? 'May 17, 11:20 AM' : 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Items & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <section className="lg:col-span-2 bg-surface-container-lowest rounded-xl border-2 border-on-surface overflow-hidden">
          <div className="p-6 border-b-2 border-surface-variant bg-surface-container-low">
            <h3 className="font-headline-md uppercase">Items</h3>
          </div>
          <div className="divide-y-2 divide-surface-variant">
            {order.items.map(item => (
              <div key={item.id} className="p-6 flex gap-6">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-onyx-gray bg-parchment-base shrink-0">
                  <Image fill alt={item.title} className="object-cover" src={item.imageSrc} />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-headline-md text-body-lg">{item.title}</h4>
                    <span className="font-label-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="font-body-md text-onyx-gray mt-1">Color: {item.colorName} | Size: {item.size}</p>
                  <p className="font-label-sm text-secondary mt-2">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-stack-lg">
          <div className="bg-surface-container-lowest p-6 rounded-xl border-2 border-on-surface">
            <h3 className="font-headline-md uppercase mb-4">Summary</h3>
            <div className="space-y-3 font-body-md">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span className="font-bold">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shipping</span>
                <span className="font-bold text-primary">Free</span>
              </div>
              <div className="pt-4 border-t-2 border-surface-variant flex justify-between items-end">
                <span className="font-headline-sm uppercase">Total</span>
                <span className="font-headline-md text-primary">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border-2 border-on-surface">
            <h3 className="font-headline-md uppercase mb-4">Shipping Info</h3>
            <p className="font-label-bold uppercase text-onyx-gray mb-1">Home</p>
            <p className="font-body-md leading-relaxed text-on-surface-variant">
              Arjun Sharma<br/>
              B-12, Green Park Extension,<br/>
              Near Hauz Khas Metro Station,<br/>
              New Delhi, Delhi - 110016<br/>
              India
            </p>
            <p className="font-body-md text-on-surface-variant mt-4">+91 9876543210</p>
          </div>
        </section>
      </div>
    </div>
  )
}
