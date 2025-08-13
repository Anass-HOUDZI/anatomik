
import type { Tool } from '../../App';
import WeightTracker from '../trackers/WeightTracker';
import MeasurementsTracker from '../trackers/MeasurementsTracker';
import PerformanceTracker from '../trackers/PerformanceTracker';
import BodyCompositionTracker from '../trackers/BodyCompositionTracker';
import HydrationTracker from '../trackers/HydrationTracker';
import SleepTracker from '../trackers/SleepTracker';
import FatigueTracker from '../trackers/FatigueTracker';
import EnergyTracker from '../trackers/EnergyTracker';
import MotivationTracker from '../trackers/MotivationTracker';
import PhotoTracker from '../trackers/PhotoTracker';
import InjuryTracker from '../trackers/InjuryTracker';

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
    icon: 'fa-battery-quarter',
    component: FatigueTracker
  },
  {
    id: 'energy-tracker',
    name: 'Tracker d\'Énergie',
    description: 'Niveaux énergétiques quotidiens pour optimiser planning',
    category: 'tracking',
    icon: 'fa-bolt',
    component: EnergyTracker
  },
  {
    id: 'motivation-tracker',
    name: 'Tracker de Motivation',
    description: 'État psychologique et facteurs de motivation',
    category: 'tracking',
    icon: 'fa-heart',
    component: MotivationTracker
  },
  {
    id: 'photo-tracker',
    name: 'Tracker de Photos',
    description: 'Évolution physique visuelle avec photos progression',
    category: 'tracking',
    icon: 'fa-camera',
    component: PhotoTracker
  },
  {
    id: 'injury-tracker',
    name: 'Tracker de Blessures',
    description: 'Historique et prévention des blessures',
    category: 'tracking',
    icon: 'fa-band-aid',
    component: InjuryTracker
  }
];

export default trackingToolsConfig;
