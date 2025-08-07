import React from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface MobileCalculatorLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export const MobileCalculatorLayout: React.FC<MobileCalculatorLayoutProps> = ({
  children,
  title,
  description,
  className
}) => {
  const { deviceInfo } = useMobileOptimization();

  return (
    <div className={cn(
      'w-full mobile-container mobile-safe-area',
      deviceInfo.isMobile ? 'mobile-spacing' : 'p-6',
      className
    )}>
      <div className="mobile-section">
        <h1 className="mobile-title text-center mb-2">{title}</h1>
        {description && (
          <p className="mobile-body text-center text-muted-foreground mb-6">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

interface MobileInputGroupProps {
  label: string;
  children: React.ReactNode;
  helper?: string;
  className?: string;
}

export const MobileInputGroup: React.FC<MobileInputGroupProps> = ({
  label,
  children,
  helper,
  className
}) => {
  return (
    <div className={cn('mobile-input-group', className)}>
      <label className="mobile-input-label">{label}</label>
      {children}
      {helper && (
        <small className="text-xs text-muted-foreground mt-1 block">
          {helper}
        </small>
      )}
    </div>
  );
};

interface MobileResultCardProps {
  value: string | number;
  label: string;
  helper?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export const MobileResultCard: React.FC<MobileResultCardProps> = ({
  value,
  label,
  helper,
  variant = 'default',
  className
}) => {
  const variantClasses = {
    default: 'border-gray-200 dark:border-gray-700',
    primary: 'border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20',
    success: 'border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    warning: 'border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
  };

  return (
    <div className={cn(
      'mobile-result-card border-2',
      variantClasses[variant],
      className
    )}>
      <div className="mobile-result-value">{value}</div>
      <div className="mobile-result-label">{label}</div>
      {helper && (
        <small className="text-xs text-muted-foreground">{helper}</small>
      )}
    </div>
  );
};

interface MobileGridProps {
  children: React.ReactNode;
  cols?: 1 | 2;
  className?: string;
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  cols = 1,
  className
}) => {
  const gridClass = cols === 2 ? 'mobile-grid-2' : 'mobile-grid-1';
  
  return (
    <div className={cn(gridClass, className)}>
      {children}
    </div>
  );
};

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
  };

  const sizeClasses = {
    sm: 'mobile-btn-small',
    md: 'mobile-btn',
    lg: 'mobile-btn-large'
  };

  return (
    <button
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};