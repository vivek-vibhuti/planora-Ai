// src/components/ui/input.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      icon,
      id,
      required,
      hint,
      ...props
    },
    ref
  ) => {
    // Prefer parent-provided id; otherwise use a stable React id
    const reactId = React.useId();
    const finalId = React.useMemo(() => id ?? `in-${reactId}`, [id, reactId]);

    // Precompute flags to keep render stable
    const hasIcon = Boolean(icon);
    const hasError = Boolean(error);
    const showAsterisk = Boolean(required);

    // Derived ids for a11y
    const errorId = `${finalId}-error`;
    const hintId = `${finalId}-hint`;

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={finalId}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
            {showAsterisk ? <span className="ml-1 text-red-500">*</span> : null}
          </label>
        ) : null}

        <div className="relative">
          {/* Keep wrapper in DOM; toggle visibility only */}
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400',
              hasIcon ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden={hasIcon ? undefined : true}
          >
            {hasIcon ? icon : null}
          </div>

          <input
            id={finalId}
            ref={ref}
            type={type}
            required={required}
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={[
              hint ? hintId : null,
              hasError ? errorId : null
            ].filter(Boolean).join(' ') || undefined}
            className={cn(
              'flex h-12 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500',
              'focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              hasIcon && 'pl-10',
              hasError && 'border-red-500 focus:border-red-500 focus:ring-red-200',
              className
            )}
            {...props}
          />
        </div>

        {/* Reserve space for hint/error to avoid layout shift */}
        <div className="mt-2 min-h-[1.25rem]">
          {hasError ? (
            <p id={errorId} className="text-sm text-red-600">{error}</p>
          ) : hint ? (
            <p id={hintId} className="text-sm text-gray-500">{hint}</p>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
