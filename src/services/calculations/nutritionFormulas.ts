
import { Demographics, BMRResult, NutritionTargets } from '../../types';

// Formules scientifiques pour calculs nutritionnels
export class NutritionCalculations {
  
  // Calcul BMR avec différentes méthodes
  static calculateBMR(demographics: Demographics, method: 'harris_benedict' | 'mifflin_st_jeor' | 'katch_mcardle' = 'mifflin_st_jeor', bodyFatPercent?: number): BMRResult {
    const { age, gender, weight, height } = demographics;
    let bmr: number;
    let confidence: number;
    
    switch (method) {
      case 'harris_benedict':
        // Harris-Benedict révisée (1990)
        if (gender === 'M') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        confidence = 85;
        break;
        
      case 'mifflin_st_jeor':
        // Mifflin-St Jeor (plus précise pour populations modernes)
        if (gender === 'M') {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        confidence = 90;
        break;
        
      case 'katch_mcardle':
        // Katch-McArdle (nécessite % graisse corporelle)
        if (!bodyFatPercent) {
          throw new Error('Body fat percentage required for Katch-McArdle formula');
        }
        const leanMass = weight * (1 - bodyFatPercent / 100);
        bmr = 370 + (21.6 * leanMass);
        confidence = 95;
        break;
        
      default:
        throw new Error(`Unknown BMR calculation method: ${method}`);
    }
    
    // Calcul TDEE selon niveau d'activité
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * activityMultipliers[demographics.activityLevel];
    
    return {
      value: Math.round(bmr),
      unit: 'kcal/day',
      confidence,
      formula: method,
      tdee: Math.round(tdee),
      calorieAdjustment: {
        maintenance: Math.round(tdee),
        cutting: Math.round(tdee * 0.8), // -20%
        bulking: Math.round(tdee * 1.15)  // +15%
      },
      recommendations: [
        `BMR: ${Math.round(bmr)} kcal/jour`,
        `TDEE: ${Math.round(tdee)} kcal/jour`,
        `Pour maintenir: ${Math.round(tdee)} kcal`,
        `Pour perdre: ${Math.round(tdee * 0.8)} kcal (-20%)`,
        `Pour prendre: ${Math.round(tdee * 1.15)} kcal (+15%)`
      ]
    };
  }
  
  // Calcul besoins macronutriments
  static calculateMacroTargets(
    totalCalories: number, 
    goal: 'cutting' | 'bulking' | 'maintenance',
    weight: number,
    activityLevel: string
  ): NutritionTargets {
    let proteinRatio: number;
    let fatRatio: number;
    let carbRatio: number;
    
    // Ratios selon objectif
    switch (goal) {
      case 'cutting':
        proteinRatio = 0.35; // Plus de protéines pour préserver muscle
        fatRatio = 0.25;
        carbRatio = 0.40;
        break;
      case 'bulking':
        proteinRatio = 0.25;
        fatRatio = 0.25;
        carbRatio = 0.50; // Plus de glucides pour énergie
        break;
      default: // maintenance
        proteinRatio = 0.30;
        fatRatio = 0.25;
        carbRatio = 0.45;
    }
    
    // Calculs en grammes (4 kcal/g protéines/glucides, 9 kcal/g lipides)
    const proteinGrams = (totalCalories * proteinRatio) / 4;
    const fatGrams = (totalCalories * fatRatio) / 9;
    const carbGrams = (totalCalories * carbRatio) / 4;
    
    // Besoins en eau (35ml/kg + activité)
    const baseWater = weight * 35;
    const activityBonus = activityLevel === 'active' || activityLevel === 'very_active' ? 500 : 0;
    
    return {
      calories: totalCalories,
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
      water: baseWater + activityBonus
    };
  }
  
  // Calcul besoins protéines selon objectif
  static calculateProteinNeeds(weight: number, goal: string, activityLevel: string): number {
    // Besoins en g/kg selon littérature scientifique
    const baseNeeds = {
      sedentary: 0.8,
      light: 1.2,
      moderate: 1.6,
      active: 2.0,
      very_active: 2.4
    };
    
    let multiplier = baseNeeds[activityLevel as keyof typeof baseNeeds] || 1.6;
    
    // Ajustement selon objectif
    if (goal === 'cutting') {
      multiplier *= 1.2; // +20% en sèche pour préserver muscle
    } else if (goal === 'bulking') {
      multiplier *= 1.1; // +10% en prise de masse
    }
    
    return Math.round(weight * multiplier);
  }
  
  // Calcul besoins hydratation
  static calculateHydrationNeeds(
    weight: number, 
    activityLevel: string, 
    climate: 'temperate' | 'hot' | 'cold' = 'temperate',
    exerciseDuration: number = 0 // minutes
  ): number {
    // Base: 35ml/kg
    let waterNeeds = weight * 35;
    
    // Ajustement activité
    const activityBonus = {
      sedentary: 0,
      light: 300,
      moderate: 500,
      active: 700,
      very_active: 1000
    };
    
    waterNeeds += activityBonus[activityLevel as keyof typeof activityBonus] || 500;
    
    // Ajustement climat
    if (climate === 'hot') waterNeeds *= 1.2;
    if (climate === 'cold') waterNeeds *= 0.95;
    
    // Ajustement exercice (150ml par 15min d'exercice)
    waterNeeds += (exerciseDuration / 15) * 150;
    
    return Math.round(waterNeeds);
  }
  
  // Calcul index glycémique d'un repas
  static calculateMealGI(foods: Array<{ gi: number; carbGrams: number }>): number {
    const totalCarbs = foods.reduce((sum, food) => sum + food.carbGrams, 0);
    
    if (totalCarbs === 0) return 0;
    
    const weightedGI = foods.reduce((sum, food) => {
      return sum + (food.gi * food.carbGrams);
    }, 0);
    
    return Math.round(weightedGI / totalCarbs);
  }
  
  // Calcul charge glycémique
  static calculateGlycemicLoad(gi: number, carbGrams: number): number {
    return Math.round((gi * carbGrams) / 100);
  }
  
  // Validation des inputs
  static validateDemographics(demographics: Demographics): string[] {
    const errors: string[] = [];
    
    if (demographics.age < 16 || demographics.age > 80) {
      errors.push('L\'âge doit être entre 16 et 80 ans');
    }
    
    if (demographics.weight < 40 || demographics.weight > 200) {
      errors.push('Le poids doit être entre 40 et 200 kg');
    }
    
    if (demographics.height < 140 || demographics.height > 220) {
      errors.push('La taille doit être entre 140 et 220 cm');
    }
    
    return errors;
  }
}
