"use client"

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'


function OtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed.")
      } else {
        setSuccess("Code verified successfully! Welcome to playR.")
        if (data.user) {
          try {
            const { useAuthStore } = await import('@/store/authStore');
            useAuthStore.getState().sync({
              id: data.user.id,
              username: data.user.name?.toLowerCase().replace(/\s+/g, '') || '',
              name: data.user.name || 'playR Member',
              phone: '',
              email: data.user.email,
              avatar: null,
              referralCode: 'PLAYR-PRO',
              walletId: `wal_${data.user.id.slice(-4)}`,
              joinedFrom: 'otp',
              authProvider: 'email',
              isOnboarded: true,
              memberSince: new Date().toISOString(),
              sprrBalance: data.user.sprrBalance || 100,
              role: data.user.role || 'member',
              tier: data.user.tier || 'STREET',
            });
          } catch (e) {
            console.error('Failed to sync auth state', e);
          }
        }
        setTimeout(() => {
          router.push('/account')
        }, 1200)
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Missing email address to resend OTP.");
      return;
    }
    setError('');
    setSuccess('Sending a new OTP code to your inbox...');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'login' }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("A new 6-digit verification code has been sent via email.");
      } else {
        setError(data.error || "Failed to resend code.");
      }
    } catch (err) {
      setError("Failed to resend verification code.");
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-black text-white text-center tracking-tighter mb-2">Verify OTP</h1>
      <p className="text-zinc-400 text-center text-sm mb-4">We sent a verification code to <span className="text-white font-medium">{email}</span></p>
      
      <div className="bg-primary-container/10 border border-primary/20 text-on-primary-container p-3 rounded-lg text-xs text-center mb-6">
        📧 Check your inbox — 6-digit verification code has been dispatched via SMTP.
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-sm mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">6-Digit Code</label>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-[1em] pl-8 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="000000"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length < 6}
          className="w-full bg-white text-black font-bold uppercase tracking-widest text-sm py-4 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500">
        Didn&apos;t receive code? <button onClick={handleResend} className="text-white hover:underline font-bold">Resend OTP</button>
      </div>
    </div>
  )
}

export default function OtpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-950 px-4">
      <Suspense fallback={<div className="text-white">Loading verification...</div>}>
        <OtpContent />
      </Suspense>
    </div>
  )
}
