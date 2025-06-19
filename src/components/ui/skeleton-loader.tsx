
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'button' | 'list';
  lines?: number;
  animate?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'card',
  lines = 3,
  animate = true
}) => {
  const baseClasses = cn(
    'bg-muted rounded',
    animate && 'shimmer',
    className
  );

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={cn(baseClasses, 'w-12 h-12 rounded-full')} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn(baseClasses, 'h-10 w-24 rounded-xl')} />
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={cn(baseClasses, 'w-12 h-12 rounded-full')} />
            <div className="flex-1 space-y-2">
              <div className={cn(baseClasses, 'h-4 w-3/4')} />
              <div className={cn(baseClasses, 'h-3 w-1/2')} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className={cn(baseClasses, 'p-6 space-y-4')}>
      <div className={cn('bg-muted-foreground/20 rounded', 'h-6 w-3/4')} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'bg-muted-foreground/20 rounded h-4',
              i === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  );
};
