'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Loader2, LogIn } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */
interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
  /** Full-width mode for detail pages */
  fullWidth?: boolean;
  /** Callback when auth is required */
  onAuthRequired?: () => void;
  className?: string;
}

/* --------------------------------------------------------------------------
   States
   -------------------------------------------------------------------------- */
type ButtonState = 'idle' | 'loading' | 'success';

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function AddToCartButton({
  variantId,
  quantity = 1,
  disabled = false,
  fullWidth = false,
  onAuthRequired,
  className = '',
}: AddToCartButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = useCallback(async () => {
    // Auth check
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      return;
    }

    if (state !== 'idle' || disabled) return;

    setState('loading');
    try {
      await addItem(variantId, quantity);
      setState('success');
      setTimeout(() => setState('idle'), 1800);
    } catch {
      setState('idle');
    }
  }, [user, state, disabled, addItem, variantId, quantity, onAuthRequired, router]);

  const isSuccess = state === 'success';
  const isLoading = state === 'loading';

  return (
    <motion.button
      className={`btn ${isSuccess ? 'btn-secondary' : 'btn-primary'} btn-lg ${className}`}
      style={{
        width: fullWidth ? '100%' : 'auto',
        minWidth: fullWidth ? undefined : 180,
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.97 }}
      layout
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading && (
          <motion.span
            key="loading"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 size={18} className="animate-spin" />
            Adding…
          </motion.span>
        )}

        {isSuccess && (
          <motion.span
            key="success"
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Check size={18} />
            </motion.span>
            Added!
          </motion.span>
        )}

        {state === 'idle' && (
          <motion.span
            key="idle"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {!user ? (
              <>
                <LogIn size={18} />
                Sign in to Add
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
