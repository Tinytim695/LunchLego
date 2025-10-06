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
    default: 'bg-white/90 backdrop-blur-md shadow-xl',
    blue: 'bg-gradient-to-br from-blue-50/90 to-indigo-100/90 backdrop-blur-md shadow-xl border-blue-200/50',
    purple: 'bg-gradient-to-br from-purple-50/90 to-pink-100/90 backdrop-blur-md shadow-xl border-purple-200/50',
    pink: 'bg-gradient-to-br from-pink-50/90 to-rose-100/90 backdrop-blur-md shadow-xl border-pink-200/50',
    white: 'bg-white/95 backdrop-blur-md shadow-xl',
  };

  return (
    <div className={cn(
      'rounded-2xl border border-white/30',
      variantClasses[variant],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}