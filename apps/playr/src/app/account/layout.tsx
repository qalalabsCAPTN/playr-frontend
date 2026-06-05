"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AccountProvider } from "@/components/account/AccountProvider"

function AccountSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/account", label: "Dashboard", icon: "dashboard", exact: true },
    { href: "/account/orders", label: "My Orders", icon: "package", exact: false },
    { href: "/account/tracking", label: "Track Shipment", icon: "local_shipping", exact: false },
    { href: "/account/addresses", label: "Addresses", icon: "location_on", exact: false },
    { href: "/account/profile", label: "Account Settings", icon: "settings", exact: false },
    { href: "/account/wallet", label: "Wallet", icon: "account_balance_wallet", exact: false },
    { href: "/account/rewards", label: "Rewards", icon: "stars", exact: false },
  ];

  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="bg-surface-container rounded-lg border-2 border-on-surface p-gutter flex flex-col gap-stack-md h-fit sticky top-28">
        <div className="mb-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">My Account</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your athletic lifestyle</p>
        </div>
        <nav className="flex flex-col gap-2">
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
                    ? "bg-action-yellow text-on-surface font-label-bold rounded-full p-4 flex items-center gap-4 scale-102 transition-transform"
                    : "text-on-surface-variant p-4 flex items-center gap-4 hover:bg-secondary-container rounded-full transition-colors font-label-bold"
                }
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            )
          })}
          
          <hr className="border-onyx-gray/20 my-2" />
          <button className="text-error p-4 flex items-center gap-4 hover:bg-error-container/20 rounded-full transition-colors font-label-bold w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <div className="max-w-7xl mx-auto px-gutter py-stack-lg flex flex-col md:flex-row gap-stack-lg min-h-[calc(100vh-88px)]">
        <AccountSidebar />
        <div className="flex-1 space-y-stack-lg min-w-0">
          {children}
        </div>
      </div>
    </AccountProvider>
  )
}
