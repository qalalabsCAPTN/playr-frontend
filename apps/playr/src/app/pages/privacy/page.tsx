import React from "react"
import Link from "next/link"

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Account information: name, email, phone number, date of birth.",
      "Order information: shipping address, payment method (we do not store full card details), order history.",
      "Device and usage data: IP address, browser type, pages visited, time on site — used to improve your experience.",
      "Cookies and tracking pixels: used for analytics, personalization, and advertising. You can opt out via your browser settings.",
    ]
  },
  {
    title: "How We Use Your Information",
    content: [
      "To process and fulfill your orders.",
      "To send transactional emails (order confirmation, shipping updates, returns).",
      "To send marketing communications — only with your consent. Unsubscribe any time.",
      "To personalize your experience, including product recommendations and playR XP rewards.",
      "To comply with legal obligations and prevent fraud.",
    ]
  },
  {
    title: "Data Sharing",
    content: [
      "We do not sell your personal data to third parties.",
      "We share data with logistics partners (Delhivery, Bluedart) solely to fulfill your orders.",
      "We share anonymized analytics data with advertising platforms (Meta, Google) to improve our ads.",
      "We may share data if required by law or legal process.",
    ]
  },
  {
    title: "Data Retention",
    content: [
      "Account data is retained as long as your account is active.",
      "Order data is retained for 7 years for tax and legal compliance.",
      "You may request account deletion at any time by contacting support@playr.in.",
    ]
  },
  {
    title: "Your Rights",
    content: [
      "Access: request a copy of the data we hold about you.",
      "Correction: request that we correct inaccurate data.",
      "Deletion: request that we delete your personal data (subject to legal retention requirements).",
      "Portability: receive your data in a machine-readable format.",
      "Opt-out: unsubscribe from marketing communications at any time.",
    ]
  },
  {
    title: "Security",
    content: [
      "We use industry-standard SSL/TLS encryption for all data in transit.",
      "Payment processing is handled by PCI-DSS compliant payment gateways.",
      "We conduct regular security audits and vulnerability assessments.",
      "Access to personal data is restricted to authorized employees on a need-to-know basis.",
    ]
  },
  {
    title: "Contact Us",
    content: [
      "For privacy-related inquiries: privacy@playr.in",
      "playR Sports Pvt. Ltd., New Delhi, India.",
      "We aim to respond to all privacy requests within 30 days.",
    ]
  }
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-container-margin-desktop">

        {/* Header */}
        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Legal</span>
          <h1 className="font-black text-5xl md:text-6xl uppercase tracking-tighter text-on-surface mb-6">
            Privacy Policy
          </h1>
          <p className="text-on-surface-variant text-lg">
            Last updated: June 2026. This policy describes how playR Sports Pvt. Ltd. collects, uses, and protects your personal information.
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
          <Link href="/pages/terms" className="hover:text-primary transition-colors font-medium">
            Terms of Service →
          </Link>
          <Link href="/pages/faq" className="hover:text-primary transition-colors font-medium">
            FAQ &amp; Help →
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors font-medium">
            Contact Us →
          </Link>
        </div>
      </div>
    </main>
  )
}
