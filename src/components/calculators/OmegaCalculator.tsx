
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const OmegaCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: '',
    activityLevel: 'moderate',
    fishIntake: 'rarely',
    nutsSeeds: 'moderate',
    cookingoils: 'mixed',
    inflammation: 'none',
    goal: 'general'
  });

  const [results, setResults] = useState({
    currentRatio: 0,
    targetRatio: 4,
    omega3Needs: 0,
    omega6Current: 0,
    epaNeeds: 0,
    dhaNeeds: 0,
    recommendations: [] as Array<{food: string, omega3: number, omega6: number, serving: string, tips: string}>
  });

  const fishIntakeOptions = [
    { value: 'rarely', label: 'Rarement (< 1x/semaine)' },
    { value: 'sometimes', label: 'Parfois (1-2x/semaine)' },
    { value: 'regular', label: 'Régulier (3-4x/semaine)' },
    { value: 'frequent', label: 'Fréquent (5+ x/semaine)' }
  ];

  const nutsSeedsOptions = [
    { value: 'low', label: 'Peu (< 15g/jour)' },
    { value: 'moderate', label: 'Modéré (15-30g/jour)' },
    { value: 'high', label: 'Élevé (30+ g/jour)' }
  ];

  const cookingOilsOptions = [
    { value: 'omega6', label: 'Huiles oméga-6 (tournesol, maïs)' },
    { value: 'mixed', label: 'Mélange d\'huiles' },
    { value: 'omega3', label: 'Huiles oméga-3 (colza, lin)' },
    { value: 'saturated', label: 'Principalement saturées (coco, beurre)' }
  ];

  const inflammationOptions = [
    { value: 'none', label: 'Aucun problème' },
    { value: 'mild', label: 'Inflammation légère' },
    { value: 'moderate', label: 'Douleurs articulaires' },
    { value: 'severe', label: 'Inflammation chronique' }
  ];

  const goalOptions = [
    { value: 'general', label: 'Santé générale' },
    { value: 'performance', label: 'Performance sportive' },
    { value: 'recovery', label: 'Récupération optimale' },
    { value: 'inflammation', label: 'Réduction inflammation' }
  ];

  const omegaFoods = [
    { food: 'Saumon sauvage', omega3: 2300, omega6: 100, serving: '100g', tips: 'Source EPA/DHA exceptionnelle' },
    { food: 'Maquereau', omega3: 2600, omega6: 200, serving: '100g', tips: 'Ratio omega-3/6 optimal' },
    { food: 'Sardines', omega3: 1400, omega6: 150, serving: '100g', tips: 'Économique et durable' },
    { food: 'Graines de lin', omega3: 22800, omega6: 5900, serving: '30g', tips: 'Moudre pour absorption' },
    { food: 'Graines de chia', omega3: 17500, omega6: 1600, serving: '30g', tips: 'Excellent ratio 11:1' },
    { food: 'Noix', omega3: 9000, omega6: 38000, serving: '30g', tips: 'Limiter pour ratio' },
    { food: 'Huile de colza', omega3: 9100, omega6: 18600, serving: '15ml', tips: 'Cuisson basse température' },
    { food: 'Huile de lin', omega3: 53300, omega6: 12700, serving: '15ml', tips: 'À froid uniquement' }
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        weight: profile.demographics.weight?.toString() || '',
        activityLevel: profile.demographics.activityLevel || 'moderate'
      }));
    }
  }, []);

  useEffect(() => {
    calculateOmegaBalance();
  }, [formData]);

  const calculateOmegaBalance = () => {
    const { weight, activityLevel, fishIntake, nutsSeeds, cookingoils, inflammation, goal } = formData;
    
    if (!weight) return;

    const weightNum = parseFloat(weight);

    // Besoins oméga-3 selon poids et objectif
    let omega3Base = weightNum * 20; // mg/kg base
    
    // Ajustements selon activité
    const activityMultipliers = {
      sedentary: 1.0,
      light: 1.2,
      moderate: 1.4,
      active: 1.6,
      very_active: 1.8
    };

    omega3Base *= activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Ajustements selon objectif
    switch (goal) {
      case 'performance':
        omega3Base *= 1.3;
        break;
      case 'recovery':
        omega3Base *= 1.4;
        break;
      case 'inflammation':
        omega3Base *= 1.6;
        break;
    }

    // Estimation oméga-6 actuel selon alimentation
    let omega6Current = 8000; // Base moderne

    // Ajustement selon noix/graines
    switch (nutsSeeds) {
      case 'low':
        omega6Current += 2000;
        break;
      case 'moderate':
        omega6Current += 5000;
        break;
      case 'high':
        omega6Current += 10000;
        break;
    }

    // Ajustement selon huiles
    switch (cookingoils) {
      case 'omega6':
        omega6Current += 8000;
        break;
      case 'mixed':
        omega6Current += 4000;
        break;
      case 'omega3':
        omega6Current += 1000;
        break;
      case 'saturated':
        omega6Current += 2000;
        break;
    }

    // Estimation oméga-3 actuel selon poisson
    let omega3Current = 500; // Base sans poisson
    
    switch (fishIntake) {
      case 'sometimes':
        omega3Current += 800;
        break;
      case 'regular':
        omega3Current += 1800;
        break;
      case 'frequent':
        omega3Current += 3000;
        break;
    }

    const currentRatio = Math.round(omega6Current / omega3Current);
    
    // Ratio cible selon inflammation
    let targetRatio = 4;
    switch (inflammation) {
      case 'mild':
        targetRatio = 3;
        break;
      case 'moderate':
        targetRatio = 2;
        break;
      case 'severe':
        targetRatio = 1;
        break;
    }

    const omega3Needs = Math.round(Math.max(omega3Base, omega6Current / targetRatio));
    const epaNeeds = Math.round(omega3Needs * 0.6); // 60% EPA
    const dhaNeeds = Math.round(omega3Needs * 0.4); // 40% DHA

    // Recommandations alimentaires selon besoins
    let recommendations = [...omegaFoods];
    
    if (omega3Needs > 2000) {
      // Privilégier sources concentrées EPA/DHA
      recommendations = recommendations
        .filter(item => item.food.includes('Saumon') || item.food.includes('Maquereau') || item.food.includes('Sardines'))
        .concat(recommendations.filter(item => item.food.includes('Huile')))
        .slice(0, 6);
    } else {
      // Sources mixtes acceptables
      recommendations = recommendations
        .sort((a, b) => (b.omega3 / (a.omega6 || 1)) - (a.omega3 / (b.omega6 || 1)))
        .slice(0, 6);
    }

    setResults({
      currentRatio,
      targetRatio,
      omega3Needs,
      omega6Current,
      epaNeeds,
      dhaNeeds,
      recommendations
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Profil alimentaire</h3>
          
          <div className="input-group-custom">
            <label htmlFor="weight">Poids (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 70"
              min="40"
              max="200"
              step="0.1"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="fishIntake">Consommation de poissons gras</label>
            <select
              id="fishIntake"
              name="fishIntake"
              value={formData.fishIntake}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {fishIntakeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="nutsSeeds">Noix et graines</label>
            <select
              id="nutsSeeds"
              name="nutsSeeds"
              value={formData.nutsSeeds}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {nutsSeedsOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="cookingoils">Huiles de cuisson principales</label>
            <select
              id="cookingoils"
              name="cookingoils"
              value={formData.cookingoils}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {cookingOilsOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="inflammation">Inflammation/douleurs</label>
            <select
              id="inflammation"
              name="inflammation"
              value={formData.inflammation}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {inflammationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="goal">Objectif principal</label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {goalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Équilibre Oméga 3/6</h3>
          
          {results.omega3Needs > 0 ? (
            <div className="space-y-6">
              {/* Ratio Status */}
              <div className="grid gap-4">
                <div className={`result-card ${
                  results.currentRatio <= results.targetRatio 
                    ? 'bg-gradient-success' 
                    : results.currentRatio <= 10 
                    ? 'bg-gradient-warning' 
                    : 'bg-gradient-danger'
                }`}>
                  <div className="result-value">{results.currentRatio}:1</div>
                  <div className="result-label">Ratio actuel Ω6/Ω3</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="result-card">
                    <div className="result-value text-lg">{results.targetRatio}:1</div>
                    <div className="result-label text-sm">Ratio cible</div>
                  </div>
                  <div className="result-card">
                    <div className="result-value text-lg">{results.omega3Needs}mg</div>
                    <div className="result-label text-sm">Oméga-3 quotidien</div>
                  </div>
                </div>
              </div>

              {/* EPA/DHA Breakdown */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-fish mr-2 text-blue-600"></i>
                  Répartition EPA/DHA recommandée
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.epaNeeds}mg</div>
                    <div className="text-sm text-blue-800">EPA (anti-inflammatoire)</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.dhaNeeds}mg</div>
                    <div className="text-sm text-green-800">DHA (cerveau/yeux)</div>
                  </div>
                </div>
              </div>

              {/* Food Sources */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-leaf mr-2 text-green-600"></i>
                  Sources alimentaires optimales
                </h4>
                <div className="space-y-3">
                  {results.recommendations.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{item.food}</span>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            Ω3: {item.omega3}mg
                          </div>
                          <div className="text-sm text-orange-600">
                            Ω6: {item.omega6}mg
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">{item.serving}</div>
                      <div className="text-sm text-blue-600 font-medium">{item.tips}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Stratégies d'optimisation
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Poissons gras :</strong> 2-3 portions/semaine minimum</li>
                  <li>• <strong>Graines de lin :</strong> Moudre juste avant consommation</li>
                  <li>• <strong>Réduire Ω6 :</strong> Limiter huiles tournesol/maïs</li>
                  <li>• <strong>Compléments :</strong> EPA/DHA si apports insuffisants</li>
                </ul>
              </div>

              {/* Warnings */}
              {results.currentRatio > 15 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-red-800 flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Déséquilibre important
                  </h4>
                  <p className="text-sm text-red-700">
                    Ratio très élevé (${results.currentRatio}:1). Risque d'inflammation chronique. 
                    Augmentez les oméga-3 et réduisez les sources d'oméga-6.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-balance-scale text-4xl mb-4"></i>
              <p className="text-lg">Remplissez vos informations pour voir l'équilibre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OmegaCalculator;
