import React, { useState } from 'react';

const MacroCalculator = () => {
  const [weight, setWeight] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extraActive'>('sedentary');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [proteinRatio, setProteinRatio] = useState(0.3);
  const [fatRatio, setFatRatio] = useState(0.3);
  const [calculatedMacros, setCalculatedMacros] = useState<{ protein: number; carbs: number; fat: number; calories: number } | null>(null);

  const calculateMacros = () => {
    if (!weight) {
      alert("Veuillez entrer votre poids.");
      return;
    }

    // Step 1: Calculate BMR (Basal Metabolic Rate)
    // Using Mifflin-St Jeor equation
    const bmr = 10 * weight + 6.25 * 175 - 5 * 30 - 161; // Assuming height is 175cm and age is 30, and female

    // Step 2: Adjust for Activity Level
    let activityFactor;
    switch (activityLevel) {
      case 'sedentary': activityFactor = 1.2; break;
      case 'lightlyActive': activityFactor = 1.375; break;
      case 'moderatelyActive': activityFactor = 1.55; break;
      case 'veryActive': activityFactor = 1.725; break;
      case 'extraActive': activityFactor = 1.9; break;
      default: activityFactor = 1.2;
    }

    const dailyCalories = bmr * activityFactor;

    // Step 3: Adjust for Goal
    let calorieAdjustment;
    switch (goal) {
      case 'lose': calorieAdjustment = -500; break;
      case 'gain': calorieAdjustment = 300; break;
      default: calorieAdjustment = 0;
    }

    const adjustedCalories = dailyCalories + calorieAdjustment;

    // Step 4: Calculate Macros
    const proteinCalories = adjustedCalories * proteinRatio;
    const fatCalories = adjustedCalories * fatRatio;
    const carbCalories = adjustedCalories - proteinCalories - fatCalories;

    const proteinGrams = proteinCalories / 4;
    const fatGrams = fatCalories / 9;
    const carbGrams = carbCalories / 4;

    setCalculatedMacros({
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
      calories: Math.round(adjustedCalories),
    });
  };

  return (
    <div className="calculator-container">
      <h2 className="text-2xl font-bold mb-2 text-[#111] drop-shadow-none" style={{textShadow: "none"}}>Calculateur de Macronutriments</h2>
      <p className="text-base mb-4 text-[#222] font-medium" style={{color:'#222', background:'none'}}>Déterminez précisément vos besoins en protéines, glucides, lipides selon vos objectifs et habitudes alimentaires.</p>
      
      <div className="input-group-custom">
        <label htmlFor="weight">Poids (kg):</label>
        <input
          type="number"
          id="weight"
          className="form-control-custom"
          value={weight === null ? '' : weight.toString()}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />
      </div>

      <div className="input-group-custom">
        <label htmlFor="activityLevel">Niveau d'activité:</label>
        <select
          id="activityLevel"
          className="form-control-custom"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extraActive')}
        >
          <option value="sedentary">Sédentaire</option>
          <option value="lightlyActive">Légèrement actif</option>
          <option value="moderatelyActive">Modérément actif</option>
          <option value="veryActive">Très actif</option>
          <option value="extraActive">Extrêmement actif</option>
        </select>
      </div>

      <div className="input-group-custom">
        <label htmlFor="goal">Objectif:</label>
        <select
          id="goal"
          className="form-control-custom"
          value={goal}
          onChange={(e) => setGoal(e.target.value as 'lose' | 'maintain' | 'gain')}
        >
          <option value="lose">Perdre du poids</option>
          <option value="maintain">Maintenir le poids</option>
          <option value="gain">Gagner du poids</option>
        </select>
      </div>

      <div className="input-group-custom">
        <label>Ratio des macronutriments:</label>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="proteinRatio">Protéines (%):</label>
            <input
              type="number"
              id="proteinRatio"
              className="form-control-custom"
              value={proteinRatio * 100}
              onChange={(e) => setProteinRatio(parseFloat(e.target.value) / 100)}
            />
          </div>
          <div>
            <label htmlFor="fatRatio">Lipides (%):</label>
            <input
              type="number"
              id="fatRatio"
              className="form-control-custom"
              value={fatRatio * 100}
              onChange={(e) => setFatRatio(parseFloat(e.target.value) / 100)}
            />
          </div>
        </div>
      </div>

      <button className="btn-gradient-primary" onClick={calculateMacros}>
        Calculer les macros
      </button>

      {calculatedMacros && (
        <div className="result-card">
          <div className="result-value">{calculatedMacros.calories} calories</div>
          <div className="result-label">Calories totales</div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="result-value">{calculatedMacros.protein}g</div>
              <div className="result-label">Protéines</div>
            </div>
            <div>
              <div className="result-value">{calculatedMacros.carbs}g</div>
              <div className="result-label">Glucides</div>
            </div>
            <div>
              <div className="result-value">{calculatedMacros.fat}g</div>
              <div className="result-label">Lipides</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default MacroCalculator;
