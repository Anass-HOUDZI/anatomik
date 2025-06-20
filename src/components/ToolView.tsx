
import React from 'react';
import type { Category, Tool } from '../App';
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { MobileCard } from "./ui/mobile-card";

// Import configs
import nutritionalToolsConfig from './tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from './tool-configs/trainingToolsConfig';
import trackingToolsConfig from './tool-configs/trackingToolsConfig';
import generatorToolsConfig from './tool-configs/generatorToolsConfig';

const cardGradients: Record<string, string> = {
  nutritional: "from-green-400 via-teal-400 to-emerald-200",
  training: "from-blue-600 via-blue-400 to-indigo-300",
  tracking: "from-orange-400 via-yellow-400 to-amber-200",
  generators: "from-purple-400 via-violet-500 to-indigo-200",
};

const getToolsForCategory = (categoryId: string) => {
  switch (categoryId) {
    case "nutritional":
      return nutritionalToolsConfig;
    case "training":
      return trainingToolsConfig;
    case "tracking":
      return trackingToolsConfig;
    case "generators":
      return generatorToolsConfig;
    default:
      return [];
  }
};

interface ToolViewProps {
  category: Category;
  onToolSelect: (tool: Tool) => void;
}

const ToolView: React.FC<ToolViewProps> = ({ category, onToolSelect }) => {
  const tools = getToolsForCategory(category.id) as Tool[];
  const implementedCount = tools.filter(tool => tool.component).length;
  const totalCount = tools.length;
  const completionPercentage = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="w-full px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold page-title mb-2 text-[#111] drop-shadow-none">
          {category.name}
        </h2>
        <p className="text-base md:text-lg mb-3 text-[#222] font-medium">
          {category.description}
        </p>
        
        {/* Progress bar */}
        <div className="flex flex-col items-center mb-2 w-full max-w-md mx-auto gap-1">
          <Progress 
            value={completionPercentage} 
            className="w-full h-4 rounded-lg bg-white/20 shadow" 
          />
          <span className="text-gray-500 font-semibold text-xs mt-1 bg-gray-200 rounded-full px-3 py-0.5">
            {implementedCount}/{totalCount} outils disponibles ({completionPercentage}%)
          </span>
        </div>
      </div>
      
      {/* Grid pleine largeur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {tools.map((tool, idx) => (
          <MobileCard
            key={tool.id}
            clickable={!!tool.component}
            onTap={() => tool.component && onToolSelect(tool)}
            className={`
              group relative rounded-xl
              bg-gradient-to-br ${cardGradients[category.id]}
              flex flex-col items-start justify-between p-4 min-h-[160px]
              tool-modern-card animate-fade-in transition-all duration-200 w-full
              ${tool.component ? 'hover:scale-[1.02] active:scale-98' : 'opacity-75'}
            `}
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {/* Header carte */}
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="flex items-start w-full gap-2 justify-between">
                <h3 className="text-base md:text-lg font-bold text-white drop-shadow-lg leading-tight flex-1">
                  {tool.name}
                </h3>
                <Badge
                  variant={tool.component ? "default" : "secondary"}
                  className={`shrink-0 px-2 py-1 text-xs font-bold rounded-full
                    ${tool.component
                      ? "bg-emerald-500 text-white"
                      : "bg-orange-400 text-white"
                    }
                  `}
                >
                  {tool.component ? "Disponible" : "Bientôt"}
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-white/90 mb-1 leading-relaxed">
                {tool.description}
              </p>
            </div>
            
            {/* Footer action */}
            <div className="mt-3 flex w-full justify-between items-center">
              <span className={`text-xs font-semibold rounded px-2 py-1 shadow
                ${tool.component
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-white/70"
                }
              `}>
                {tool.component ? "Cliquez pour utiliser" : "En développement"}
              </span>
              <svg width="16" height="16" className={`ml-2 ${tool.component ? "opacity-100" : "opacity-40"}`}>
                <path d="M6 8h4m0 0-2-2m2 2-2 2"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </MobileCard>
        ))}
      </div>
    </div>
  );
};

export default ToolView;
