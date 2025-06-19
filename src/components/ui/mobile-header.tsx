
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { Search, X } from 'lucide-react';

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  enableSearch?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  children,
  searchPlaceholder = "Rechercher...",
  onSearch,
  enableSearch = false,
  actions,
  className
}) => {
  const { isMobile } = useResponsive();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setSearchActive(!searchActive);
    if (searchActive) {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  if (children) {
    return (
      <header className={cn('mobile-header', className)}>
        {children}
      </header>
    );
  }

  return (
    <header className={cn(
      'mobile-header',
      'h-14 md:h-16 flex items-center px-4',
      'bg-background/95 backdrop-blur-sm border-b',
      className
    )}>
      {searchActive && enableSearch ? (
        // Search mode
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-xl',
                'bg-muted border-0 focus:ring-2 focus:ring-primary',
                isMobile ? 'h-10 text-base' : 'h-9 text-sm'
              )}
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={handleSearchToggle}
            className="touch-target p-2 rounded-lg hover:bg-accent"
            aria-label="Fermer la recherche"
          >
            <X size={20} />
          </button>
        </form>
      ) : (
        // Normal mode
        <>
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className={cn(
                'font-semibold text-foreground truncate',
                isMobile ? 'text-lg' : 'text-xl'
              )}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {enableSearch && (
              <button
                onClick={handleSearchToggle}
                className="touch-target p-2 rounded-lg hover:bg-accent"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>
            )}
            {actions}
          </div>
        </>
      )}
    </header>
  );
};
