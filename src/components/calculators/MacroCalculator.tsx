import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const MacroCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    calories: '',
    goal: 'maintenance',
    proteinRatio: '25',
    fatRatio: '25',
    carbRatio: '50'
  });

  const [results, setResults] = useState({
    protein: { grams: 0, calories: 0, percentage: 0 },
    carbs: { grams: 0, calories: 0, percentage: 0 },
    fat: { grams: 0, calories: 0, percentage: 0 },
    totalCalories: 0
  });

  const goals = [
    { value: 'maintenance', label: 'Maintien du poids', protein: 25, fat: 25, carbs: 50 },
    { value: 'bulk', label: 'Prise de masse', protein: 25, fat: 20, carbs: 55 },
    { value: 'cut', label: 'Perte de poids/Sèche', protein: 35, fat: 25, carbs: 40 },
    { value: 'recomp', label: 'Recomposition corporelle', protein: 30, fat: 25, carbs: 45 },
    { value: 'custom', label: 'Personnalisé', protein: 25, fat: 25, carbs: 50 }
  ];

  useEffect(() => {
    // Try to load calories from BMR calculation
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics && profile.demographics.weight && profile.demographics.height && profile.demographics.age) {
      // Estimate TDEE for maintenance
      const bmr = profile.demographics.gender === 'M' 
        ? (10 * profile.demographics.weight) + (6.25 * profile.demographics.height) - (5 * profile.demographics.age) + 5
        : (10 * profile.demographics.weight) + (6.25 * profile.demographics.height) - (5 * profile.demographics.age) - 161;
      
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
      };
      
      const activityLevel = activityMultipliers[profile.demographics.activityLevel] || 1.375;
      const estimatedTDEE = Math.round(bmr * activityLevel);
      
      setFormData(prev => ({ 
        ...prev, 
        calories: estimatedTDEE.toString() 
      }));
    }
  }, []);

  useEffect(() => {
    calculateMacros();
  }, [formData]);

  const handleGoalChange = (goal: string) => {
    const selectedGoal = goals.find(g => g.value === goal);
    if (selectedGoal && goal !== 'custom') {
      setFormData(prev => ({
        ...prev,
        goal,
        proteinRatio: selectedGoal.protein.toString(),
        fatRatio: selectedGoal.fat.toString(),
        carbRatio: selectedGoal.carbs.toString()
      }));
    } else {
      setFormData(prev => ({ ...prev, goal }));
    }
  };

  const handleRatioChange = (macro: string, value: string) => {
    const newValue = Math.max(5, Math.min(70, parseFloat(value) || 0));
    let newRatios = { ...formData };
    
    if (macro === 'protein') newRatios.proteinRatio = newValue.toString();
    if (macro === 'fat') newRatios.fatRatio = newValue.toString();
    if (macro === 'carbs') newRatios.carbRatio = newValue.toString();
    
    // Auto-adjust other macros to maintain 100%
    const total = parseFloat(newRatios.proteinRatio) + parseFloat(newRatios.fatRatio) + parseFloat(newRatios.carbRatio);
    if (total !== 100) {
      const difference = 100 - total;
      if (macro !== 'carbs') {
        // If protein or fat changed, adjust carbs
        newRatios.carbRatio = Math.max(5, parseFloat(newRatios.carbRatio) + difference).toString();
      } else {
        // If carbs changed, adjust protein and fat equally
        const adjustment = difference / 2;
        newRatios.proteinRatio = Math.max(5, parseFloat(newRatios.proteinRatio) + adjustment).toString();
        newRatios.fatRatio = Math.max(5, parseFloat(newRatios.fatRatio) + adjustment).toString();
      }
    }
    
    setFormData(newRatios);
  };

  const calculateMacros = () => {
    const calories = parseFloat(formData.calories);
    if (!calories || calories <= 0) {
      setResults({
        protein: { grams: 0, calories: 0, percentage: 0 },
        carbs: { grams: 0, calories: 0, percentage: 0 },
        fat: { grams: 0, calories: 0, percentage: 0 },
        totalCalories: 0
      });
      return;
    }

    const proteinPercentage = parseFloat(formData.proteinRatio);
    const fatPercentage = parseFloat(formData.fatRatio);
    const carbPercentage = parseFloat(formData.carbRatio);

    const proteinCalories = (calories * proteinPercentage) / 100;
    const fatCalories = (calories * fatPercentage) / 100;
    const carbCalories = (calories * carbPercentage) / 100;

    // Convert to grams (1g protein = 4 cal, 1g carbs = 4 cal, 1g fat = 9 cal)
    const proteinGrams = Math.round(proteinCalories / 4);
    const carbGrams = Math.round(carbCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    setResults({
      protein: {
        grams: proteinGrams,
        calories: Math.round(proteinCalories),
        percentage: proteinPercentage
      },
      carbs: {
        grams: carbGrams,
        calories: Math.round(carbCalories),
        percentage: carbPercentage
      },
      fat: {
        grams: fatGrams,
        calories: Math.round(fatCalories),
        percentage: fatPercentage
      },
      totalCalories: calories
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Configuration</h3>
          
          <div className="input-group-custom">
            <label htmlFor="calories">Calories quotidiennes</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
              className="form-control-custom"
              placeholder="Ex: 2000"
              min="1000"
              max="5000"
            />
            <small className="text-muted-foreground mt-1 block">
              Utilisez le calculateur BMR pour estimer vos besoins
            </small>
          </div>

          <div className="input-group-custom">
            <label htmlFor="goal">Objectif</label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={(e) => handleGoalChange(e.target.value)}
              className="form-control-custom"
            >
              {goals.map(goal => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Ratios */}
          <div className="space-y-4">
            <h4 className="font-semibold">Répartition des macronutriments</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Protéines</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={formData.proteinRatio}
                    onChange={(e) => handleRatioChange('protein', e.target.value)}
                    className="flex-1"
                    disabled={formData.goal !== 'custom'}
                  />
                  <span className="text-sm font-semibold w-12">{formData.proteinRatio}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lipides</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={formData.fatRatio}
                    onChange={(e) => handleRatioChange('fat', e.target.value)}
                    className="flex-1"
                    disabled={formData.goal !== 'custom'}
                  />
                  <span className="text-sm font-semibold w-12">{formData.fatRatio}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Glucides</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={formData.carbRatio}
                    onChange={(e) => handleRatioChange('carbs', e.target.value)}
                    className="flex-1"
                    disabled={formData.goal !== 'custom'}
                  />
                  <span className="text-sm font-semibold w-12">{formData.carbRatio}%</span>
                </div>
              </div>
            </div>

            {formData.goal !== 'custom' && (
              <p className="text-sm text-muted-foreground">
                Sélectionnez "Personnalisé" pour ajuster manuellement les ratios
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Vos macronutriments</h3>
          
          {results.totalCalories > 0 ? (
            <div className="space-y-6">
              {/* Macro Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="result-card bg-gradient-primary">
                  <div className="result-value">{results.protein.grams}g</div>
                  <div className="result-label">Protéines</div>
                  <small className="text-sm opacity-75">
                    {results.protein.calories} cal • {results.protein.percentage}%
                  </small>
                </div>

                <div className="result-card bg-gradient-secondary">
                  <div className="result-value">{results.carbs.grams}g</div>
                  <div className="result-label">Glucides</div>
                  <small className="text-sm opacity-75">
                    {results.carbs.calories} cal • {results.carbs.percentage}%
                  </small>
                </div>

                <div className="result-card bg-gradient-success">
                  <div className="result-value">{results.fat.grams}g</div>
                  <div className="result-label">Lipides</div>
                  <small className="text-sm opacity-75">
                    {results.fat.calories} cal • {results.fat.percentage}%
                  </small>
                </div>
              </div>

              {/* Visual Chart */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4">Répartition visuelle</h4>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div 
                    className="bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${results.protein.percentage}%` }}
                  >
                    {results.protein.percentage > 15 && 'P'}
                  </div>
                  <div 
                    className="bg-gradient-secondary flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${results.carbs.percentage}%` }}
                  >
                    {results.carbs.percentage > 15 && 'G'}
                  </div>
                  <div 
                    className="bg-gradient-success flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${results.fat.percentage}%` }}
                  >
                    {results.fat.percentage > 15 && 'L'}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Protéines</span>
                  <span>Glucides</span>
                  <span>Lipides</span>
                </div>
              </div>

              {/* Practical Tips */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-utensils text-primary mr-2"></i>
                  Exemples d'aliments
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-primary mb-2">Protéines ({results.protein.grams}g)</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Poulet: {Math.round(results.protein.grams / 0.31)}g</li>
                      <li>• Œufs: {Math.round(results.protein.grams / 6)} œufs</li>
                      <li>• Whey: {Math.round(results.protein.grams / 25)} doses</li>
                      <li>• Thon: {Math.round(results.protein.grams / 0.26)}g</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-secondary mb-2">Glucides ({results.carbs.grams}g)</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Riz cuit: {Math.round(results.carbs.grams / 0.28)}g</li>
                      <li>• Avoine: {Math.round(results.carbs.grams / 0.66)}g</li>
                      <li>• Banane: {Math.round(results.carbs.grams / 23)} bananes</li>
                      <li>• Pâtes cuites: {Math.round(results.carbs.grams / 0.31)}g</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-success mb-2">Lipides ({results.fat.grams}g)</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Huile d'olive: {Math.round(results.fat.grams)} ml</li>
                      <li>• Amandes: {Math.round(results.fat.grams / 0.49)}g</li>
                      <li>• Avocat: {Math.round(results.fat.grams / 15)} avocats</li>
                      <li>• Beurre de cacahuète: {Math.round(results.fat.grams / 0.5)}g</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-pie-chart text-4xl mb-4"></i>
              <p className="text-lg">Entrez vos calories pour voir la répartition</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacroCalculator;
