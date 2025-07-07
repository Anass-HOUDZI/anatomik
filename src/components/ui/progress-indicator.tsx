
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  variant?: 'line' | 'circle' | 'bar';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  variant = 'line',
  size = 'md',
  className,
  showText = true,
  color = 'primary'
}) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
  
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    error: 'bg-red-500'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  if (variant === 'line') {
    return (
      <div className={cn('w-full', className)}>
        {showText && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              {current}/{total} outils
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
          <div 
            className={cn('h-full transition-all duration-500 ease-out rounded-full', colorClasses[color])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'circle') {
    const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg 
          className="transform -rotate-90" 
          width={radius * 2 + 8} 
          height={radius * 2 + 8}
        >
          <circle
            cx={radius + 4}
            cy={radius + 4}
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx={radius + 4}
            cy={radius + 4}
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn('transition-all duration-500 ease-out', {
              'text-primary': color === 'primary',
              'text-green-500': color === 'success',
              'text-orange-500': color === 'warning',
              'text-red-500': color === 'error'
            })}
          />
        </svg>
        {showText && (
          <span className="absolute text-xs font-medium">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {showText && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">Progression</span>
          <span className="text-sm font-medium">{current}/{total}</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={cn('h-2 rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
