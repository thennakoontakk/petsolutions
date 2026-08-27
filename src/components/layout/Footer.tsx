'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Send,
  Heart,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hotline, setHotline] = useState('+94 77 123 4567');

  // Fetch hotline from store_settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createBrowserClient();
        const { data } = await supabase
          .from('store_settings')
          .select('value, is_enabled')
          .eq('key', 'hotline')
          .single();

        if (data && data.is_enabled && data.value) {
          setHotline(data.value);
        }
      } catch {
        // Fallback to default
      }
    }
    fetchSettings();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="relative overflow-hidden text-white" style={{ backgroundColor: '#0F121E' }}>

      {/* 2. NEWSLETTER / VIP CLUB BANNER */}
      <div className="container mx-auto px-4 pt-12">
        <div 
          className="p-6 sm:p-10 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.95) 0%, rgba(15, 18, 30, 0.95) 100%)',
          }}
        >
          {/* Subtle gold glow behind newsletter */}
          <div 
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: '#FFC800' }}
          />

          <div className="max-w-xl text-center lg:text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30 mb-3">
              🐾 Join the PetSolutions VIP Club
            </span>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              Get Weekly Pet Care Tips & Exclusive Discounts
            </h3>
            <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
              Subscribe to receive members-only promo codes, clinical healthcare guides, and alerts on new inventory arrivals.
            </p>
          </div>

          <div className="w-full lg:max-w-md relative z-10">
            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-success/20 border border-success/40 text-success text-xs font-bold flex items-center justify-center gap-2 animate-scale-in">
                <CheckCircle2 size={18} />
                <span>Thank you! You've joined the VIP Pet Club.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent focus:bg-white/15 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary text-xs font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <Send size={14} />
                </button>
              </form>
            )}
            <p className="text-[10px] text-white/40 mt-2 text-center lg:text-left">
              🔒 We respect your privacy. Unsubscribe anytime with 1-click.
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN FOOTER: BRAND & CONTACT INFO (1-2 Lines) */}
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Image 
              src="/logo-icon.png" 
              width={50} 
              height={50} 
              alt="PetSolutions Icon" 
              className="h-12 w-auto object-contain"
            />
            <Image 
              src="/logo-text.png" 
              width={120} 
              height={32} 
              alt="PetSolutions.lk" 
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <p className="text-xs text-white/70 max-w-xl text-center md:text-left leading-relaxed">
            Sri Lanka's trusted online pet pharmacy and nutrition hub. Delivering authorized parasite treatments, medicated shampoos, supplements, and premium pet foods straight to your doorstep.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PetSolutions Facebook"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-accent hover:text-text border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PetSolutions Instagram"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-accent hover:text-text border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${hotline.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PetSolutions WhatsApp"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#25D366] hover:text-white border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 1-2 LINE CONTACT INFO BAR */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/80">
          <div className="flex items-center gap-2.5">
            <MapPin size={16} className="text-accent flex-shrink-0" />
            <span>Colombo & Western Province, Sri Lanka</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone size={16} className="text-accent flex-shrink-0" />
            <a href={`tel:${hotline}`} className="font-bold text-white hover:text-accent transition-colors">{hotline}</a>
          </div>

          <div className="flex items-center gap-2.5">
            <Mail size={16} className="text-accent flex-shrink-0" />
            <a href="mailto:support@petsolutions.lk" className="hover:text-accent transition-colors">support@petsolutions.lk</a>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-accent flex-shrink-0" />
            <span>Daily Hotline Support <span className="text-white/50 font-normal ml-1">8:30 AM – 8:30 PM</span></span>
          </div>
        </div>
      </div>

      {/* 4. FOOTER BOTTOM: COPYRIGHT & PAYMENT METHODS */}
      <div className="border-t border-white/10" style={{ backgroundColor: '#0A0C14' }}>
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          
          {/* Copyright text */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>&copy; {currentYear} PetSolutions.lk. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px]">
              Crafted with <Heart size={11} className="text-error fill-current inline" /> for pets in Sri Lanka
            </span>
          </div>

          {/* Modern Payment Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 mr-1">We Accept:</span>
            
            <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-bold text-[10px] flex items-center gap-1.5 shadow-xs">
              <span className="text-accent font-extrabold">💵</span> Cash on Delivery
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-bold text-[10px] flex items-center gap-1.5 shadow-xs">
              <span className="text-accent font-extrabold">🏦</span> Bank Transfer
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-bold text-[10px] flex items-center gap-1.5 shadow-xs">
              <span className="text-accent font-extrabold">💳</span> Visa / Master
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
