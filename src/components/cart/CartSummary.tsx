'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Receipt, ArrowRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils/formatPrice';
import { calculateLineItemPricing } from '@/lib/utils/dealPricing';

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
  const { items, totalItems } = useCart();

  const safeSubtotal = Number(subtotal) || 0;
  const total = Math.max(0, safeSubtotal - discount);

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-secondary-alt/40 shadow-sm p-5 sm:p-6 space-y-5 sticky top-24 ${className}`}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-secondary/40 pb-3.5">
        <h3 className="font-heading font-extrabold text-base sm:text-lg text-text flex items-center gap-2">
          <Receipt size={20} className="text-accent" />
          Order Summary
        </h3>
        <span className="text-xs font-bold text-text-muted">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* ── Bill Breakdown (Receipt Style) ── */}
      {items.length > 0 && (
        <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-secondary/50 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-secondary/40 pb-2">
            <span>Bill Items ({items.length})</span>
            <span>Amount</span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 divide-y divide-secondary/20">
            {items.map((item) => {
              const productName = item.variant?.product?.name ?? 'Product';
              const sizeLabel = item.variant?.size_label ?? 'Standard';
              const {
                unitRegularPrice,
                unitEffectivePrice,
                grossLineTotal,
                lineDiscount,
                netLineTotal,
                dealTag,
              } = calculateLineItemPricing(item);

              return (
                <div
                  key={item.variant_id}
                  className="pt-2 first:pt-0 flex justify-between items-start gap-2.5 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-text text-xs leading-snug line-clamp-2" title={productName}>
                      {productName}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-text-muted">
                        Size: <strong className="text-text font-semibold">{sizeLabel}</strong>
                        <span className="mx-1 opacity-50">|</span>
                        Qty: <strong className="text-text font-semibold">{item.quantity}</strong>
                      </span>
                      {dealTag && (
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          🔥 {dealTag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {lineDiscount > 0 ? (
                      <>
                        <p className="font-bold text-text text-xs">
                          {formatPrice(netLineTotal)}
                        </p>
                        <p className="text-[10px] text-muted line-through">
                          {formatPrice(grossLineTotal)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-text text-xs">
                          {formatPrice(grossLineTotal)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-text-muted">
                            ({formatPrice(unitRegularPrice)} ea)
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Price Breakdown ── */}
      <div className="space-y-2.5 pt-1">
        <div className="flex justify-between items-center text-xs text-text-muted">
          <span>Items Subtotal</span>
          <span className="font-semibold text-text">{formatPrice(safeSubtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-text-muted">
          <span>Estimated Delivery</span>
          <span className="text-[11px] font-medium text-text-light italic">
            Calculated at checkout
          </span>
        </div>

        {discount > 0 && (
          <motion.div
            className="flex justify-between items-center text-xs text-success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <span>Promotional Discount</span>
            <span className="font-bold">-{formatPrice(discount)}</span>
          </motion.div>
        )}

        <div className="border-t border-dashed border-secondary-alt/40 pt-3 flex justify-between items-baseline">
          <div>
            <span className="font-heading font-extrabold text-sm text-text block">Total Payable</span>
            <span className="text-[10px] text-text-muted">All taxes included</span>
          </div>
          <span className="font-heading font-black text-xl text-accent">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* ── Proceed to Checkout Button ── */}
      <div className="space-y-2.5 pt-1">
        <motion.button
          onClick={handleCheckout}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={safeSubtotal <= 0}
          className="btn btn-primary w-full py-3.5 text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <ShoppingBag size={16} />
          <span>Proceed to Checkout</span>
          <ArrowRight size={15} />
        </motion.button>

        <Link
          href="/products"
          className="block text-center text-xs font-bold text-text-muted hover:text-accent py-1.5 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* ── Trust & Security Badges ── */}
      <div className="border-t border-secondary/40 pt-3.5 grid grid-cols-2 gap-2 text-[10.5px] text-text-muted">
        <div className="flex items-center gap-1.5">
          <Truck size={14} className="text-accent shrink-0" />
          <span>Islandwide Delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success shrink-0" />
          <span>100% Genuine Care</span>
        </div>
      </div>
    </div>
  );
}
