'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';

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
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 150, damping: 22 } as const,
    },
  };

  return (
    <section 
      className="relative overflow-hidden flex flex-col justify-between hero-banner-section w-full pt-24 pb-8 md:pt-28 md:pb-12"
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
          className="w-full h-full object-cover object-right md:object-center"
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
          className="max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex flex-col items-start gap-5 md:gap-7 text-left py-8 md:py-12"
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-heading font-extrabold text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] text-text leading-tight md:leading-[1.05] tracking-tight"
          >
            Everything Your Furry Friends <br />
            <span className="text-accent relative">
              Deserve & More
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm md:text-base text-text-muted max-w-md md:max-w-xl leading-relaxed"
            style={{ marginTop: '8px', marginBottom: '8px' }}
          >
            Experience premium pet care shopping. Browse authorized dry foods, medicated grooming solutions, tick treatments, and wellness products with direct home delivery.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto"
          >
            <Link
              href="/products"
              className="btn btn-primary px-6 sm:px-9 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
            >
              <ShoppingBag size={18} /> Explore Shop
            </Link>
            <Link
              href="/products?category=tick-flea-treatment"
              className="btn btn-outline px-6 sm:px-9 py-3.5 sm:py-4 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold border border-secondary-alt hover:border-accent hover:bg-white/30 transition-all hover:scale-105"
            >
              Flea & Tick Care
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Feature Cards Infinite Marquee Ticker ── */}
      <div className="w-full overflow-hidden relative py-4 select-none z-10">
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
          {[
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
            // Duplicate the set for seamless loop
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
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx} 
                className="glass p-5 rounded-2xl border border-white/50 flex items-center gap-4 text-left hover:scale-[1.02] transition-transform duration-300 w-[280px] md:w-[320px] flex-shrink-0"
                style={{ marginRight: '24px' }}
              >
                <div className="p-3 bg-accent/10 text-accent rounded-xl">
                  <Icon size={20} />
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
