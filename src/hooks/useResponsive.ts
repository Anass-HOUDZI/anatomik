
import { useState, useEffect, useCallback } from 'react';

export interface ResponsiveBreakpoints {
  xs: boolean;      // 375px - Très petits mobiles
  sm: boolean;      // 480px - Mobiles standard  
  md: boolean;      // 640px - Tablettes portrait
  lg: boolean;      // 768px - Tablettes landscape
  xl: boolean;      // 1024px - Laptops
  '2xl': boolean;   // 1280px - Grands écrans
  '3xl': boolean;   // 1920px - Ultra wide
}

export interface ResponsiveState extends ResponsiveBreakpoints {
  isMobile: boolean;
  isMobileSm: boolean;
  isMobileMd: boolean;
  isMobileLg: boolean;
  isTablet: boolean;
  isTabletSm: boolean;
  isTabletLg: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
}

const getBreakpoints = (width: number): ResponsiveBreakpoints => ({
  xs: width >= 375,
  sm: width >= 480,
  md: width >= 640,
  lg: width >= 768,
  xl: width >= 1024,
  '2xl': width >= 1280,
  '3xl': width >= 1920,
});

const getDeviceType = (width: number): 'mobile' | 'tablet' | 'desktop' => {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    const breakpoints = getBreakpoints(width);
    const deviceType = getDeviceType(width);
    const isPortrait = height > width;
    
    return {
      ...breakpoints,
      isMobile: width < 768,
      isMobileSm: width >= 375 && width < 480,
      isMobileMd: width >= 480 && width < 640,
      isMobileLg: width >= 640 && width < 768,
      isTablet: width >= 768 && width < 1024,
      isTabletSm: width >= 768 && width < 900,
      isTabletLg: width >= 900 && width < 1024,
      isDesktop: width >= 1024,
      isPortrait,
      isLandscape: !isPortrait,
      width,
      height,
      deviceType,
      orientation: isPortrait ? 'portrait' : 'landscape',
    };
  });

  const updateState = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoints = getBreakpoints(width);
    const deviceType = getDeviceType(width);
    const isPortrait = height > width;
    
    setState({
      ...breakpoints,
      isMobile: width < 768,
      isMobileSm: width >= 375 && width < 480,
      isMobileMd: width >= 480 && width < 640,
      isMobileLg: width >= 640 && width < 768,
      isTablet: width >= 768 && width < 1024,
      isTabletSm: width >= 768 && width < 900,
      isTabletLg: width >= 900 && width < 1024,
      isDesktop: width >= 1024,
      isPortrait,
      isLandscape: !isPortrait,
      width,
      height,
      deviceType,
      orientation: isPortrait ? 'portrait' : 'landscape',
    });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateState, 100);
    };

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateState, 200);
    });

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', updateState);
      clearTimeout(timeoutId);
    };
  }, [updateState]);

  return state;
};
