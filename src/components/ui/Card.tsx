import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'blue' | 'purple' | 'pink' | 'white';
}

export function Card({ children, className, padding = 'md', variant = 'default' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white/80 backdrop-blur-sm',
    blue: 'bg-blue-100/80 backdrop-blur-sm',
    purple: 'bg-purple-100/80 backdrop-blur-sm',
    pink: 'bg-pink-100/80 backdrop-blur-sm',
    white: 'bg-white/90 backdrop-blur-sm',
  };

  return (
    <div className={cn(
      'rounded-xl border border-white/20 shadow-lg',
      variantClasses[variant],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}