
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatsCounterProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({
  value,
  label,
  icon,
  className,
  delay = 0
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      let start = 0;
      const increment = value / 30;
      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 50);
      
      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-700",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      className
    )}>
      <div className="p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/10">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">
          {count}+
        </div>
        <div className="text-sm text-white/80">
          {label}
        </div>
      </div>
    </div>
  );
};
