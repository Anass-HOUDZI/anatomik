
import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleCardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export const SimpleCard: React.FC<SimpleCardProps> = ({
  children,
  className,
  clickable = false,
  onClick
}) => {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-lg border shadow-sm p-6',
        clickable && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
};
