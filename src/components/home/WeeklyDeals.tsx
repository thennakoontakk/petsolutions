'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function WeeklyDeals() {
  return (
    <section className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#F59E0B] p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Left: Pet Image */}
          <div className="w-full md:w-1/3 relative h-48 md:h-64 rounded-2xl overflow-hidden">
            <Image 
              src="/images/storefront/deals-dog.jpg" 
              alt="Weekly Deals Pet" 
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Center: Content */}
          <div className="w-full md:w-1/3 flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-white/30 text-[var(--color-text)] rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider inline-block">
              SPECIAL OFFER
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mt-3">
              Up to 30% Off on Selected Pet Essentials
            </h3>
            <p className="text-sm text-[var(--color-text)]/70 mt-2">
              Healthy, happy pets — at a better price.
            </p>
            <Link 
              href="/offers" 
              className="bg-[var(--color-text)] text-white rounded-full px-6 py-2.5 text-sm font-bold mt-4 inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Shop Deals <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Circular Badge */}
          <div className="hidden md:flex md:w-1/4 justify-center">
            <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-center p-2 border-2 border-dashed border-white/50 shadow-sm">
              <span className="text-xs font-bold text-[var(--color-text)] uppercase leading-tight">
                Limited<br/>Time<br/>Only
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
