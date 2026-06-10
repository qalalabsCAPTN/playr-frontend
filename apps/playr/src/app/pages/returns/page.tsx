import React from "react"
import Link from "next/link"

const steps = [
  {
    step: "01",
    title: "Initiate Return",
    desc: "Go to Account → Orders within 15 days of delivery. Select the item and click Return / Exchange.",
    icon: "package_2",
  },
  {
    step: "02",
    title: "Schedule Pickup",
    desc: "Our logistics partner will schedule a doorstep pickup within 2 business days. No drop-off required.",
    icon: "local_shipping",
  },
  {
    step: "03",
    title: "Quality Check",
    desc: "Once received, items are inspected within 2 business days. Items must be unworn, unwashed, with tags intact.",
    icon: "fact_check",
  },
  {
    step: "04",
    title: "Refund / Exchange",
    desc: "Refunds process in 5–7 business days to your original payment method. Exchanges ship within 3 business days.",
    icon: "currency_rupee",
  },
]

const notEligible = [
  "Items washed, worn, or altered",
  "Products without original tags/packaging",
  "Items returned after 15 days from delivery",
  "Customized/personalized products (name prints, numbers)",
  "Gift cards and digital products",
  "Items marked as Final Sale",
]

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[900px] mx-auto px-4 md:px-container-margin-desktop">

        {/* Header */}
        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Policy</span>
          <h1 className="font-black text-5xl md:text-6xl uppercase tracking-tighter text-on-surface mb-6">
            Returns &amp; Exchanges
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl">
            We stand behind every product. If something isn&apos;t right, we&apos;ll make it right — fast.
          </p>
        </div>

        {/* Key Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: "event_available", title: "15-Day Window", desc: "Return or exchange within 15 days of delivery." },
            { icon: "storefront", title: "Free Pickup", desc: "Doorstep pickup at no extra cost anywhere in India." },
            { icon: "replay", title: "Free Size Exchange", desc: "Size swaps are always free, subject to stock." },
          ].map((fact) => (
            <div key={fact.title} className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block">{fact.icon}</span>
              <h3 className="font-bold text-on-surface text-lg mb-2">{fact.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{fact.desc}</p>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="font-black text-xs uppercase tracking-[0.3em] text-outline mb-8 pb-4 border-b border-outline-variant/30">
            How It Works
          </h2>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container text-2xl">{s.icon}</span>
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary font-black text-xs tracking-wider">{s.step}</span>
                    <h3 className="font-bold text-on-surface text-lg">{s.title}</h3>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not Eligible */}
        <div className="mb-16">
          <h2 className="font-black text-xs uppercase tracking-[0.3em] text-outline mb-8 pb-4 border-b border-outline-variant/30">
            Not Eligible for Return
          </h2>
          <ul className="space-y-3">
            {notEligible.map((item) => (
              <li key={item} className="flex items-start gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-error text-lg mt-0.5 shrink-0">cancel</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-primary-container/30 border border-primary-container/50 rounded-2xl p-10 text-center">
          <h3 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-3">Ready to Return?</h3>
          <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">Log in to your account and initiate a return in under 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <button className="bg-on-surface text-background px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Start a Return
              </button>
            </Link>
            <Link href="/pages/faq">
              <button className="bg-transparent border-2 border-on-surface text-on-surface px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-surface-container transition-all">
                View FAQ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
