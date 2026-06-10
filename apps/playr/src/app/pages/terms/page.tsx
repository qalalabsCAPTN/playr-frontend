import React from "react"
import Link from "next/link"

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or purchasing from playr.in, you agree to these Terms of Service and our Privacy Policy.",
      "If you do not agree, please do not use our services.",
      "We reserve the right to update these terms at any time. Continued use after updates constitutes acceptance.",
    ]
  },
  {
    title: "Account Responsibilities",
    content: [
      "You must be 18 years or older to create an account and make purchases.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate and current information when creating your account.",
      "You must notify us immediately of any unauthorized access to your account.",
    ]
  },
  {
    title: "Orders & Payment",
    content: [
      "All prices are in Indian Rupees (INR) inclusive of applicable taxes.",
      "We reserve the right to cancel orders due to pricing errors, stock availability, or suspected fraud.",
      "Payment must be made at the time of order. We accept major credit/debit cards, UPI, net banking, and wallets.",
      "All transactions are secured with SSL encryption through PCI-DSS compliant payment gateways.",
    ]
  },
  {
    title: "Shipping & Delivery",
    content: [
      "Estimated delivery timelines are provided in good faith but are not guaranteed.",
      "Risk of loss and title transfer to you upon delivery by our carrier.",
      "We are not liable for delays caused by carrier failures, natural disasters, or government restrictions.",
      "Incorrect delivery address provided by the customer is not our responsibility.",
    ]
  },
  {
    title: "Returns & Refunds",
    content: [
      "Returns are subject to our Returns Policy available at playr.in/pages/returns.",
      "Refunds will be processed to the original payment method within 5–7 business days of receiving the return.",
      "We reserve the right to refuse returns that do not comply with our return eligibility criteria.",
    ]
  },
  {
    title: "Intellectual Property",
    content: [
      "All content on playr.in including logos, images, text, and design is owned by playR Sports Pvt. Ltd. or licensed to us.",
      "Official team logos and marks are property of their respective franchises and used under license.",
      "You may not reproduce, distribute, or create derivative works from our content without written permission.",
    ]
  },
  {
    title: "Limitation of Liability",
    content: [
      "playR Sports Pvt. Ltd. is not liable for indirect, incidental, or consequential damages.",
      "Our total liability for any claim shall not exceed the amount paid for the specific product involved.",
      "We do not warrant that our website will be error-free or uninterrupted.",
    ]
  },
  {
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of India.",
      "Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.",
      "For disputes under ₹1,00,000 we encourage resolution through our customer support channel first.",
    ]
  }
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-container-margin-desktop">

        {/* Header */}
        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Legal</span>
          <h1 className="font-black text-5xl md:text-6xl uppercase tracking-tighter text-on-surface mb-6">
            Terms of Service
          </h1>
          <p className="text-on-surface-variant text-lg">
            Last updated: June 2026. Please read these terms carefully before using playr.in or making a purchase.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-black text-xl uppercase tracking-tight text-on-surface mb-5 pb-4 border-b border-outline-variant/30">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.content.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-on-surface-variant leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex flex-col sm:flex-row gap-4 text-sm text-on-surface-variant">
          <Link href="/pages/privacy" className="hover:text-primary transition-colors font-medium">
            Privacy Policy →
          </Link>
          <Link href="/pages/returns" className="hover:text-primary transition-colors font-medium">
            Returns Policy →
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors font-medium">
            Contact Us →
          </Link>
        </div>
      </div>
    </main>
  )
}
