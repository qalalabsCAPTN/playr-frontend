"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAccount } from "@/components/account/AccountProvider"

export default function AccountDashboard() {
  const { profile, orders, rewards, isLoading } = useAccount()

  if (isLoading || !profile) {
    return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>
  }

  const recentOrders = orders.slice(0, 2)

  return (
    <>
      {/* Welcome Hero */}
      <section className="bg-on-surface text-background p-10 rounded-xl block-shadow relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="font-headline-lg text-headline-lg mb-stack-sm">Welcome back, {profile.firstName}!</h1>
          <div className="flex flex-wrap gap-stack-md">
            <div className="flex flex-col">
              <span className="font-label-sm opacity-60 uppercase">Total Orders</span>
              <span className="font-headline-md text-action-yellow">{orders.length}</span>
            </div>
            <div className="w-[1px] h-10 bg-surface-variant/30 self-center hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="font-label-sm opacity-60 uppercase">Member Since</span>
              <span className="font-headline-md">{profile.memberSince}</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <span className="material-symbols-outlined text-[200px]" data-icon="fitness_center">fitness_center</span>
        </div>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg">
        {/* Recent Orders Section */}
        <section className="flex flex-col gap-stack-md">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-headline-md text-headline-md uppercase tracking-tight">Recent Orders</h3>
            <Link href="/account/orders" className="font-label-bold text-primary underline decoration-2 underline-offset-4">View All</Link>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border-2 border-on-surface overflow-hidden">
            {recentOrders.length > 0 ? (
              <div className="divide-y-2 divide-surface-variant">
                {recentOrders.map(order => (
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
                        <p className="font-body-md text-onyx-gray">Order #{order.displayId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-action-yellow'}`}></span>
                        <span className="font-label-bold text-[12px] uppercase">{order.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-onyx-gray">No recent orders.</div>
            )}
          </div>
        </section>

        {/* playR Rewards & Address Book Section */}
        <section className="flex flex-col gap-stack-lg">
          {/* New playR Rewards Section */}
          <div className="flex flex-col gap-stack-md">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-headline-md text-headline-md uppercase tracking-tight">playR Rewards</h3>
              <Link href="/account/rewards" className="font-label-bold text-primary underline decoration-2 underline-offset-4">Redeem</Link>
            </div>
            <div className="bg-on-surface text-background p-8 rounded-xl border-2 border-on-surface block-shadow flex items-center justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <span className="font-label-sm uppercase opacity-70">Current Balance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="font-display-xl text-4xl text-action-yellow">{rewards?.points || 0}</h2>
                  <span className="font-headline-md uppercase text-xl">Points</span>
                </div>
                <p className="font-body-md mt-4 text-surface-variant max-w-[200px]">Next reward unlock at {rewards?.nextTierPoints || 1500} points.</p>
              </div>
              <div className="bg-action-yellow/10 p-6 rounded-full group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-6xl text-action-yellow" data-icon="stars">stars</span>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-5">
                <span className="material-symbols-outlined text-[150px]" data-icon="military_tech">military_tech</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-stack-md">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-headline-md text-headline-md uppercase tracking-tight">Address Book</h3>
              <Link href="/account/addresses" className="bg-on-surface text-background px-6 py-2 rounded-full font-label-bold text-label-bold hover:scale-105 active:scale-95 transition-all">
                Manage
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-lowest p-8 rounded-xl border-2 border-on-surface relative">
                <span className="absolute top-6 right-6 font-label-sm bg-primary text-background px-3 py-1 rounded-full">DEFAULT</span>
                <div className="flex flex-col gap-2">
                  <span className="font-label-bold uppercase text-onyx-gray">Home</span>
                  <h4 className="font-headline-md">{profile.firstName} {profile.lastName}</h4>
                  <p className="font-body-md leading-relaxed text-on-surface-variant">
                    B-12, Green Park Extension,<br/>
                    Near Hauz Khas Metro Station,<br/>
                    New Delhi, Delhi - 110016<br/>
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Account Overview / Quick Actions */}
      <section className="p-10 rounded-xl border-2 border-on-surface" style={{ backgroundColor: "#867b5d" }}>
        <h3 className="font-headline-md text-headline-md mb-stack-md uppercase tracking-tight text-white">Account Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/account/profile" className="bg-white/10 hover:bg-white/20 p-6 rounded-lg border-2 border-white/20 hover:scale-102 transition-transform flex flex-col items-center gap-2 group text-white">
            <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">edit</span>
            <span className="font-label-bold uppercase">Edit Profile</span>
          </Link>
          <Link href="/account/profile" className="bg-white/10 hover:bg-white/20 p-6 rounded-lg border-2 border-white/20 hover:scale-102 transition-transform flex flex-col items-center gap-2 group text-white">
            <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">lock_reset</span>
            <span className="font-label-bold uppercase">Password</span>
          </Link>
          <button className="bg-white/10 hover:bg-white/20 p-6 rounded-lg border-2 border-white/20 hover:scale-102 transition-transform flex flex-col items-center gap-2 group text-white">
            <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">notifications</span>
            <span className="font-label-bold uppercase">Alerts</span>
          </button>
          <button className="bg-white/10 hover:bg-white/20 p-6 rounded-lg border-2 border-white/20 hover:scale-102 transition-transform flex flex-col items-center gap-2 group text-white">
            <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">support_agent</span>
            <span className="font-label-bold uppercase">Help Desk</span>
          </button>
        </div>
      </section>
    </>
  )
}
