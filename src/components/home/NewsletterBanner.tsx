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
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 shadow-md border border-amber-400/40"
        style={{
          background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 55%, #FF8F00 100%)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Left: Text and Subscription Form */}
          <div className="text-[#1C1917] flex-1 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 backdrop-blur-xs text-[#1C1917] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2.5">
              <PawPrint size={13} className="text-[#1C1917]" />
              <span>Stay in Touch</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#1C1917] tracking-tight leading-tight">
              Get Exclusive Offers &amp; Pet Care Tips
            </h2>

            <p className="text-[#1C1917]/85 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
              Join our pet community to receive weekly special discounts, veterinary health tips, and new catalog arrivals direct to your inbox.
            </p>

            {subscribed ? (
              <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-emerald-800 font-bold text-xs sm:text-sm shadow-md">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>You are subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-5 flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0 bg-white p-1.5 rounded-full shadow-md border border-amber-200/50"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2.5 rounded-full bg-transparent text-[#1C1917] text-xs sm:text-sm placeholder:text-stone-400 outline-none"
                  required
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                  }}
                  className="px-6 py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-95 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <span>Subscribe</span>
                  <Send size={12} className="stroke-[2.5]" />
                </button>
              </form>
            )}
          </div>

          {/* Right: Curious Cat Photo with STRICT SIZING */}
          <div className="flex justify-center shrink-0">
            <div
              className="rounded-full overflow-hidden border-4 border-white shadow-xl bg-white/20 shrink-0"
              style={{
                width: '160px',
                height: '160px',
                maxWidth: '160px',
                maxHeight: '160px',
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
