'use client';

import { Heart, ShieldCheck, Stethoscope, Award, PawPrint } from 'lucide-react';

export default function BrandStory() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Trusted Brands',
      description: '100% genuine pet care products',
    },
    {
      icon: Stethoscope,
      title: 'Pet Health First',
      description: 'Wellness & veterinary care',
    },
    {
      icon: Award,
      title: 'Happy Pet Parents',
      description: 'Thousands of happy pets',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="mx-auto"
        style={{
          maxWidth: '1100px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
        }}
      >
        {/* Left Column: Overlapping Organic Pet Photo Bubbles */}
        <div
          className="shrink-0 select-none flex justify-center"
          style={{ width: '370px' }}
        >
          <div
            className="relative"
            style={{ width: '370px', height: '350px' }}
          >
            {/* Soft Organic Amber Glow behind circles */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '9999px',
                background: 'radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(255, 237, 213, 0.25) 60%, transparent 80%)',
                filter: 'blur(28px)',
                pointerEvents: 'none',
              }}
            />

            {/* Main Large Dog Photo Circle */}
            <div
              style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                width: '215px',
                height: '215px',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '4px solid #FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
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
                bottom: '15px',
                right: '15px',
                width: '170px',
                height: '170px',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '4px solid #FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
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
                top: '55px',
                right: '48px',
                width: '42px',
                height: '42px',
                borderRadius: '9999px',
                backgroundColor: '#F97316',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
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
                top: '2px',
                left: '20px',
                transform: 'rotate(-4deg)',
                zIndex: 4,
              }}
            >
              <span
                className="italic font-serif text-xs text-[#EA580C] font-bold px-3.5 py-1.5 rounded-full border inline-block"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#FED7AA',
                  boxShadow: '0 2px 10px rgba(234, 88, 12, 0.12)',
                }}
              >
                ✦ Better Care, Brighter Days
              </span>
            </div>

            {/* Playful Script Doodle Annotation: Pets Make Life Better */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '30px',
                transform: 'rotate(2deg)',
                zIndex: 4,
              }}
            >
              <span
                className="italic font-serif text-xs text-[#78716C] font-semibold px-3.5 py-1 rounded-full border inline-block"
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

        {/* Right Column: Mission Text & 3 Mini Feature Cards */}
        <div
          className="text-left"
          style={{
            flex: '1 1 460px',
            maxWidth: '620px',
          }}
        >
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3.5"
            style={{ backgroundColor: '#FFF3EB', color: '#EA580C' }}
          >
            <PawPrint size={13} style={{ color: '#EA580C' }} />
            <span>More Than Just a Store</span>
          </div>

          <h2
            className="font-heading font-extrabold text-[#1C1917] tracking-tight leading-[1.2] mb-3.5"
            style={{ fontSize: 'clamp(1.75rem, 1.35rem + 1.25vw, 2.35rem)' }}
          >
            A Healthier, Happier Life for Every Pet
          </h2>

          <p className="text-sm sm:text-base text-[#78716C] leading-relaxed mb-6">
            At PetSolutions.lk, we believe pets are family. That&apos;s why we offer high-quality products, expert advice, and genuine care — because their well-being matters.
          </p>

          {/* 3 Mini Feature Cards */}
          <div
            style={{
              borderTop: '1px solid rgba(231, 223, 213, 0.8)',
              paddingTop: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-2.5 rounded-2xl bg-white border border-[#E7DFD5] transition-all hover:shadow-xs"
                  style={{
                    padding: '12px 14px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div
                    className="rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: '#FFF3EB',
                      color: '#F97316',
                    }}
                  >
                    <Icon size={19} className="stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading font-bold text-xs sm:text-[13px] text-[#1C1917] leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
