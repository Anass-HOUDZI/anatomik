
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  showNumbers?: boolean;
  className?: string;
  variant?: 'line' | 'circle' | 'steps';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  showPercentage = true,
  showNumbers = true,
  className,
  variant = 'line'
}) => {
  const percentage = Math.round((current / total) * 100);

  if (variant === 'circle') {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold">{percentage}%</span>
          </div>
        </div>
        {showNumbers && (
          <span className="text-sm text-muted-foreground">
            {current}/{total}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'steps') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {Array.from({ length: total }, (_, index) => (
          <div key={index} className="flex items-center">
            {index < current ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <Circle size={20} className="text-muted-foreground" />
            )}
            {index < total - 1 && (
              <div className="w-8 h-0.5 mx-2 bg-muted" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        {showNumbers && (
          <span className="text-sm font-medium text-muted-foreground">
            {current}/{total} outils
          </span>
        )}
        {showPercentage && (
          <span className="text-sm font-semibold text-primary">
            {percentage}%
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
