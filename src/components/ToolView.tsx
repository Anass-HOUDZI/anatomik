import React from 'react';
import type { Category, Tool } from '../App';
import BMRCalculator from './calculators/BMRCalculator';
import MacroCalculator from './calculators/MacroCalculator';
import OneRMCalculator from './calculators/OneRMCalculator';
import HydrationCalculator from './calculators/HydrationCalculator';
import ProteinCalculator from './calculators/ProteinCalculator';
import BulkCalculator from './calculators/BulkCalculator';
import CutCalculator from './calculators/CutCalculator';
import GICalculator from './calculators/GICalculator';
import TimingCalculator from './calculators/TimingCalculator';
import SupplementsCalculator from './calculators/SupplementsCalculator';
import FiberCalculator from './calculators/FiberCalculator';
import SodiumCalculator from './calculators/SodiumCalculator';
import OmegaCalculator from './calculators/OmegaCalculator';
import VitaminsCalculator from './calculators/VitaminsCalculator';
import MineralsCalculator from './calculators/MineralsCalculator';
import NutrientDensityCalculator from './calculators/NutrientDensityCalculator';
import LoadCalculator from './calculators/LoadCalculator';
import VolumeCalculator from './calculators/VolumeCalculator';
import ProgressionCalculator from './calculators/ProgressionCalculator';
import RestCalculator from './calculators/RestCalculator';
import FrequencyCalculator from './calculators/FrequencyCalculator';
import PeriodizationCalculator from './calculators/PeriodizationCalculator';
import RMZoneCalculator from './calculators/RMZoneCalculator';
import TempoCalculator from './calculators/TempoCalculator';
import DropSetsCalculator from './calculators/DropSetsCalculator';
import SupersetCalculator from './calculators/SupersetCalculator';
import CircuitCalculator from './calculators/CircuitCalculator';
import HIITCalculator from './calculators/HIITCalculator';
import RecoveryCalculator from './calculators/RecoveryCalculator';
import DeloadCalculator from './calculators/DeloadCalculator';
import WeightTracker from './trackers/WeightTracker';
import MeasurementsTracker from './trackers/MeasurementsTracker';

interface ToolViewProps {
  category: Category;
  onToolSelect: (tool: Tool) => void;
}

// Configuration des outils par catégorie avec tous les calculateurs
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
      id: 'hydration-calculator',
      name: 'Calculateur d\'Hydratation',
      description: 'Besoins en eau selon votre poids et niveau d\'activité',
      category: 'nutritional',
      icon: 'fa-tint',
      component: HydrationCalculator
    },
    {
      id: 'protein-calculator',
      name: 'Calculateur de Protéines',
      description: 'Besoins protéiques selon vos objectifs et poids corporel',
      category: 'nutritional',
      icon: 'fa-drumstick-bite',
      component: ProteinCalculator
    },
    {
      id: 'bulk-calculator',
      name: 'Calculateur de Prise de Masse',
      description: 'Surplus calorique optimal pour une prise de masse propre',
      category: 'nutritional',
      icon: 'fa-plus-circle',
      component: BulkCalculator
    },
    {
      id: 'cut-calculator',
      name: 'Calculateur de Sèche',
      description: 'Déficit calorique progressif pour perdre du gras en préservant le muscle',
      category: 'nutritional',
      icon: 'fa-minus-circle',
      component: CutCalculator
    },
    {
      id: 'gi-calculator',
      name: 'Calculateur d\'Index Glycémique',
      description: 'Impact des glucides sur votre glycémie et énergie',
      category: 'nutritional',
      icon: 'fa-chart-line',
      component: GICalculator
    },
    {
      id: 'timing-calculator',
      name: 'Calculateur de Timing Nutritionnel',
      description: 'Optimisez le timing de vos nutriments pré/post entraînement',
      category: 'nutritional',
      icon: 'fa-clock',
      component: TimingCalculator
    },
    {
      id: 'supplements-calculator',
      name: 'Calculateur de Suppléments',
      description: 'Dosages recommandés selon vos besoins et objectifs',
      category: 'nutritional',
      icon: 'fa-pills',
      component: SupplementsCalculator
    },
    {
      id: 'omega-calculator',
      name: 'Calculateur Oméga 3/6',
      description: 'Équilibre optimal des acides gras essentiels',
      category: 'nutritional',
      icon: 'fa-fish',
      component: OmegaCalculator
    },
    {
      id: 'fiber-calculator',
      name: 'Calculateur de Fibres',
      description: 'Besoins en fibres pour santé digestive et satiété optimales',
      category: 'nutritional',
      icon: 'fa-seedling',
      component: FiberCalculator
    },
    {
      id: 'sodium-calculator',
      name: 'Calculateur de Sodium',
      description: 'Gestion du sodium pour pression artérielle et définition musculaire',
      category: 'nutritional',
      icon: 'fa-balance-scale',
      component: SodiumCalculator
    },
    {
      id: 'vitamins-calculator',
      name: 'Calculateur de Vitamines',
      description: 'Apports journaliers recommandés selon votre profil',
      category: 'nutritional',
      icon: 'fa-prescription-bottle',
      component: VitaminsCalculator
    },
    {
      id: 'minerals-calculator',
      name: 'Calculateur de Minéraux',
      description: 'Fer, calcium, magnésium optimisés pour sportifs',
      category: 'nutritional',
      icon: 'fa-gem',
      component: MineralsCalculator
    },
    {
      id: 'nutrient-density-calculator',
      name: 'Calculateur de Densité Nutritionnelle',
      description: 'Score qualité nutritionnelle des aliments par calorie',
      category: 'nutritional',
      icon: 'fa-star',
      component: NutrientDensityCalculator
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
      icon: 'fa-percent',
      component: LoadCalculator
    },
    {
      id: 'volume-calculator',
      name: 'Calculateur de Volume',
      description: 'Volume total d\'entraînement (Sets × Reps × Poids)',
      category: 'training',
      icon: 'fa-calculator',
      component: VolumeCalculator
    },
    {
      id: 'progression-calculator',
      name: 'Calculateur de Progression',
      description: 'Planification de la surcharge progressive',
      category: 'training',
      icon: 'fa-arrow-up',
      component: ProgressionCalculator
    },
    {
      id: 'rest-calculator',
      name: 'Calculateur de Repos',
      description: 'Temps de récupération optimal selon l\'intensité',
      category: 'training',
      icon: 'fa-clock',
      component: RestCalculator
    },
    {
      id: 'frequency-calculator',
      name: 'Calculateur de Fréquence',
      description: 'Nombre optimal de séances par groupe musculaire',
      category: 'training',
      icon: 'fa-calendar-week',
      component: FrequencyCalculator
    },
    {
      id: 'periodization-calculator',
      name: 'Calculateur de Périodisation',
      description: 'Planification des cycles d\'entraînement long terme',
      category: 'training',
      icon: 'fa-sync-alt',
      component: PeriodizationCalculator
    },
    {
      id: 'rm-zone-calculator',
      name: 'Calculateur RM par Zone',
      description: 'Calculs 3RM, 5RM, 10RM selon vos objectifs',
      category: 'training',
      icon: 'fa-layer-group',
      component: RMZoneCalculator
    },
    {
      id: 'tempo-calculator',
      name: 'Calculateur de Tempo',
      description: 'Vitesse d\'exécution optimale selon vos objectifs',
      category: 'training',
      icon: 'fa-stopwatch',
      component: TempoCalculator
    },
    {
      id: 'drop-sets-calculator',
      name: 'Calculateur de Drop Sets',
      description: 'Séries dégressives automatisées pour intensification',
      category: 'training',
      icon: 'fa-level-down-alt',
      component: DropSetsCalculator
    },
    {
      id: 'superset-calculator',
      name: 'Calculateur de Superset',
      description: 'Combinaisons d\'exercices enchaînés optimales',
      category: 'training',
      icon: 'fa-link',
      component: SupersetCalculator
    },
    {
      id: 'circuit-calculator',
      name: 'Calculateur de Circuit',
      description: 'Entraînement en stations avec timing précis',
      category: 'training',
      icon: 'fa-route',
      component: CircuitCalculator
    },
    {
      id: 'hiit-calculator',
      name: 'Calculateur HIIT',
      description: 'Intervalles haute intensité personnalisés',
      category: 'training',
      icon: 'fa-running',
      component: HIITCalculator
    },
    {
      id: 'recovery-calculator',
      name: 'Calculateur de Récupération',
      description: 'Temps de repos entre séances selon fatigue',
      category: 'training',
      icon: 'fa-bed',
      component: RecoveryCalculator
    },
    {
      id: 'deload-calculator',
      name: 'Calculateur de Deload',
      description: 'Semaines de décharge programmées pour surcompensation',
      category: 'training',
      icon: 'fa-pause',
      component: DeloadCalculator
    }
  ],
  tracking: [
    {
      id: 'weight-tracker',
      name: 'Tracker de Poids',
      description: 'Suivez l\'évolution de votre poids corporel avec graphiques',
      category: 'tracking',
      icon: 'fa-weight',
      component: WeightTracker
    },
    {
      id: 'measurements-tracker',
      name: 'Tracker de Mensurations',
      description: 'Évolution de vos mensurations corporelles',
      category: 'tracking',
      icon: 'fa-ruler',
      component: MeasurementsTracker
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
    },
    {
      id: 'sleep-tracker',
      name: 'Tracker de Sommeil',
      description: 'Impact du sommeil sur votre récupération',
      category: 'tracking',
      icon: 'fa-bed'
    },
    {
      id: 'fatigue-tracker',
      name: 'Tracker de Fatigue',
      description: 'Échelle de perception de l\'effort et fatigue',
      category: 'tracking',
      icon: 'fa-battery-quarter'
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
    },
    {
      id: 'recovery-planner',
      name: 'Planificateur de Récupération',
      description: 'Routines d\'étirements et mobilité personnalisées',
      category: 'generators',
      icon: 'fa-spa'
    }
  ]
};

const ToolView: React.FC<ToolViewProps> = ({ category, onToolSelect }) => {
  const tools = toolsConfig[category.id] || [];

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
