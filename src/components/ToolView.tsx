
import React from 'react';
import type { Category, Tool } from '../App';
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

// Import configs
import nutritionalToolsConfig from './tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from './tool-configs/trainingToolsConfig';
import trackingToolsConfig from './tool-configs/trackingToolsConfig';
import generatorToolsConfig from './tool-configs/generatorToolsConfig';

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

const categoryGradients: Record<string, string> = {
  nutritional: "from-green-500 to-emerald-400",
  training: "from-blue-500 to-cyan-400",
  tracking: "from-orange-500 to-yellow-400",
  generators: "from-purple-500 to-pink-400",
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
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          {category.name}
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {category.description}
        </p>
        
        <div className="flex flex-col items-center space-y-2 max-w-md mx-auto">
          <Progress value={completionPercentage} className="w-full h-3" />
          <span className="text-sm text-muted-foreground font-medium">
            {implementedCount}/{totalCount} outils disponibles ({completionPercentage}%)
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <div
            key={tool.id}
            className={`
              group relative rounded-xl p-6 shadow-lg border transition-all duration-200
              ${tool.component 
                ? 'bg-card hover:shadow-xl hover:scale-[1.02] cursor-pointer' 
                : 'bg-muted/50 opacity-75'
              }
            `}
            style={{ animationDelay: `${idx * 0.05}s` }}
            onClick={() => tool.component && onToolSelect(tool)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold leading-tight flex-1 pr-4">
                  {tool.name}
                </h3>
                <Badge
                  variant={tool.component ? "default" : "secondary"}
                  className={`shrink-0 ${
                    tool.component
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-orange-400 text-white"
                  }`}
                >
                  {tool.component ? "Disponible" : "Bientôt"}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  tool.component
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {tool.component ? "Cliquez pour utiliser" : "En développement"}
                </span>
                {tool.component && (
                  <i className="fas fa-arrow-right text-muted-foreground group-hover:text-primary transition-colors"></i>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolView;
