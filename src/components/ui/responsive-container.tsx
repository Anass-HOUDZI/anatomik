
import React from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  enableSafeAreas?: boolean;
  enableTouchOptimization?: boolean;
  fullWidth?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  enableSafeAreas = false,
  enableTouchOptimization = true,
  fullWidth = true
}) => {
  const { deviceInfo } = useMobileOptimization();

  const getResponsiveClassName = () => {
    let baseClassName = className || '';
    
    if (fullWidth) {
      baseClassName += ' w-full';
    }
    
    if (deviceInfo.isMobile && mobileClassName) {
      baseClassName += ` ${mobileClassName}`;
    } else if (deviceInfo.isTablet && tabletClassName) {
      baseClassName += ` ${tabletClassName}`;
    } else if (deviceInfo.isDesktop && desktopClassName) {
      baseClassName += ` ${desktopClassName}`;
    }

    if (enableSafeAreas) {
      baseClassName += ' pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right';
    }

    if (enableTouchOptimization && deviceInfo.isTouchDevice) {
      baseClassName += ' touch-target';
    }

    return baseClassName;
  };

  return (
    <div className={cn(getResponsiveClassName())}>
      {children}
    </div>
  );
};
