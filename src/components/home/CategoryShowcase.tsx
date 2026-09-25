'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Dog Food & Treats',
    slug: 'dry-wet-pet-food?pet_type=Dog',
    image: '/images/storefront/cat-dog-food.jpg',
  },
  {
    name: 'Cat Food & Treats',
    slug: 'dry-wet-pet-food?pet_type=Cat',
    image: '/images/storefront/cat-cat-food.jpg',
  },
  {
    name: 'Health & Wellness',
    slug: 'health-supplements',
    image: '/images/storefront/cat-health.jpg',
  },
  {
    name: 'Grooming & Hygiene',
    slug: 'medicated-shampoos-grooming',
    image: '/images/storefront/cat-grooming.jpg',
  },
  {
    name: 'Tick & Flea Control',
    slug: 'parasite-tick-control',
    image: '/images/storefront/deals-dog.jpg',
  },
  {
    name: 'Cat Litter & Hygiene',
    slug: 'cat-litter-hygiene',
    image: '/images/storefront/brand-story-cat.jpg',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-12 sm:py-16 container mx-auto px-4">
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
            className="group block h-full select-none"
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-[#BDDFEA]/60 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-end text-center bg-[#F5F2EB]"
              style={{
                height: '220px',
                minHeight: '220px',
                padding: '14px 12px 20px 12px',
              }}
            >
              {/* Full Card Background Image */}
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                }}
                className="absolute inset-0 group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Overlay for Text Contrast */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.25) 55%, rgba(0, 0, 0, 0.75) 85%, rgba(0, 0, 0, 0.92) 100%)',
                }}
              />

              {/* Overlaid Bottom Content */}
              <div className="relative z-10 flex flex-col items-center justify-end text-center w-full">
                {/* Category Name */}
                <h3 className="font-heading font-extrabold text-xs sm:text-sm text-white group-hover:text-[#FFC800] transition-colors leading-snug line-clamp-2 min-h-[2rem] flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                  {category.name}
                </h3>

                {/* Small Yellow Arrow Chip */}
                <div
                  className="mx-auto mt-2.5 shadow-md transition-all duration-300 group-hover:scale-110 shrink-0"
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#FFC800',
                    color: '#1A1A2E',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(255, 200, 0, 0.4)',
                  }}
                >
                  <ArrowRight size={13} className="text-[#1A1A2E] stroke-[2.5]" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
