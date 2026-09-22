'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Dog, Cat, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { formatPriceShort, calcDiscount } from '@/lib/utils/formatPrice';
import { useCart } from '@/lib/hooks/useCart';

/* --------------------------------------------------------------------------
   Paw SVG Placeholder
   -------------------------------------------------------------------------- */
function PawPlaceholder() {
  return (
    <div
      className="flex items-center justify-center w-full h-full bg-[#F9F6EE]"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-30"
      >
        <ellipse cx="32" cy="42" rx="10" ry="8" fill="#FFC800" />
        <circle cx="20" cy="26" r="6" fill="#FFC800" />
        <circle cx="44" cy="26" r="6" fill="#FFC800" />
        <circle cx="14" cy="38" r="5" fill="#FFC800" />
        <circle cx="50" cy="38" r="5" fill="#FFC800" />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */
interface ProductCardProps {
  product: Product;
  /** Index for stagger animations */
  index?: number;
  className?: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function ProductCard({
  product,
  index = 0,
  className = '',
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const variants = product.variants ?? [];
  const activeVariants = variants.filter((v) => v.is_active);
  const prices = activeVariants.map((v) => v.price);
  const compareAtPrices = activeVariants
    .filter((v) => v.compare_at_price)
    .map((v) => v.compare_at_price!);

  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const hasMultipleSizes = prices.length > 1;
  const isSingleVariant = activeVariants.length === 1;
  const singleVariantId = isSingleVariant ? activeVariants[0].id : null;

  // Calculate best discount across variants
  const bestDiscount = activeVariants.reduce((max, v) => {
    if (v.compare_at_price && v.compare_at_price > v.price) {
      const d = calcDiscount(v.compare_at_price, v.price);
      return d > max ? d : max;
    }
    return max;
  }, 0);

  const PetIconComponent =
    product.pet_type === 'Dog' ? Dog : product.pet_type === 'Cat' ? Cat : null;

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSingleVariant && singleVariantId) {
      setIsAdding(true);
      try {
        await addItem(singleVariantId, 1);
        toast.success(`Added to cart!`, {
          description: `${product.name} · ${formatPriceShort(lowestPrice)}`,
        });
      } catch (err) {
        console.error('Failed to add to cart:', err);
        toast.error('Could not add item to cart. Please try again.');
      } finally {
        setTimeout(() => setIsAdding(false), 600);
      }
    } else {
      router.push(`/products/${product.slug}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
        type: 'spring',
        stiffness: 350,
        damping: 25,
      }}
      className={`h-full ${className}`}
    >
      <motion.article
        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(26,26,46,0.10)' }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="group relative flex flex-col h-full bg-white rounded-2xl p-3 border border-[#BDDFEA]/70"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {/* 1. Standardized 1:1 Aspect Ratio Image Container */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-square w-full rounded-xl bg-[#F9F6EE] overflow-hidden shrink-0 group/img"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 group-hover/img:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <PawPlaceholder />
          )}

          {/* Discount Badge */}
          {bestDiscount > 0 && (
            <span className="absolute top-2 left-2 bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs z-10">
              -{bestDiscount}%
            </span>
          )}

          {/* Pet Type Badge */}
          {PetIconComponent && (
            <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[#1A1A2E] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#BDDFEA]/60 flex items-center gap-1 z-10">
              <PetIconComponent size={11} className="text-[#00ACDF]" />
              <span>{product.pet_type}</span>
            </span>
          )}
        </Link>

        {/* 2. Content Info with Enforced Minimum Heights */}
        <div className="mt-3 flex flex-col flex-1">
          {/* Fixed-height Category / Brand Slot */}
          <div className="h-5 flex items-center overflow-hidden">
            <span className="text-[11px] font-semibold text-[#00ACDF] uppercase tracking-wider truncate">
              {product.brand ||
                (typeof product.category === 'object' && product.category !== null
                  ? product.category.name
                  : 'Pet Care')}
            </span>
          </div>

          {/* Fixed-height 2-line Title Slot */}
          <Link href={`/products/${product.slug}`} className="block mt-1">
            <h3 className="font-heading font-semibold text-sm text-[#1A1A2E] line-clamp-2 min-h-[2.5rem] leading-snug hover:text-[#00ACDF] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* 3. Sticky Bottom Price & CTA Bar */}
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#BDDFEA]/30 gap-2">
            {/* Price Container */}
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-bold text-sm sm:text-base text-[#1A1A2E] truncate">
                {hasMultipleSizes
                  ? `From ${formatPriceShort(lowestPrice)}`
                  : formatPriceShort(lowestPrice)}
              </span>
              <div className="h-4 flex items-center">
                {!hasMultipleSizes && compareAtPrices.length === 1 && (
                  <span className="text-xs text-[#6B6B7B] line-through truncate">
                    {formatPriceShort(compareAtPrices[0])}
                  </span>
                )}
              </div>
            </div>

            {/* Always-visible compact + round button */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onClick={handleAction}
              disabled={isAdding}
              className="btn-icon-round flex-shrink-0"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-text)',
                boxShadow: '0 2px 8px rgba(255,200,0,0.25)',
              }}
              aria-label={isSingleVariant ? 'Add to cart' : 'View options'}
            >
              {isAdding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isSingleVariant ? (
                <ShoppingCart size={14} />
              ) : (
                <ArrowRight size={14} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
