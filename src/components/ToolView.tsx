
import React from 'react';
import { Clock, CheckCircle2, ArrowRight, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Tool } from '../App';
import { Card, CardContent } from './ui/card';

// Import real tool configurations
import nutritionalToolsConfig from './tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from './tool-configs/trainingToolsConfig';
import trackingToolsConfig from './tool-configs/trackingToolsConfig';
import generatorToolsConfig from './tool-configs/generatorToolsConfig';

const getToolsForCategory = (categoryId: string): Tool[] => {
  try {
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
  } catch (error) {
    console.error('Erreur lors du chargement des outils:', error);
    return [];
  }
};

interface ToolViewProps {
  category: Category;
  onToolSelect: (tool: Tool) => void;
}

const ToolView: React.FC<ToolViewProps> = ({ category, onToolSelect }) => {
  const tools = getToolsForCategory(category.id);
  const implementedCount = tools.filter(tool => tool.component).length;
  const totalCount = tools.length;
  const progressPercentage = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            {category.name}
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>
        
        {/* Progress Section */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-1000 ease-out",
                `gradient-card-${category.color}`
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="font-medium text-foreground">{implementedCount} outils disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-orange-500" />
              <span className="font-medium text-foreground">{totalCount - implementedCount} en développement</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className={cn(
                "cursor-pointer transition-all duration-300 group relative overflow-hidden",
                tool.component 
                  ? "hover:scale-105 hover:shadow-xl border-primary/20" 
                  : "opacity-75 cursor-not-allowed"
              )}
              onClick={() => tool.component && onToolSelect(tool)}
            >
              <CardContent className="p-8 h-full flex flex-col min-h-[200px]">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-foreground leading-tight group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
                    tool.component
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                  )}>
                    {tool.component ? (
                      <div className="flex items-center gap-1">
                        <Zap size={12} />
                        Disponible
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        Bientôt
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed flex-1 mb-6">
                  {tool.description}
                </p>
                
                {tool.component ? (
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Outil premium
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">Utiliser</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-border text-center">
                    <span className="text-sm text-muted-foreground">
                      Cet outil sera bientôt disponible
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Loading/Empty State */
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
            <Clock size={48} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Outils en cours de développement</h3>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Cette catégorie sera bientôt disponible avec tous ses outils professionnels.
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolView;
