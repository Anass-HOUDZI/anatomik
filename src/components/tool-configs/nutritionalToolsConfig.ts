
import type { Tool } from '../../App';
import BMRCalculator from '../calculators/BMRCalculator';
import MacroCalculator from '../calculators/MacroCalculator';
import HydrationCalculator from '../calculators/HydrationCalculator';
import ProteinCalculator from '../calculators/ProteinCalculator';
import BulkCalculator from '../calculators/BulkCalculator';
import CutCalculator from '../calculators/CutCalculator';
import GICalculator from '../calculators/GICalculator';
import TimingCalculator from '../calculators/TimingCalculator';
import SupplementsCalculator from '../calculators/SupplementsCalculator';
import OmegaCalculator from '../calculators/OmegaCalculator';
import FiberCalculator from '../calculators/FiberCalculator';
import SodiumCalculator from '../calculators/SodiumCalculator';
import VitaminsCalculator from '../calculators/VitaminsCalculator';
import MineralsCalculator from '../calculators/MineralsCalculator';
import NutrientDensityCalculator from '../calculators/NutrientDensityCalculator';

const nutritionalToolsConfig: Tool[] = [
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
];

export default nutritionalToolsConfig;
