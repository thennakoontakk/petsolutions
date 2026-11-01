'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice, formatPriceShort } from '@/lib/utils/formatPrice';
import { calculateLineItemPricing } from '@/lib/utils/dealPricing';
import { PRODUCT_IMAGE_MAP, OLD_IMAGE_PATH_MAP } from '@/lib/data/productImageMap';
import type { CartItem as CartItemType } from '@/lib/types';

/* --------------------------------------------------------------------------
   Paw Placeholder (small)
   -------------------------------------------------------------------------- */
function PawPlaceholderSmall() {
  return (
    <div
      className="flex-center w-full h-full"
      style={{ background: 'var(--color-dominant-alt)' }}
    >
      <svg
        width="24"
        height="24"
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
interface CartItemProps {
  item: CartItemType;
  mode?: 'compact' | 'full';
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function CartItem({ item, mode = 'compact' }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const product = item.variant?.product;
  const productName = product?.name ?? 'Product';
  const rawImageUrl = product?.image_url || (product?.images && product.images.length > 0 ? product.images[0] : null);
  const imageUrl = (product?.id && PRODUCT_IMAGE_MAP[product.id]?.image_url)
    ? PRODUCT_IMAGE_MAP[product.id].image_url
    : (product?.slug && PRODUCT_IMAGE_MAP[product.slug]?.image_url)
      ? PRODUCT_IMAGE_MAP[product.slug].image_url
      : (rawImageUrl && OLD_IMAGE_PATH_MAP[rawImageUrl])
        ? OLD_IMAGE_PATH_MAP[rawImageUrl]
        : rawImageUrl;

  const sizeLabel = item.variant?.size_label ?? '';
  const {
    unitRegularPrice,
    unitEffectivePrice,
    grossLineTotal,
    lineDiscount,
    netLineTotal,
    dealTag,
  } = calculateLineItemPricing(item);

  const isCompact = mode === 'compact';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex gap-3 sm:gap-4 items-center w-full"
      style={{
        padding: isCompact ? 'var(--space-3)' : 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(212,207,196,0.3)',
      }}
    >
      {/* Product Image */}
      <div
        className="relative overflow-hidden rounded-xl flex-shrink-0"
        style={{
          width: isCompact ? 60 : 76,
          height: isCompact ? 60 : 76,
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-cover"
            sizes={isCompact ? '60px' : '76px'}
          />
        ) : (
          <PawPlaceholderSmall />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="min-w-0 flex-1">
            <h4
              className={`font-heading font-semibold text-text leading-snug ${isCompact ? 'truncate' : 'line-clamp-2'}`}
              style={{ fontSize: isCompact ? 'var(--text-sm)' : 'var(--text-base)' }}
            >
              {productName}
            </h4>
            {sizeLabel && (
              <span className="text-xs text-muted mt-0.5 inline-block">{sizeLabel}</span>
            )}
          </div>

          <div className="flex flex-col items-end gap-0.5 flex-shrink-0 text-right">
            {lineDiscount > 0 ? (
              <>
                <div className="flex items-baseline gap-2 justify-end">
                  <span
                    className="font-heading font-extrabold"
                    style={{
                      fontSize: isCompact ? 'var(--text-sm)' : 'var(--text-base)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {formatPrice(netLineTotal)}
                  </span>
                  <span className="line-through text-xs text-muted/70">
                    {formatPrice(grossLineTotal)}
                  </span>
                </div>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5 inline-block">
                  Save {formatPriceShort(lineDiscount)}
                </span>
              </>
            ) : (
              <>
                <span
                  className="font-heading font-bold"
                  style={{
                    fontSize: isCompact ? 'var(--text-sm)' : 'var(--text-base)',
                    color: 'var(--color-brand-blue)',
                  }}
                >
                  {formatPrice(grossLineTotal)}
                </span>
                <span className="text-xs text-muted">
                  {formatPriceShort(unitRegularPrice)} × {item.quantity}
                </span>
              </>
            )}
          </div>
        </div>
        {dealTag && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
              🔥 {dealTag}
            </span>
          </div>
        )}
        {/* Quantity Controls & Remove Button */}
        <div className="flex items-center justify-between border-t border-secondary-alt/25 pt-2 mt-1 w-full">
          <div
            className="flex items-center"
            style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-secondary)',
              display: 'inline-flex',
              overflow: 'hidden',
            }}
          >
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
              aria-label="Decrease quantity"
              style={{ padding: 'var(--space-1)' }}
            >
              <Minus size={14} />
            </button>
            <AnimatePresence mode="wait">
              <motion.span
                key={item.quantity}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-xs text-text"
                style={{ minWidth: 28, textAlign: 'center' }}
              >
                {item.quantity}
              </motion.span>
            </AnimatePresence>
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
              aria-label="Increase quantity"
              style={{ padding: 'var(--space-1)' }}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Remove */}
          <motion.button
            className="btn btn-ghost btn-sm btn-icon"
            onClick={() => removeItem(item.variant_id)}
            aria-label="Remove item"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ color: 'var(--color-error)', padding: 'var(--space-1)' }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
