'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import FreeDeliveryProgressBar from '@/components/cart/FreeDeliveryProgressBar';

/* --------------------------------------------------------------------------
   Warm Illustrated Sleeping Pet SVG
   -------------------------------------------------------------------------- */
function SleepingPetIllustration() {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-[#FFC800]/15 rounded-full blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm"
      >
        {/* Soft Rug / Mat */}
        <ellipse cx="100" cy="155" rx="85" ry="30" fill="#E6F4F8" stroke="#BDDFEA" strokeWidth="2" strokeDasharray="4 4" />

        {/* Sleeping Kitten / Puppy Body (Curled up) */}
        <path
          d="M60 145 C50 115, 80 85, 120 88 C155 90, 165 125, 145 150 C125 168, 75 165, 60 145 Z"
          fill="#FFF3DB"
          stroke="#E5C388"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Soft Fur Accent Spot */}
        <path
          d="M95 100 C110 95, 130 105, 125 120 C115 130, 95 125, 95 100 Z"
          fill="#FDE7BD"
        />

        {/* Sleeping Head */}
        <circle cx="75" cy="120" r="26" fill="#FFF3DB" stroke="#E5C388" strokeWidth="2.5" />

        {/* Ears */}
        <path
          d="M56 102 C52 90, 62 84, 70 94 Z"
          fill="#F5D0A9"
          stroke="#E5C388"
          strokeWidth="2"
        />
        <path
          d="M84 96 C94 88, 100 95, 96 106 Z"
          fill="#F5D0A9"
          stroke="#E5C388"
          strokeWidth="2"
        />

        {/* Closed Peaceful Sleeping Eye */}
        <path
          d="M64 122 C67 127, 73 127, 76 122"
          stroke="#1A1A2E"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Cute Little Nose & Mouth */}
        <ellipse cx="61" cy="128" rx="2.5" ry="2" fill="#E08383" />
        <path d="M61 130 C61 133, 63 135, 66 134" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />

        {/* Whiskers */}
        <path d="M53 126 L43 124" stroke="#D1B280" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M53 130 L42 131" stroke="#D1B280" strokeWidth="1.2" strokeLinecap="round" />

        {/* Gold Collar with Cyan Charm */}
        <path d="M72 143 C80 146, 88 144, 94 140" stroke="#FFC800" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="83" cy="147" r="4.5" fill="#00ACDF" stroke="#FFC800" strokeWidth="1.5" />

        {/* Curled Tail */}
        <path
          d="M145 142 C160 140, 168 125, 162 115 C158 108, 150 112, 152 118"
          stroke="#E5C388"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Empty Food Bowl */}
        <ellipse cx="148" cy="158" rx="20" ry="8" fill="#BDDFEA" />
        <ellipse cx="148" cy="154" rx="20" ry="7" fill="#00ACDF" />
        <ellipse cx="148" cy="153" rx="17" ry="5.5" fill="#FEFCF3" stroke="#00ACDF" strokeWidth="1.5" />
        {/* Tiny bone watermark in bowl bottom */}
        <path
          d="M142 153 C143 151, 146 151, 148 153 C150 151, 153 151, 154 153 C153 155, 150 155, 148 153 C146 155, 143 155, 142 153 Z"
          fill="#BDDFEA"
          opacity="0.8"
        />

        {/* Floating Sleeping 'z Z Z' */}
        <text x="75" y="80" fill="#00ACDF" fontSize="11" fontFamily="Outfit, sans-serif" fontWeight="bold" opacity="0.65">z</text>
        <text x="88" y="70" fill="#00ACDF" fontSize="14" fontFamily="Outfit, sans-serif" fontWeight="bold" opacity="0.85">Z</text>
        <text x="103" y="58" fill="#FFC800" fontSize="18" fontFamily="Outfit, sans-serif" fontWeight="bold">Z</text>
      </svg>
    </div>
  );
}

const quickCategories = [
  { label: 'Dog Food & Treats', emoji: '🐶', href: '/products?category=dry-wet-pet-food&pet_type=Dog' },
  { label: 'Cat Essentials', emoji: '🐱', href: '/products?pet_type=Cat' },
  { label: 'Flea & Tick Defense', emoji: '💊', href: '/products?category=parasite-tick-control' },
  { label: 'Pet Pharmacy', emoji: '🩺', href: '/products?category=wound-care-topical-pharmacy' },
];

export default function CartPage() {
  const { items, subtotal } = useCart();

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-6 md:py-10 bg-[#FEFCF3]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-[#1A1A2E]">
              Your Shopping Cart
            </h1>
            {items.length > 0 && (
              <span className="text-sm font-medium text-[#6B6B7B]">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {items.length === 0 ? (
            /* F10: Warm Illustrated Empty Cart State */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white p-8 sm:p-12 text-center rounded-3xl max-w-2xl mx-auto border border-[#BDDFEA]/80 shadow-sm flex flex-col items-center justify-center"
            >
              <SleepingPetIllustration />

              <div className="mt-6 space-y-2 max-w-md">
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A2E] tracking-tight">
                  Your pet&apos;s bowl is looking a little empty!
                </h2>
                <p className="text-sm text-[#6B6B7B] leading-relaxed">
                  Treat your furry companion to vet-approved nutrition, wellness essentials, or favorite toys.
                </p>
              </div>

              {/* Quick Category Discovery Chips */}
              <div className="mt-8 w-full">
                <p className="text-xs font-bold uppercase tracking-wider text-[#00ACDF] mb-3">
                  Popular Categories to Explore
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {quickCategories.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FEFCF3] hover:bg-[#E6F4F8] border border-[#BDDFEA]/80 hover:border-[#00ACDF] text-xs font-semibold text-[#1A1A2E] transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tactile Primary Action */}
              <div className="mt-8">
                <Link href="/products">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="h-12 px-7 rounded-xl bg-[#FFC800] hover:bg-[#E6B400] text-[#1A1A2E] font-heading font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <ShoppingBag size={18} />
                    <span>Explore Pet Catalog</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Dynamic Free-Delivery Progress Bar */}
              <FreeDeliveryProgressBar subtotal={subtotal} />

              <div className="cart-layout">
                {/* Items List */}
                <div className="w-full space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItem key={item.variant_id} item={item} mode="full" />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Order Summary Sidebar */}
                <aside className="w-full lg:w-96 flex-shrink-0">
                  <CartSummary subtotal={subtotal} />
                </aside>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
