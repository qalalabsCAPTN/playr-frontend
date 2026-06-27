"use client"

import React, { useState } from "react"

export default function ContactPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, subject, message })
      })
      if (res.ok) {
        setStatus("Thanks! Your message has been sent to our support team.")
        setFirstName("")
        setLastName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        const data = await res.json()
        setStatus(data.error || "Failed to submit inquiry. Please try again.")
      }
    } catch (e) {
      console.error(e)
      setStatus("An error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fdf9f0] min-h-screen text-on-surface py-20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        <div className="text-center mb-16">
          <h1 className="font-headline-xl text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Contact playR</h1>
          <p className="text-secondary font-body-lg max-w-2xl mx-auto">
            Whether you have a question about our high-performance gear, need assistance with an order, or want to discuss a corporate partnership, our team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information & Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
              <h3 className="font-headline-md text-2xl uppercase tracking-tight font-bold mb-6">Direct Channels</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold uppercase tracking-wider mb-1">Email Support</h4>
                    <a href="mailto:support@playr.athletics" className="text-secondary hover:text-primary transition-colors font-body-md">support@playr.in</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">phone_in_talk</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold uppercase tracking-wider mb-1">Phone</h4>
                    <a href="tel:+919876543210" className="text-secondary hover:text-primary transition-colors font-body-md">+91 98765 43210</a>
                    <p className="text-outline-variant text-sm mt-1">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold uppercase tracking-wider mb-1">Headquarters</h4>
                    <p className="text-secondary font-body-md">
                      PlayR Athletics Ltd.<br />
                      Corporate Tower B, Sector 4<br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-on-surface p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-8xl">domain</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-headline-md text-2xl uppercase tracking-tight font-bold mb-4">Corporate & B2B</h3>
                <p className="text-white/80 font-body-md mb-6">
                  Looking to outfit your team or require bulk purchasing for a corporate event?
                </p>
                <a href="/b2b" className="inline-block bg-action-yellow text-on-surface font-label-bold px-6 py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-widest">
                  View B2B Solutions
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-2xl border border-outline-variant/30 shadow-md">
              <h3 className="font-headline-md text-3xl uppercase tracking-tight font-black mb-8">Send an Inquiry</h3>
              
              {status && (
                <div className="mb-8 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 font-label-bold">
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">First Name</label>
                    <input 
                      type="text" 
                      required 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Last Name</label>
                    <input 
                      type="text" 
                      required 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Subject / Order ID</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Message</label>
                  <textarea 
                    rows={5} 
                    required 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-on-surface text-white font-label-bold text-lg uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-primary transition-colors shadow-lg disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
