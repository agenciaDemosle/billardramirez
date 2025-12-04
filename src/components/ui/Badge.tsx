import { HTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full';

  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    accent: 'bg-accent/20 text-accent-dark',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
