import React from 'react';
import type { Category, Tool } from '../App';

// Import tool configs désormais externalisés
import nutritionalToolsConfig from './tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from './tool-configs/trainingToolsConfig';
import trackingToolsConfig from './tool-configs/trackingToolsConfig';
import generatorToolsConfig from './tool-configs/generatorToolsConfig';

interface ToolViewProps {
  category: Category;
  onToolSelect: (tool: Tool) => void;
}

/** 
 * Récupère la config d’outils adaptée à la catégorie.
 * On pourra facilement faire du code-splitting plus tard si besoin.
 */
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

const ToolView: React.FC<ToolViewProps> = ({ category, onToolSelect }) => {
  const tools = getToolsForCategory(category.id) as import('../App').Tool[];

  // Count implemented tools
  const implementedCount = tools.filter(tool => tool.component).length;
  const totalCount = tools.length;
  const completionPercentage = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Category Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full category-card ${category.color} mb-6`}>
          <i className={`fas ${category.icon} text-4xl text-white`}></i>
        </div>
        <h2 className="text-4xl font-bold mb-4">{category.name}</h2>
        <p className="text-xl text-muted-foreground mb-6">{category.description}</p>
        <div className="inline-flex items-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-full">
          <span className="font-semibold">{implementedCount}/{totalCount} outils disponibles ({completionPercentage}%)</span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div
            key={tool.id}
            className="tool-card slide-up cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onToolSelect(tool)}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center">
                  <i className={`fas ${tool.icon}`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{tool.name}</h3>
                  {tool.component && (
                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      <i className="fas fa-check-circle mr-1"></i>
                      Disponible
                    </span>
                  )}
                  {!tool.component && (
                    <span className="inline-flex items-center text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      <i className="fas fa-clock mr-1"></i>
                      Bientôt
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {tool.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                {tool.component ? 'Cliquez pour utiliser' : 'En développement'}
              </span>
              <i className="fas fa-arrow-right text-primary"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Status */}
      <div className="text-center mt-12 p-8 bg-gradient-primary text-white rounded-xl">
        <i className="fas fa-check-circle text-4xl mb-4"></i>
        <h3 className="text-2xl font-bold mb-2">Progression du Développement</h3>
        <div className="text-lg opacity-90 mb-4">
          {category.id === 'nutritional' && 
            `Phase 1 - Calculateurs Nutritionnels: 15/15 outils (100% complété)`
          }
          {category.id === 'training' && 
            `Phase 2 - Calculateurs d'Entraînement: ${implementedCount}/15 outils (${completionPercentage}% complété)`
          }
          {category.id !== 'nutritional' && category.id !== 'training' && 
            `Phase en cours d'implémentation.`
          }
        </div>
        <p className="opacity-75">
          Chaque outil intègre les dernières recherches scientifiques en nutrition et entraînement.
        </p>
      </div>
    </div>
  );
};

export default ToolView;
