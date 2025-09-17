import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;      // adds hover/active/focus styles for clickable cards
  asChild?: boolean;           // allow polymorphic rendering (e.g., <Link> or <a>)
}

export function Card({ className, interactive, asChild, ...props }: CardProps) {
  const Comp: any = asChild ? 'div' : 'div';
  return (
    <Comp
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-md transition-shadow',
        'backdrop-blur-sm',
        interactive &&
          'hover:shadow-lg active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
        className
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-5 sm:p-6', className)}
      {...props}
    />
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-5 sm:p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center p-5 sm:p-6 pt-0', className)} {...props} />
  );
}
