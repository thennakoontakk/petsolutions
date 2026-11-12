'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';

const FEATURE_ITEMS = [
  {
    icon: Truck,
    title: 'Islandwide Delivery',
    description: 'Free delivery for orders above Rs. 5,000',
  },
  {
    icon: ShieldCheck,
    title: '100% Genuine Products',
    description: 'Sourced directly from official distributors',
  },
  {
    icon: Heart,
    title: 'Expert Care Selections',
    description: 'Vitamins, food, and grooming options',
  },
];

// 4 sets per half (12 cards per half = ~4,128px width), repeated twice for seamless infinite -50% translateX loop
// This ensures that even on 4K ultra-wide screens (>2560px), cards always fully cover the screen without blank gaps
const HALF_FEATURE_CARDS = [
  ...FEATURE_ITEMS,
  ...FEATURE_ITEMS,
  ...FEATURE_ITEMS,
  ...FEATURE_ITEMS,
];
const MARQUEE_CARDS = [...HALF_FEATURE_CARDS, ...HALF_FEATURE_CARDS];

export default function HeroBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 150, damping: 22 } as const,
    },
  };

  const handleDealsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const dealsEl = document.getElementById('weekly-deals');
    if (dealsEl) {
      dealsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#weekly-deals';
    }
  };

  return (
    <section 
      id="hero-banner"
      className="relative overflow-hidden flex flex-col justify-between hero-banner-section w-full pt-4 sm:pt-6 md:pt-8 pb-3 md:pb-5"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #FFFDF6 0%, #FEF9EC 40%, #F5EFEB 100%)',
      }}
    >
      {/* ── Background Video Layer (Edge-to-Edge Full Bleed) ── */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <video
          src="/hero-banner.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video w-full h-full object-cover"
        />
        {/* Desktop Left-to-Right Readability Gradient */}
        <div 
          className="absolute inset-0 z-10 hidden md:block" 
          style={{ 
            background: 'linear-gradient(90deg, rgba(255,253,246,0.98) 0%, rgba(255,253,246,0.85) 45%, rgba(255,253,246,0.45) 70%, rgba(255,253,246,0) 100%)' 
          }} 
        />
        {/* Mobile Bottom-to-Top Readability Gradient */}
        <div 
          className="absolute inset-0 z-10 md:hidden" 
          style={{ 
            background: 'linear-gradient(0deg, rgba(255,253,246,0.98) 0%, rgba(255,253,246,0.7) 60%, rgba(255,253,246,0.2) 100%)' 
          }} 
        />
      </div>

      {/* Decorative Apple-style Liquid Orbs in background */}
      <div 
        className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 mix-blend-multiply filter blur-3xl animate-blob z-0 pointer-events-none" 
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="absolute top-20 right-1/4 w-[450px] h-[450px] rounded-full bg-warm-gold/5 mix-blend-multiply filter blur-3xl animate-blob z-0 pointer-events-none" 
        style={{ animationDelay: '2s' }}
      />

      {/* ── Main Content Container (Aligned with Site Layout) ── */}
      <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex flex-col items-start gap-3 sm:gap-3.5 text-left pt-1 sm:pt-2 pb-4 sm:pb-6"
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="flex flex-col items-start tracking-tight"
          >
            {/* Line 1: Single line across desktop, clean proportionate font */}
            <span className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[54px] text-[#1A1A2E] leading-tight block whitespace-normal md:whitespace-nowrap">
              Everything Your Furry Friends
            </span>
            {/* Line 2: Prominently enlarged in vibrant Brand Cyan */}
            <span className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#00ACDF] leading-none mt-1 sm:mt-1.5 block">
              Deserve & More
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm md:text-base text-text-muted max-w-md md:max-w-xl leading-relaxed mt-0.5"
          >
            Experience premium pet care shopping. Browse authorized dry foods, medicated grooming solutions, tick treatments, and wellness products with direct home delivery.
          </motion.p>

          {/* CTAs with Prominently Highlighted Deals Button */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto"
          >
            {/* 1. Hot Weekly Deals — The Star Highlighted CTA */}
            <a
              href="#weekly-deals"
              onClick={handleDealsClick}
              className="relative group px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-black text-[#1A1A2E] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_25px_-5px_rgba(255,160,0,0.5)] ring-2 ring-[#FFC800] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #FFD84D 0%, #FFB800 45%, #FF9000 100%)',
              }}
            >
              {/* Shimmer sweep effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

              <span className="tracking-wide uppercase font-extrabold text-xs sm:text-sm">Hot Weekly Deals</span>
            </a>

            {/* 2. Explore Shop Button */}
            <Link
              href="/products"
              className="btn btn-outline px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#1A1A2E] bg-white/85 hover:bg-white border border-[#BDDFEA] hover:border-accent shadow-sm transition-all hover:scale-105"
            >
              <ShoppingBag size={17} className="text-[#00ACDF]" />
              <span>Explore Shop</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Feature Cards Infinite Marquee Ticker ── */}
      <div className="w-full overflow-hidden relative py-3 select-none z-10">
        {/* Soft edge fade overlays to hide raw crop cuts */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-16 z-20 pointer-events-none" 
          style={{ background: 'linear-gradient(90deg, #FEF9EC 0%, rgba(254,249,236,0) 100%)' }} 
        />
        <div 
          className="absolute top-0 bottom-0 right-0 w-16 z-20 pointer-events-none" 
          style={{ background: 'linear-gradient(270deg, #FEF9EC 0%, rgba(254,249,236,0) 100%)' }} 
        />

        <div className="animate-feature-marquee">
          {MARQUEE_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx} 
                className="glass p-4 rounded-2xl border border-white/50 flex items-center gap-4 text-left hover:scale-[1.02] transition-transform duration-300 w-[280px] md:w-[320px] flex-shrink-0"
                style={{ marginRight: '24px' }}
              >
                <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                  <Icon size={19} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-text">{card.title}</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
