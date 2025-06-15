
import type { Tool } from '../../App';
import OneRMCalculator from '../calculators/OneRMCalculator';
import LoadCalculator from '../calculators/LoadCalculator';
import VolumeCalculator from '../calculators/VolumeCalculator';
import ProgressionCalculator from '../calculators/ProgressionCalculator';
import RestCalculator from '../calculators/RestCalculator';
import FrequencyCalculator from '../calculators/FrequencyCalculator';
import PeriodizationCalculator from '../calculators/PeriodizationCalculator';
import RMZoneCalculator from '../calculators/RMZoneCalculator';
import TempoCalculator from '../calculators/TempoCalculator';
import DropSetsCalculator from '../calculators/DropSetsCalculator';
import SupersetCalculator from '../calculators/SupersetCalculator';
import CircuitCalculator from '../calculators/CircuitCalculator';
import HIITCalculator from '../calculators/HIITCalculator';
import RecoveryCalculator from '../calculators/RecoveryCalculator';
import DeloadCalculator from '../calculators/DeloadCalculator';

const trainingToolsConfig: Tool[] = [
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
];

export default trainingToolsConfig;
