"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAccount } from "@/components/account/AccountProvider"
import { useCommerce } from "@/components/commerce/CommerceProvider"
import { motion, AnimatePresence } from "framer-motion"

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export default function AccountDashboard() {
  const { profile, orders, rewards, wallet, xpState, isLoading } = useAccount()
  const { wishlistItems, addToCart } = useCommerce()
  
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [showReferModal, setShowReferModal] = useState(false)
  const [copiedReferral, setCopiedReferral] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Fetch user audit logs
  useEffect(() => {
    if (!profile?.id) return;
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/identity/users/${profile.id}/audit-logs`)
        if (res.ok) {
          const data = await res.json()
          setAuditLogs(data.slice(0, 5)) // show top 5 recent activities
        }
      } catch (err) {
        console.error("Failed to load audit logs", err)
      }
    }
    fetchLogs()
  }, [profile?.id])

  if (isLoading || !profile) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-48 bg-surface-container rounded-3xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-surface-container rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-surface-container rounded-3xl"></div>
          <div className="h-64 bg-surface-container rounded-3xl"></div>
        </div>
      </div>
    )
  }

  // Calculate profile completion %
  const profileFields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    (profile as any).dob,
    (profile as any).gender,
    (profile as any).sportPreference,
    (profile as any).favCategory,
    (profile as any).favTeam,
    (profile as any).jerseySize
  ];
  const completedFields = profileFields.filter(f => f !== undefined && f !== null && f !== '').length;
  const completionPercent = Math.round((completedFields / profileFields.length) * 100);

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://playr.in/register?ref=${profile.firstName.toLowerCase()}${profile.id.substring(0, 4)}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleBuyAgain = async (item: any) => {
    try {
      await addToCart({
        id: `${item.productId}-${item.colorName || 'default'}-${item.size || 'default'}`,
        productId: item.productId,
        variantId: "default",
        title: item.title,
        price: item.price,
        imageSrc: item.imageSrc,
        quantity: 1,
        colorName: item.colorName,
        size: item.size
      })
      triggerToast(`Added ${item.title} to bag!`)
    } catch (e) {
      triggerToast("Failed to add to bag.")
    }
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
            <span className="material-symbols-outlined text-sm text-primary-fixed-dim">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Premium Overview Banner */}
      <section className="bg-surface-container-low p-6 md:p-8 rounded-3xl border border-outline-variant/30 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          {/* Avatar Initials */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center border-4 border-surface shadow-md shrink-0">
            <span className="text-2xl font-black text-on-primary tracking-tighter">{initials}</span>
          </div>
          <div className="space-y-2 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-on-surface font-headline">
                Welcome, {profile.firstName}!
              </h1>
              <div className="flex items-center gap-1.5 bg-primary-container text-on-primary-container px-3 py-1 rounded-full border border-primary/20">
                <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                <span className="font-bold text-[9px] uppercase tracking-widest">Elite Tier</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold">
              Athlete ecosystem member since <span className="text-on-surface font-bold">{profile.memberSince}</span>
            </p>
            {/* Completion Meter */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${completionPercent}%` }} />
              </div>
              <span className="text-[10px] font-black uppercase text-on-surface-variant">
                {completionPercent}% Profile Complete
              </span>
            </div>
          </div>
        </div>

        {/* Loyalty Tracker */}
        <div className="relative z-10 w-full lg:w-auto min-w-full sm:min-w-[320px] bg-surface-container rounded-2xl p-5 border border-outline-variant/20 shadow-sm shrink-0">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">Loyalty Balance</p>
              <div className="flex items-baseline gap-1">
                <p className="font-black text-3xl text-primary">{rewards?.points || 0}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">XP</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">Next Milestone</p>
              <p className="font-black text-sm text-on-surface uppercase">{xpState?.nextTier?.name || "Max Level"}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${xpState?.progressPercent || 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
              Wallet: ₹{(wallet?.balance || 0).toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-on-surface-variant">
              {xpState?.xpToNextTier ? `${xpState.xpToNextTier} XP to unlock` : "Max tier unlocked"}
            </span>
          </div>
        </div>

        {/* Background Graphic */}
        <div className="absolute -right-10 -top-10 opacity-[0.02] pointer-events-none">
          <span className="material-symbols-outlined text-[280px]">sports_cricket</span>
        </div>
      </section>

      {/* Quick Stats Bento Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Orders', value: orders.length.toString(), icon: 'local_mall', link: '/account/orders' },
          { label: 'Wishlist', value: wishlistItems.length.toString(), icon: 'favorite', link: '/account/wishlist' },
          { label: 'Addresses', value: ((profile as any).addresses?.length || 1).toString(), icon: 'location_on', link: '/account/addresses' },
          { label: 'Active Coupons', value: '2', icon: 'confirmation_number', link: '/account/rewards' },
          { label: 'Returns', value: '0', icon: 'assignment_return', link: '/account/returns' },
          { label: 'Support Tickets', value: '1', icon: 'support_agent', link: '/account/support' },
        ].map((stat, idx) => (
          <Link key={idx} href={stat.link} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-lg">{stat.icon}</span>
              <span className="material-symbols-outlined text-on-surface-variant/30 text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
            </div>
            <div>
              <p className="font-black text-2xl text-on-surface leading-none">{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant mt-1.5 leading-none">{stat.label}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Quick Actions Grid */}
      <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30">
        <h3 className="font-black text-lg uppercase tracking-tight text-on-surface mb-5 px-1 font-headline">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <Link href="/collections/premium-polos" className="bg-surface-container p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/20 hover:bg-on-surface/5 transition-all text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">shopping_bag</span>
            <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface">Shop Drop</span>
          </Link>
          <Link href="/account/tracking" className="bg-surface-container p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/20 hover:bg-on-surface/5 transition-all text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">local_shipping</span>
            <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface">Track Order</span>
          </Link>
          <Link href="/account/wallet" className="bg-surface-container p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/20 hover:bg-on-surface/5 transition-all text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">account_balance_wallet</span>
            <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface">Add Funds</span>
          </Link>
          <Link href="/account/rewards" className="bg-surface-container p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/20 hover:bg-on-surface/5 transition-all text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">stars</span>
            <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface">Redeem XP</span>
          </Link>
          <button 
            onClick={() => setShowReferModal(true)} 
            className="bg-surface-container p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/20 hover:bg-on-surface/5 transition-all text-center flex flex-col items-center gap-3 w-full"
          >
            <span className="material-symbols-outlined text-2xl text-primary">group_add</span>
            <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface">Refer Friends</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Orders & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Section */}
        <section className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex justify-between items-end px-1 border-b border-outline-variant/30 pb-3">
            <h3 className="font-black text-xl uppercase tracking-tight text-on-surface font-headline">Recent Purchases</h3>
            <Link href="/account/orders" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-on-surface transition-colors">View All</Link>
          </div>
          
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.slice(0, 2).map(order => (
                <div key={order.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 flex flex-col gap-4 shadow-sm hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start border-b border-outline-variant/10 pb-3">
                    <div>
                      <p className="text-xs font-bold text-on-surface">Order #{order.displayId}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant mt-0.5 uppercase tracking-wider">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full border border-outline-variant/10">
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-action-yellow'}`}></span>
                      <span className="font-bold text-[9px] uppercase tracking-wider text-on-surface">{order.status}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/10">
                      <Image fill alt={order.items[0].title} className="object-cover" src={order.items[0].imageSrc} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm text-on-surface truncate">{order.items[0].title}</h4>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        Qty: {order.items[0].quantity} • {order.items[0].colorName} • Size {order.items[0].size}
                      </p>
                      {order.items.length > 1 && (
                        <p className="text-xs font-bold text-primary mt-1">+{order.items.length - 1} more items</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-on-surface">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-3 border-t border-outline-variant/10 mt-1">
                    <Link href={`/account/tracking/${order.id}`} className="bg-on-surface text-background px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-opacity">
                      Track
                    </Link>
                    <button 
                      onClick={() => triggerToast(`[Simulation] Invoice downloaded for order ${order.displayId}`)}
                      className="bg-surface-container text-on-surface px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-on-surface/5 transition-all border border-outline-variant/20"
                    >
                      Invoice
                    </button>
                    <button 
                      onClick={() => handleBuyAgain(order.items[0])}
                      className="bg-surface-container text-on-surface px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-on-surface/5 transition-all border border-outline-variant/20"
                    >
                      Buy Again
                    </button>
                    <Link 
                      href={`/products/pro-training-tee`} 
                      className="bg-surface-container text-on-surface px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-on-surface/5 transition-all border border-outline-variant/20"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-10 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">inventory_2</span>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">No orders found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="flex flex-col gap-5">
          <div className="flex justify-between items-end px-1 border-b border-outline-variant/30 pb-3">
            <h3 className="font-black text-xl uppercase tracking-tight text-on-surface font-headline">Recent Activity</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm relative">
            <div className="absolute left-[31px] top-8 bottom-8 w-[1.5px] bg-outline-variant/20" />
            <div className="space-y-6 relative">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => {
                  let icon = "info";
                  let colorClass = "bg-primary text-on-primary";
                  
                  if (log.action.includes("wallet")) {
                    icon = "account_balance_wallet";
                    colorClass = "bg-green-500/10 text-green-600 border border-green-500/20";
                  } else if (log.action.includes("reward") || log.action.includes("redeem")) {
                    icon = "stars";
                    colorClass = "bg-amber-500/10 text-amber-600 border border-amber-500/20";
                  } else if (log.action.includes("profile")) {
                    icon = "person";
                    colorClass = "bg-blue-500/10 text-blue-600 border border-blue-500/20";
                  } else if (log.action.includes("address")) {
                    icon = "location_on";
                    colorClass = "bg-purple-500/10 text-purple-600 border border-purple-500/20";
                  } else if (log.action.includes("otp") || log.action.includes("login")) {
                    icon = "shield";
                    colorClass = "bg-zinc-500/10 text-zinc-600 border border-zinc-500/20";
                  }

                  return (
                    <div key={log.id} className="flex gap-4 items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 bg-surface ${colorClass}`}>
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{log.details}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant/30 mb-1">history</span>
                  <p className="text-[11px] font-bold uppercase text-on-surface-variant">No activity logs recorded.</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Referral Modal */}
      <AnimatePresence>
        {showReferModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReferModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[20%] mx-auto max-w-md bg-surface-container rounded-3xl border border-outline-variant/30 p-8 z-50 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">group_add</span>
                </div>
                <button 
                  onClick={() => setShowReferModal(false)}
                  className="w-8 h-8 bg-on-surface/5 hover:bg-on-surface/10 rounded-full flex items-center justify-center text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-2xl uppercase tracking-tight text-on-surface font-headline">Refer a Friend</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Invite your friends to join the playR athletic ecosystem. When they register and place their first order, they unlock Silver status, and you get <strong className="text-primary">+1,000 XP</strong> rewards!
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Your Referral Link</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`https://playr.in/register?ref=${profile.firstName.toLowerCase()}${profile.id.substring(0, 4)}`}
                    className="flex-grow bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-xs font-semibold text-on-surface-variant outline-none"
                  />
                  <button
                    onClick={handleCopyReferral}
                    className="bg-primary text-on-primary px-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shrink-0"
                  >
                    {copiedReferral ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
