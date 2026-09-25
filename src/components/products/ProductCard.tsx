'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Dog, Cat, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { formatPriceShort, calcDiscount } from '@/lib/utils/formatPrice';
import { useCart } from '@/lib/hooks/useCart';

/* --------------------------------------------------------------------------
   Paw SVG Placeholder
   -------------------------------------------------------------------------- */
function PawPlaceholder() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-[#FAF7F2]">
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-25"
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
  const hasMultipleVariants = activeVariants.length > 1;

  // Selected variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    activeVariants[0]?.id || null
  );

  const selectedVariant =
    activeVariants.find((v) => v.id === selectedVariantId) ||
    activeVariants[0] ||
    null;

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : activeVariants[0]?.price || 0;

  const currentCompareAt = selectedVariant?.compare_at_price || null;

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

    const targetVariantId = selectedVariantId || activeVariants[0]?.id || null;

    if (targetVariantId) {
      setIsAdding(true);
      try {
        await addItem(targetVariantId, 1);
        toast.success('Added to cart!', {
          description: `${product.name} ${selectedVariant?.size_label ? `(${selectedVariant.size_label})` : ''} · ${formatPriceShort(currentPrice)}`,
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
        whileHover={{
          y: -5,
          boxShadow: '0 20px 35px -8px rgba(26, 26, 46, 0.12)',
        }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="group relative flex flex-col h-full bg-white border border-[#BDDFEA]/60 transition-all duration-300"
        style={{
          borderRadius: '28px',
          padding: '16px',
          boxShadow:
            '0 8px 24px -4px rgba(26, 26, 46, 0.06), 0 2px 6px rgba(26, 26, 46, 0.03)',
        }}
      >
        {/* 1. Image Container with Floating Wishlist Heart */}
        <div
          className="relative w-full overflow-hidden shrink-0"
          style={{
            aspectRatio: '1 / 1',
            borderRadius: '20px',
            backgroundColor: '#F8F9FA',
          }}
        >
          <Link
            href={`/products/${product.slug}`}
            className="block relative w-full h-full group/img"
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain group-hover/img:scale-105 transition-transform duration-300"
                style={{
                  padding: '10px',
                  borderRadius: '20px',
                }}
                loading="lazy"
              />
            ) : (
              <PawPlaceholder />
            )}

            {/* Discount Badge on Top Left */}
            {bestDiscount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 10,
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
                className="shadow-xs"
              >
                -{bestDiscount}%
              </span>
            )}
          </Link>
        </div>

        {/* 2. Product Information */}
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Title */}
          <Link href={`/products/${product.slug}`} style={{ display: 'block' }}>
            <h3
              className="font-heading font-bold text-[#1A1A2E] hover:text-[#FFC800] transition-colors"
              style={{
                fontSize: '15px',
                lineHeight: '1.35',
                minHeight: '2.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Variant Size Pills (Matching Reference Image) */}
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: '2px',
            }}
          >
            {hasMultipleVariants ? (
              activeVariants.map((v) => {
                const isSelected = v.id === selectedVariant?.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariantId(v.id);
                    }}
                    style={{
                      borderRadius: '9999px',
                      backgroundColor: isSelected ? '#FFC800' : '#F1F5F9',
                      color: isSelected ? '#1A1A2E' : '#64748B',
                      border: isSelected ? '1px solid #E6B400' : '1px solid #E2E8F0',
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: isSelected ? 700 : 600,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {v.size_label || 'Standard'}
                  </button>
                );
              })
            ) : (
              <>
                <span
                  style={{
                    borderRadius: '9999px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#00ACDF',
                    backgroundColor: '#E6F4F8',
                    border: '1px solid rgba(189, 223, 234, 0.7)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {product.brand ||
                    (typeof product.category === 'object' && product.category !== null
                      ? product.category.name
                      : 'Veterinary')}
                </span>
                {PetIconComponent && (
                  <span
                    style={{
                      borderRadius: '9999px',
                      padding: '3px 9px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#64748B',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <PetIconComponent size={11} className="text-[#00ACDF]" />
                    <span>{product.pet_type}</span>
                  </span>
                )}
              </>
            )}
          </div>

          {/* Short 2-Line Description */}
          <p
            style={{
              marginTop: '8px',
              fontSize: '12px',
              lineHeight: '1.5',
              color: '#6B6B7B',
              minHeight: '2.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description ||
              product.indications ||
              'High quality veterinary formula recommended for clinical care and daily wellness.'}
          </p>

          {/* 3. Bottom Price & Wide Pill 'Add to Cart' Button with Brand Yellow */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              borderTop: '1px solid #F1F5F9',
            }}
          >
            {/* Price */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                className="font-heading"
                style={{
                  fontWeight: 800,
                  fontSize: '16px',
                  color: '#1A1A2E',
                  lineHeight: 1.2,
                }}
              >
                {formatPriceShort(currentPrice)}
              </span>
              {currentCompareAt && currentCompareAt > currentPrice && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#94A3B8',
                    textDecoration: 'line-through',
                    lineHeight: 1.2,
                  }}
                >
                  {formatPriceShort(currentCompareAt)}
                </span>
              )}
            </div>

            {/* Pill 'Add to Cart' Button (Brand Yellow #FFC800 matching .btn-primary) */}
            <button
              type="button"
              onClick={handleAction}
              disabled={isAdding}
              style={{
                backgroundColor: '#FFC800',
                color: '#1A1A2E',
                borderRadius: '9999px',
                boxShadow: '0 4px 14px rgba(255, 200, 0, 0.35)',
                padding: '8px 18px',
                fontWeight: 800,
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="hover:brightness-95 active:scale-95"
              aria-label="Add to cart"
            >
              {isAdding ? (
                <Loader2 size={13} className="animate-spin text-[#1A1A2E]" />
              ) : (
                <>
                  <ShoppingCart size={13} className="text-[#1A1A2E]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
