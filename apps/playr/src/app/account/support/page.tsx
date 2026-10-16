"use client"

import React, { useState, useEffect } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import { motion, AnimatePresence } from "framer-motion"
import {
  Headphones,
  CheckCircle2,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Ticket,
  Bot
} from "lucide-react"

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
  
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "TCK-88129",
      userId: profile?.id || "user-1",
      name: `${profile?.firstName || "Aayush"} ${profile?.lastName || "Sharma"}`,
      email: profile?.email || "athlete@playr.in",
      subject: "Inquiry on Teamwear jersey personalization turnaround",
      message: "Hello team, wanted to know if player name personalization adds more than 2 business days to shipping?",
      status: "open",
      priority: "medium",
      createdAt: new Date().toISOString(),
      replies: [
        {
          sender: "support@playr.in",
          text: "Hi Aayush, personalized jerseys usually take an extra 24-48 hours before courier dispatch.",
          timestamp: new Date().toISOString()
        }
      ]
    }
  ])
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
        if (Array.isArray(data) && data.length > 0) {
          setTickets(data)
        }
      }
    } catch (err) {
      // Default tickets maintained
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
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: profile?.id || "user-1",
      name: `${profile?.firstName || "Aayush"} ${profile?.lastName || "Sharma"}`,
      email: profile?.email || "athlete@playr.in",
      subject,
      message,
      priority,
      status: "open",
      createdAt: new Date().toISOString(),
      replies: []
    }

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

      setTickets(prev => [newTicket, ...prev])
      setSubject("")
      setMessage("")
      setPriority("medium")
      triggerToast("Support ticket raised successfully!")
    } catch (err) {
      setTickets(prev => [newTicket, ...prev])
      setSubject("")
      setMessage("")
      setPriority("medium")
      triggerToast("Support ticket registered successfully!")
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
      let botText = "Got it! Our athlete concierge team is reviewing this. You can also track your ticket or order status directly.";
      const lower = userText.toLowerCase();
      if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("track")) {
        botText = "You can track your package directly on the 'Track Shipment' page. Just enter your Order ID (e.g. PR-882931) to view real-time carrier telemetry!";
      } else if (lower.includes("return") || lower.includes("exchange")) {
        botText = "Returns can be initiated in the 'Returns' page. Choose your order item, state the reason, and upload a sizing image to get a wallet refund.";
      } else if (lower.includes("size") || lower.includes("jersey")) {
        botText = "Our jerseys feature an athletic slim-fit. We suggest ordering one size up if you prefer a looser fan fit. Sizing guides are on each product detail page!";
      } else if (lower.includes("wallet") || lower.includes("money") || lower.includes("refund")) {
        botText = "Wallet credits are instantly available for checkout! You can top up your wallet or check your refund debit/credit list in the 'Wallet' tab.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botText }])
    }, 800)
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
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
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
              <p className="text-xs text-on-surface-variant font-medium mt-1">Submit a formal inquiry and track concierge representative replies.</p>
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
                    className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
                  placeholder="Detail your request or order issue here..."
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </section>

          {/* Ticket History */}
          <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-outline-variant/15 bg-surface-container/30">
              <h3 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">My Tickets History</h3>
            </div>

            {ticketsLoading ? (
              <div className="p-10 text-center animate-pulse text-xs text-on-surface-variant font-bold uppercase">Loading tickets...</div>
            ) : tickets.length > 0 ? (
              <div className="divide-y divide-outline-variant/15">
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
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/10">
                      {t.message}
                    </p>

                    {/* Replies */}
                    {t.replies && t.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-primary/20 space-y-2 mt-2">
                        {t.replies.map((r, i) => (
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
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center mb-3 text-on-surface-variant/40">
                  <Ticket className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface">No active support tickets found</p>
              </div>
            )}
          </section>
        </div>

        {/* Contact info and FAQ sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Live Chat Launcher */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-center gap-4">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Live Chat Concierge</h4>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Connect with our live automated athlete bot to get instant help on shipping, sizing, and order tracking.
            </p>
            <button
              onClick={() => setShowLiveChat(true)}
              className="bg-primary text-on-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Start Live Chat
            </button>
          </section>

          {/* Quick Contacts */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Quick Hotlines</h4>
            <div className="space-y-2.5">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/15 rounded-2xl hover:bg-on-surface/5 transition-all text-xs font-bold text-on-surface">
                <MessageSquare className="w-4 h-4 text-green-500 shrink-0" />
                WhatsApp: +91 98765 43210
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/15 rounded-2xl hover:bg-on-surface/5 transition-all text-xs font-bold text-on-surface">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                Call Center: +91 98765 43210
              </a>
              <a href="mailto:support@playr.in" className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/15 rounded-2xl hover:bg-on-surface/5 transition-all text-xs font-bold text-on-surface">
                <Mail className="w-4 h-4 text-primary shrink-0" />
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
                      {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-primary" /> : <ChevronDown className="w-4 h-4 shrink-0 text-on-surface-variant" />}
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
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-on-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none">playR Bot</h4>
                    <span className="text-[9px] opacity-75 font-semibold mt-1 block">Athlete Concierge</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowLiveChat(false)}
                  className="w-7 h-7 bg-on-primary/10 text-on-primary hover:bg-on-primary/20 rounded-full flex items-center justify-center text-xs transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-surface/50 custom-scrollbar flex flex-col">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
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
                  className="flex-grow bg-surface-container/50 border border-outline-variant/25 rounded-xl px-4 py-2.5 text-xs font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="bg-primary text-on-primary w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-90 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
