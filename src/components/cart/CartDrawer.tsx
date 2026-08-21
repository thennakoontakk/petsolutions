'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/utils/formatPrice';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalItems, subtotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close drawer on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            style={{ position: 'fixed', zIndex: 1000 }}
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-l border-white/20 flex flex-col"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              zIndex: 1001,
              backgroundColor: 'rgba(254, 252, 243, 0.95)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-secondary-alt/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-accent" size={24} />
                <h2 className="font-heading font-bold text-lg">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="badge badge-accent animate-pulse-glow">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary/40 rounded-full transition-colors text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {items.length > 0 ? (
                  items.map((item) => (
                    <CartItem key={item.variant_id} item={item} mode="compact" />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center p-8 space-y-4"
                  >
                    <div className="p-4 bg-accent/10 rounded-full text-accent">
                      <ShoppingBag size={48} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base mb-1">Your cart is empty</h3>
                      <p className="text-xs text-muted">Looks like you haven't added anything to your cart yet.</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="btn btn-primary btn-sm flex items-center gap-2"
                    >
                      Continue Shopping <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary Footer */}
            {items.length > 0 && (
              <div className="p-5 bg-secondary-alt/10 border-t border-secondary-alt/20 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-heading font-bold text-lg">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted">
                  Shipping and taxes are calculated at checkout.
                </p>
                <div className="grid grid-2 gap-3 flex">
                  <button
                    onClick={onClose}
                    className="btn btn-outline w-full"
                  >
                    Close
                  </button>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
