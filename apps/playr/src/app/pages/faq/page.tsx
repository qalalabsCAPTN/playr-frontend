"use client"

import React, { useState } from "react"
import Link from "next/link"

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 4–7 business days across India. Express delivery (1–2 business days) is available for select pin codes. Order cut-off time is 12 PM IST for same-day dispatch."
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once shipped, you receive a tracking link via SMS and email. You can also track from your Account → Orders section at any time."
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we ship within India. International shipping is coming soon — join our newsletter to get notified first."
      },
      {
        q: "What are the shipping charges?",
        a: "Free shipping on all orders above ₹999. A flat ₹79 fee applies on orders below ₹999."
      },
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is the return window?",
        a: "We offer a 15-day return window from the date of delivery. Items must be unwashed, unworn, and in original packaging with tags intact."
      },
      {
        q: "How do I initiate a return?",
        a: "Go to Account → Orders, select the item, and click 'Return/Exchange'. Our team will schedule a pickup within 2 business days."
      },
      {
        q: "How long does the refund take?",
        a: "Once we receive the returned item and verify its condition, refunds are processed within 5–7 business days to the original payment method."
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes. Size exchanges are free. Select 'Exchange' during the return process and choose your new size. Subject to stock availability."
      },
    ]
  },
  {
    category: "Products & Sizing",
    items: [
      {
        q: "How do I find my size?",
        a: "Refer to the Size Chart on each product page. Our gear runs true-to-size. If you're between sizes, we recommend sizing up for a more relaxed athletic fit."
      },
      {
        q: "What materials do you use?",
        a: "We use premium performance fabrics including moisture-wicking polyester blends, 4-way stretch materials, and sustainable cotton options. Material details are listed on each product page."
      },
      {
        q: "Are the IPL jerseys official?",
        a: "Yes. playR is an official merchandise partner for CSK, LSG, Sunrisers, UP Yoddhas, and Seattle Orcas. All jerseys carry official team licensing."
      },
    ]
  },
  {
    category: "playR XP & Rewards",
    items: [
      {
        q: "What is playR XP?",
        a: "playR XP is our loyalty program. Earn XP points on every purchase, review, and referral. Redeem points for discounts, exclusive products, and early access drops."
      },
      {
        q: "How do I earn XP?",
        a: "Purchase (1 XP per ₹1 spent), Leave a review (+200 XP), Refer a friend (+1,000 XP each), First purchase (+500 XP bonus). Check your dashboard for active challenges."
      },
      {
        q: "When do XP points expire?",
        a: "Points are valid for 12 months from the date earned. Any purchase activity within that window resets the expiry clock."
      },
    ]
  },
  {
    category: "B2B & Team Orders",
    items: [
      {
        q: "Do you offer bulk/team orders?",
        a: "Yes. We cater to sports teams, corporates, schools, and clubs. Minimum order of 20 units. Custom branding (name, number, logo) available."
      },
      {
        q: "How long do custom orders take?",
        a: "Standard custom team orders take 10–14 business days. Rush orders (7 days) available with a premium charge."
      },
    ]
  }
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-outline-variant/30 last:border-0">
      <button
        className="flex justify-between items-center w-full py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-bold text-on-surface group-hover:text-primary transition-colors pr-8">{q}</span>
        <span
          className="material-symbols-outlined text-outline shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <p className="pb-5 text-on-surface-variant leading-relaxed text-[15px]">{a}</p>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[900px] mx-auto px-4 md:px-container-margin-desktop">

        {/* Header */}
        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Support</span>
          <h1 className="font-black text-5xl md:text-6xl uppercase tracking-tighter text-on-surface mb-6">
            FAQ &amp; Help
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl">
            Answers to the most common questions. Can&apos;t find what you need?{" "}
            <Link href="/contact" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
              Contact our team.
            </Link>
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-black text-xs uppercase tracking-[0.3em] text-outline mb-6 pb-4 border-b border-outline-variant/30">
                {section.category}
              </h2>
              <div>
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div className="mt-20 bg-primary-container/30 border border-primary-container/50 rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 block">support_agent</span>
          <h3 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-3">Still Need Help?</h3>
          <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">
            Our support team is available Mon–Sat, 10 AM – 6 PM IST.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-on-surface text-background px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Contact Us
              </button>
            </Link>
            <Link href="/account/tracking">
              <button className="bg-transparent border-2 border-on-surface text-on-surface px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-surface-container transition-all">
                Track My Order
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
