"use client"

import React, { useState } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
      productTitle: "Pro Training Tee",
      reason: "Size is too tight, exchange requested",
      type: "exchange",
      status: "Courier Pickup Scheduled",
      timestamp: "2026-06-25T14:30:00Z",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0"
    }
  ])

  // Form states
  const [isRaisingRequest, setIsRaisingRequest] = useState(false)
  const [selectedOrderItem, setSelectedOrderItem] = useState("")
  const [claimType, setClaimType] = useState<'return' | 'exchange'>('return')
  const [reason, setReason] = useState("Size exchange")
  const [details, setDetails] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Find eligible items for returns (from delivered orders)
  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const returnableItems: Array<{ id: string; title: string; imageSrc: string; orderDisplayId: string; orderId: string }> = []
  
  deliveredOrders.forEach(o => {
    o.items.forEach(item => {
      returnableItems.push({
        id: `${o.id}-${item.id}`,
        title: `${item.title} (Size: ${item.size}, Color: ${item.colorName})`,
        imageSrc: item.imageSrc,
        orderDisplayId: o.displayId,
        orderId: o.id
      })
    })
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(URL.createObjectURL(file))
      triggerToast("Proof image uploaded successfully!")
    }
  }

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderItem) {
      triggerToast("Please select an item to return.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const selectedObj = returnableItems.find(r => r.id === selectedOrderItem)
      if (selectedObj) {
        const newRequest: ReturnRequest = {
          id: `RET-${Math.floor(10000 + Math.random() * 90000)}`,
          orderId: selectedObj.orderDisplayId,
          productTitle: selectedObj.title,
          reason: `${reason} - ${details}`,
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
      }
      setIsSubmitting(false)
    }, 1500)
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
            <span className="material-symbols-outlined text-sm text-primary-fixed-dim">assignment_return</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">Returns & Exchanges</h1>
        {returnableItems.length > 0 && (
          <button 
            onClick={() => setIsRaisingRequest(!isRaisingRequest)}
            className="bg-primary text-on-primary px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">{isRaisingRequest ? 'close' : 'add'}</span>
            {isRaisingRequest ? 'Cancel' : 'Request Return'}
          </button>
        )}
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
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Sizing issues">Sizing issues (too large/too tight)</option>
                  <option value="Defective/Damaged product">Defective/Damaged product</option>
                  <option value="Incorrect color match">Incorrect color match</option>
                  <option value="Changed mind">Changed mind</option>
                </select>
              </div>

              {/* File Upload Mock */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Upload Sizing/Damage Proof</label>
                <div className="flex gap-3 items-center">
                  <label className="bg-surface-container border border-outline-variant/30 hover:border-primary/40 rounded-xl px-5 py-3 text-xs font-bold text-on-surface cursor-pointer transition-all uppercase tracking-wider">
                    Choose Proof File
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
                className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
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
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/10">
                        <Image fill alt={ret.productTitle} className="object-cover" src={ret.imageSrc} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">{ret.productTitle}</h4>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mt-0.5">
                          Order #{ret.orderId} • Claim ID: {ret.id}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black bg-primary-container text-on-primary-container px-3 py-1 rounded-full uppercase tracking-wider">
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
                            <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shrink-0 ${
                              isCompleted ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant/40'
                            }`}>
                              {isCompleted ? (
                                <span className="material-symbols-outlined text-[10px]">check</span>
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
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-16 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">assignment_return</span>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">No active returns or exchange claims found.</p>
          </div>
        )}
      </section>
    </div>
  )
}
