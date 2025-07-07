
import React from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Tool } from '../App';
import { EnhancedCard } from './ui/enhanced-card';
import { ProgressIndicator } from './ui/progress-indicator';

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

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {category.name}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
            {category.description}
          </p>
        </div>
        
        {/* Progress Section */}
        <div className="max-w-md mx-auto">
          <ProgressIndicator
            current={implementedCount}
            total={totalCount}
            variant="line"
            className="mb-4"
            color="primary"
          />
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>{implementedCount} disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-500" />
              <span>{totalCount - implementedCount} en développement</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, idx) => (
          <EnhancedCard
            key={tool.id}
            variant="hover-lift"
            clickable={!!tool.component}
            onClick={() => tool.component && onToolSelect(tool)}
            className={cn(
              'min-h-[240px] p-6 group transition-all duration-300',
              !tool.component && 'opacity-75 cursor-not-allowed'
            )}
            style={{ animationDelay: `${idx * 0.05}s` }}
            badge={
              <div className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold',
                tool.component
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
              )}>
                {tool.component ? 'Disponible' : 'Bientôt'}
              </div>
            }
          >
            <div className="space-y-4 h-full flex flex-col">
              {/* Title */}
              <h3 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
                {tool.name}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {tool.description}
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className={cn(
                  'text-xs font-medium px-3 py-1 rounded-full',
                  tool.component
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {tool.component ? 'Cliquez pour utiliser' : 'En développement'}
                </span>
                {tool.component && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-200">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Empty State */}
      {tools.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Clock size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Outils en cours de développement
          </h3>
          <p className="text-muted-foreground">
            Cette catégorie sera bientôt disponible avec tous ses outils.
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolView;
