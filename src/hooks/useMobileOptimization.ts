
import { useState, useEffect, useCallback } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  orientation: 'portrait' | 'landscape';
  isRetina: boolean;
  safeAreas: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface TouchGesture {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  isSwipe: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
}

export const useMobileOptimization = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenSize: 'lg',
    orientation: 'landscape',
    isRetina: false,
    safeAreas: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const [touchGesture, setTouchGesture] = useState<TouchGesture | null>(null);

  // Détection des caractéristiques de l'appareil
  const detectDevice = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Détection du type d'appareil
    const isMobile = width < 768 || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    // Détection de la taille d'écran
    let screenSize: DeviceInfo['screenSize'] = 'lg';
    if (width < 320) screenSize = 'xs';
    else if (width < 480) screenSize = 'sm';
    else if (width < 640) screenSize = 'md';
    else if (width < 768) screenSize = 'lg';
    else if (width < 1024) screenSize = 'xl';
    else if (width < 1280) screenSize = '2xl';
    else if (width < 1536) screenSize = '3xl';
    else if (width < 1920) screenSize = '4xl';
    else screenSize = '5xl';

    // Détection de l'orientation
    const orientation = height > width ? 'portrait' : 'landscape';

    // Détection écran rétine
    const isRetina = window.devicePixelRatio > 1;

    // Safe areas (zones sûres pour les encoches)
    const computedStyle = getComputedStyle(document.documentElement);
    const safeAreas = {
      top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
      right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0')
    };

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      screenSize,
      orientation,
      isRetina,
      safeAreas
    });
  }, []);

  // Gestion des gestes tactiles
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchGesture({
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        isSwipe: false,
        direction: null
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1 && touchGesture) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchGesture.startX;
      const deltaY = touch.clientY - touchGesture.startY;
      
      // Détection du swipe
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const isSwipe = distance > 50;
      
      let direction: TouchGesture['direction'] = null;
      if (isSwipe) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
      }

      setTouchGesture(prev => prev ? {
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX,
        deltaY,
        isSwipe,
        direction
      } : null);
    }
  }, [touchGesture]);

  const handleTouchEnd = useCallback(() => {
    setTouchGesture(null);
  }, []);

  // Optimisation des performances pour mobile
  const optimizeForMobile = useCallback(() => {
    if (deviceInfo.isMobile) {
      // Désactiver le zoom par pincement si nécessaire
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
      }

      // Optimiser le scroll
      document.body.style.overscrollBehavior = 'contain';
      document.body.style.touchAction = 'pan-x pan-y';

      // Améliorer les performances de rendu
      document.body.style.webkitBackfaceVisibility = 'hidden';
      document.body.style.webkitPerspective = '1000';
      document.body.style.webkitTransform = 'translate3d(0,0,0)';
    }
  }, [deviceInfo.isMobile]);

  // Gestion du mode plein écran
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.log('Fullscreen not supported');
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.log('Exit fullscreen failed');
      }
    }
  }, []);

  // Haptic feedback pour les appareils supportés
  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Gestion de l'orientation
  const lockOrientation = useCallback(async (orientation: 'portrait' | 'landscape') => {
    if ('screen' in window && 'orientation' in window.screen && 'lock' in window.screen.orientation) {
      try {
        await (window.screen.orientation as any).lock(orientation);
      } catch (error) {
        console.log('Orientation lock not supported');
      }
    }
  }, []);

  // Event listeners
  useEffect(() => {
    detectDevice();

    const handleResize = () => detectDevice();
    const handleOrientationChange = () => setTimeout(detectDevice, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    if (deviceInfo.isTouchDevice) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [detectDevice, deviceInfo.isTouchDevice, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Optimisations au changement d'appareil
  useEffect(() => {
    optimizeForMobile();
  }, [optimizeForMobile]);

  return {
    deviceInfo,
    touchGesture,
    hapticFeedback,
    toggleFullscreen,
    lockOrientation,
    optimizeForMobile
  };
};
