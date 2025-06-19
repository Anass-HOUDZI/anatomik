
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { X, Menu } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  bottomNav?: React.ReactNode;
  enableSidebar?: boolean;
  sidebarDefaultOpen?: boolean;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  sidebar,
  header,
  bottomNav,
  enableSidebar = true,
  sidebarDefaultOpen = false,
  className
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { deviceInfo } = useMobileOptimization();
  const [sidebarOpen, setSidebarOpen] = useState(sidebarDefaultOpen && !isMobile);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      setSidebarVisible(true);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSidebarTransitionEnd = () => {
    if (!sidebarOpen) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      setSidebarVisible(true);
    }
  }, [sidebarOpen]);

  return (
    <div className={cn(
      'min-h-screen flex flex-col overflow-hidden',
      'safe-area-container',
      className
    )}>
      {/* Header */}
      {header && (
        <header className={cn(
          'mobile-header z-40',
          'h-14 md:h-16 flex items-center justify-between px-4',
          'bg-background/95 backdrop-blur-sm border-b'
        )}>
          {enableSidebar && sidebar && (
            <button
              onClick={toggleSidebar}
              className="touch-target p-2 -ml-2 rounded-lg hover:bg-accent"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          {header}
        </header>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        {enableSidebar && sidebar && (
          <>
            {/* Backdrop for mobile */}
            {isMobile && sidebarVisible && (
              <div
                className={cn(
                  'fixed inset-0 bg-black/50 z-30 transition-opacity duration-300',
                  sidebarOpen ? 'opacity-100' : 'opacity-0'
                )}
                onClick={closeSidebar}
              />
            )}
            
            {/* Sidebar */}
            <aside
              className={cn(
                'z-40 flex flex-col bg-background border-r',
                // Mobile: Fixed overlay
                isMobile && [
                  'fixed top-0 left-0 h-full w-80 max-w-[85vw]',
                  'transform transition-transform duration-300 ease-out',
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                  deviceInfo.safeAreas.top > 0 && 'pt-safe-top'
                ],
                // Tablet: Overlay or static
                isTablet && [
                  sidebarOpen ? 'w-80' : 'w-0',
                  'transition-all duration-300 overflow-hidden'
                ],
                // Desktop: Always visible when open
                isDesktop && [
                  sidebarOpen ? 'w-80' : 'w-0',
                  'transition-all duration-300 overflow-hidden'
                ]
              )}
              onTransitionEnd={handleSidebarTransitionEnd}
            >
              {sidebarVisible && (
                <>
                  {/* Sidebar header on mobile */}
                  {isMobile && (
                    <div className="h-14 flex items-center justify-between px-4 border-b">
                      <span className="font-semibold">Menu</span>
                      <button
                        onClick={closeSidebar}
                        className="touch-target p-2 -mr-2 rounded-lg hover:bg-accent"
                        aria-label="Close sidebar"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                  
                  {/* Sidebar content */}
                  <div className="flex-1 overflow-auto">
                    {sidebar}
                  </div>
                </>
              )}
            </aside>
          </>
        )}

        {/* Main content */}
        <main className={cn(
          'flex-1 flex flex-col overflow-hidden',
          'will-change-transform',
          bottomNav && 'pb-16 md:pb-0' // Space for bottom nav on mobile
        )}>
          <div className="flex-1 overflow-auto mobile-scroll-container">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      {bottomNav && (
        <nav className={cn(
          'mobile-nav md:hidden',
          'h-16 flex items-center justify-around',
          'bg-background/95 backdrop-blur-sm border-t'
        )}>
          {bottomNav}
        </nav>
      )}
    </div>
  );
};
