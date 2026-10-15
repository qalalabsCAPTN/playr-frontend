"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client"

const links = [
  { href: "/account", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/account/orders", label: "My Orders", icon: "package", exact: false },
  { href: "/account/tracking", label: "Track Shipment", icon: "local_shipping", exact: false },
  { href: "/account/addresses", label: "Addresses", icon: "location_on", exact: false },
  { href: "/account/profile", label: "Profile", icon: "person", exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: "favorite", exact: false },
  { href: "/account/wallet", label: "Wallet", icon: "account_balance_wallet", exact: false },
  { href: "/account/rewards", label: "Rewards", icon: "stars", exact: false },
  { href: "/account/returns", label: "Returns", icon: "assignment_return", exact: false },
  { href: "/account/support", label: "Support", icon: "support_agent", exact: false },
  { href: "/account/settings", label: "Settings", icon: "settings", exact: false },
];

function AccountSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Supabase signOut error", e);
    }
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <aside className="hidden md:block md:col-span-1">
        <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-6 flex flex-col gap-6 sticky top-28 shadow-sm">
          <div className="mb-2">
            <h2 className="font-black text-2xl tracking-tight text-on-surface uppercase font-headline">My Account</h2>
            <div className="flex items-center gap-2 mt-2 bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-primary text-sm">workspace_premium</span>
              <span className="font-bold text-[10px] uppercase tracking-widest text-primary">Elite Member</span>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = link.exact 
                ? pathname === link.href 
                : pathname.startsWith(link.href);
              
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? "bg-primary text-on-primary font-bold rounded-2xl px-4 py-3 flex items-center gap-3 transition-all shadow-sm"
                      : "text-on-surface-variant px-4 py-3 flex items-center gap-3 hover:bg-on-surface/5 hover:text-on-surface rounded-2xl transition-colors font-medium"
                  }
                >
                  <span 
                    className="material-symbols-outlined text-xl" 
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {link.icon}
                  </span>
                  <span className="text-sm tracking-wide">{link.label}</span>
                </Link>
              )
            })}
            
            <hr className="border-on-surface/10 my-4" />
            <button 
              onClick={handleLogout}
              className="text-error/80 px-4 py-3 flex items-center gap-3 hover:bg-error/10 hover:text-error rounded-2xl transition-colors font-medium w-full text-left"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span className="text-sm tracking-wide">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Top Scrollable Carousel */}
      <div className="md:hidden w-full overflow-x-auto hide-scrollbar border-b border-outline-variant/30 pb-3 flex gap-2 sticky top-[80px] bg-background z-20 py-2">
        {links.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                isActive 
                  ? "bg-primary text-on-primary border-primary shadow-sm" 
                  : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:bg-on-surface/5"
              }`}
            >
              <span 
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Mobile Floating Action Button for Bottom Sheet Navigation */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border border-primary-fixed-dim"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="md:hidden fixed bottom-0 left-0 right-0 max-h-[85vh] bg-surface-container rounded-t-[32px] border-t border-outline-variant/30 p-6 z-50 flex flex-col overflow-y-auto"
            >
              {/* Grab Handle */}
              <div className="w-12 h-1.5 bg-on-surface/10 rounded-full mx-auto mb-6 shrink-0" />
              
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tight text-on-surface">Account Menu</h3>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Elite Tier Member</p>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 bg-on-surface/5 hover:bg-on-surface/10 text-on-surface rounded-full flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5 flex-grow">
                {links.map((link) => {
                  const isActive = link.exact 
                    ? pathname === link.href 
                    : pathname.startsWith(link.href);
                  
                  return (
                    <Link 
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isActive
                          ? "bg-primary text-on-primary border-primary font-bold shadow-sm"
                          : "bg-surface-container-low text-on-surface border-outline-variant/10 font-medium hover:bg-on-surface/5"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span 
                          className="material-symbols-outlined text-xl"
                          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {link.icon}
                        </span>
                        <span className="text-sm tracking-wide">{link.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  )
                })}

                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-error/5 text-error hover:bg-error/10 font-bold mt-4 border border-error/10 transition-colors w-full text-left"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="text-sm tracking-wide">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-10 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 min-h-[calc(100vh-88px)]">
      <AccountSidebar />
      <div className="md:col-span-3 min-w-0 space-y-10">
        {children}
      </div>
    </div>
  )
}

