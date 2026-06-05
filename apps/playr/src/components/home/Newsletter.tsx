import { Button } from '@playr/ui';

export function Newsletter() {
  return (
    <section className="bg-[#867b5d]/10 py-24 border-y border-[#867b5d]/20">
      <div className="container max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight font-[var(--font-sora)] mb-4 text-zinc-900">Join the playR Club</h2>
        <p className="text-zinc-600 mb-8 max-w-lg mx-auto">Subscribe to get early access to exclusive drops, official team merchandise, and tailored performance tips.</p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 h-12 px-4 rounded-full border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#867b5d] bg-white"
            required
          />
          <Button type="submit" className="h-12 rounded-full px-8 bg-zinc-900 text-white hover:bg-black font-bold">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
