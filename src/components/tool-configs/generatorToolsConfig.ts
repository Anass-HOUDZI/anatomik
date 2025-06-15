
import type { Tool } from '../../App';
import WorkoutGenerator from '../generators/WorkoutGenerator';
import NutritionGenerator from '../generators/NutritionGenerator';
import MealPlannerGenerator from '../generators/MealPlannerGenerator';

const generatorToolsConfig: Tool[] = [
  {
    id: 'workout-generator',
    name: 'Générateur de Programmes',
    description: "Création de programmes d'entraînement personnalisés",
    category: 'generators',
    icon: 'fa-list-alt',
    component: WorkoutGenerator
  },
  {
    id: 'nutrition-generator',
    name: 'Générateur de Menus',
    description: 'Plans nutritionnels équilibrés selon vos besoins',
    category: 'generators',
    icon: 'fa-utensils',
    component: NutritionGenerator
  },
  {
    id: 'meal-planner',
    name: 'Planificateur de Repas',
    description: 'Organisation de vos repas pour la semaine',
    category: 'generators',
    icon: 'fa-calendar-week',
    component: MealPlannerGenerator
  },
  {
    id: 'exercise-generator',
    name: "Générateur d'Exercices",
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
    description: "Routines d'étirements et mobilité personnalisées",
    category: 'generators',
    icon: 'fa-spa'
  }
];

export default generatorToolsConfig;

