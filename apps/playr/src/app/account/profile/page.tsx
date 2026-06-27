"use client"

import React, { useState } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfilePage() {
  const { profile, wallet, rewards, isLoading, refreshData } = useAccount()
  const [isSaving, setIsSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  
  // Preference states
  const [sportPreference, setSportPreference] = useState("")
  const [favCategory, setFavCategory] = useState("")
  const [favTeam, setFavTeam] = useState("")
  const [jerseySize, setJerseySize] = useState("")

  // Notification states
  const [emailPromo, setEmailPromo] = useState(true)
  const [smsPromo, setSmsPromo] = useState(true)
  const [rewardsSummary, setRewardsSummary] = useState(true)

  // Initialize values when profile loads
  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "")
      setLastName(profile.lastName || "")
      setPhone(profile.phone || "")
      setEmail(profile.email || "")
      setDob((profile as any).dob || "")
      setGender((profile as any).gender || "")
      setSportPreference((profile as any).sportPreference || "Cricket")
      setFavCategory((profile as any).favCategory || "Men")
      setFavTeam((profile as any).favTeam || "CSK")
      setJerseySize((profile as any).jerseySize || "M")
      setEmailPromo((profile as any).emailPromo !== undefined ? (profile as any).emailPromo : true)
      setSmsPromo((profile as any).smsPromo !== undefined ? (profile as any).smsPromo : true)
      setRewardsSummary((profile as any).rewardsSummary !== undefined ? (profile as any).rewardsSummary : true)
    }
  }, [profile])

  if (isLoading || !profile) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch(`/api/identity/users/${profile.id}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          dob,
          gender,
          sportPreference,
          favCategory,
          favTeam,
          jerseySize,
          emailPromo,
          smsPromo,
          rewardsSummary
        })
      })

      if (res.ok) {
        await refreshData()
        triggerToast("Profile preferences saved successfully!")
      } else {
        triggerToast("Failed to save changes.")
      }
    } catch (err) {
      triggerToast("Network error. Please try again.")
    } finally {
      setIsSaving(false)
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

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">My Profile</h1>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Personal Details & Gear Preferences */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Personal Information */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">First Name</label>
                <input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Last Name</label>
                <input 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface-variant cursor-not-allowed outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Date of Birth</label>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Gender</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </section>

          {/* Sports & Gear Preferences */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Sports & Gear Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Favorite Sport</label>
                <select 
                  value={sportPreference} 
                  onChange={(e) => setSportPreference(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Cricket">Cricket</option>
                  <option value="Pickleball">Pickleball</option>
                  <option value="Football">Football</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Running">Running & Training</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Favorite Category</label>
                <select 
                  value={favCategory} 
                  onChange={(e) => setFavCategory(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Club">Club/Teamwear</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Favorite Club / Franchise</label>
                <select 
                  value={favTeam} 
                  onChange={(e) => setFavTeam(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="CSK">Chennai Super Kings (CSK)</option>
                  <option value="RR">Rajasthan Royals (RR)</option>
                  <option value="MI">Mumbai Indians (MI)</option>
                  <option value="KKR">Kolkata Knight Riders (KKR)</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Jersey Sizing</label>
                <select 
                  value={jerseySize} 
                  onChange={(e) => setJerseySize(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="S">S - Small</option>
                  <option value="M">M - Medium</option>
                  <option value="L">L - Large</option>
                  <option value="XL">XL - Extra Large</option>
                  <option value="XXL">XXL - Double Extra Large</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Preferences Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Communication Preferences */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Notifications</h4>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={emailPromo}
                    onChange={(e) => setEmailPromo(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border-2 border-outline/50 rounded bg-transparent checked:bg-primary checked:border-primary transition-colors cursor-pointer" 
                  />
                  <span className="material-symbols-outlined text-[12px] text-on-primary absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface block leading-none">Email Offers</span>
                  <span className="text-[10px] text-on-surface-variant mt-1 block leading-relaxed">Early access to sale releases and collection drops.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={smsPromo}
                    onChange={(e) => setSmsPromo(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border-2 border-outline/50 rounded bg-transparent checked:bg-primary checked:border-primary transition-colors cursor-pointer" 
                  />
                  <span className="material-symbols-outlined text-[12px] text-on-primary absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface block leading-none">SMS Updates</span>
                  <span className="text-[10px] text-on-surface-variant mt-1 block leading-relaxed">Delivery alerts and checkout order tracking reports.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={rewardsSummary}
                    onChange={(e) => setRewardsSummary(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border-2 border-outline/50 rounded bg-transparent checked:bg-primary checked:border-primary transition-colors cursor-pointer" 
                  />
                  <span className="material-symbols-outlined text-[12px] text-on-primary absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface block leading-none">Rewards Summary</span>
                  <span className="text-[10px] text-on-surface-variant mt-1 block leading-relaxed">Monthly reports of earned XP points and unlocked tiers.</span>
                </div>
              </label>
            </div>
          </section>

          {/* Social Logins */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Connected Accounts</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/20">
                <span className="text-xs font-bold text-on-surface">Google Account</span>
                <span className="text-[10px] font-black uppercase text-green-600 bg-green-500/10 px-2 py-0.5 rounded">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/20 opacity-60">
                <span className="text-xs font-bold text-on-surface">Apple ID</span>
                <button 
                  type="button" 
                  onClick={() => triggerToast("[Simulation] Redirecting to Apple Login...")}
                  className="text-[10px] font-black uppercase text-primary hover:underline"
                >
                  LINK
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-error/5 p-6 rounded-3xl border border-error/20">
            <h4 className="font-black text-md uppercase tracking-tight text-error font-headline mb-2">Danger Zone</h4>
            <p className="text-[11px] font-medium text-error/80 mb-4 leading-relaxed">Deleting your account is permanent and deletes all your order histories, wallet balance, and XP badges.</p>
            <button 
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-error border border-error/50 px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-error hover:text-white transition-colors"
            >
              Delete Account
            </button>
          </section>
        </aside>

      </form>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[20%] mx-auto max-w-md bg-surface-container rounded-3xl border border-outline-variant/30 p-8 z-50 shadow-2xl flex flex-col gap-6"
            >
              <div className="bg-error/10 text-error w-12 h-12 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-2xl uppercase tracking-tight text-on-surface font-headline">Delete Account?</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Are you absolutely sure? This will delete the user account profile and deactivate your NECTAR wallet balance (₹{(wallet?.balance || 0).toLocaleString()}) and {(rewards?.points || 0).toLocaleString()} XP points. This action is irreversible.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => triggerToast("[Simulation] Account deletion cancelled.")}
                  className="flex-1 bg-surface-container-highest text-on-surface py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-on-surface/5 transition-all border border-outline-variant/25"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    triggerToast("[Simulation] Account deleted. Logging out...");
                    setTimeout(() => window.location.href = "/", 2000);
                  }}
                  className="flex-1 bg-error text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
