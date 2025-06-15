
import React from 'react';
import type { Category, Tool } from '../App';
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

// Import configs
import nutritionalToolsConfig from './tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from './tool-configs/trainingToolsConfig';
import trackingToolsConfig from './tool-configs/trackingToolsConfig';
import generatorToolsConfig from './tool-configs/generatorToolsConfig';

// Map gradient classes by category
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

  // Ajout icône Lucide si présent (option : améliorable + tard)
  return (
    <div className="max-w-6xl mx-auto px-2">
      {/* Titre de la page (toujours blanc) */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold page-title mb-3">{category.name}</h2>
        <p className="text-lg text-white/80 mb-4">{category.description}</p>
        {/* Barre de progression */}
        <div className="flex flex-col items-center mb-2 w-full max-w-lg mx-auto gap-1">
          <Progress value={completionPercentage} className="w-full h-5 rounded-lg bg-white/20 shadow" />
          <span className="text-white font-semibold text-sm mt-1 bg-black/20 rounded-full px-4 py-0.5">
            {implementedCount}/{totalCount} outils disponibles ({completionPercentage}%)
          </span>
        </div>
      </div>
      
      {/* Grille des outils */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, idx) => (
          <div
            key={tool.id}
            className={`
              group relative rounded-2xl shadow-xl
              bg-gradient-to-br ${cardGradients[category.id]} 
              flex flex-col items-start justify-between p-6 min-h-[195px]
              cursor-pointer tool-modern-card animate-fade-in transition-all duration-200
              hover:scale-[1.025] active:scale-98
            `}
            style={{ animationDelay: `${idx * 0.08}s` }}
            onClick={() => tool.component && onToolSelect(tool)}
          >
            {/* Header carte */}
            <div className="flex flex-col items-start gap-2 w-full">
              {/* Titre + badge état */}
              <div className="flex items-center w-full gap-2 justify-between">
                <h3 className="text-lg font-bold text-white drop-shadow-lg">{tool.name}</h3>
                <Badge
                  variant={tool.component ? "success" : "warning"}
                  className={`ml-2 px-3 py-1 text-xs font-bold rounded-full
                    ${tool.component
                      ? "bg-emerald-500 text-white"
                      : "bg-orange-400 text-white"
                    }
                  `}
                >
                  {tool.component ? "Disponible" : "Bientôt"}
                </Badge>
              </div>
              <p className="text-sm text-white/90 mb-1">{tool.description}</p>
            </div>
            {/* Footer action */}
            <div className="mt-4 flex w-full justify-between items-center">
              <span className={`text-xs 
                font-semibold rounded px-3 py-1 shadow
                ${tool.component
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-white/70"
                }
              `}>
                {tool.component ? "Cliquez pour utiliser" : "En développement"}
              </span>
              <svg width="22" height="22" className={`ml-2 ${tool.component ? "opacity-100" : "opacity-40"}`}>
                <path d="M7 11h8m0 0-3-3m3 3-3 3"
                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolView;
