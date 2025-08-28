// Types stricts pour le tracking

export interface DataPoint {
  date: string;
  value: number;
  notes?: string;
}

export interface WeightEntry extends DataPoint {
  bodyFat?: number;
  muscleMass?: number;
}

export interface MeasurementEntry extends DataPoint {
  bodyPart: string;
}

export interface SleepEntry {
  date: string;
  bedtime: string;
  wakeup: string;
  duration: number;
  quality: number;
  notes?: string;
}

export interface FatigueEntry {
  date: string;
  fatigue: number;
  soreness: number;
  motivation: number;
  notes?: string;
}

export interface HydrationEntry {
  date: string;
  value: number;
  unit: string;
  temperature?: number;
  activity?: string;
}

export interface EnergyEntry {
  date: string;
  morning: number;
  afternoon: number;
  evening: number;
  overall: number;
  notes?: string;
}

export interface MotivationEntry {
  date: string;
  motivation: number;
  confidence: number;
  stress: number;
  mood: number;
  notes?: string;
}

export interface InjuryEntry {
  id: string;
  date: string;
  type: 'acute' | 'chronic' | 'recurring';
  severity: number;
  bodyPart: string;
  description: string;
  treatment?: string;
  recoveryDate?: string;
  status: 'active' | 'recovering' | 'recovered';
}

export interface PerformanceEntry {
  date: string;
  exercise: string;
  value: number;
  unit: string;
  notes?: string;
  rpe?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
    rpe?: number;
    rest?: number;
  }>;
  notes?: string;
}

export interface WorkoutEntry {
  id: string;
  date: string;
  name: string;
  duration: number;
  exercises: WorkoutExercise[];
  notes?: string;
  rating?: number;
}

export interface NutritionEntry {
  date: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  meals: Array<{
    name: string;
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
  }>;
}

export interface TrackingData {
  weight: WeightEntry[];
  measurements: Record<string, MeasurementEntry[]>;
  workouts: WorkoutEntry[];
  nutrition: NutritionEntry[];
  hydration: HydrationEntry[];
  performance: Record<string, PerformanceEntry[]>;
  bodyFat: DataPoint[];
  sleep: SleepEntry[];
  fatigue: FatigueEntry[];
  energy: EnergyEntry[];
  motivation: MotivationEntry[];
  injuries: InjuryEntry[];
}