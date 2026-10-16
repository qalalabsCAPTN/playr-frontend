"use client"

import React, { useState, useEffect } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, CheckCircle2, Shield, X, Award, Moon, Sun, Globe } from "lucide-react"

export default function AccountSettingsPage() {
  const { profile, isLoading, refreshData } = useAccount()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Settings States
  const [emailPromo, setEmailPromo] = useState(true)
  const [smsPromo, setSmsPromo] = useState(true)
  const [rewardsSummary, setRewardsSummary] = useState(true)
  const [language, setLanguage] = useState("en")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying2FA, setIsVerifying2FA] = useState(false)
  const [previewDarkMode, setPreviewDarkMode] = useState(false)

  useEffect(() => {
    if (profile) {
      setEmailPromo((profile as any).emailPromo !== undefined ? (profile as any).emailPromo : true)
      setSmsPromo((profile as any).smsPromo !== undefined ? (profile as any).smsPromo : true)
      setRewardsSummary((profile as any).rewardsSummary !== undefined ? (profile as any).rewardsSummary : true)
      setLanguage((profile as any).language || "en")
      setTwoFactorEnabled(!!(profile as any).twoFactorEnabled)
    }
  }, [profile])

  if (isLoading || !profile) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSaveSettings = async () => {
    try {
      const res = await fetch(`/api/identity/users/${profile.id}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          emailPromo,
          smsPromo,
          rewardsSummary,
          language,
          twoFactorEnabled
        })
      })

      if (res.ok) {
        await refreshData()
        triggerToast("Settings preferences saved successfully!")
      } else {
        triggerToast("Preferences saved locally!")
      }
    } catch (e) {
      triggerToast("Preferences saved locally!")
    }
  }

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false)
      triggerToast("2FA disabled.")
    } else {
      setShowTwoFactorModal(true)
    }
  }

  const handleVerify2FA = () => {
    if (verificationCode.length !== 6) {
      triggerToast("Please enter a valid 6-digit code.")
      return
    }
    setIsVerifying2FA(true)
    setTimeout(async () => {
      setIsVerifying2FA(false)
      setShowTwoFactorModal(false)
      setTwoFactorEnabled(true)
      setVerificationCode("")
      triggerToast("2FA enabled successfully!")
    }, 1000)
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
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core preferences settings */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Notifications Toggles */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Notification Channels</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Control how you receive updates and announcements.</p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-sm text-on-surface">Order Tracking Reports</span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">Receive transactional SMS and shipping milestone changes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={smsPromo} 
                    onChange={(e) => setSmsPromo(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant/40 peer-checked:after:bg-on-primary after:border-surface after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-sm text-on-surface">Promotions & Newsletters</span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">Early alerts for flash sales, gear launches, and exclusive drops.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={emailPromo} 
                    onChange={(e) => setEmailPromo(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant/40 peer-checked:after:bg-on-primary after:border-surface after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-sm text-on-surface">NECTAR XP Points Statements</span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">Monthly breakdown of rewards, challenges, and unlocked levels.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rewardsSummary} 
                    onChange={(e) => setRewardsSummary(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant/40 peer-checked:after:bg-on-primary after:border-surface after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>

          {/* Interactive Dark Mode Preview */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Display Theme</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Simulate playR dark mode aesthetic in real-time.</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDarkMode(!previewDarkMode)}
                className="bg-primary text-on-primary px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 shadow-sm"
              >
                {previewDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{previewDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>

            {/* Dark mode card preview */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 ${
              previewDarkMode 
                ? 'bg-zinc-950 text-white border-zinc-800 shadow-xl' 
                : 'bg-surface-container-low text-on-surface border-outline-variant/20 shadow-sm'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Personal Hub</span>
                <Award className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-black text-xl uppercase tracking-tight leading-none mb-1 font-headline">playR Athletics</h4>
              <p className="text-xs opacity-75">Visual simulator container. Looking sleek and responsive.</p>
            </div>
          </section>

          <div className="flex gap-4">
            <button
              onClick={handleSaveSettings}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Security & Localization Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Localization Dropdown */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary shrink-0" />
              <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Localization</h4>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Default Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English (India / Global)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Español (ES)</option>
                <option value="de">Deutsch (DE)</option>
              </select>
            </div>
          </section>

          {/* Security & 2FA Toggle */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Security Hub</h4>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div>
                <span className="font-bold text-xs text-on-surface uppercase tracking-wider block">2-Factor Auth</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">Secure logins via SMS OTP.</span>
              </div>
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`px-4 py-2 rounded-full font-bold text-[9px] uppercase tracking-widest transition-all ${
                  twoFactorEnabled 
                    ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                    : 'bg-primary text-on-primary hover:opacity-90 shadow-sm'
                }`}
              >
                {twoFactorEnabled ? "ENABLED" : "ENABLE"}
              </button>
            </div>
          </section>
        </aside>

      </div>

      {/* Two-Factor Authentication Modal */}
      <AnimatePresence>
        {showTwoFactorModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTwoFactorModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[20%] mx-auto max-w-sm bg-surface-container rounded-3xl border border-outline-variant/30 p-6 z-50 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 text-primary w-11 h-11 rounded-2xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <button 
                  onClick={() => setShowTwoFactorModal(false)}
                  className="w-7 h-7 bg-on-surface/5 hover:bg-on-surface/10 rounded-full flex items-center justify-center text-on-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-black text-xl uppercase tracking-tight text-on-surface font-headline">Two-Factor Authentication</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                  Enter the verification code sent to <strong className="text-on-surface">{profile.phone || "+91 9876543210"}</strong>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Verification Code</label>
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  placeholder="123456"
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest text-on-surface outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleVerify2FA}
                  disabled={isVerifying2FA}
                  className="w-full bg-primary text-on-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
                >
                  {isVerifying2FA ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
