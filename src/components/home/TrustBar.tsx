'use client';

import { Award, Truck, Stethoscope, ShieldCheck } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: Award,
      title: 'Premium Quality Products',
      description: 'Only the best for your pets',
    },
    {
      icon: Truck,
      title: 'Fast & Reliable Delivery',
      description: 'Get it on time, every time',
    },
    {
      icon: Stethoscope,
      title: 'Expert Pet Care Support',
      description: 'Real advice from real experts',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description: 'Shop with complete confidence',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 relative z-30 -mt-8 sm:-mt-10 mb-12 sm:mb-16">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#E7DFD5] shadow-lg"
        style={{
          boxShadow: '0 10px 30px -5px rgba(28, 25, 23, 0.08), 0 4px 10px -2px rgba(28, 25, 23, 0.04)',
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 text-left"
              >
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#FFF3EB', color: '#F97316' }}
                >
                  <Icon size={22} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-[#1C1917] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#78716C] mt-0.5 leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
