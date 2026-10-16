"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import ProfileGuard from "@/components/auth/ProfileGuard"

import {
  LayoutDashboard,
  Package,
  Truck,
  MapPin,
  User,
  Heart,
  Wallet,
  Sparkles,
  RotateCcw,
  Headphones,
  Settings,
  LogOut,
  Award,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package, exact: false },
  { href: "/account/tracking", label: "Track Shipment", icon: Truck, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
  { href: "/account/profile", label: "Profile", icon: User, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { href: "/account/wallet", label: "Wallet", icon: Wallet, exact: false },
  { href: "/account/rewards", label: "Rewards", icon: Sparkles, exact: false },
  { href: "/account/returns", label: "Returns", icon: RotateCcw, exact: false },
  { href: "/account/support", label: "Support", icon: Headphones, exact: false },
  { href: "/account/settings", label: "Settings", icon: Settings, exact: false },
];

function AccountSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    try {
      const { logoutAction } = await import('@/app/actions/auth');
      await logoutAction();
    } catch (e) {
      console.error("Logout error", e);
    }
    useAuthStore.getState().logout();
    window.location.href = '/';
  };

  const tierLabel = user?.tier || 'STREET';

  return (
    <>
      <aside className="hidden md:block md:col-span-1">
        <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-6 flex flex-col gap-6 sticky top-28 shadow-sm">
          <div className="mb-2">
            <h2 className="font-black text-2xl tracking-tight text-on-surface uppercase font-headline">My Account</h2>
            <div className="flex items-center gap-1.5 mt-2 bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20">
              <Award className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-bold text-[10px] uppercase tracking-widest text-primary">{tierLabel} Tier</span>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const Icon = link.icon;
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
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm tracking-wide">{link.label}</span>
                </Link>
              )
            })}
            
            <hr className="border-on-surface/10 my-4" />
            <button 
              onClick={handleLogout}
              className="text-error/80 px-4 py-3 flex items-center gap-3 hover:bg-error/10 hover:text-error rounded-2xl transition-colors font-medium w-full text-left"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="text-sm tracking-wide">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Drawer Trigger */}
      <div className="md:hidden flex items-center justify-between bg-surface-container p-4 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {user?.name?.[0]?.toUpperCase() || 'P'}
          </div>
          <div>
            <div className="font-bold text-sm">{user?.name || 'playR Member'}</div>
            <div className="text-[10px] text-primary uppercase font-bold tracking-wider">{tierLabel} Tier</div>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-on-surface/5 rounded-xl border border-outline-variant/20"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-surface-container p-6 z-[101] md:hidden overflow-y-auto flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10">
                  <h3 className="font-black text-xl tracking-tight uppercase font-headline">Account Navigation</h3>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-on-surface/5 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {links.map((link) => {
                  const Icon = link.icon;
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
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm tracking-wide">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant shrink-0" />
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
                  <LogOut className="w-5 h-5 shrink-0" />
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
    <ProfileGuard>
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-10 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 min-h-[calc(100vh-88px)]">
        <AccountSidebar />
        <div className="md:col-span-3 min-w-0 space-y-10">
          {children}
        </div>
      </div>
    </ProfileGuard>
  )
}
