
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { useGestures } from '@/contexts/GestureContext';

interface MobileListProps {
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => Promise<void>;
  refreshThreshold?: number;
  enablePullToRefresh?: boolean;
  enableSwipeActions?: boolean;
  onSwipeLeft?: (index: number) => void;
  onSwipeRight?: (index: number) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export const MobileList: React.FC<MobileListProps> = ({
  children,
  className,
  onRefresh,
  refreshThreshold = 80,
  enablePullToRefresh = true,
  enableSwipeActions = false,
  onSwipeLeft,
  onSwipeRight,
  loading = false,
  emptyState
}) => {
  const { isMobile } = useResponsive();
  const { enableHapticFeedback } = useGestures();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isAtTop = useRef(true);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enablePullToRefresh || !isMobile) return;
    startY.current = e.touches[0].clientY;
    isAtTop.current = (listRef.current?.scrollTop || 0) === 0;
  }, [enablePullToRefresh, isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enablePullToRefresh || !isMobile || !isAtTop.current || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      e.preventDefault();
      const distance = Math.min(diff * 0.5, refreshThreshold * 1.5);
      setPullDistance(distance);
      
      if (distance >= refreshThreshold) {
        enableHapticFeedback('medium');
      }
    }
  }, [enablePullToRefresh, isMobile, isRefreshing, refreshThreshold, enableHapticFeedback]);

  const handleTouchEnd = useCallback(async () => {
    if (!enablePullToRefresh || !isMobile) return;
    
    if (pullDistance >= refreshThreshold && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      enableHapticFeedback('heavy');
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  }, [enablePullToRefresh, isMobile, pullDistance, refreshThreshold, onRefresh, isRefreshing, enableHapticFeedback]);

  useEffect(() => {
    const element = listRef.current;
    if (!element || !isMobile) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, isMobile]);

  const refreshIndicatorStyle = {
    transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
    opacity: Math.min(pullDistance / refreshThreshold, 1)
  };

  const contentStyle = {
    transform: `translateY(${pullDistance}px)`,
    transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
  };

  return (
    <div 
      ref={listRef}
      className={cn(
        'mobile-scroll-container relative overflow-auto',
        'will-change-scroll',
        isMobile && '-webkit-overflow-scrolling: touch',
        className
      )}
      style={{ 
        WebkitOverflowScrolling: 'touch',
        transform: 'translate3d(0,0,0)' 
      }}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && isMobile && (
        <div 
          className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center z-10"
          style={refreshIndicatorStyle}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Actualisation...</span>
              </>
            ) : pullDistance >= refreshThreshold ? (
              <span>Relâcher pour actualiser</span>
            ) : (
              <span>Tirer pour actualiser</span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={contentStyle}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : React.Children.count(children) === 0 ? (
          <div className="flex items-center justify-center py-8">
            {emptyState || <span className="text-muted-foreground">Aucun élément</span>}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
