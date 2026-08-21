'use client';

import { type ReactNode, forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
type GlassVariant = 'default' | 'strong' | 'dark';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: GlassVariant;
  hover?: boolean;
  children: ReactNode;
  className?: string;
}

/* --------------------------------------------------------------------------
   Variant → CSS class map
   -------------------------------------------------------------------------- */
const variantClass: Record<GlassVariant, string> = {
  default: 'glass',
  strong: 'glass-strong',
  dark: 'glass-dark',
};

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', hover = false, children, className = '', style, ...rest }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`${variantClass[variant]} ${className}`}
        style={{ overflow: 'hidden', ...style }}
        whileHover={
          hover
            ? {
                scale: 1.02,
                boxShadow:
                  '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
              }
            : undefined
        }
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
