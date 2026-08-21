'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

/* --------------------------------------------------------------------------
   Variant → CSS class map
   -------------------------------------------------------------------------- */
const variantClass: Record<BadgeVariant, string> = {
  default: 'badge',
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  error: 'badge badge-error',
  info: 'badge badge-info',
  accent: 'badge badge-accent',
};

/* --------------------------------------------------------------------------
   Dot colors
   -------------------------------------------------------------------------- */
const dotColor: Record<BadgeVariant, string> = {
  default: 'var(--color-text-muted)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
  accent: 'var(--color-accent)',
};

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  const sizeStyles: React.CSSProperties =
    size === 'sm'
      ? { fontSize: 'var(--text-xs)', padding: '2px var(--space-2)' }
      : {};

  return (
    <span className={`${variantClass[variant]} ${className}`} style={sizeStyles}>
      {dot && (
        <motion.span
          style={{
            display: 'inline-block',
            width: size === 'sm' ? 5 : 6,
            height: size === 'sm' ? 5 : 6,
            borderRadius: '50%',
            backgroundColor: dotColor[variant],
            flexShrink: 0,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      {children}
    </span>
  );
}
