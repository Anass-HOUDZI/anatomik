
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav aria-label="Fil d'Ariane" className={cn('flex items-center space-x-2 text-sm', className)}>
      <button
        onClick={items[0]?.onClick}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md p-1"
        aria-label="Accueil"
      >
        <Home size={16} />
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-muted-foreground" />
          <button
            onClick={item.onClick}
            disabled={item.current}
            className={cn(
              'font-medium transition-colors focus-ring rounded-md px-2 py-1',
              item.current
                ? 'text-foreground cursor-default'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
