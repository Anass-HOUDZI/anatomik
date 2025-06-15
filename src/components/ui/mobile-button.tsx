
import React from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  enableHaptic?: boolean;
  children: React.ReactNode;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  enableHaptic = true,
  className,
  children,
  onClick,
  ...props
}) => {
  const { deviceInfo, hapticFeedback } = useMobileOptimization();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableHaptic && deviceInfo.isTouchDevice) {
      hapticFeedback('light');
    }
    onClick?.(e);
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  const sizeClasses = {
    sm: deviceInfo.isMobile ? 'h-10 px-4 text-sm' : 'h-9 px-3 text-sm',
    md: deviceInfo.isMobile ? 'h-12 px-6 text-base' : 'h-10 px-4',
    lg: deviceInfo.isMobile ? 'h-14 px-8 text-lg' : 'h-11 px-8'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'touch-target touch-feedback',
        variantClasses[variant],
        sizeClasses[size],
        deviceInfo.isMobile && 'shadow-touch active:shadow-touch-active',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
