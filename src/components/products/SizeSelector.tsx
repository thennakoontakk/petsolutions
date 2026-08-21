'use client';

import { motion } from 'framer-motion';
import type { ProductVariant } from '@/lib/types';
import { formatPriceShort } from '@/lib/utils/formatPrice';

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */
interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedId: string | null;
  onChange: (variant: ProductVariant) => void;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function SizeSelector({
  variants,
  selectedId,
  onChange,
}: SizeSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Select size">
      {variants.map((v) => {
        const isActive = v.id === selectedId;
        const isOutOfStock = v.stock <= 0 || !v.is_active;

        return (
          <button
            key={v.id}
            role="radio"
            aria-checked={isActive}
            disabled={isOutOfStock}
            onClick={() => onChange(v)}
            className="size-pill"
            style={{
              position: 'relative',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid',
              borderColor: isActive
                ? 'var(--color-accent)'
                : 'var(--color-secondary-alt)',
              background: isActive
                ? 'var(--color-accent-light)'
                : 'var(--white)',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              opacity: isOutOfStock ? 0.45 : 1,
              transition: 'border-color 200ms, background 200ms',
              minWidth: 80,
            }}
          >
            {/* Active indicator pill background */}
            {isActive && (
              <motion.span
                layoutId="size-active-indicator"
                className="absolute inset-0"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-accent-light)',
                  zIndex: 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}

            <span
              style={{
                position: 'relative',
                zIndex: 1,
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                color: isActive
                  ? 'var(--color-accent-hover)'
                  : 'var(--color-text)',
                lineHeight: 1.3,
              }}
            >
              {v.size_label}
            </span>

            <span
              style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 'var(--text-xs)',
                color: isActive
                  ? 'var(--color-accent-hover)'
                  : 'var(--color-text-muted)',
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              {formatPriceShort(v.price)}
            </span>

            {isOutOfStock && (
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '0.625rem',
                  color: 'var(--color-error)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: 2,
                }}
              >
                Out of Stock
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
