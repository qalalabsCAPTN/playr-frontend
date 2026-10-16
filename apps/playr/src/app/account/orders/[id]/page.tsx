"use client"

import React, { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAccount } from "@/components/account/AccountProvider"
import { ArrowLeft, Download, Check, Package, Truck, Home, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { orders, isLoading } = useAccount()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  if (isLoading) return <div className="animate-pulse h-64 bg-surface-container rounded-3xl"></div>
  
  const order = orders.find(o => o.id === resolvedParams.id)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleDownloadInvoice = () => {
    triggerToast(`Invoice for Order #${order?.displayId || resolvedParams.id} downloaded!`)
  }

  if (!order) {
    return (
      <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
        <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-2">Order Not Found</h2>
        <p className="text-on-surface-variant text-sm mb-6">We could not find an order matching #{resolvedParams.id}</p>
        <Link href="/account/orders" className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-on-background text-background px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl border border-outline/10 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <Link href="/account/orders" className="text-on-surface-variant hover:text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface">Order #{order.displayId}</h1>
          <p className="text-on-surface-variant text-xs font-semibold mt-1">Placed on {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button 
          onClick={handleDownloadInvoice}
          className="bg-surface-container text-on-surface px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-on-surface/5 transition-all border border-outline-variant/20 w-fit"
        >
          <Download className="w-4 h-4" />
          Invoice
        </button>
      </div>

      {/* Order Status Timeline */}
      <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
        <h3 className="font-black text-lg uppercase tracking-tight text-on-surface mb-6 font-headline">Tracking Status</h3>
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-outline-variant/20 -translate-x-1/2 hidden sm:block"></div>
          
          <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-4 z-10">
            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-surface shadow-sm shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="sm:text-center">
                <span className="font-bold text-xs block uppercase tracking-wider text-on-surface">Order Placed</span>
                <span className="text-[10px] text-on-surface-variant font-medium">May 15, 10:00 AM</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center border-4 border-surface shadow-sm shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="sm:text-center">
                <span className="font-bold text-xs block uppercase tracking-wider text-on-surface">Processing</span>
                <span className="text-[10px] text-on-surface-variant font-medium">May 15, 02:30 PM</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface shadow-sm shrink-0 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant/40'}`}>
                <Truck className="w-4 h-4" />
              </div>
              <div className="sm:text-center">
                <span className="font-bold text-xs block uppercase tracking-wider text-on-surface">Shipped</span>
                <span className="text-[10px] text-on-surface-variant font-medium">{order.status === 'delivered' ? 'May 16, 09:00 AM' : 'In Transit'}</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface shadow-sm shrink-0 ${order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-surface-container text-on-surface-variant/40'}`}>
                <Home className="w-4 h-4" />
              </div>
              <div className="sm:text-center">
                <span className="font-bold text-xs block uppercase tracking-wider text-on-surface">Delivered</span>
                <span className="text-[10px] text-on-surface-variant font-medium">{order.status === 'delivered' ? 'May 17, 11:20 AM' : 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Items & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant/15 bg-surface-container/30">
            <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Items in this Order</h3>
          </div>
          <div className="divide-y border-outline-variant/10">
            {order.items.map(item => (
              <div key={item.id} className="p-6 flex gap-6">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container shrink-0">
                  <Image fill alt={item.title} className="object-cover" src={item.imageSrc} />
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-base text-on-surface truncate">{item.title}</h4>
                    <span className="font-black text-sm text-on-surface shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">Color: {item.colorName} | Size: {item.size}</p>
                  {item.isPersonalized && (
                    <p className="text-[11px] text-green-600 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                      Personalized: {item.playerName} ({item.playerNumber})
                    </p>
                  )}
                  <p className="text-xs text-on-surface-variant mt-2">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-black text-lg uppercase tracking-tight text-on-surface mb-4 font-headline">Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-bold text-on-surface">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span className="font-bold text-primary">FREE</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/15 flex justify-between items-end">
                <span className="font-black text-sm uppercase tracking-wider text-on-surface">Total</span>
                <span className="font-black text-xl text-primary">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-black text-lg uppercase tracking-tight text-on-surface mb-4 font-headline">Delivery Address</h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-1 block">HOME</span>
            <p className="text-xs text-on-surface font-semibold leading-relaxed">
              Arjun Sharma<br/>
              B-12, Green Park Extension,<br/>
              Near Hauz Khas Metro Station,<br/>
              New Delhi, Delhi - 110016<br/>
              India
            </p>
            <p className="text-xs text-on-surface-variant mt-3 font-semibold">+91 9876543210</p>
          </div>
        </section>
      </div>
    </div>
  )
}
