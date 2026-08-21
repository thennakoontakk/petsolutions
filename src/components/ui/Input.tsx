'use client';

import { forwardRef, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
interface InputBaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
}

type InputFieldProps = InputBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    as?: 'input';
  };

type TextareaFieldProps = InputBaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
    as: 'textarea';
  };

type InputProps = InputFieldProps | TextareaFieldProps;

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (props, ref) => {
    const {
      label,
      error,
      helperText,
      icon,
      required,
      className = '',
      wrapperClassName = '',
      as = 'input',
      ...fieldProps
    } = props;

    const hasError = !!error;
    const inputClasses = [
      as === 'textarea' ? 'input textarea' : 'input',
      hasError ? 'input-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClassName} style={{ width: '100%' }}>
        {/* Label */}
        {label && (
          <label className="label">
            {label}
            {required && (
              <span
                style={{
                  color: 'var(--color-error)',
                  marginLeft: '4px',
                }}
              >
                *
              </span>
            )}
          </label>
        )}

        {/* Field wrapper */}
        <div style={{ position: 'relative' }}>
          {/* Left icon */}
          {icon && as !== 'textarea' && (
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

          {/* Render input or textarea */}
          {as === 'textarea' ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={inputClasses}
              aria-invalid={hasError}
              {...(fieldProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={inputClasses}
              aria-invalid={hasError}
              style={icon ? { paddingLeft: 'var(--space-10)' } : undefined}
              {...(fieldProps as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            className="text-error text-xs"
            style={{ marginTop: 'var(--space-1)' }}
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p
            className="text-muted text-xs"
            style={{ marginTop: 'var(--space-1)' }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
