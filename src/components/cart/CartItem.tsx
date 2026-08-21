'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice, formatPriceShort } from '@/lib/utils/formatPrice';

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
  item: {
    variant_id: string;
    quantity: number;
    variant?: {
      size_label: string;
      price: number;
      product?: {
        name: string;
        slug: string;
        image_url: string | null;
        images?: string[];
      };
    };
  };
  mode?: 'compact' | 'full';
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function CartItem({ item, mode = 'compact' }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const product = item.variant?.product;
  const productName = product?.name ?? 'Product';
  const imageUrl = product?.image_url || (product?.images && product.images.length > 0 ? product.images[0] : null);
  const sizeLabel = item.variant?.size_label ?? '';
  const unitPrice = item.variant?.price ?? 0;
  const lineTotal = unitPrice * item.quantity;

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

          <div className="flex items-baseline sm:flex-col sm:items-end gap-2 sm:gap-0 flex-shrink-0">
            <span
              className="font-heading font-bold"
              style={{
                fontSize: isCompact ? 'var(--text-sm)' : 'var(--text-base)',
                color: 'var(--color-brand-blue)',
              }}
            >
              {formatPrice(lineTotal)}
            </span>
            <span className="text-xs text-muted">
              {formatPriceShort(unitPrice)} × {item.quantity}
            </span>
          </div>
        </div>

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
