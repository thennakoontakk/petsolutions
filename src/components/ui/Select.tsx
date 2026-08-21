'use client';

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  icon?: ReactNode;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      icon,
      required,
      className = '',
      wrapperClassName = '',
      ...rest
    },
    ref
  ) => {
    const hasError = !!error;
    const inputClasses = ['input', hasError ? 'input-error' : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClassName} style={{ width: '100%' }}>
        {/* Label */}
        {label && (
          <label className="label">
            {label}
            {required && (
              <span style={{ color: 'var(--color-error)', marginLeft: '4px' }}>
                *
              </span>
            )}
          </label>
        )}

        {/* Select wrapper */}
        <div style={{ position: 'relative' }}>
          {/* Left icon */}
          {icon && (
            <span
              style={{
                position: 'absolute',
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: hasError ? 'var(--color-error)' : 'var(--color-text-light)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              {icon}
            </span>
          )}

          <select
            ref={ref}
            className={inputClasses}
            aria-invalid={hasError}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              paddingRight: 'var(--space-10)',
              paddingLeft: icon ? 'var(--space-10)' : undefined,
              cursor: 'pointer',
            }}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <span
            style={{
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-light)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <ChevronDown size={16} />
          </span>
        </div>

        {/* Error */}
        {hasError && (
          <p
            className="text-error text-xs"
            style={{ marginTop: 'var(--space-1)' }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
