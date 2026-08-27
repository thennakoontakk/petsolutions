'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const highlights = [
  {
    title: 'Islandwide Direct Delivery',
    description: 'Fast, dependable doorstep delivery across all provinces in Sri Lanka with careful temperature handling.',
    tag: 'Islandwide Express',
    image: '/trust/delivery.jpg',
  },
  {
    title: '100% Authentic & Authorized',
    description: 'Directly sourced veterinary pharmaceuticals, prescription care, and certified nutrition brands you can trust.',
    tag: 'Certified Veterinary',
    image: '/trust/authentic.jpg',
  },
  {
    title: 'Dedicated Hotline Support',
    description: 'Personalized product advice and order assistance from our experienced pet care team daily from 8:30 AM to 8:30 PM.',
    tag: 'Daily 8:30 AM - 8:30 PM',
    image: '/trust/support.jpg',
  },
  {
    title: 'Flexible & Secure Payments',
    description: 'Seamless payment convenience with Cash on Delivery (COD), Direct Bank Transfer, and secure Card checkout.',
    tag: 'COD & Card Checkout',
    image: '/trust/payment.jpg',
  },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-b from-white/40 via-secondary/20 to-white/40 border-y border-secondary-alt/20">
      
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFC800 0%, #00ACDF 100%)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-1 bg-accent/15 text-accent-hover text-xs font-bold uppercase tracking-widest rounded-full mb-2 border border-accent/25 shadow-xs">
            <span>Why Choose PetSolutions</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text tracking-tight">
            Sri Lanka&apos;s Premier Pet Care Standard
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-2.5 mb-2.5" />
          <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
            Authorized veterinary healthcare, authentic clinical nutrition, and unmatched dedicated service delivered straight to your home.
          </p>
        </div>

        {/* 4 Cards Grid - 4 Columns Across */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="trust-cards-grid"
        >
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="glass rounded-3xl p-6 flex flex-col items-center text-center h-full border border-white/80 shadow-md hover:shadow-2xl hover:border-accent/50 transition-all duration-300 group bg-white/85 backdrop-blur-md"
            >
              {/* Luxury 3D Visual */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-secondary/20 border border-secondary-alt/20 shadow-sm flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Tag & Title */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                {item.tag}
              </span>
              <h3 className="font-heading font-extrabold text-base text-text mb-2 group-hover:text-accent transition-colors leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-text-muted leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
