"use client"

import React, { useState } from "react"
import { useAccount } from "@/components/account/AccountProvider"

export default function AddressesPage() {
  const { profile, isLoading } = useAccount()
  const [isAddingNew, setIsAddingNew] = useState(false)

  if (isLoading || !profile) return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>

  return (
    <section className="flex flex-col gap-stack-md">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-headline-md text-headline-md uppercase tracking-tight">Address Book</h3>
        <button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="bg-on-surface text-background px-6 py-2 rounded-full font-label-bold text-label-bold hover:scale-105 active:scale-95 transition-all"
        >
          {isAddingNew ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {isAddingNew && (
        <div className="bg-surface-container-low p-8 rounded-xl border-2 border-primary mb-4">
          <h4 className="font-headline-md mb-6 uppercase">New Address</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full bg-surface-container-lowest border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="First Name" />
              <input className="w-full bg-surface-container-lowest border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="Last Name" />
            </div>
            <input className="w-full bg-surface-container-lowest border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="Address Line 1" />
            <input className="w-full bg-surface-container-lowest border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="Address Line 2 (Optional)" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="w-full bg-surface-container-lowest border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="City" />
              <input className="w-full bg-surface-container-lowest border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="State" />
              <input className="w-full bg-surface-container-lowest border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="PIN Code" />
            </div>
            <label className="flex items-center gap-3 mt-4 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary focus:ring-primary rounded" />
              <span className="font-label-bold">Set as default address</span>
            </label>
            <div className="flex gap-4 mt-8 pt-6 border-t-2 border-surface-variant">
              <button 
                onClick={() => setIsAddingNew(false)}
                className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-bold uppercase tracking-widest hover:opacity-90"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Default Address */}
        <div className="bg-surface-container-lowest p-8 rounded-xl border-2 border-on-surface relative flex flex-col h-full">
          <span className="absolute top-6 right-6 font-label-sm bg-primary text-background px-3 py-1 rounded-full">DEFAULT</span>
          <div className="flex flex-col gap-2 flex-grow">
            <span className="font-label-bold uppercase text-onyx-gray">Home</span>
            <h4 className="font-headline-md">{profile.firstName} {profile.lastName}</h4>
            <p className="font-body-md leading-relaxed text-on-surface-variant">
              B-12, Green Park Extension,<br/>
              Near Hauz Khas Metro Station,<br/>
              New Delhi, Delhi - 110016<br/>
              India
            </p>
            <p className="font-body-md text-on-surface-variant mt-2">{profile.phone}</p>
          </div>
          <div className="flex gap-4 mt-6 pt-6 border-t border-surface-variant">
            <button className="font-label-bold text-primary underline decoration-2 underline-offset-4">Edit</button>
          </div>
        </div>

        {/* Secondary Address */}
        <div className="bg-surface-container-lowest p-8 rounded-xl border-2 border-surface-variant relative flex flex-col h-full opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2 flex-grow">
            <span className="font-label-bold uppercase text-onyx-gray">Work</span>
            <h4 className="font-headline-md">{profile.firstName} {profile.lastName}</h4>
            <p className="font-body-md leading-relaxed text-on-surface-variant">
              Level 4, Innov8 Coworking,<br/>
              Connaught Place,<br/>
              New Delhi, Delhi - 110001<br/>
              India
            </p>
            <p className="font-body-md text-on-surface-variant mt-2">{profile.phone}</p>
          </div>
          <div className="flex gap-4 mt-6 pt-6 border-t border-surface-variant">
            <button className="font-label-bold text-primary underline decoration-2 underline-offset-4">Edit</button>
            <button className="font-label-bold text-error underline decoration-2 underline-offset-4">Delete</button>
            <button className="font-label-bold text-onyx-gray underline decoration-2 underline-offset-4 ml-auto">Set as Default</button>
          </div>
        </div>
      </div>
    </section>
  )
}
