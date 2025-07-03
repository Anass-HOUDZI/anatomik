
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
        return `gradient-card-${gradientType} text-white`;
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border-white/20';
      case 'hover-lift':
        return 'modern-card hover-lift hover-glow';
      default:
        return 'modern-card';
    }
  };

  if (loading) {
    return (
      <div className={cn('loading-shimmer rounded-xl h-48', className)} style={style}>
        <div className="p-6 space-y-4">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/20 rounded w-1/2"></div>
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        getVariantClasses(),
        clickable && 'interactive-element cursor-pointer focus-ring',
        className
      )}
      style={style}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
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
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
      )}
    </div>
  );
};
