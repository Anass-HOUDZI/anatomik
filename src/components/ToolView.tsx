
import React from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Tool } from '../App';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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

interface ToolViewProps {
  category: Category;
  onToolSelect: (tool: Tool) => void;
}

const ToolView: React.FC<ToolViewProps> = ({ category, onToolSelect }) => {
  const tools = getToolsForCategory(category.id) as Tool[];
  const implementedCount = tools.filter(tool => tool.component).length;
  const totalCount = tools.length;
  const progressPercentage = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          {category.name}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {category.description}
        </p>
        
        {/* Progress Section */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-muted-foreground">{implementedCount} disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-500" />
              <span className="text-muted-foreground">{totalCount - implementedCount} en développement</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-lg",
              tool.component 
                ? "hover:scale-105 hover:border-primary/50" 
                : "opacity-75 cursor-not-allowed"
            )}
            onClick={() => tool.component && onToolSelect(tool)}
          >
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-foreground leading-tight">
                    {tool.name}
                  </h3>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  tool.component
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                )}>
                  {tool.component ? 'Disponible' : 'Bientôt'}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                {tool.description}
              </p>
              
              {tool.component && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-primary font-medium">
                    Cliquez pour utiliser
                  </span>
                  <ArrowRight size={16} className="text-primary" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {tools.length === 0 && (
        <div className="text-center py-16">
          <Clock size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Outils en cours de développement</h3>
          <p className="text-muted-foreground">
            Cette catégorie sera bientôt disponible avec tous ses outils.
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolView;
