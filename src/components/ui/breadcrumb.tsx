
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
  current: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight size={16} className="text-muted-foreground" />
          )}
          <button
            onClick={item.onClick}
            className={cn(
              "transition-colors hover:text-primary",
              item.current 
                ? "text-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
