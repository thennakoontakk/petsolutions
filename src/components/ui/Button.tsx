'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/* --------------------------------------------------------------------------
   Variant → CSS class map
   -------------------------------------------------------------------------- */
const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

/* --------------------------------------------------------------------------
   Danger button inline styles (not in globals.css)
   -------------------------------------------------------------------------- */
const dangerStyles: React.CSSProperties = {
  backgroundColor: 'var(--color-error)',
  color: 'var(--white)',
  boxShadow: 'var(--shadow-sm)',
};

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      className = '',
      disabled,
      type = 'button',
      style,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classes = [
      'btn',
      variantClass[variant],
      sizeClass[size],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <motion.button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        style={{
          ...(variant === 'danger' ? dangerStyles : {}),
          ...style,
        }}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        whileHover={
          isDisabled
            ? undefined
            : {
                y: -1,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        {...rest}
      >
        {loading ? (
          <>
            <Loader2
              size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
              className="animate-spin"
            />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex" style={{ flexShrink: 0 }}>
                {icon}
              </span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="flex" style={{ flexShrink: 0 }}>
                {icon}
              </span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
