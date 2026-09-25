'use client';

import { useState } from 'react';
import { PawPrint, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing!', {
      description: 'Exclusive pet care tips and deals will be sent to your inbox.',
    });
  };

  return (
    <section className="py-12 sm:py-16 container mx-auto px-4">
      <div
        className="relative overflow-hidden rounded-3xl shadow-xl border border-amber-400/40"
        style={{
          background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 55%, #FF8F00 100%)',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.75rem, 5vw, 4rem)',
          minHeight: '380px',
          borderRadius: '2rem',
        }}
      >
        {/* Subtle decorative circles for depth */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-amber-600/10 pointer-events-none blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
          
          {/* Left: Text and Subscription Form */}
          <div className="text-[#1C1917] flex-1 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/45 backdrop-blur-xs text-[#1C1917] text-xs font-black uppercase tracking-wider mb-3.5 shadow-2xs">
              <PawPrint size={14} className="text-[#1C1917]" />
              <span>Stay in Touch</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-black text-[#1C1917] tracking-tight leading-tight mb-3">
              Get Exclusive Offers &amp; Pet Care Tips
            </h2>

            <p className="text-[#1C1917]/90 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
              Join our pet community to receive weekly special discounts, veterinary health tips, and new catalog arrivals direct to your inbox.
            </p>

            {subscribed ? (
              <div className="mt-7 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-emerald-800 font-bold text-sm sm:text-base shadow-md">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span>You are subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-2 max-w-lg sm:max-w-xl mx-auto md:mx-0 bg-white p-2 rounded-2xl sm:rounded-full shadow-lg border-2 border-white/80"
                style={{
                  boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.06)',
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-5 py-3 sm:py-3.5 rounded-full bg-transparent text-[#1C1917] text-sm sm:text-base placeholder:text-stone-400 outline-none"
                  style={{ minWidth: 0, fontSize: '15px' }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)',
                    padding: '14px 48px',
                  }}
                  className="font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Subscribe</span>
                  <Send size={16} className="stroke-[2.5]" />
                </button>
              </form>
            )}
          </div>

          {/* Right: Curious Cat Photo */}
          <div className="flex justify-center shrink-0">
            <div
              className="rounded-full overflow-hidden border-4 sm:border-[6px] border-white shadow-2xl bg-white/20 shrink-0"
              style={{
                width: 'clamp(180px, 20vw, 220px)',
                height: 'clamp(180px, 20vw, 220px)',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
              }}
            >
              <img
                src="/images/storefront/newsletter-cat.jpg"
                alt="Curious loving cat"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
