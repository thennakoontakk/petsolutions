'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Dog, Cat } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPriceShort } from '@/lib/utils/formatPrice';
import { calcDiscount } from '@/lib/utils/formatPrice';

/* --------------------------------------------------------------------------
   Paw SVG Placeholder
   -------------------------------------------------------------------------- */
function PawPlaceholder() {
  return (
    <div
      className="flex-center w-full h-full"
      style={{ background: 'var(--color-dominant-alt)' }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.3 }}
      >
        <ellipse cx="32" cy="42" rx="10" ry="8" fill="#F5A623" />
        <circle cx="20" cy="26" r="6" fill="#F5A623" />
        <circle cx="44" cy="26" r="6" fill="#F5A623" />
        <circle cx="14" cy="38" r="5" fill="#F5A623" />
        <circle cx="50" cy="38" r="5" fill="#F5A623" />
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
  const variants = product.variants ?? [];
  const prices = variants.filter((v) => v.is_active).map((v) => v.price);
  const compareAtPrices = variants
    .filter((v) => v.is_active && v.compare_at_price)
    .map((v) => v.compare_at_price!);

  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const hasMultipleSizes = prices.length > 1;

  // Calculate best discount across variants
  const bestDiscount = variants.reduce((max, v) => {
    if (v.compare_at_price && v.compare_at_price > v.price) {
      const d = calcDiscount(v.compare_at_price, v.price);
      return d > max ? d : max;
    }
    return max;
  }, 0);

  const petIcon =
    product.pet_type === 'Dog' ? Dog : product.pet_type === 'Cat' ? Cat : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className={className}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <motion.article
          className="glass overflow-hidden"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            cursor: 'pointer',
          }}
          whileHover={{ y: -6, boxShadow: 'var(--shadow-xl)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* ── Image Area (60%) ── */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '4 / 3' }}
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
                style={{ transition: 'transform 400ms ease' }}
              />
            ) : (
              <PawPlaceholder />
            )}

            {/* Pet Type Badge */}
            {petIcon && (
              <span
                className="badge badge-accent absolute"
                style={{
                  top: 'var(--space-3)',
                  left: 'var(--space-3)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  backdropFilter: 'blur(8px)',
                  background: 'rgba(255,255,255,0.85)',
                }}
              >
                {petIcon &&
                  (() => {
                    const IconComp = petIcon;
                    return <IconComp size={12} />;
                  })()}
                {product.pet_type}
              </span>
            )}

            {/* Discount Badge */}
            {bestDiscount > 0 && (
              <span
                className="badge absolute"
                style={{
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  zIndex: 2,
                  background: 'var(--color-error)',
                  color: 'var(--white)',
                  fontWeight: 700,
                }}
              >
                -{bestDiscount}%
              </span>
            )}

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 flex-center"
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(2px)',
                zIndex: 3,
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <motion.span
                className="btn btn-primary btn-sm"
                initial={{ y: 10, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
              >
                <Eye size={14} />
                View Details
              </motion.span>
            </motion.div>
          </div>

          {/* ── Info Area (40%) ── */}
          <div
            className="flex-col p-4"
            style={{ flex: 1, display: 'flex', gap: 'var(--space-1)' }}
          >
            {/* Brand */}
            {product.brand && (
              <span
                className="text-xs text-muted font-medium truncate"
                style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                {product.brand}
              </span>
            )}

            {/* Product Name */}
            <h3
              className="font-heading font-semibold line-clamp-2"
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 1.35,
                color: 'var(--color-text)',
              }}
            >
              {product.name}
            </h3>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Price */}
            <div className="flex items-center gap-2" style={{ marginTop: 'var(--space-2)' }}>
              <span
                className="font-heading font-bold"
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-accent)',
                }}
              >
                {hasMultipleSizes ? `From ${formatPriceShort(lowestPrice)}` : formatPriceShort(lowestPrice)}
              </span>

              {/* Compare-at price (if single size with discount) */}
              {!hasMultipleSizes && compareAtPrices.length === 1 && (
                <span
                  className="text-xs text-muted"
                  style={{ textDecoration: 'line-through' }}
                >
                  {formatPriceShort(compareAtPrices[0])}
                </span>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
