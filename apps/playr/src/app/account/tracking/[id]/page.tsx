"use client"

import React, { use, useEffect, useState } from "react"
import Link from "next/link"
import { Shipment, MockLogisticsService } from "@playr/nectar-core"
import { ArrowLeft, Truck, Check, ReceiptText, RotateCcw, Headphones, ShoppingBag, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCommerce } from "@/components/commerce/CommerceProvider"

export default function TrackingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { addToCart } = useCommerce()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  useEffect(() => {
    const fetchShipment = async () => {
      setIsLoading(true)
      const data = await MockLogisticsService.getShipment(resolvedParams.id)
      setShipment(data)
      setIsLoading(false)
    }
    fetchShipment()
  }, [resolvedParams.id])

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
  }

  if (!shipment) {
    return (
      <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
        <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-2 font-headline">Shipment Not Found</h2>
        <p className="text-on-surface-variant text-xs mb-6">We could not find shipment telemetry for ID: {resolvedParams.id}</p>
        <Link href="/account/tracking" className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
          Back to Tracking Search
        </Link>
      </div>
    )
  }

  const completedMilestones = shipment.milestones.filter(m => m.isCompleted)
  const isDelivered = shipment.currentStatus === 'Delivered'

  const handleReorder = async () => {
    try {
      await addToCart({
        id: `reorder-${shipment.orderId}-default`,
        productId: "playr-pro-tee",
        variantId: "default",
        title: "Pro Training Performance Tee",
        price: 1499,
        imageSrc: "https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard6.png?v=1782909214",
        quantity: 1,
        colorName: "India Blue",
        size: "M"
      })
      triggerToast("Items added to your bag for reorder!")
    } catch (e) {
      triggerToast("Failed to reorder items.")
    }
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
          <Link href="/account/tracking" className="text-on-surface-variant hover:text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
          <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">Order #{shipment.orderId}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Results Section */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm h-full">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={`px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider mb-2.5 inline-block ${isDelivered ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                  {shipment.currentStatus}
                </span>
                <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface font-headline">AWB: {shipment.id}</h2>
                <p className="font-medium text-xs text-on-surface-variant mt-1">
                  Estimated Delivery: <strong className="text-on-surface">{new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-0 relative pl-4">
              {/* Vertical Line Background */}
              <div className="absolute left-[33px] top-4 bottom-12 w-1 bg-surface-container-highest rounded-full"></div>
              {/* Vertical Line Progress */}
              <div 
                className="absolute left-[33px] top-4 w-1 bg-primary rounded-full transition-all duration-1000"
                style={{ height: `${(completedMilestones.length / shipment.milestones.length) * 100}%` }}
              ></div>

              {/* Timeline Items */}
              {shipment.milestones.map((milestone, index) => {
                const isLast = index === shipment.milestones.length - 1;
                
                return (
                  <div key={milestone.id} className={`relative flex gap-6 ${!isLast ? 'pb-10' : ''}`}>
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface shadow-sm shrink-0 ${milestone.isCompleted ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant/40'}`}>
                      {milestone.isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 bg-on-surface-variant/30 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-grow pt-1.5">
                      <h4 className={`font-bold text-sm uppercase tracking-wide ${milestone.isCompleted ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                        {milestone.description}
                      </h4>
                      {milestone.isCompleted ? (
                        <>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {new Date(milestone.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          <p className="text-[11px] font-bold text-primary mt-1">{milestone.location}</p>
                        </>
                      ) : (
                        <p className="text-xs text-on-surface-variant/40 mt-0.5">Pending dispatch scan</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Experience Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
            <h4 className="font-black text-lg uppercase tracking-tight text-on-surface mb-4 font-headline">Order Actions</h4>
            <div className="space-y-2">
              <Link href={`/account/orders`} className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-surface-container transition-colors text-xs font-bold uppercase tracking-wider text-on-surface border border-outline-variant/15">
                <ReceiptText className="w-4 h-4 text-primary shrink-0" />
                <span>View Order Details</span>
              </Link>
              <button 
                onClick={handleReorder}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-surface-container transition-colors text-xs font-bold uppercase tracking-wider text-on-surface border border-outline-variant/15 text-left"
              >
                <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                <span>Reorder Items</span>
              </button>
              <Link href="/account/returns" className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-surface-container transition-colors text-xs font-bold uppercase tracking-wider text-on-surface border border-outline-variant/15">
                <RotateCcw className="w-4 h-4 text-primary shrink-0" />
                <span>Request Return / Exchange</span>
              </Link>
              <Link href="/account/support" className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-surface-container transition-colors text-xs font-bold uppercase tracking-wider text-on-surface border border-outline-variant/15">
                <Headphones className="w-4 h-4 text-primary shrink-0" />
                <span>Contact Concierge Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
