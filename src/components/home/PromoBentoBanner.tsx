'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';

export default function PromoBentoBanner() {
  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-md border border-amber-300/60"
        style={{
          background: 'linear-gradient(120deg, #FCD34D 0%, #FBBF24 50%, #F59E0B 100%)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Left: Dog Photo with STRICT SIZING */}
          <div className="flex justify-center shrink-0">
            <div
              className="rounded-full overflow-hidden border-4 border-white/90 shadow-lg bg-white/20 shrink-0 relative"
              style={{
                width: '160px',
                height: '160px',
                maxWidth: '160px',
                maxHeight: '160px',
              }}
            >
              <img
                src="/images/storefront/deals-dog.jpg"
                alt="Special Offer Dog"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
              />
            </div>
          </div>

          {/* Center: Offer Copy & CTA */}
          <div className="text-center md:text-left text-[#1C1917] flex-1 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 backdrop-blur-xs text-[#1C1917] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-[#1C1917]" />
              <span>SPECIAL OFFER</span>
            </div>

            <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-[#1C1917] tracking-tight leading-tight">
              Up to 30% Off on Selected Pet Essentials
            </h3>

            <p className="text-xs sm:text-sm text-[#1C1917]/85 mt-1.5 font-medium">
              Healthy, happy pets — at a better price.
            </p>

            <div className="mt-4">
              <Link
                href="/products?category=dry-wet-pet-food"
                style={{
                  backgroundColor: '#F97316',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 font-bold text-xs sm:text-sm shadow-md hover:brightness-95 transition-all"
              >
                <span>Shop Deals</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right: Dual Product Package Mockup + Limited Time Stamp */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-center md:justify-end">
            {/* 2 Pet Food Bags overlapping */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                width: '135px',
                height: '115px',
                flexShrink: 0,
              }}
            >
              {/* Back bag */}
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  bottom: '0',
                  width: '72px',
                  height: '98px',
                  transform: 'rotate(-6deg)',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
                }}
              >
                <img
                  src="https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-puppy-milk-flavor_Puppy_milk_product_shot_2K_202607270231.jpeg"
                  alt="Classic Pets Food Bag"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              {/* Front bag */}
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  bottom: '0',
                  width: '80px',
                  height: '108px',
                  transform: 'rotate(4deg)',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.22))',
                  zIndex: 2,
                }}
              >
                <img
                  src="https://jnakxlejkmyptoffvhsa.supabase.co/storage/v1/object/public/product-images/products/classic-pet-adult-dog-chicken-flavour_Classic_Pets_dog_food_bag_202607270321.jpeg"
                  alt="Classic Pets Dog Food Bag"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Limited Time Only Stamp */}
            <div
              className="rounded-full bg-white text-[#1C1917] border-2 border-dashed border-amber-500 shadow-md flex flex-col items-center justify-center text-center rotate-6 p-2 shrink-0"
              style={{
                width: '86px',
                height: '86px',
              }}
            >
              <Clock size={15} style={{ color: '#F97316' }} className="mb-0.5" />
              <span className="text-[9px] font-black uppercase tracking-tight leading-tight">
                Limited
              </span>
              <span className="text-[10px] font-black uppercase leading-none" style={{ color: '#F97316' }}>
                Time Only
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
