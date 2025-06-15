
// Types principaux pour FitMASTER PRO
export interface Demographics {
  age: number;
  gender: 'M' | 'F';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface FitnessGoals {
  primary: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance';
  timeline: number; // weeks
  targetWeight?: number;
  specificGoals: string[];
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface AppSettings {
  autoSave: boolean;
  dataRetention: number; // days
  exportFormat: 'pdf' | 'csv' | 'json';
  privacyMode: boolean;
}

export interface UserProfile {
  id: string;
  demographics: Demographics;
  goals: FitnessGoals;
  preferences: UserPreferences;
  settings: AppSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Types nutritionnels
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  macros: MacroNutrients;
  micros: MicroNutrients;
  source: 'usda' | 'openfoodfacts' | 'nutritionix' | 'local';
}

export interface MacroNutrients {
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  sugar: number; // g
}

export interface MicroNutrients {
  sodium: number; // mg
  potassium: number; // mg
  calcium: number; // mg
  iron: number; // mg
  vitaminC: number; // mg
  vitaminD: number; // IU
  [key: string]: number;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // ml
}

export interface DailyNutrition {
  date: string;
  meals: Meal[];
  totals: MacroNutrients & { calories: number };
  targets: NutritionTargets;
  compliance: number; // 0-100%
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: FoodEntry[];
  totals: MacroNutrients & { calories: number };
}

export interface FoodEntry {
  food: FoodItem;
  quantity: number;
  unit: string;
}

// Types entraînement
export interface Exercise {
  id: string;
  name: string;
  category: 'compound' | 'isolation';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion
  rest: number; // seconds
  notes?: string;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
  oneRm?: number;
  volume: number; // sets × reps × weight
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: WorkoutExercise[];
  duration: number; // minutes
  notes?: string;
  rating?: number; // 1-10
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration: number; // weeks
  frequency: number; // sessions per week
  level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  sessions: WorkoutSession[];
}

// Types tracking
export interface ProgressMetrics {
  weight: DataPoint[];
  bodyFat?: DataPoint[];
  measurements: { [bodyPart: string]: DataPoint[] };
  performance: { [exercise: string]: DataPoint[] };
  photos?: ProgressPhoto[];
}

export interface DataPoint {
  date: string;
  value: number;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  type: 'front' | 'back' | 'side';
  url: string; // base64 or blob URL
  notes?: string;
}

// Types calculateurs
export interface CalculationResult {
  value: number;
  unit: string;
  confidence: number; // 0-100%
  formula: string;
  recommendations?: string[];
  warnings?: string[];
}

export interface BMRResult extends CalculationResult {
  method: 'harris_benedict' | 'mifflin_st_jeor' | 'katch_mcardle';
  tdee: number;
  calorieAdjustment: {
    maintenance: number;
    cutting: number;
    bulking: number;
  };
}

// Types APIs
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  timestamp: Date;
}

export interface NutritionAPIFood {
  fdcId?: number; // USDA
  code?: string; // Open Food Facts
  nix_item_id?: string; // Nutritionix
  name: string;
  nutrients: { [key: string]: number };
  servingSize: number;
  servingUnit: string;
}
