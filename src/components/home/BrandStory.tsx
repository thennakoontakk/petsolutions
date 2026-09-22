'use client';

import { Heart, ShieldCheck, Stethoscope, Award, PawPrint } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center',
        }}
      >
        
        {/* Left Column: Overlapping Organic Pet Photo Bubbles */}
        <div className="flex justify-center">
          <div
            className="relative shrink-0"
            style={{ width: '360px', height: '360px', position: 'relative' }}
          >
            {/* Soft Organic Amber Glow behind circles */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '9999px',
                background: 'radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(255, 237, 213, 0.25) 60%, transparent 80%)',
                filter: 'blur(24px)',
                pointerEvents: 'none',
              }}
            />

            {/* Main Large Dog Photo Circle */}
            <div
              style={{
                position: 'absolute',
                top: '15px',
                left: '10px',
                width: '210px',
                height: '210px',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '4px solid #FFFFFF',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                zIndex: 1,
              }}
            >
              <img 
                src="/images/storefront/brand-story-dog.jpg" 
                alt="Happy dog companion" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Overlapping Cat Photo Circle */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '15px',
                width: '160px',
                height: '160px',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '4px solid #FFFFFF',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 2,
              }}
            >
              <img 
                src="/images/storefront/brand-story-cat.jpg" 
                alt="Loving cat companion" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Playful Floating Heart Badge */}
            <div
              style={{
                position: 'absolute',
                top: '30px',
                right: '40px',
                width: '42px',
                height: '42px',
                borderRadius: '9999px',
                backgroundColor: '#F97316',
                border: '2px solid #FFFFFF',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
              }}
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>

            {/* Playful Script Doodle Annotation: Better Care, Brighter Days */}
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                left: '0px',
                transform: 'rotate(-5deg)',
                zIndex: 4,
              }}
            >
              <span
                className="italic font-serif text-xs text-[#EA580C] font-bold px-3.5 py-1.5 rounded-full border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#FED7AA',
                  boxShadow: '0 2px 8px rgba(234, 88, 12, 0.12)',
                }}
              >
                ✦ Better Care, Brighter Days
              </span>
            </div>

            {/* Playful Script Doodle Annotation: Pets Make Life Better */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '20px',
                transform: 'rotate(3deg)',
                zIndex: 4,
              }}
            >
              <span
                className="italic font-serif text-xs text-[#78716C] font-semibold px-3 py-1 rounded-full border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E7DFD5',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
              >
                Pets Make Life Better 🐾
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Mission Text & 3 Mini Feature Badges */}
        <div className="text-left">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-3"
            style={{ backgroundColor: '#FFF3EB', color: '#EA580C' }}
          >
            <PawPrint size={12} style={{ color: '#EA580C' }} />
            <span>More Than Just a Store</span>
          </div>

          <h2
            className="font-heading font-extrabold text-[#1C1917] tracking-tight leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)' }}
          >
            A Healthier, Happier Life for Every Pet
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#78716C] mt-3 leading-relaxed max-w-xl">
            At PetSolutions.lk, we believe pets are family. That&apos;s why we offer high-quality products, expert advice, and genuine care — because their well-being matters.
          </p>

          {/* 3 Mini Feature Badges matching reference */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6"
            style={{
              borderTop: '1px solid rgba(231, 223, 213, 0.7)',
            }}
          >
            
            <div
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border shadow-2xs"
              style={{ borderColor: '#E7DFD5' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FFF3EB', color: '#F97316' }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#1C1917]">Trusted Brands</h3>
                <p className="text-[10px] text-[#78716C] mt-0.5 leading-tight">We only stock the best.</p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border shadow-2xs"
              style={{ borderColor: '#E7DFD5' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FFF3EB', color: '#F97316' }}
              >
                <Stethoscope size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#1C1917]">Pet Health Focused</h3>
                <p className="text-[10px] text-[#78716C] mt-0.5 leading-tight">Wellness for life.</p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border shadow-2xs"
              style={{ borderColor: '#E7DFD5' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FFF3EB', color: '#F97316' }}
              >
                <Award size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#1C1917]">Happy Pet Parents</h3>
                <p className="text-[10px] text-[#78716C] mt-0.5 leading-tight">Thousands of satisfied customers.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
