
import React from 'react';
import { ArrowRight, Star, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Tool } from '../App';
import { ModernCard } from './ui/modern-card';

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

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="w-full">
        <div className="space-y-8">
          {/* Header Section - Simplified */}
          <div className="text-center space-y-6 p-4">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h2>
              <p className="text-xl text-gray-900 dark:text-white max-w-4xl mx-auto leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
          
          {/* Modern Tools Grid */}
          {tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
              {tools.map((tool) => (
                <ModernCard
                  key={tool.id}
                  variant="premium"
                  clickable={!!tool.component}
                  onClick={() => tool.component && onToolSelect(tool)}
                  glow={!!tool.component}
                  className={cn(
                    "min-h-[280px] transition-all duration-500",
                    tool.component 
                      ? "hover:scale-105 hover:-translate-y-2 cursor-pointer" 
                      : "opacity-75 cursor-not-allowed"
                  )}
                >
                  <div className="p-8 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm",
                        tool.component
                          ? "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-orange-100/80 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
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
                    
                    {/* Content */}
                    <p className="text-gray-900 dark:text-white leading-relaxed flex-1 mb-6 text-base">
                      {tool.description}
                    </p>
                    
                    {/* Footer */}
                    {tool.component ? (
                      <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            Outil premium
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                          <span className="text-sm font-medium">Utiliser</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    ) : (
                      <div className="pt-6 border-t border-border/50 text-center">
                        <span className="text-sm text-muted-foreground">
                          Cet outil sera bientôt disponible
                        </span>
                      </div>
                    )}
                  </div>
                </ModernCard>
              ))}
            </div>
          ) : (
            /* Loading/Empty State */
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Clock size={48} className="text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Outils en cours de développement</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
                Cette catégorie sera bientôt disponible avec tous ses outils professionnels.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolView;
