'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils/formatPrice';

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */
interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  onCheckout?: () => void;
  className?: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function CartSummary({
  subtotal = 0,
  discount = 0,
  onCheckout,
  className = '',
}: CartSummaryProps) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const safeSubtotal = Number(subtotal) || 0;
  const total = Math.max(0, safeSubtotal - discount);

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      // Promo code validation would go here
      setPromoApplied(true);
    }
  };

  return (
    <div
      className={`glass ${className}`}
      style={{ padding: 'var(--space-5)' }}
    >
      <h3
        className="font-heading font-semibold"
        style={{
          fontSize: 'var(--text-lg)',
          marginBottom: 'var(--space-4)',
        }}
      >
        Order Summary
      </h3>

      {/* ── Line Items ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          width: '100%',
        }}
      >
        <div className="flex justify-between text-sm w-full" style={{ width: '100%' }}>
          <span className="text-muted">Subtotal</span>
          <span className="font-medium text-text">{formatPrice(safeSubtotal)}</span>
        </div>

        {discount > 0 && (
          <motion.div
            className="flex justify-between text-sm w-full"
            style={{ width: '100%' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <span style={{ color: 'var(--color-success)' }}>Discount</span>
            <span className="font-medium" style={{ color: 'var(--color-success)' }}>
              -{formatPrice(discount)}
            </span>
          </motion.div>
        )}

        <hr className="divider" style={{ margin: 'var(--space-2) 0', width: '100%' }} />

        <div className="flex justify-between w-full" style={{ width: '100%' }}>
          <span className="font-heading font-semibold text-text">Total</span>
          <span
            className="font-heading font-bold"
            style={{
              fontSize: 'var(--text-xl)',
              color: 'var(--color-brand-blue)',
            }}
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* ── Promo Code ── */}
      <div style={{ marginTop: 'var(--space-5)', width: '100%' }}>
        <label className="label">Promo Code</label>
        <div className="flex gap-2 w-full" style={{ width: '100%' }}>
          <div className="relative flex-1">
            <Tag
              size={16}
              className="absolute"
              style={{
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-light)',
              }}
            />
            <input
              type="text"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                setPromoApplied(false);
              }}
              className="input"
              style={{ paddingLeft: 'var(--space-8)' }}
            />
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleApplyPromo}
            disabled={!promoCode.trim()}
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs"
            style={{ color: 'var(--color-success)', marginTop: 'var(--space-2)' }}
          >
            Promo code applied!
          </motion.p>
        )}
      </div>

      {/* ── Checkout Button ── */}
      <motion.button
        className="btn btn-primary btn-lg w-full"
        style={{ marginTop: 'var(--space-5)' }}
        onClick={handleCheckout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={subtotal <= 0}
      >
        <ShoppingBag size={18} />
        Proceed to Checkout
        <ArrowRight size={16} />
      </motion.button>

      {/* Continue Shopping */}
      <Link
        href="/products"
        className="btn btn-ghost text-sm w-full"
        style={{
          marginTop: 'var(--space-3)',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}
