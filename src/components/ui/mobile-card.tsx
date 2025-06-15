
import React from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  onTap?: () => void;
  enableHaptic?: boolean;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  clickable = false,
  onTap,
  enableHaptic = true
}) => {
  const { deviceInfo, hapticFeedback } = useMobileOptimization();

  const handleTap = () => {
    if (enableHaptic && deviceInfo.isTouchDevice) {
      hapticFeedback('light');
    }
    onTap?.();
  };

  return (
    <div
      className={cn(
        'bg-card text-card-foreground',
        deviceInfo.isMobile 
          ? 'rounded-2xl p-4 shadow-mobile-card' 
          : 'rounded-lg p-6 shadow-md',
        clickable && 'cursor-pointer transition-all hover:shadow-lg',
        clickable && deviceInfo.isTouchDevice && 'touch-feedback active:scale-98',
        className
      )}
      onClick={clickable ? handleTap : undefined}
    >
      {children}
    </div>
  );
};
