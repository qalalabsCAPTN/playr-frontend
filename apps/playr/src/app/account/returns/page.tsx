"use client"

import React, { useState } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, CheckCircle2, Check, Plus, X, PackageOpen, ArrowRight } from "lucide-react"

interface ReturnRequest {
  id: string;
  orderId: string;
  productTitle: string;
  reason: string;
  type: 'return' | 'exchange';
  status: 'Claim Submitted' | 'Reviewing Claim' | 'Courier Pickup Scheduled' | 'Refund Dispatched';
  timestamp: string;
  imageSrc: string;
}

export default function AccountReturnsPage() {
  const { orders, isLoading } = useAccount()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Return requests list
  const [returns, setReturns] = useState<ReturnRequest[]>([
    {
      id: "RET-90118",
      orderId: "PR-99231",
      productTitle: "Pro Training Performance Tee",
      reason: "Size is too tight, exchange requested",
      type: "exchange",
      status: "Courier Pickup Scheduled",
      timestamp: "2026-06-25T14:30:00Z",
      imageSrc: "https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard6.png?v=1782909214"
    }
  ])

  // Form states
  const [isRaisingRequest, setIsRaisingRequest] = useState(false)
  const [selectedOrderItem, setSelectedOrderItem] = useState("")
  const [claimType, setClaimType] = useState<'return' | 'exchange'>('return')
  const [reason, setReason] = useState("Sizing issues")
  const [details, setDetails] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Find eligible items for returns (from delivered orders, or all items)
  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const returnableItems: Array<{ id: string; title: string; imageSrc: string; orderDisplayId: string; orderId: string }> = [];
  
  const targetOrders = deliveredOrders.length > 0 ? deliveredOrders : orders;
  targetOrders.forEach((o: any) => {
    o.items?.forEach((item: any) => {
      returnableItems.push({
        id: `${o.id}-${item.id}`,
        title: `${item.title} (Size: ${item.size}, Color: ${item.colorName})`,
        imageSrc: item.imageSrc,
        orderDisplayId: o.displayId,
        orderId: o.id
      });
    });
  });

  // Add fallback item if no orders exist yet
  if (returnableItems.length === 0) {
    returnableItems.push({
      id: "demo-item-1",
      title: "playR Mesh Cap — Red (Standard Size)",
      imageSrc: "https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard6.png?v=1782909214",
      orderDisplayId: "PR-882931",
      orderId: "demo-order"
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(URL.createObjectURL(file))
      triggerToast("Proof image attached!")
    }
  }

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderItem) {
      triggerToast("Please select an item for return.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const selectedObj = returnableItems.find(r => r.id === selectedOrderItem) || returnableItems[0]
      const newRequest: ReturnRequest = {
        id: `RET-${Math.floor(10000 + Math.random() * 90000)}`,
        orderId: selectedObj.orderDisplayId,
        productTitle: selectedObj.title,
        reason: `${reason}${details ? ' - ' + details : ''}`,
        type: claimType,
        status: 'Claim Submitted',
        timestamp: new Date().toISOString(),
        imageSrc: selectedObj.imageSrc
      }

      setReturns(prev => [newRequest, ...prev])
      triggerToast("Return request submitted successfully!")
      setIsRaisingRequest(false)
      setSelectedOrderItem("")
      setDetails("")
      setUploadedImage(null)
      setIsSubmitting(false)
    }, 1000)
  }

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
  }

  return (
    <div className="space-y-10">
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

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">Returns & Exchanges</h1>
        <button 
          onClick={() => setIsRaisingRequest(!isRaisingRequest)}
          className="bg-primary text-on-primary px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          {isRaisingRequest ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isRaisingRequest ? 'Cancel' : 'Request Return'}
        </button>
      </div>

      {/* Request Return Form */}
      {isRaisingRequest && (
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border-2 border-primary/30 shadow-sm space-y-6">
          <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Raise Return Request</h3>
          
          <form onSubmit={handleSubmitRequest} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Select Purchased Item</label>
                <select
                  value={selectedOrderItem}
                  onChange={(e) => setSelectedOrderItem(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Choose item...</option>
                  {returnableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      Order #{item.orderDisplayId} - {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Request Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setClaimType('return')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase border transition-all ${
                      claimType === 'return' 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface-container text-on-surface border-outline-variant/20 hover:bg-on-surface/5'
                    }`}
                  >
                    Refund Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setClaimType('exchange')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase border transition-all ${
                      claimType === 'exchange' 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface-container text-on-surface border-outline-variant/20 hover:bg-on-surface/5'
                    }`}
                  >
                    Size Swap
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Reason for Return</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Sizing issues">Sizing issues (too large/too tight)</option>
                  <option value="Defective/Damaged product">Defective/Damaged product</option>
                  <option value="Incorrect color match">Incorrect color match</option>
                  <option value="Changed mind">Changed mind</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Upload Verification Proof</label>
                <div className="flex gap-3 items-center">
                  <label className="bg-surface-container border border-outline-variant/30 hover:border-primary/40 rounded-xl px-5 py-3 text-xs font-bold text-on-surface cursor-pointer transition-all uppercase tracking-wider">
                    Choose Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {uploadedImage && (
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-outline-variant/30">
                      <Image fill alt="Proof preview" className="object-cover" src={uploadedImage} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Additional details</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Details of defects or specific sizing requirements..."
                rows={3}
                className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
              >
                {isSubmitting ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active returns timeline list */}
      <section className="space-y-6">
        <h3 className="font-black text-xl uppercase tracking-tight text-on-surface font-headline px-1">Claims Status</h3>
        
        {returns.length > 0 ? (
          <div className="space-y-6">
            {returns.map((ret) => {
              const statusMilestones = [
                "Claim Submitted",
                "Reviewing Claim",
                "Courier Pickup Scheduled",
                "Refund Dispatched"
              ];
              const currentIndex = statusMilestones.indexOf(ret.status)
              
              return (
                <div key={ret.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 md:p-8 space-y-6 shadow-sm">
                  
                  {/* Header info */}
                  <div className="flex justify-between items-start border-b border-outline-variant/15 pb-4">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/15">
                        <Image fill alt={ret.productTitle} className="object-cover" src={ret.imageSrc} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">{ret.productTitle}</h4>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mt-0.5">
                          Order #{ret.orderId} • Claim ID: {ret.id}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
                      {ret.type === 'exchange' ? "EXCHANGE" : "REFUND"}
                    </span>
                  </div>

                  {/* Milestones horizontal tracker */}
                  <div className="relative">
                    <div className="absolute left-4 md:left-0 right-0 top-3 h-0.5 bg-surface-container" />
                    <div className="absolute left-4 md:left-0 top-3 h-0.5 bg-primary transition-all duration-1000" style={{ width: `${(currentIndex / 3) * 100}%` }} />
                    
                    <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-4 z-10">
                      {statusMilestones.map((m, idx) => {
                        const isCompleted = idx <= currentIndex
                        
                        return (
                          <div key={m} className="flex md:flex-col items-center gap-3 md:gap-1.5 md:w-1/4">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-4 border-surface shadow-sm shrink-0 ${
                              isCompleted ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant/40'
                            }`}>
                              {isCompleted ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <div className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full" />
                              )}
                            </div>
                            <div className="md:text-center">
                              <span className={`font-bold text-[10px] uppercase tracking-wider block ${isCompleted ? 'text-on-surface' : 'text-on-surface-variant/40'}`}>
                                {m}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant font-semibold bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 leading-relaxed">
                    <strong>Reason for claim:</strong> {ret.reason}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4 text-on-surface-variant/40">
              <RotateCcw className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface">No active returns or exchange claims found</p>
            <p className="text-[11px] text-on-surface-variant mt-1">If you receive an item you want to exchange or return, raise a claim here within 30 days.</p>
          </div>
        )}
      </section>
    </div>
  )
}
