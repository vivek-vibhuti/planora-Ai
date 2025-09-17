import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading = false, disabled, fullWidth, children, ...props },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 ' +
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed ' +
      'select-none ' +
      'transform hover:scale-[1.02] active:scale-[0.98]';

    const variants: Record<Variant, string> = {
      primary:
        'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg ' +
        'hover:from-green-700 hover:to-blue-700 hover:shadow-xl border-2 border-transparent',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 ' +
        'border-2 border-gray-200 hover:border-gray-300',
      outline:
        'border-2 border-green-600 text-green-700 hover:bg-green-50 ' +
        'bg-white hover:border-green-700',
      ghost:
        'text-gray-700 hover:text-gray-900 hover:bg-gray-100 ' +
        'border-2 border-transparent',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 ' +
        'border-2 border-transparent shadow-lg hover:shadow-xl',
    };

    const sizes: Record<Size, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-[15px]',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-7 text-lg',
      icon: 'h-10 w-10 p-0',
    };

    // Normalize child spacing for icon + label
    // Applies gap if there are multiple children (e.g., icon + text).
    const contentHasMultipleChildren =
      React.Children.count(children) > 1 || (typeof children !== 'string' && !!children);

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          // Add gap only when not icon-only
          size !== 'icon' && contentHasMultipleChildren && 'gap-2',
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span
            className={cn(
              'inline-block rounded-full animate-spin',
              // spinner sizes tuned per button size
              size === 'sm' ? 'h-3 w-3 border-2' : size === 'lg' || size === 'xl' ? 'h-5 w-5 border-2' : 'h-4 w-4 border-2',
              // spinner color per variant
              variant === 'secondary' || variant === 'outline' || variant === 'ghost'
                ? 'border-gray-600 border-t-transparent'
                : 'border-white border-t-transparent'
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
