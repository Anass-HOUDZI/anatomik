
import React, { createContext, useContext, useCallback, useRef, useState } from 'react';

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  deltaX: number;
  deltaY: number;
  velocity: number;
}

export interface PinchGesture {
  scale: number;
  deltaScale: number;
  centerX: number;
  centerY: number;
}

export interface GestureContextType {
  onSwipe: (callback: (swipe: SwipeDirection) => void) => () => void;
  onPinch: (callback: (pinch: PinchGesture) => void) => () => void;
  enableHapticFeedback: (type: 'light' | 'medium' | 'heavy') => void;
}

const GestureContext = createContext<GestureContextType | null>(null);

export const useGestures = () => {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error('useGestures must be used within a GestureProvider');
  }
  return context;
};

interface GestureProviderProps {
  children: React.ReactNode;
}

export const GestureProvider: React.FC<GestureProviderProps> = ({ children }) => {
  const swipeCallbacks = useRef<Set<(swipe: SwipeDirection) => void>>(new Set());
  const pinchCallbacks = useRef<Set<(pinch: PinchGesture) => void>>(new Set());
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isGestureActive, setIsGestureActive] = useState(false);

  const onSwipe = useCallback((callback: (swipe: SwipeDirection) => void) => {
    swipeCallbacks.current.add(callback);
    return () => {
      swipeCallbacks.current.delete(callback);
    };
  }, []);

  const onPinch = useCallback((callback: (pinch: PinchGesture) => void) => {
    pinchCallbacks.current.add(callback);
    return () => {
      pinchCallbacks.current.delete(callback);
    };
  }, []);

  const enableHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      setIsGestureActive(true);
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current || e.changedTouches.length !== 1) {
      setIsGestureActive(false);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Swipe detection (minimum 50px distance, maximum 500ms duration)
    if (distance >= 50 && deltaTime <= 500) {
      let direction: 'left' | 'right' | 'up' | 'down';
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      const swipeData: SwipeDirection = {
        direction,
        deltaX,
        deltaY,
        velocity
      };

      swipeCallbacks.current.forEach(callback => callback(swipeData));
      enableHapticFeedback('light');
    }

    touchStart.current = null;
    setIsGestureActive(false);
  }, [enableHapticFeedback]);

  React.useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  const value: GestureContextType = {
    onSwipe,
    onPinch,
    enableHapticFeedback
  };

  return (
    <GestureContext.Provider value={value}>
      {children}
    </GestureContext.Provider>
  );
};
