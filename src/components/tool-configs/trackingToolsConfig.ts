
import type { Tool } from '../../App';
import WeightTracker from '../trackers/WeightTracker';
import MeasurementsTracker from '../trackers/MeasurementsTracker';
import PerformanceTracker from '../trackers/PerformanceTracker';
import BodyCompositionTracker from '../trackers/BodyCompositionTracker';
import HydrationTracker from '../trackers/HydrationTracker';
import SleepTracker from '../trackers/SleepTracker';

const trackingToolsConfig: Tool[] = [
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
    icon: 'fa-chart-bar',
    component: PerformanceTracker
  },
  {
    id: 'body-composition-tracker',
    name: 'Tracker de Composition',
    description: 'Évolution de votre masse grasse et masse maigre',
    category: 'tracking',
    icon: 'fa-user',
    component: BodyCompositionTracker
  },
  {
    id: 'hydration-tracker',
    name: 'Tracker d\'Hydratation',
    description: 'Suivi quotidien de votre consommation d\'eau',
    category: 'tracking',
    icon: 'fa-glass-water',
    component: HydrationTracker
  },
  {
    id: 'sleep-tracker',
    name: 'Tracker de Sommeil',
    description: 'Impact du sommeil sur votre récupération',
    category: 'tracking',
    icon: 'fa-bed',
    component: SleepTracker
  },
  {
    id: 'fatigue-tracker',
    name: 'Tracker de Fatigue',
    description: 'Échelle de perception de l\'effort et fatigue',
    category: 'tracking',
    icon: 'fa-battery-quarter'
  }
];

export default trackingToolsConfig;
