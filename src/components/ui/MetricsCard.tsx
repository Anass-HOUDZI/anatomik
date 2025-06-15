
import React from "react";

interface MetricsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  hint?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, icon, trend, hint }) => {
  return (
    <div className="card-modern bg-white/70 dark:bg-[#171924]/90 backdrop-blur-modern shadow-3d group transition-all duration-300 relative overflow-visible hover:scale-105 hover:rotate-[1deg]">
      {/* 3D floating icon */}
      {icon && (
        <div className="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shadow-lg z-10 animate-float group-hover:scale-110">
          {icon}
        </div>
      )}
      <div className="pl-0 pt-8 flex flex-col items-start space-y-2">
        <span className="gradient-text text-xl font-display">{label}</span>
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {trend && (
            <span
              className={`inline-flex items-center ${trend === "up" ? "text-green-500" : "text-red-500"} animate-pulse-glow`}
            >
              {trend === "up" ? "▲" : "▼"}
            </span>
          )}
        </div>
        {hint && (
          <span className="text-xs mt-2 opacity-70">{hint}</span>
        )}
      </div>
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 pointer-events-none shimmer"></div>
    </div>
  );
};

export default MetricsCard;
