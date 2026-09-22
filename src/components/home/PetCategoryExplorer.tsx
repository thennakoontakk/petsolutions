'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Dog,
  Cat,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  Flame,
  Feather,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';

/* --------------------------------------------------------------------------
   Quick-Pick Avatars
   -------------------------------------------------------------------------- */
const quickPickAvatars = [
  {
    id: 'dogs',
    label: 'Dogs',
    sublabel: 'Nutrition & Care',
    icon: Dog,
    href: '/products?pet_type=Dog',
    bgColor: 'bg-[#E6F4F8]',
    iconColor: 'text-[#00ACDF]',
    badgeColor: 'border-[#BDDFEA]',
  },
  {
    id: 'cats',
    label: 'Cats',
    sublabel: 'Wellness & Food',
    icon: Cat,
    href: '/products?pet_type=Cat',
    bgColor: 'bg-[#FFF8E7]',
    iconColor: 'text-[#E28743]',
    badgeColor: 'border-[#F6E3B4]',
  },
  {
    id: 'pharmacy',
    label: 'Pet Pharmacy',
    sublabel: 'Rx & Tick Defense',
    icon: ShieldAlert,
    href: '/products?category=parasite-tick-control',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badgeColor: 'border-emerald-200',
  },
  {
    id: 'deals',
    label: 'Deals & Offers',
    sublabel: 'Up to 30% Off',
    icon: Flame,
    href: '#deals',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
    badgeColor: 'border-rose-200',
  },
  {
    id: 'birds',
    label: 'Birds & Teaser',
    sublabel: 'Avian Care',
    icon: Feather,
    href: '#',
    bgColor: 'bg-[#F4EFFF]',
    iconColor: 'text-purple-500',
    badgeColor: 'border-purple-200',
    isComingSoon: true,
  },
];

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function PetCategoryExplorer() {
  return (
    <section className="py-14 sm:py-20 bg-[#FEFCF3] relative overflow-hidden border-b border-[#BDDFEA]/40">
      {/* Ambient background atmosphere glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[320px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, #00ACDF 0%, #FFC800 50%, transparent 80%)',
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F8] border border-[#BDDFEA] text-[#00ACDF] text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <HeartPulse size={13} />
            <span>Curated Pet Ecosystem</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1A1A2E] tracking-tight">
            Explore by Pet &amp; Health Need
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#6B6B7B] mt-2 max-w-2xl leading-relaxed">
            Scientifically formulated diets, vet-certified pharmaceuticals, and daily wellness essentials curated for Sri Lankan pets.
          </p>
        </div>

        {/* 1. Circular Avatar Quick-Pick Strip */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-3 scrollbar-none snap-x">
            {quickPickAvatars.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="snap-start shrink-0">
                  {item.isComingSoon ? (
                    <div className="flex flex-col items-center gap-2 opacity-75 cursor-not-allowed group">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${item.bgColor} border ${item.badgeColor} flex items-center justify-center relative shadow-xs`}
                      >
                        <Icon size={24} className={item.iconColor} />
                        <span className="absolute -top-1 -right-1 bg-[#1A1A2E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                          Soon
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-[#1A1A2E]">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-[#6B6B7B]">
                          {item.sublabel}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link href={item.href} className="group block">
                      <motion.div
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                        }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${item.bgColor} border ${item.badgeColor} flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-200`}
                        >
                          <Icon size={24} className={item.iconColor} />
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-bold text-[#1A1A2E] group-hover:text-[#00ACDF] transition-colors">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-[#6B6B7B]">
                            {item.sublabel}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Gapless Bento Grid (4 Columns x 2 Rows = 8 Interlocking Units) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-flow-dense gap-4 sm:gap-5">
          {/* ── Tile 1: Dog Care & Nutrition (Hero Bento: 2 cols x 2 rows = 4 cells) ── */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-3xl bg-gradient-to-br from-[#E6F4F8] via-[#EDF8FA] to-[#FEFCF3] border border-[#BDDFEA] p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group"
          >
            {/* Background decorative blob */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#00ACDF]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00ACDF] text-white text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Dog size={14} /> Dog Care &amp; Nutrition
                </span>
                <span className="text-xs font-semibold text-[#00ACDF] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#BDDFEA]/60">
                  Top Category
                </span>
              </div>

              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A2E] tracking-tight mb-2">
                Tail-Wagging Nutrition &amp; Daily Vitality
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B7B] max-w-md leading-relaxed mb-6">
                Vet-approved dry kibble, tender gravies, puppy developmental milk, and therapeutic joint supplements formulated for all dog breeds.
              </p>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Royal Canin', 'Pedigree', 'Drools', 'Bark Out Loud', 'Joint Care'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-[#1A1A2E] bg-white/90 px-2.5 py-1 rounded-lg border border-[#BDDFEA]/60 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#BDDFEA]/40 flex items-center justify-between">
              <span className="text-xs text-[#6B6B7B] font-medium">
                100% Genuine Veterinary Brands
              </span>
              <Link
                href="/products?pet_type=Dog"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFC800] hover:bg-[#E6B400] text-[#1A1A2E] text-xs font-bold shadow-xs hover:shadow-sm transition-all"
              >
                <span>Shop Dog Essentials</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* ── Tile 2: Cat Wellness (2 cols x 1 row = 2 cells) ── */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-3xl bg-white border border-[#BDDFEA]/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#E28743] border border-[#F6E3B4] text-xs font-bold uppercase tracking-wider">
                  <Cat size={14} /> Cat Wellness &amp; Hygiene
                </span>
                <span className="text-xs text-[#6B6B7B]">Kitten &amp; Adult</span>
              </div>

              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A1A2E] tracking-tight mb-1.5">
                Feline Nutrition &amp; Odor-Lock Litter
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B7B] max-w-lg leading-relaxed">
                Taurine-rich wet pouches, urinary care dry foods, and high-clumping bentonite litter for fresh homes.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#BDDFEA]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#6B6B7B]">
                  Whiskas · Me-O · Kit Cat · Odor Clean
                </span>
              </div>
              <Link
                href="/products?pet_type=Cat"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00ACDF] hover:text-[#008db7] group-hover:translate-x-0.5 transition-all"
              >
                <span>Shop Cat Range</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* ── Tile 3: Pet Pharmacy & Clinical Solutions (1 col x 1 row = 1 cell) ── */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="col-span-1 row-span-1 rounded-3xl bg-white border border-[#BDDFEA]/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 size={12} /> Pharmacy
                </span>
                <span className="text-[11px] font-mono text-[#6B6B7B]">Rx &amp; OTC</span>
              </div>

              <h3 className="font-heading font-bold text-lg text-[#1A1A2E] tracking-tight mb-1.5">
                Tick &amp; Parasite Defense
              </h3>
              <p className="text-xs text-[#6B6B7B] leading-relaxed">
                Fluralaner chewables, broad-spectrum dewormers, and Catron wound healing sprays.
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-[#BDDFEA]/30 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700">Vet Approved</span>
              <Link
                href="/products?category=parasite-tick-control"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00ACDF] hover:text-[#008db7]"
              >
                <span>Explore</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </motion.div>

          {/* ── Tile 4: Medicated Shampoos & Grooming (1 col x 1 row = 1 cell) ── */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="col-span-1 row-span-1 rounded-3xl bg-white border border-[#BDDFEA]/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6F4F8] text-[#00ACDF] border border-[#BDDFEA] text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles size={12} /> Derma Care
                </span>
                <span className="text-[11px] font-mono text-[#6B6B7B]">Topical</span>
              </div>

              <h3 className="font-heading font-bold text-lg text-[#1A1A2E] tracking-tight mb-1.5">
                Medicated Coat &amp; Skin
              </h3>
              <p className="text-xs text-[#6B6B7B] leading-relaxed">
                Antifungal shampoos, chlorhexidine washes, and hypoallergenic soothing conditioners.
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-[#BDDFEA]/30 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#00ACDF]">Gentle Care</span>
              <Link
                href="/products?category=medicated-shampoos-grooming"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00ACDF] hover:text-[#008db7]"
              >
                <span>Explore</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
