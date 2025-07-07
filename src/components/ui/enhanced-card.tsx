
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'gradient' | 'glass' | 'hover-lift';
  gradientType?: 'green' | 'blue' | 'orange' | 'purple';
  clickable?: boolean;
  onClick?: () => void;
  loading?: boolean;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  style,
  variant = 'default',
  gradientType = 'blue',
  clickable = false,
  onClick,
  loading = false,
  badge,
  icon
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return `gradient-card-${gradientType} text-white shadow-xl`;
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border-white/20 shadow-lg';
      case 'hover-lift':
        return 'bg-card text-card-foreground border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300';
      default:
        return 'bg-card text-card-foreground border shadow-md';
    }
  };

  if (loading) {
    return (
      <div className={cn('animate-pulse rounded-xl h-48 bg-muted', className)} style={style}>
        <div className="p-6 space-y-4">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
          <div className="h-20 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl transition-all duration-300',
        getVariantClasses(),
        clickable && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
      style={style}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          {badge}
        </div>
      )}

      {/* Icon */}
      {icon && (
        <div className="absolute top-4 left-4 z-10 opacity-20">
          {icon}
        </div>
      )}

      {children}

      {/* Hover Overlay for Gradient Cards */}
      {variant === 'gradient' && clickable && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      )}
    </div>
  );
};
