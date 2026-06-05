"use client"

import React, { useState } from "react"
import { useAccount } from "@/components/account/AccountProvider"

export default function ProfilePage() {
  const { profile, isLoading } = useAccount()
  const [isSaving, setIsSaving] = useState(false)
  
  if (isLoading || !profile) return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-stack-lg">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-headline-md text-headline-md uppercase tracking-tight">Account Settings</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
        <div className="lg:col-span-8 space-y-stack-lg">
          {/* Personal Information */}
          <section className="bg-surface-container-lowest p-8 rounded-xl border-2 border-on-surface space-y-6">
            <h4 className="font-headline-md uppercase">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-label-bold uppercase text-onyx-gray text-xs">First Name</label>
                <input defaultValue={profile.firstName} className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-2">
                <label className="font-label-bold uppercase text-onyx-gray text-xs">Last Name</label>
                <input defaultValue={profile.lastName} className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label-bold uppercase text-onyx-gray text-xs">Email Address</label>
              <input defaultValue={profile.email} type="email" className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-label-bold uppercase text-onyx-gray text-xs">Phone Number</label>
              <input defaultValue={profile.phone} type="tel" className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button 
              onClick={handleSave}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </section>

          {/* Password */}
          <section className="bg-surface-container-lowest p-8 rounded-xl border-2 border-on-surface space-y-6">
            <h4 className="font-headline-md uppercase">Change Password</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-label-bold uppercase text-onyx-gray text-xs">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-2">
                <label className="font-label-bold uppercase text-onyx-gray text-xs">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-2">
                <label className="font-label-bold uppercase text-onyx-gray text-xs">Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" className="w-full bg-surface-container-low border border-secondary/30 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <button className="bg-surface-container-highest text-on-surface px-8 py-3 rounded-full font-label-bold uppercase tracking-widest hover:bg-secondary-container transition-colors">
              Update Password
            </button>
          </section>
        </div>

        {/* Preferences Sidebar */}
        <aside className="lg:col-span-4 space-y-stack-md">
          <section className="bg-surface-container-lowest p-8 rounded-xl border-2 border-on-surface space-y-6">
            <h4 className="font-headline-md uppercase">Preferences</h4>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded" />
                <div>
                  <span className="font-bold block">Order Updates</span>
                  <span className="text-label-sm text-secondary">SMS & Email notifications for shipping</span>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded" />
                <div>
                  <span className="font-bold block">Promotions</span>
                  <span className="text-label-sm text-secondary">Early access to drops and sales</span>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded" />
                <div>
                  <span className="font-bold block">NECTAR Rewards</span>
                  <span className="text-label-sm text-secondary">Monthly points summary</span>
                </div>
              </label>
            </div>
          </section>

          <section className="bg-error-container/20 p-8 rounded-xl border-2 border-error/20">
            <h4 className="font-headline-md uppercase text-error mb-2">Danger Zone</h4>
            <p className="font-body-md text-error/80 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="text-error border-2 border-error px-6 py-2 rounded-full font-label-bold uppercase hover:bg-error hover:text-white transition-colors">
              Delete Account
            </button>
          </section>
        </aside>
      </div>
    </div>
  )
}
