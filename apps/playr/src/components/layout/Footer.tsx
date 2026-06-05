import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 py-16 border-t border-zinc-900">
      <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <span className="font-extrabold text-3xl tracking-tighter text-white font-[var(--font-sora)] mb-4 block">playR</span>
          <p className="text-sm text-zinc-500 mb-6 max-w-xs">Engineered for elite performance. Designed for everyday greatness.</p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Shop</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/collections/new" className="hover:text-white transition">New Arrivals</Link></li>
            <li><Link href="/collections/men" className="hover:text-white transition">Men&apos;s Gear</Link></li>
            <li><Link href="/collections/women" className="hover:text-white transition">Women&apos;s Gear</Link></li>
            <li><Link href="/collections/accessories" className="hover:text-white transition">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/pages/faq" className="hover:text-white transition">FAQ & Help</Link></li>
            <li><Link href="/account/tracking" className="hover:text-white transition">Track Order</Link></li>
            <li><Link href="/pages/returns" className="hover:text-white transition">Returns Policy</Link></li>
            <li><Link href="/pages/contact" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Corporate</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/b2b" className="hover:text-white transition">B2B & Teamwear</Link></li>
            <li><Link href="/pages/about" className="hover:text-white transition">Our Story</Link></li>
            <li><Link href="/pages/careers" className="hover:text-white transition">Careers</Link></li>
          </ul>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-zinc-900 text-xs text-zinc-600 flex flex-col md:flex-row justify-between items-center">
        <p>© 2026 playR. Powered by NECTAR Ecosystem.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/pages/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/pages/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
