'use client';

import Link from 'next/link';
import { Star, Dog, Cat, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    tag: 'Dog Parent · Golden Retriever',
    avatarText: 'SM',
    bgColor: 'bg-[#FFF3EB]',
    textColor: 'text-[#EA580C]',
    quote:
      'Amazing quality products and fast delivery! My dog’s food and flea prevention arrived fresh and on time in Colombo. Highly recommended!',
    petIcon: Dog,
  },
  {
    id: 2,
    name: 'James T.',
    tag: 'Cat Parent · Persian Cat',
    avatarText: 'JT',
    bgColor: 'bg-[#E0F2FE]',
    textColor: 'text-[#0284C7]',
    quote:
      'The best pet pharmacy I have used online! Great variety of clinical shampoos, excellent customer service, and my cat loves the treats.',
    petIcon: Cat,
  },
  {
    id: 3,
    name: 'Emily R.',
    tag: 'Pet Parent · 2 Rescue Dogs',
    avatarText: 'ER',
    bgColor: 'bg-[#FEF3C7]',
    textColor: 'text-[#D97706]',
    quote:
      'Very reliable and trustworthy store. They truly care about animal health and genuine meds. Will definitely shop here again and again!',
    petIcon: Dog,
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] border-y border-[#E7DFD5]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-3">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1.5">
              Real stories from real pet parents across Sri Lanka.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Reviews</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Review Cards Grid matching reference comp */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {testimonials.map((t) => {
            const PetIcon = t.petIcon;
            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7DFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Reviewer Header */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="rounded-full font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border border-white shadow-2xs"
                      style={{
                        width: '44px',
                        height: '44px',
                        backgroundColor: t.id === 1 ? '#FFF3EB' : t.id === 2 ? '#E0F2FE' : '#FEF3C7',
                        color: t.id === 1 ? '#EA580C' : t.id === 2 ? '#0284C7' : '#D97706',
                      }}
                    >
                      {t.avatarText}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-[#1C1917] leading-snug">
                        {t.name}
                      </h3>
                      <p className="text-[11px] text-[#78716C] flex items-center gap-1 mt-0.5">
                        <PetIcon size={12} style={{ color: '#F97316' }} />
                        <span>{t.tag}</span>
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#292524] leading-relaxed italic mb-3">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Footer with 5 Gold Stars */}
                <div className="mt-2 pt-3 border-t border-[#F3ECE2] flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        style={{ fill: '#FBBF24', color: '#FBBF24' }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#A8A29E] font-semibold">Verified Buyer</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
