'use client';

import Link from 'next/link';
import { ArrowRight, Bone, Cat, Dog, HeartPulse, Sparkles, ShieldCheck } from 'lucide-react';

const categories = [
  {
    name: 'Dog Food & Treats',
    slug: 'dry-wet-pet-food?pet_type=Dog',
    image: '/images/storefront/cat-dog-food.jpg',
    bgColor: '#FFF0DB',
    icon: Dog,
  },
  {
    name: 'Cat Food & Treats',
    slug: 'dry-wet-pet-food?pet_type=Cat',
    image: '/images/storefront/cat-cat-food.jpg',
    bgColor: '#FEE6E1',
    icon: Cat,
  },
  {
    name: 'Health & Wellness',
    slug: 'health-supplements',
    image: '/images/storefront/cat-health.jpg',
    bgColor: '#E2F4FD',
    icon: HeartPulse,
  },
  {
    name: 'Grooming & Hygiene',
    slug: 'medicated-shampoos-grooming',
    image: '/images/storefront/cat-grooming.jpg',
    bgColor: '#FEF9D9',
    icon: Sparkles,
  },
  {
    name: 'Tick & Flea Control',
    slug: 'parasite-tick-control',
    image: '/images/storefront/cat-health.jpg',
    bgColor: '#FFE2E2',
    icon: ShieldCheck,
  },
  {
    name: 'Cat Litter & Hygiene',
    slug: 'cat-litter-hygiene',
    image: '/images/storefront/cat-cat-food.jpg',
    bgColor: '#F3ECE7',
    icon: Bone,
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8 sm:mb-10">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Find the perfect products for every stage of your pet&apos;s life.
          </p>
        </div>
        <Link
          href="/categories"
          className="text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 6 Clean Category Cards in 1 Single Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(140px, 1fr))',
          gap: '1rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: '0.25rem',
        }}
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/products?category=${category.slug}`}
            className="group block h-full"
          >
            <div className="bg-white rounded-2xl p-3 border border-[#E7DFD5] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center h-full">
              
              {/* Pastel Container with Contained Image */}
              <div
                className="w-full rounded-xl flex items-center justify-center p-2 mb-2.5 shrink-0"
                style={{
                  backgroundColor: category.bgColor,
                  height: '98px',
                }}
              >
                <div
                  className="rounded-full overflow-hidden border-2 border-white/90 shadow-2xs relative shrink-0"
                  style={{
                    width: '68px',
                    height: '68px',
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    className="group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Category Name */}
              <h3 className="font-heading font-bold text-xs text-[#1C1917] group-hover:text-[#F97316] transition-colors leading-snug line-clamp-2 min-h-[2rem] flex items-center justify-center">
                {category.name}
              </h3>

              {/* Small Orange Arrow Chip */}
              <div
                className="mx-auto mt-2 shadow-2xs transition-transform group-hover:scale-110 shrink-0"
                style={{
                  width: '26px',
                  height: '26px',
                  backgroundColor: '#F97316',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowRight size={12} className="text-white stroke-[2.5]" />
              </div>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
