
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
            <ChevronRight size={16} className="text-[#7303c0] dark:text-gray-400" />
          )}
          <button
            onClick={item.onClick}
            className={cn(
              "transition-colors hover:text-primary",
              item.current 
                ? "bg-gradient-to-r from-[#7303c0] to-[#4a00e0] bg-clip-text text-transparent dark:text-white font-medium" 
                : "bg-gradient-to-r from-[#7303c0] to-[#4a00e0] bg-clip-text text-transparent dark:text-gray-300 hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
