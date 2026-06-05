"use client"

import React, { use, useEffect, useState } from "react"
import Link from "next/link"
import { Shipment, MockLogisticsService } from "@playr/nectar-core"

export default function TrackingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>
  }

  if (!shipment) {
    return (
      <div className="p-12 text-center bg-surface-container-lowest rounded-xl border-2 border-on-surface">
        <h2 className="font-headline-md mb-2">Shipment Not Found</h2>
        <p className="text-secondary mb-4">We couldn&apos;t find a shipment with ID: {resolvedParams.id}</p>
        <Link href="/account/tracking" className="text-primary underline font-label-bold">Back to Tracking</Link>
      </div>
    )
  }

  const completedMilestones = shipment.milestones.filter(m => m.isCompleted)
  const isDelivered = shipment.currentStatus === 'Delivered'

  return (
    <div className="space-y-stack-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <Link href="/account/tracking" className="text-secondary hover:text-primary font-label-bold flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Search
          </Link>
          <h3 className="font-headline-md text-headline-md uppercase tracking-tight">Order #{shipment.orderId}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Results Section */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl border border-accent-grey/20 shadow-sm h-full">
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className={`px-3 py-1 rounded-full font-label-bold text-label-sm mb-2 inline-block uppercase ${isDelivered ? 'bg-green-600 text-white' : 'bg-action-yellow text-on-surface'}`}>
                  {shipment.currentStatus}
                </span>
                <h2 className="font-headline-md text-headline-md">Tracking: {shipment.id}</h2>
                <p className="font-body-md text-body-md text-secondary mt-1">
                  Estimated Delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`material-symbols-outlined text-5xl ${isDelivered ? 'text-green-600' : 'text-action-yellow'}`}>
                  local_shipping
                </span>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-0 relative pl-4">
              {/* Vertical Line Background */}
              <div className="absolute left-[33px] top-4 bottom-12 w-1 bg-surface-container-highest rounded-full"></div>
              {/* Vertical Line Progress */}
              <div 
                className="absolute left-[33px] top-4 w-1 bg-on-surface rounded-full transition-all duration-1000"
                style={{ height: `${(completedMilestones.length / shipment.milestones.length) * 100}%` }}
              ></div>

              {/* Timeline Items */}
              {shipment.milestones.map((milestone, index) => {
                const isLast = index === shipment.milestones.length - 1;
                
                return (
                  <div key={milestone.id} className={`relative flex gap-6 ${!isLast ? 'pb-12' : ''}`}>
                    <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shrink-0 ${milestone.isCompleted ? 'bg-on-surface text-white' : 'bg-surface-container-highest'}`}>
                      {milestone.isCompleted ? (
                        <span className="material-symbols-outlined text-lg">check</span>
                      ) : (
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-grow pt-2">
                      <h4 className={`font-label-bold text-label-bold ${milestone.isCompleted ? '' : 'text-secondary'}`}>
                        {milestone.description}
                      </h4>
                      {milestone.isCompleted ? (
                        <>
                          <p className="font-body-md text-body-md text-secondary">
                            {new Date(milestone.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          <p className="font-label-sm text-label-sm mt-1">{milestone.location}</p>
                        </>
                      ) : (
                        <p className="font-body-md text-body-md text-secondary-fixed-dim">Pending</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Experience Side Panel */}
        <div className="lg:col-span-4 space-y-stack-md">
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-accent-grey/20 shadow-sm">
            <h4 className="font-headline-md uppercase mb-4">Need Help?</h4>
            <div className="space-y-4">
              <Link href={`/account/orders/${shipment.orderId}`} className="w-full flex items-center gap-3 py-3 border-b border-surface-variant hover:text-primary transition-colors font-label-bold uppercase">
                <span className="material-symbols-outlined">receipt_long</span>
                View Order Details
              </Link>
              <button className="w-full flex items-center gap-3 py-3 border-b border-surface-variant hover:text-primary transition-colors font-label-bold uppercase">
                <span className="material-symbols-outlined">restart_alt</span>
                Reorder Items
              </button>
              <button className="w-full flex items-center gap-3 py-3 border-b border-surface-variant hover:text-primary transition-colors font-label-bold uppercase text-left">
                <span className="material-symbols-outlined">keyboard_return</span>
                Request Return
              </button>
              <button className="w-full flex items-center gap-3 py-3 hover:text-primary transition-colors font-label-bold uppercase text-left">
                <span className="material-symbols-outlined">support_agent</span>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
