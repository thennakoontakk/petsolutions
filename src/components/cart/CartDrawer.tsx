'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import CartItem from './CartItem';
import FreeDeliveryProgressBar from './FreeDeliveryProgressBar';
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
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md flex flex-col"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              zIndex: 1001,
              backgroundColor: 'rgba(254, 252, 243, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(189, 223, 234, 0.4)',
              boxShadow: '0 0 60px rgba(26, 26, 46, 0.14)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-secondary-alt/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag style={{ color: 'var(--color-brand-blue)' }} size={22} />
                <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--color-text)' }}>Your Cart</h2>
                {totalItems > 0 && (
                  <span className="badge badge-accent">
                    {totalItems}
                  </span>
                )}
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="p-2 hover:bg-secondary/40 rounded-full transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Free Delivery Bar in Drawer */}
            {items.length > 0 && (
              <div className="px-4 pt-3 pb-1">
                <FreeDeliveryProgressBar subtotal={subtotal} />
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {items.length > 0 ? (
                  items.map((item) => (
                    <CartItem key={item.variant_id} item={item} mode="compact" />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                    className="flex flex-col items-center justify-center h-64 text-center p-8 gap-4"
                  >
                    {/* Warm paw illustration */}
                    <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-accent-light)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="32" cy="42" rx="11" ry="9" fill="#FFC800" opacity="0.9"/>
                        <circle cx="20" cy="26" r="6.5" fill="#FFC800" opacity="0.75"/>
                        <circle cx="44" cy="26" r="6.5" fill="#FFC800" opacity="0.75"/>
                        <circle cx="14" cy="38" r="5.5" fill="#FFC800" opacity="0.65"/>
                        <circle cx="50" cy="38" r="5.5" fill="#FFC800" opacity="0.65"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base mb-1" style={{ color: 'var(--color-text)' }}>Your cart is empty</h3>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Start browsing our premium pet care selection.</p>
                    </div>
                    {/* Quick category chips */}
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {[
                        { label: 'Pet Food', href: '/products?category=dry-wet-pet-food' },
                        { label: 'Tick Care', href: '/products?category=parasite-tick-control' },
                        { label: 'Grooming', href: '/products?category=medicated-shampoos-grooming' },
                      ].map((chip) => (
                        <a
                          key={chip.label}
                          href={chip.href}
                          onClick={onClose}
                          style={{
                            fontSize: '11px', fontWeight: 600, padding: '5px 12px',
                            borderRadius: '9999px', textDecoration: 'none',
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-brand-blue)',
                            border: '1px solid var(--color-secondary-alt)',
                            display: 'inline-block',
                          }}
                        >
                          {chip.label}
                        </a>
                      ))}
                    </div>
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
