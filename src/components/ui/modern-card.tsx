
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'gradient' | 'premium';
  color?: 'green' | 'blue' | 'orange' | 'purple';
  clickable?: boolean;
  onClick?: () => void;
  image?: string;
  glow?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className,
  variant = 'glass',
  color = 'blue',
  clickable = false,
  onClick,
  image,
  glow = false,
  onMouseEnter,
  onMouseLeave
}) => {
  const baseClasses = "relative overflow-hidden rounded-3xl transition-all duration-150 ease-out group";
  
  const variants = {
    glass: "bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10",
    gradient: `bg-gradient-to-br ${getGradientColors(color)} text-white border-0`,
    premium: "bg-gradient-to-br from-[#7303c0] to-[#4a00e0] text-white border-0"
  };

  const clickableClasses = clickable ? "cursor-pointer hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]" : "";
  const glowClasses = glow ? "shadow-2xl hover:shadow-4xl" : "shadow-xl";

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        clickableClasses,
        glowClasses,
        className
      )}
      onClick={clickable ? onClick : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-200">
          <img 
            src={image} 
            alt="" 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 dark:to-black/20" />
      
      {/* Glow Effect */}
      {glow && (
        <div className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-xl",
          `bg-gradient-to-br ${getGradientColors(color)}`
        )} />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 to-transparent group-hover:animate-shine" />
      </div>
    </div>
  );
};

function getGradientColors(color: string) {
  const gradients = {
    green: "from-emerald-500 via-teal-500 to-cyan-500",
    blue: "from-blue-600 via-purple-600 to-indigo-600", 
    orange: "from-orange-500 via-red-500 to-pink-500",
    purple: "from-purple-600 via-pink-600 to-rose-500"
  };
  return gradients[color as keyof typeof gradients] || gradients.blue;
}
