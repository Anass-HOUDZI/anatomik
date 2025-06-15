
import React from 'react';
import type { Category, Tool } from '../App';
import BMRCalculator from './calculators/BMRCalculator';
import MacroCalculator from './calculators/MacroCalculator';
import OneRMCalculator from './calculators/OneRMCalculator';

interface ToolViewProps {
  category: Category;
  onToolSelect: (tool: Tool) => void;
}

// Configuration des outils par catégorie
const toolsConfig: Record<string, Tool[]> = {
  nutritional: [
    {
      id: 'bmr-calculator',
      name: 'Calculateur BMR',
      description: 'Calculez votre métabolisme de base et vos besoins caloriques quotidiens',
      category: 'nutritional',
      icon: 'fa-fire',
      component: BMRCalculator
    },
    {
      id: 'macro-calculator',
      name: 'Calculateur de Macros',
      description: 'Répartition optimale protéines/glucides/lipides selon vos objectifs',
      category: 'nutritional',
      icon: 'fa-pie-chart',
      component: MacroCalculator
    },
    {
      id: 'bulk-calculator',
      name: 'Calculateur de Prise de Masse',
      description: 'Surplus calorique optimal pour une prise de masse propre',
      category: 'nutritional',
      icon: 'fa-plus-circle'
    },
    {
      id: 'cut-calculator',
      name: 'Calculateur de Sèche',
      description: 'Déficit calorique progressif pour perdre du gras en préservant le muscle',
      category: 'nutritional',
      icon: 'fa-minus-circle'
    },
    {
      id: 'hydration-calculator',
      name: 'Calculateur d\'Hydratation',
      description: 'Besoins en eau selon votre poids et niveau d\'activité',
      category: 'nutritional',
      icon: 'fa-tint'
    }
  ],
  training: [
    {
      id: 'one-rm-calculator',
      name: 'Calculateur 1RM',
      description: 'Estimez votre force maximale théorique sur un mouvement',
      category: 'training',
      icon: 'fa-weight-hanging',
      component: OneRMCalculator
    },
    {
      id: 'load-calculator',
      name: 'Calculateur de Charges',
      description: 'Pourcentages d\'entraînement basés sur votre 1RM',
      category: 'training',
      icon: 'fa-percent'
    },
    {
      id: 'volume-calculator',
      name: 'Calculateur de Volume',
      description: 'Volume total d\'entraînement (Sets × Reps × Poids)',
      category: 'training',
      icon: 'fa-calculator'
    },
    {
      id: 'progression-calculator',
      name: 'Calculateur de Progression',
      description: 'Planification de la surcharge progressive',
      category: 'training',
      icon: 'fa-arrow-up'
    },
    {
      id: 'rest-calculator',
      name: 'Calculateur de Repos',
      description: 'Temps de récupération optimal selon l\'intensité',
      category: 'training',
      icon: 'fa-clock'
    }
  ],
  tracking: [
    {
      id: 'weight-tracker',
      name: 'Tracker de Poids',
      description: 'Suivez l\'évolution de votre poids corporel avec graphiques',
      category: 'tracking',
      icon: 'fa-weight'
    },
    {
      id: 'measurements-tracker',
      name: 'Tracker de Mensurations',
      description: 'Évolution de vos mensurations corporelles',
      category: 'tracking',
      icon: 'fa-ruler'
    },
    {
      id: 'performance-tracker',
      name: 'Tracker de Performance',
      description: 'Progression de vos charges d\'entraînement',
      category: 'tracking',
      icon: 'fa-chart-bar'
    },
    {
      id: 'body-composition-tracker',
      name: 'Tracker de Composition',
      description: 'Évolution de votre masse grasse et masse maigre',
      category: 'tracking',
      icon: 'fa-user'
    },
    {
      id: 'hydration-tracker',
      name: 'Tracker d\'Hydratation',
      description: 'Suivi quotidien de votre consommation d\'eau',
      category: 'tracking',
      icon: 'fa-glass-water'
    }
  ],
  generators: [
    {
      id: 'workout-generator',
      name: 'Générateur de Programmes',
      description: 'Création de programmes d\'entraînement personnalisés',
      category: 'generators',
      icon: 'fa-list-alt'
    },
    {
      id: 'nutrition-generator',
      name: 'Générateur de Menus',
      description: 'Plans nutritionnels équilibrés selon vos besoins',
      category: 'generators',
      icon: 'fa-utensils'
    },
    {
      id: 'meal-planner',
      name: 'Planificateur de Repas',
      description: 'Organisation de vos repas pour la semaine',
      category: 'generators',
      icon: 'fa-calendar-week'
    },
    {
      id: 'exercise-generator',
      name: 'Générateur d\'Exercices',
      description: 'Alternatives d\'exercices par groupe musculaire',
      category: 'generators',
      icon: 'fa-random'
    },
    {
      id: 'periodization-planner',
      name: 'Planificateur de Périodes',
      description: 'Cycles de masse, sèche et maintien',
      category: 'generators',
      icon: 'fa-calendar-alt'
    }
  ]
};

const ToolView: React.FC<ToolViewProps> = ({ category, onToolSelect }) => {
  const tools = toolsConfig[category.id] || [];

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
          <span className="font-semibold">{tools.length} outils disponibles</span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div
            key={tool.id}
            className="tool-card slide-up"
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
                    <span className="inline-flex items-center text-xs bg-success text-white px-2 py-1 rounded-full">
                      <i className="fas fa-check-circle mr-1"></i>
                      Disponible
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {tool.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-custom">
              <span className="text-sm text-muted-foreground">
                {tool.component ? 'Cliquez pour utiliser' : 'Bientôt disponible'}
              </span>
              <i className="fas fa-arrow-right text-primary"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center mt-12 p-8 bg-gradient-primary text-white rounded-xl">
        <i className="fas fa-rocket text-4xl mb-4"></i>
        <h3 className="text-2xl font-bold mb-2">Plus d'outils en cours de développement</h3>
        <p className="text-lg opacity-90">
          Tous les 60 outils seront progressivement ajoutés. Revenez bientôt pour découvrir les nouveautés !
        </p>
      </div>
    </div>
  );
};

export default ToolView;
