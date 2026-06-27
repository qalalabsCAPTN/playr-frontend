"use client"

import React, { useState, useEffect } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import { motion, AnimatePresence } from "framer-motion"

interface TicketReply {
  sender: string;
  text: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  replies: TicketReply[];
}

export default function AccountSupportPage() {
  const { profile, isLoading } = useAccount()
  
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [ticketsLoading, setTicketsLoading] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Live Chat Simulation States
  const [showLiveChat, setShowLiveChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: "Hi! Welcome to playR Athlete Support. I'm ready to help you with orders, sizing, or rewards. What's on your mind today?" }
  ])
  const [chatInput, setChatInput] = useState("")

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Official kitted jersey orders with personalization may take an extra 48 hours to process." },
    { q: "What is the return policy?", a: "We offer a 30-day hassle-free return and exchange policy on all unworn items with tags. Personalized jerseys are non-returnable unless defective." },
    { q: "How do I redeem my NECTAR rewards?", a: "Go to your Account Rewards Hub, choose an unlocked coupon code, and click 'Redeem'. You can copy this code and paste it in the Cart or Checkout screen to apply discounts." },
    { q: "Can I cancel my order after it has shipped?", a: "Once an order is shipped, it cannot be cancelled. You can raise a return request in the Returns page once it is delivered." },
    { q: "How does wallet cashback work?", a: "Elite tier members earn up to 15% XP cashback on purchases. This is instantly credited to your NECTAR wallet and can be used on your next checkout." }
  ];

  const fetchTickets = async () => {
    if (!profile?.id) return;
    setTicketsLoading(true)
    try {
      const res = await fetch(`/api/identity/users/${profile.id}/support-tickets`)
      if (res.ok) {
        const data = await res.json()
        setTickets(data)
      }
    } catch (err) {
      console.error("Failed to load tickets", err)
    } finally {
      setTicketsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) return;

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/identity/users/${profile!.id}/support-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${profile!.firstName} ${profile!.lastName}`,
          email: profile!.email,
          subject,
          message,
          priority
        })
      })

      if (res.ok) {
        setSubject("")
        setMessage("")
        setPriority("medium")
        triggerToast("Support ticket raised successfully!")
        await fetchTickets()
      } else {
        triggerToast("Failed to submit support ticket.")
      }
    } catch (err) {
      triggerToast("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }])
    setChatInput("")

    // Simulated Bot Reply
    setTimeout(() => {
      let botText = "Got it! Our athlete support team is looking into this. Can you provide your Order ID?";
      const lower = userText.toLowerCase();
      if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("track")) {
        botText = "You can track your package directly on the 'Track Shipment' page. Just enter your Order ID (e.g. PR-99231) to see live FedEx milestones!";
      } else if (lower.includes("return") || lower.includes("exchange")) {
        botText = "Returns can be initiated in the 'Returns' page. Choose your order item, state the reason, and upload a sizing image to get a NECTAR wallet refund.";
      } else if (lower.includes("size") || lower.includes("jersey")) {
        botText = "Our jerseys feature an athletic slim-fit. We suggest ordering one size up if you prefer a looser fan fit. Sizing guides are on each product detail page!";
      } else if (lower.includes("wallet") || lower.includes("money") || lower.includes("refund")) {
        botText = "Wallet credits are instantly available for checkout! You can top up your wallet or check your refund debit/credit list in the 'Wallet' tab.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botText }])
    }, 1000)
  }

  if (isLoading || !profile) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
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
            <span className="material-symbols-outlined text-sm text-primary-fixed-dim">support_agent</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">Support Center</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Support Ticket Forms and History */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Raise Support Ticket */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Submit Support Ticket</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Submit a formal inquiry and track our representative replies.</p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="e.g. Size exchange for basico polo"
                    className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Message Description</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Detail your request or issue here..."
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </section>

          {/* Ticket History */}
          <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-outline-variant/30 bg-surface-container/30">
              <h3 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">My Tickets History</h3>
            </div>

            {ticketsLoading ? (
              <div className="p-10 text-center animate-pulse text-xs text-on-surface-variant font-bold uppercase">Loading tickets...</div>
            ) : tickets.length > 0 ? (
              <div className="divide-y divide-outline-variant/20">
                {tickets.map((t) => (
                  <div key={t.id} className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">{t.subject}</h4>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mt-0.5">
                          Created {new Date(t.createdAt).toLocaleDateString()} • Ticket ID: {t.id}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          t.priority === 'high' ? 'bg-error/10 text-error' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {t.priority}
                        </span>
                        <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          t.status === 'open' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/10">
                      {t.message}
                    </p>

                    {/* Replies */}
                    {t.replies && t.replies.length > 1 && (
                      <div className="pl-6 border-l-2 border-primary/20 space-y-2 mt-3">
                        {t.replies.slice(1).map((r, i) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-primary">{r.sender === t.email ? "You" : "playR Support"}:</span>
                            <span className="text-on-surface-variant font-medium ml-1.5">{r.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2">confirmation_number</span>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">No active support tickets found.</p>
              </div>
            )}
          </section>
        </div>

        {/* Contact info and FAQ sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Live Chat Launcher */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-center gap-4">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Live Chat Support</h4>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Connect with our live automated athlete bot to get instant feedback on shipping, collections, and rewards.
            </p>
            <button
              onClick={() => setShowLiveChat(true)}
              className="bg-primary text-on-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              Start Live Chat
            </button>
          </section>

          {/* Quick Contacts */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Quick Hotlines</h4>
            <div className="space-y-3">
              <a href="https://wa.me/919876543210" target="_blank" className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/20 rounded-xl hover:bg-on-surface/5 transition-all text-xs font-bold text-on-surface">
                <span className="material-symbols-outlined text-green-500">sms</span>
                WhatsApp: +91 98765 43210
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/20 rounded-xl hover:bg-on-surface/5 transition-all text-xs font-bold text-on-surface">
                <span className="material-symbols-outlined text-primary">call</span>
                Call Center: +91 98765 43210
              </a>
              <a href="mailto:support@playr.in" className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/20 rounded-xl hover:bg-on-surface/5 transition-all text-xs font-bold text-on-surface">
                <span className="material-symbols-outlined text-primary">mail</span>
                Email: support@playr.in
              </a>
            </div>
          </section>

          {/* FAQ Accordions */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">General FAQs</h4>
            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx
                return (
                  <div key={idx} className="border-b border-outline-variant/10 pb-2">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left py-2 font-bold text-xs text-on-surface hover:text-primary transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-sm">{isOpen ? 'expand_less' : 'expand_more'}</span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[11px] text-on-surface-variant font-medium leading-relaxed pr-4 pt-1"
                        >
                          {faq.a}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </section>
        </aside>

      </div>

      {/* Simulated Live Chat Drawer */}
      <AnimatePresence>
        {showLiveChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLiveChat(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Chat Box */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 h-[500px] bg-surface-container rounded-t-3xl md:rounded-3xl border border-outline-variant/30 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-primary text-on-primary p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-on-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-md">chat_bubble</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none">playR Bot</h4>
                    <span className="text-[9px] opacity-75 font-semibold mt-1 block">Live simulator agent</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowLiveChat(false)}
                  className="w-7 h-7 bg-on-primary/10 text-on-primary hover:bg-on-primary/20 rounded-full flex items-center justify-center text-xs"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Message List */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-surface/50 custom-scrollbar flex flex-col">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                      msg.sender === 'user' ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/15'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-outline-variant/20 bg-surface shrink-0 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Ask about returns, sizing, wallet..."
                  className="flex-grow bg-surface-container/50 border border-outline-variant/25 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="bg-primary text-on-primary w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-90 shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
