'use client';

import Image from 'next/image';

export default function BrandStory() {
  const points = [
    {
      number: '1',
      circleBg: '#00ACDF', // PetSolutions signature Brand Cyan
      stat: '100% Genuine & Batch-Verified',
      description:
        'Sourced directly from authorized global brands with sealed tamper-proof packaging and verified shelf life. Zero counterfeit risk, 100% safety for your pet.',
    },
    {
      number: '2',
      circleBg: '#0284C7', // Deep brand blue
      stat: '98.6% On-Time Islandwide Delivery',
      description:
        'Fast 24–48 hour doorstep delivery across Colombo, Kandy, Galle, and all 25 districts in Sri Lanka with flexible Cash on Delivery (COD) options.',
    },
    {
      number: '3',
      circleBg: '#FFC800', // PetSolutions signature Brand Yellow / Gold
      textColor: '#1A1A2E',
      stat: '94.8% Returning Pet Parents & Vet Approved',
      description:
        'Trusted by over 15,000+ Sri Lankan pet owners and veterinary clinics for premium nutrition, specialized diets, and genuine healthcare essentials.',
    },
  ];

  return (
    /* Margins matched directly with FeaturedProducts & CategoryShowcase (container mx-auto px-4) */
    <section className="py-10 sm:py-14 md:py-16 container mx-auto px-4">
      {/* Main Card with Split Background */}
      <div
        className="w-full overflow-hidden shadow-2xl border border-[#BDDFEA]/60 flex flex-col lg:flex-row relative"
        style={{
          borderRadius: '32px',
          boxShadow:
            '0 20px 45px -12px rgba(12, 36, 52, 0.18), 0 8px 20px -6px rgba(0, 172, 223, 0.12)',
        }}
      >
        {/* Left Column: PetSolutions Brand Navy Panel with Pets Background */}
        <div
          className="w-full lg:w-[44%] relative select-none overflow-hidden flex flex-col justify-between"
          style={{
            backgroundColor: '#0C2434',
            minHeight: '480px',
            padding: 'clamp(36px, 4vw, 52px) clamp(24px, 3vw, 40px) 32px clamp(36px, 4.5vw, 60px)',
          }}
        >
          {/* Background Image of Cute Pets anchored at the bottom */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '54%',
              pointerEvents: 'none',
              zIndex: 0,
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/storefront/cute_pets_pointing.jpg"
              alt="Cute puppy and kitten pointing towards PetSolutions highlights"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 12%',
              }}
            />
            {/* Seamless gradient blend into top #0C2434 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                background:
                  'linear-gradient(180deg, #0C2434 0%, rgba(12, 36, 52, 0.75) 20%, rgba(12, 36, 52, 0) 55%)',
              }}
            />
          </div>

          {/* Header Typography */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 text-[#00ACDF] border border-[#00ACDF]/30"
              style={{ backgroundColor: 'rgba(0, 172, 223, 0.16)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC800] animate-pulse" />
              Why PetSolutions.lk
            </span>

            <h2
              className="font-heading font-extrabold text-white tracking-tight leading-[1.06] mb-3 sm:mb-4 drop-shadow-sm"
              style={{ fontSize: 'clamp(2.4rem, 1.8rem + 2vw, 3.6rem)' }}
            >
              Why
              <br />
              Choose
              <br />
              Us?
            </h2>

            <p className="text-[#BAE6FD] font-medium text-base sm:text-lg leading-relaxed max-w-sm drop-shadow-sm">
              The numbers speak for themselves.
            </p>
          </div>
        </div>

        {/* Right Column: Warm Cream Panel matching site theme */}
        <div
          className="w-full lg:w-[56%] flex flex-col justify-center relative"
          style={{
            backgroundColor: 'var(--color-dominant, #FEFCF3)',
            padding: 'clamp(40px, 4.5vw, 56px) clamp(28px, 3.5vw, 48px) clamp(40px, 4.5vw, 56px) clamp(36px, 4.5vw, 64px)',
          }}
        >
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {points.map((point) => (
              <div
                key={point.number}
                className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-0 group"
              >
                {/* Number Circle Badge:
                    On mobile/tablet: sits inline with flex
                    On desktop (lg): sits exactly on the seam (left: 0, translate-x: -50%), overlapping 50% dark and 50% light! */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-full font-heading font-extrabold select-none transition-transform duration-300 group-hover:scale-108 z-20 lg:absolute lg:left-0 lg:-translate-x-1/2"
                  style={{
                    width: '68px',
                    height: '68px',
                    backgroundColor: point.circleBg,
                    color: point.textColor || '#FFFFFF',
                    border: '5px solid var(--color-dominant, #FEFCF3)',
                    boxShadow: '0 8px 24px rgba(12, 36, 52, 0.16)',
                    fontSize: '26px',
                  }}
                >
                  {point.number}
                </div>

                {/* Stat & Explanation Text */}
                <div className="min-w-0 flex-1 lg:pl-16">
                  <h3 className="font-heading font-extrabold text-[#1A1A2E] text-lg sm:text-xl lg:text-[22px] tracking-tight leading-snug group-hover:text-[#00ACDF] transition-colors">
                    {point.stat}
                  </h3>
                  <p className="text-[#6B6B7B] text-sm sm:text-[15px] leading-relaxed mt-2 max-w-xl">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
